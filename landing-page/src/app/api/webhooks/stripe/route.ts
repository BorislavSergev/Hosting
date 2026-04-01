import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/server'
import { coolify } from '@/lib/coolify'
import { allocateServer, releaseServer } from '@/lib/server-allocator'
import type { ServiceConfig } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${err}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice)
      break
    default:
      break
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { user_id, plan_id, project_id, service_config: configJson } = session.metadata ?? {}
  if (!user_id || !plan_id || !configJson) return

  const serviceConfig: ServiceConfig = JSON.parse(configJson)

  // Fetch plan
  const { data: plan } = await supabaseAdmin
    .from('billing_plans')
    .select('*')
    .eq('id', plan_id)
    .single()
  if (!plan) return

  // Retrieve full subscription
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

  // Smart server allocation
  let server
  try {
    server = await allocateServer({
      cpu: plan.cpu_cores,
      ram_mb: plan.ram_mb,
      disk_gb: plan.disk_gb,
    })
  } catch (err) {
    console.error('Server allocation failed:', err)
    // Still create the service record so admin can manually assign
  }

  // Provision on Coolify
  let coolifyResourceUuid: string | null = null
  let externalUrl: string | null = null

  if (server?.coolify_server_uuid) {
    try {
      if (serviceConfig.type === 'database') {
        const result = await coolify.createDatabase({
          serverUuid: server.coolify_server_uuid,
          name: serviceConfig.name,
          dbType: serviceConfig.db_type!,
          dbVersion: serviceConfig.db_version,
          dbName: serviceConfig.db_name,
          dbPassword: serviceConfig.db_password,
        })
        coolifyResourceUuid = result.uuid
        externalUrl = result.url ?? null
      } else {
        const result = await coolify.createApplication({
          serverUuid: server.coolify_server_uuid,
          name: serviceConfig.name,
          gitRepo: serviceConfig.git_repo,
          gitBranch: serviceConfig.git_branch,
          buildCommand: serviceConfig.build_command,
          startCommand: serviceConfig.start_command,
          dockerImage: serviceConfig.docker_image,
          port: serviceConfig.port,
        })
        coolifyResourceUuid = result.uuid
        externalUrl = result.url ?? null

        // Trigger first deploy
        if (coolifyResourceUuid) {
          await coolify.triggerDeploy(coolifyResourceUuid).catch(() => {})
        }
      }
    } catch (err) {
      console.error('Coolify provisioning failed:', err)
    }
  }

  // Create service record
  const { data: service } = await supabaseAdmin
    .from('services')
    .insert({
      user_id,
      project_id,
      name: serviceConfig.name,
      type: serviceConfig.type,
      plan_id,
      status: coolifyResourceUuid ? 'building' : 'failed',
      server_id: server?.id ?? null,
      coolify_resource_uuid: coolifyResourceUuid,
      coolify_server_uuid: server?.coolify_server_uuid ?? null,
      git_repo: serviceConfig.git_repo ?? null,
      git_branch: serviceConfig.git_branch ?? 'main',
      build_command: serviceConfig.build_command ?? null,
      start_command: serviceConfig.start_command ?? null,
      docker_image: serviceConfig.docker_image ?? null,
      port: serviceConfig.port ?? 3000,
      cron_schedule: serviceConfig.cron_schedule ?? null,
      db_type: serviceConfig.db_type ?? null,
      db_version: serviceConfig.db_version ?? null,
      db_name: serviceConfig.db_name ?? null,
      external_url: externalUrl,
      stripe_subscription_id: subscription.id,
      monthly_cost: plan.monthly_price,
    })
    .select()
    .single()

  if (!service) return

  // Create first deployment record (for non-db services)
  if (serviceConfig.type !== 'database' && coolifyResourceUuid) {
    await supabaseAdmin.from('deployments').insert({
      service_id: service.id,
      user_id,
      status: 'running',
      triggered_by: 'initial',
      started_at: new Date().toISOString(),
    })
  }

  // current_period fields moved to subscription items in Stripe API 2025-02-24
  const firstItem = subscription.items?.data?.[0] as { current_period_start?: number; current_period_end?: number } | undefined
  await supabaseAdmin.from('subscriptions').insert({
    user_id,
    service_id: service.id,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: subscription.status,
    current_period_start: firstItem?.current_period_start ? new Date(firstItem.current_period_start * 1000).toISOString() : null,
    current_period_end: firstItem?.current_period_end ? new Date(firstItem.current_period_end * 1000).toISOString() : null,
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { data: service } = await supabaseAdmin
    .from('services')
    .select('*, plan:billing_plans(*)')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (!service) return

  // Delete from Coolify
  if (service.coolify_resource_uuid) {
    try {
      if (service.type === 'database') await coolify.deleteDatabase(service.coolify_resource_uuid)
      else await coolify.deleteApplication(service.coolify_resource_uuid)
    } catch { /* ignore */ }
  }

  // Release server resources
  if (service.server_id && service.plan) {
    await releaseServer(service.server_id, service.plan).catch(() => {})
  }

  // Suspend service
  await supabaseAdmin
    .from('services')
    .update({ status: 'suspended', updated_at: new Date().toISOString() })
    .eq('id', service.id)

  await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // In Stripe API 2025-02-24, subscription reference is on the parent
  const subscriptionId = (invoice as unknown as { subscription?: string }).subscription
  if (!subscriptionId) return
  await supabaseAdmin
    .from('services')
    .update({ status: 'suspended', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscriptionId)
}
