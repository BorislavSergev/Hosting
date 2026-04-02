import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ServiceCard from '@/components/dashboard/ServiceCard'
import type { Service } from '@/lib/types'

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*, services(*, plan:billing_plans(*))')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) notFound()

  const services = project.services ?? []
  const svcList = (services ?? []) as Service[]
  const grouped = {
    web:      svcList.filter((s) => s.type === 'web'),
    database: svcList.filter((s) => s.type === 'database'),
    worker:   svcList.filter((s) => s.type === 'worker'),
    cron:     svcList.filter((s) => s.type === 'cron'),
    static:   svcList.filter((s) => s.type === 'static'),
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: project.name },
      ]} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Project header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              {project.description && <p className="text-gray-400 text-sm mt-1">{project.description}</p>}
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/projects/${projectId}/settings`} className="glass border border-white/10 text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-xl transition-colors">
                Settings
              </Link>
              <Link href={`/dashboard/services/new?project=${projectId}`} className="btn-primary text-white text-sm px-4 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Service
              </Link>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="glass border border-white/10 rounded-2xl p-16 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-lg font-bold text-white mb-2">No services yet</h2>
              <p className="text-gray-400 text-sm mb-6">Add a web service, database, worker, or cron job to this project.</p>
              <Link href={`/dashboard/services/new?project=${projectId}`} className="btn-primary inline-flex text-white px-5 py-2.5 rounded-xl font-medium">
                Add your first service →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {(Object.entries(grouped) as [string, Service[]][]).map(([type, list]) =>
                list.length > 0 ? (
                  <div key={type}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                      {type === 'web' ? 'Web Services' : type === 'database' ? 'Databases' : type === 'worker' ? 'Workers' : type === 'cron' ? 'Cron Jobs' : 'Static Sites'}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {list.map((s) => <ServiceCard key={s.id} service={s} />)}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
