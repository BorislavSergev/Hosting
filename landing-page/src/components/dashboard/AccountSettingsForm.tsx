'use client'
import { useState } from 'react'
import type { Profile } from '@/lib/types'
import { createSupabaseClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AccountSettingsForm({ profile }: { profile: Profile | null }) {
  const supabase = createSupabaseClient()
  const [name, setName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('profiles').update({ full_name: name }).eq('id', profile!.id)
    setMsg('Saved!')
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  async function handlePasswordReset() {
    if (!profile?.email) return
    await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    setMsg('Password reset email sent!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSave} className="glass border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-white">Profile</h2>
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={profile?.email ?? ''} disabled hint="Email cannot be changed" />
        {msg && <p className="text-xs text-green-400">{msg}</p>}
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>

      <div className="glass border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-2">Password</h2>
        <p className="text-gray-400 text-sm mb-4">We&apos;ll send a password reset link to your email.</p>
        <Button variant="secondary" onClick={handlePasswordReset}>Send reset email</Button>
      </div>
    </div>
  )
}
