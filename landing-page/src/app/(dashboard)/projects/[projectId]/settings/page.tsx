'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/projects/${projectId}`).then((r) => r.json()).then((p) => {
      setName(p.name ?? '')
      setDescription(p.description ?? '')
    })
  }, [projectId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    setLoading(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader crumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Project', href: `/dashboard/projects/${projectId}` },
        { label: 'Settings' },
      ]} />
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-white">Project Settings</h1>

          <form onSubmit={handleSave} className="glass border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white">General</h2>
            <Input label="Project name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>Save changes</Button>
            </div>
          </form>

          <div className="glass border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-gray-400 text-sm mb-4">Deleting a project permanently removes all its services. This cannot be undone.</p>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete project</Button>
          </div>
        </div>
      </main>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete project">
        <p className="text-gray-400 text-sm mb-6">Are you sure? All services in this project will be permanently deleted.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete forever</Button>
        </div>
      </Modal>
    </div>
  )
}
