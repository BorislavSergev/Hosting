'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), slug, description }),
    })
    if (res.ok) {
      const project = await res.json()
      router.push(`/dashboard/projects/${project.id}`)
    } else {
      const { error: msg } = await res.json()
      setError(msg || 'Failed to create project')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'New Project' }]} />
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Create a new project</h1>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="glass border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            <Input
              label="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome App"
              required
            />
            {name && (
              <p className="text-xs text-gray-500 -mt-3">
                Slug: <code className="text-violet-400">{slug || '…'}</code>
              </p>
            )}
            <Input
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this project do?"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" loading={loading} disabled={!name.trim()}>
                Create project →
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
