import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { coolify } from '@/lib/coolify'
import { releaseServer } from '@/lib/server-allocator'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects')
    .select('*, services(*)')
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
  const { data, error } = await supabase
    .from('projects')
    .update({ name: body.name, description: body.description })
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

  // Get all services to clean up Coolify resources
  const { data: services } = await supabaseAdmin
    .from('services')
    .select('*, plan:billing_plans(*)')
    .eq('project_id', id)
    .eq('user_id', user.id)

  for (const service of services ?? []) {
    if (service.coolify_resource_uuid) {
      try {
        if (service.type === 'database') await coolify.deleteDatabase(service.coolify_resource_uuid)
        else await coolify.deleteApplication(service.coolify_resource_uuid)
      } catch { /* ignore Coolify errors on delete */ }
    }
    if (service.server_id && service.plan) {
      await releaseServer(service.server_id, service.plan).catch(() => {})
    }
  }

  await supabaseAdmin.from('projects').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
