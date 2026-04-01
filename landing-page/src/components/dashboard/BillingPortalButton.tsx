'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function BillingPortalButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    if (res.ok) {
      const { url } = await res.json()
      window.location.href = url
    } else {
      setLoading(false)
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} loading={loading}>
      Manage billing →
    </Button>
  )
}
