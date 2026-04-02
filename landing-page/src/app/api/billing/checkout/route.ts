import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe'
import type { ServiceConfig } from '@/lib/types'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan_id, service_config }: { plan_id: string; service_config: ServiceConfig } = await req.json()
  if (!plan_id || !service_config) {
    return NextResponse.json({ error: 'Missing plan_id or service_config' }, { status: 400 })
  }

  // Fetch plan
  const { data: plan } = await supabaseAdmin
    .from('billing_plans')
    .select('*')
    .eq('id', plan_id)
    .single()

  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
  if (!plan.stripe_price_id) {
    return NextResponse.json({ error: 'This plan is not yet available for purchase' }, { status: 400 })
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer(user.id, user.email!)

  // Create Stripe Checkout session
  const session = await createCheckoutSession({
    customerId,
    stripePriceId: plan.stripe_price_id,
    serviceConfig: { ...service_config, plan_id },
    userId: user.id,
  })

  return NextResponse.json({ url: session.url })
}
