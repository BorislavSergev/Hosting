import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import BillingPortalButton from '@/components/dashboard/BillingPortalButton'

export default async function BillingPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const { data: services } = await supabase
    .from('services')
    .select('id, name, type, status, monthly_cost, plan:billing_plans(name)')
    .eq('user_id', user.id)
    .neq('status', 'suspended')
    .order('created_at', { ascending: false })

  const totalMonthly = (services ?? []).reduce((sum, s) => sum + (s.monthly_cost ?? 0), 0)

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Billing' }]} />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Billing</h1>
            {profile?.stripe_customer_id && <BillingPortalButton />}
          </div>

          {/* Summary card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold gradient-text">${totalMonthly.toFixed(2)}</div>
              <div className="text-gray-400 text-sm mt-1">Monthly estimate</div>
            </div>
            <div className="glass border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-white">{services?.length ?? 0}</div>
              <div className="text-gray-400 text-sm mt-1">Active services</div>
            </div>
            <div className="glass border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-white">
                {profile?.stripe_customer_id ? '✓' : '—'}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {profile?.stripe_customer_id ? 'Payment on file' : 'No payment yet'}
              </div>
            </div>
          </div>

          {/* Services table */}
          <div className="glass border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active services</span>
            </div>
            {!services?.length ? (
              <div className="px-5 py-8 text-center text-gray-500 text-sm">No active services</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium">Service</th>
                    <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium">Plan</th>
                    <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium">Status</th>
                    <th className="text-right px-5 py-2 text-xs text-gray-500 font-medium">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map((s) => (
                    <tr key={s.id}>
                      <td className="px-5 py-3 text-white">{s.name}</td>
                      <td className="px-5 py-3 text-gray-400">{(s.plan as unknown as { name: string } | null)?.name ?? s.type}</td>
                      <td className="px-5 py-3 text-gray-400 capitalize">{s.status}</td>
                      <td className="px-5 py-3 text-right text-white font-medium">
                        {s.monthly_cost != null ? `$${s.monthly_cost.toFixed(2)}` : 'Free'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10">
                    <td colSpan={3} className="px-5 py-3 text-gray-400 text-sm font-medium">Total</td>
                    <td className="px-5 py-3 text-right text-white font-bold">${totalMonthly.toFixed(2)}/mo</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {!profile?.stripe_customer_id && (
            <p className="text-center text-gray-500 text-sm mt-6">
              Payment details are collected when you purchase your first service.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
