import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { coolify } from '@/lib/coolify'
import { releaseServer } from '@/lib/server-allocator'
import { stripe } from '@/lib/stripe'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('services')
    .select('*, plan:billing_plans(*), server:servers(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['name', 'git_repo', 'git_branch', 'build_command', 'start_command', 'port', 'cron_schedule']
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: service } = await supabaseAdmin
    .from('services')
    .select('*, plan:billing_plans(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // 1. Delete from Coolify
  if (service.coolify_resource_uuid) {
    try {
      if (service.type === 'database') await coolify.deleteDatabase(service.coolify_resource_uuid)
      else await coolify.deleteApplication(service.coolify_resource_uuid)
    } catch { /* log but continue */ }
  }

  // 2. Release server resources
  if (service.server_id && service.plan) {
    await releaseServer(service.server_id, service.plan).catch(() => {})
  }

  // 3. Cancel Stripe subscription
  if (service.stripe_subscription_id) {
    await stripe.subscriptions.cancel(service.stripe_subscription_id).catch(() => {})
  }

  // 4. Delete from DB
  await supabaseAdmin.from('services').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}
