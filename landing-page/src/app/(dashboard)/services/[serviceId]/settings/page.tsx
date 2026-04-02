import { notFound, redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import EnvVarEditor from '@/components/dashboard/EnvVarEditor'
import ServiceSettingsForm from '@/components/dashboard/ServiceSettingsForm'

export default async function ServiceSettingsPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: service } = await supabase
    .from('services')
    .select('*, project:projects(id, name)')
    .eq('id', serviceId)
    .eq('user_id', user.id)
    .single()

  if (!service) notFound()

  const { data: envVars } = await supabase
    .from('environment_variables')
    .select('*')
    .eq('service_id', serviceId)
    .order('key')

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: (service.project as unknown as { name: string })?.name ?? 'Project', href: `/dashboard/projects/${service.project_id}` },
        { label: service.name, href: `/dashboard/services/${serviceId}` },
        { label: 'Settings' },
      ]} />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-white">Service Settings</h1>
          <ServiceSettingsForm service={service} />
          <div className="glass border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Environment Variables</h2>
            <p className="text-xs text-gray-500 mb-4">
              Changes take effect on the next deployment. Secret values are encrypted at rest.
            </p>
            <EnvVarEditor serviceId={serviceId} initial={envVars ?? []} />
          </div>
        </div>
      </main>
    </div>
  )
}
