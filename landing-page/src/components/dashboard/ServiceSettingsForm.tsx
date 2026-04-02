'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Service } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

export default function ServiceSettingsForm({ service }: { service: Service }) {
  const router = useRouter()
  const [name, setName] = useState(service.name)
  const [gitRepo, setGitRepo] = useState(service.git_repo ?? '')
  const [gitBranch, setGitBranch] = useState(service.git_branch ?? 'main')
  const [buildCmd, setBuildCmd] = useState(service.build_command ?? '')
  const [startCmd, setStartCmd] = useState(service.start_command ?? '')
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, git_repo: gitRepo, git_branch: gitBranch, build_command: buildCmd, start_command: startCmd }),
    })
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/services/${service.id}`, { method: 'DELETE' })
    router.push(`/dashboard/projects/${service.project_id}`)
  }

  return (
    <>
      <form onSubmit={handleSave} className="glass border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-white">General</h2>
        <Input label="Service name" value={name} onChange={(e) => setName(e.target.value)} />
        {service.type !== 'database' && (
          <>
            <Input label="Git repository" value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} placeholder="https://github.com/user/repo" />
            <Input label="Branch" value={gitBranch} onChange={(e) => setGitBranch(e.target.value)} />
            <Input label="Build command" value={buildCmd} onChange={(e) => setBuildCmd(e.target.value)} placeholder="npm run build" />
            <Input label="Start command" value={startCmd} onChange={(e) => setStartCmd(e.target.value)} placeholder="npm start" />
          </>
        )}
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>

      <div className="glass border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-gray-400 text-sm mb-4">
          Deleting this service will destroy the running container, cancel the billing subscription, and free server resources. This cannot be undone.
        </p>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete service</Button>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete service">
        <p className="text-gray-400 text-sm mb-6">
          Are you sure you want to delete <strong className="text-white">{service.name}</strong>? This will stop all running processes and cancel billing.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete forever</Button>
        </div>
      </Modal>
    </>
  )
}
