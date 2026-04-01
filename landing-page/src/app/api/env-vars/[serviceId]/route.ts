import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

type Params = { params: Promise<{ serviceId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { serviceId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('environment_variables')
    .select('*')
    .eq('service_id', serviceId)
    .order('key')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { serviceId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify service ownership
  const { data: service } = await supabase
    .from('services')
    .select('id')
    .eq('id', serviceId)
    .eq('user_id', user.id)
    .single()
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { key, value, is_secret } = await req.json()
  if (!key?.trim()) return NextResponse.json({ error: 'Key is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('environment_variables')
    .upsert({ service_id: serviceId, key: key.trim(), value, is_secret: !!is_secret }, { onConflict: 'service_id,key' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { serviceId } = await params
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership via service
  const { data: service } = await supabase
    .from('services')
    .select('id')
    .eq('id', serviceId)
    .eq('user_id', user.id)
    .single()
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await supabase.from('environment_variables').delete().eq('id', id).eq('service_id', serviceId)
  return NextResponse.json({ ok: true })
}
