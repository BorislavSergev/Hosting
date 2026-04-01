import Stripe from 'stripe'
import { supabaseAdmin } from './supabase/server'
import type { ServiceConfig } from './types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function getOrCreateCustomer(
  userId: string,
  email: string
): Promise<string> {
  // Check existing
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (profile?.stripe_customer_id) return profile.stripe_customer_id

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  // Save back to DB
  await supabaseAdmin
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)

  return customer.id
}

export async function createCheckoutSession(params: {
  customerId: string
  stripePriceId: string
  serviceConfig: ServiceConfig
  userId: string
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: params.stripePriceId, quantity: 1 }],
    metadata: {
      user_id: params.userId,
      plan_id: params.serviceConfig.plan_id,
      project_id: params.serviceConfig.project_id,
      service_config: JSON.stringify(params.serviceConfig),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${params.serviceConfig.project_id}?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/services/new?cancelled=1`,
    subscription_data: {
      metadata: {
        user_id: params.userId,
        plan_id: params.serviceConfig.plan_id,
      },
    },
  })
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session.url
}
