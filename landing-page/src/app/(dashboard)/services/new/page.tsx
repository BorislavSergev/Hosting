import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ServiceWizard from '@/components/dashboard/ServiceWizard'

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>
}) {
  const { project: projectId } = await searchParams
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!projectId) redirect('/dashboard')

  const { data: plans } = await supabase
    .from('billing_plans')
    .select('*')
    .order('monthly_price', { ascending: true })

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Project', href: `/dashboard/projects/${projectId}` },
        { label: 'New Service' },
      ]} />
      <main className="flex-1 p-6">
        <ServiceWizard projectId={projectId} plans={plans ?? []} />
      </main>
    </div>
  )
}
