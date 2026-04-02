import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import DeployButton from '@/components/dashboard/DeployButton'

export default async function ServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: service } = await supabase
    .from('services')
    .select('*, plan:billing_plans(*), project:projects(id, name), server:servers(name, location, hetzner_server_type)')
    .eq('id', serviceId)
    .eq('user_id', user.id)
    .single()

  if (!service) notFound()

  const { data: deployments } = await supabase
    .from('deployments')
    .select('*')
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false })
    .limit(10)

  const infoRows = [
    ['Type', service.type],
    ['Status', null],
    ['Plan', service.plan?.name ?? service.plan_id],
    ['Monthly cost', service.monthly_cost != null ? `$${service.monthly_cost}/mo` : '—'],
    ...(service.server ? [
      ['Server', service.server.name],
      ['Region', `${service.server.location} (${service.server.hetzner_server_type})`],
    ] : []),
    ...(service.git_repo ? [['Repository', service.git_repo], ['Branch', service.git_branch]] : []),
    ...(service.db_type ? [['Database', service.db_type]] : []),
    ['Created', new Date(service.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })],
  ]

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: service.project?.name ?? 'Project', href: `/dashboard/projects/${service.project_id}` },
        { label: service.name },
      ]} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Service header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{service.name}</h1>
                <StatusBadge status={service.status} />
              </div>
              {service.external_url && (
                <a href={service.external_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                  {service.external_url} ↗
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/services/${serviceId}/logs`} className="glass border border-white/10 text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-xl transition-colors">
                Logs
              </Link>
              <Link href={`/dashboard/services/${serviceId}/settings`} className="glass border border-white/10 text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-xl transition-colors">
                Settings
              </Link>
              <DeployButton serviceId={serviceId} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info */}
            <div className="lg:col-span-1">
              <div className="glass border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Service info</span>
                </div>
                <div className="divide-y divide-white/5">
                  {infoRows.map(([k, v]) => (
                    <div key={k as string} className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="text-gray-500">{k}</span>
                      {k === 'Status'
                        ? <StatusBadge status={service.status} />
                        : <span className="text-white text-right max-w-[180px] truncate">{v as string}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent deployments */}
            <div className="lg:col-span-2">
              <div className="glass border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Deployments</span>
                  <Link href={`/dashboard/services/${serviceId}/logs`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View logs →</Link>
                </div>
                {!deployments?.length ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">No deployments yet</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {deployments.map((d) => (
                      <div key={d.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <StatusBadge status={d.status} />
                          {d.commit_message && (
                            <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{d.commit_message}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{d.triggered_by}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(d.created_at).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
