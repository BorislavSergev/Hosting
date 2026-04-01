import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import LogsViewer from '@/components/dashboard/LogsViewer'
import DeployButton from '@/components/dashboard/DeployButton'

export default async function ServiceLogsPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: service } = await supabase
    .from('services')
    .select('id, name, project_id, project:projects(name)')
    .eq('id', serviceId)
    .eq('user_id', user.id)
    .single()

  if (!service) notFound()

  const { data: deployments } = await supabase
    .from('deployments')
    .select('*')
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: (service.project as unknown as { name: string })?.name ?? 'Project', href: `/dashboard/projects/${service.project_id}` },
        { label: service.name, href: `/dashboard/services/${serviceId}` },
        { label: 'Logs' },
      ]} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Deployment Logs</h1>
            <div className="flex gap-2">
              <Link href={`/dashboard/services/${serviceId}`} className="glass border border-white/10 text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-xl transition-colors">
                ← Overview
              </Link>
              <DeployButton serviceId={serviceId} />
            </div>
          </div>
          <LogsViewer serviceId={serviceId} deployments={deployments ?? []} />
        </div>
      </main>
    </div>
  )
}
