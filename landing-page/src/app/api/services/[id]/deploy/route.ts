import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { coolify } from '@/lib/coolify'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: service } = await supabase
    .from('services')
    .select('id, coolify_resource_uuid, type, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!service.coolify_resource_uuid) {
    return NextResponse.json({ error: 'Service not yet provisioned' }, { status: 400 })
  }
  if (service.type === 'database') {
    return NextResponse.json({ error: 'Databases cannot be manually deployed' }, { status: 400 })
  }

  // Trigger deploy on Coolify
  const result = await coolify.triggerDeploy(service.coolify_resource_uuid)

  // Record deployment
  const { data: deployment } = await supabaseAdmin
    .from('deployments')
    .insert({
      service_id: id,
      user_id: user.id,
      coolify_deployment_uuid: result.deployment_uuid,
      status: 'running',
      triggered_by: 'manual',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  return NextResponse.json(deployment, { status: 201 })
}
