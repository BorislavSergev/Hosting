import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import AccountSettingsForm from '@/components/dashboard/AccountSettingsForm'

export default async function SettingsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>
          <AccountSettingsForm profile={profile} />
        </div>
      </main>
    </div>
  )
}
