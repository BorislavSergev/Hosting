import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ProjectCard from '@/components/dashboard/ProjectCard'

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, services(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[{ label: 'Dashboard' }]} />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Hey, {firstName} 👋</h1>
              <p className="text-gray-400 text-sm mt-1">
                {projects?.length ? `You have ${projects.length} project${projects.length !== 1 ? 's' : ''}` : 'Create your first project to get started'}
              </p>
            </div>
            <Link href="/dashboard/projects/new" className="btn-primary text-white text-sm px-4 py-2 rounded-xl font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              New Project
            </Link>
          </div>

          {!projects?.length ? (
            <div className="glass border border-white/10 rounded-2xl p-16 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-xl font-bold text-white mb-2">Create your first project</h2>
              <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                Projects group your services together. Create one and start deploying web apps, databases, and workers.
              </p>
              <Link href="/dashboard/projects/new" className="btn-primary inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold">
                Create project →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
