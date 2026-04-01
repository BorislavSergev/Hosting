'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function DeployButton({ serviceId }: { serviceId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleDeploy() {
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch(`/api/services/${serviceId}/deploy`, { method: 'POST' })
      if (res.ok) setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDeploy}
      loading={loading}
      variant={success ? 'secondary' : 'primary'}
      size="sm"
    >
      {success ? '✓ Deploying…' : 'Deploy now'}
    </Button>
  )
}
