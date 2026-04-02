'use client'
import { useState } from 'react'
import type { EnvVar } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  serviceId: string
  initial: EnvVar[]
}

export default function EnvVarEditor({ serviceId, initial }: Props) {
  const [vars, setVars] = useState(initial)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newSecret, setNewSecret] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function addVar() {
    if (!newKey.trim()) return
    setSaving(true)
    const res = await fetch(`/api/env-vars/${serviceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: newKey.trim(), value: newValue, is_secret: newSecret }),
    })
    if (res.ok) {
      const created = await res.json()
      setVars((v) => [...v, created])
      setNewKey('')
      setNewValue('')
      setNewSecret(false)
      setMsg('Saved')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  async function deleteVar(id: string) {
    await fetch(`/api/env-vars/${serviceId}?id=${id}`, { method: 'DELETE' })
    setVars((v) => v.filter((x) => x.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="glass border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">Key</th>
              <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">Value</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {vars.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-500 text-sm">No environment variables yet</td></tr>
            )}
            {vars.map((v) => (
              <tr key={v.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-2 font-mono text-xs text-violet-300">{v.key}</td>
                <td className="px-4 py-2 font-mono text-xs text-gray-400">
                  {v.is_secret ? '••••••••' : v.value}
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => deleteVar(v.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 items-end">
        <Input label="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="DATABASE_URL" className="flex-1" />
        <Input label="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="value" className="flex-1" />
        <label className="flex items-center gap-1.5 text-sm text-gray-400 pb-2 cursor-pointer">
          <input type="checkbox" checked={newSecret} onChange={(e) => setNewSecret(e.target.checked)} className="accent-violet-500" />
          Secret
        </label>
        <Button onClick={addVar} loading={saving} size="sm" className="mb-0.5">Add</Button>
      </div>
      {msg && <p className="text-xs text-green-400">{msg}</p>}
    </div>
  )
}
