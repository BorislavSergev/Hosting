'use client'
import { useEffect, useRef, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { Deployment } from '@/lib/types'

interface Props {
  serviceId: string
  deployments: Deployment[]
}

export default function LogsViewer({ serviceId, deployments }: Props) {
  const [selectedId, setSelectedId] = useState(deployments[0]?.id ?? '')
  const [logs, setLogs] = useState<string[]>([])
  const [live, setLive] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!selectedId) return
    const deployment = deployments.find((d) => d.id === selectedId)
    if (!deployment) return

    // Fetch static logs
    setLogs([`[NexusBG] Deployment ${deployment.id.slice(0, 8)} — status: ${deployment.status}`])

    if (deployment.status === 'running') {
      setLive(true)
      // Subscribe to realtime changes on this deployment
      const channel = supabase
        .channel(`deployment-${selectedId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'deployments',
          filter: `id=eq.${selectedId}`,
        }, (payload) => {
          const updated = payload.new as Deployment
          if (updated.status !== 'running') setLive(false)
          setLogs((prev) => [...prev, `[status] → ${updated.status}`])
        })
        .subscribe()

      return () => { supabase.removeChannel(channel); setLive(false) }
    }
  }, [selectedId, deployments]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (deployments.length === 0) {
    return (
      <div className="glass border border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
        No deployments yet. Click <strong className="text-white">Deploy now</strong> to trigger your first deployment.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Deployment selector */}
      <div className="flex items-center gap-3">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="glass border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white appearance-none bg-transparent"
        >
          {deployments.map((d) => (
            <option key={d.id} value={d.id} style={{ background: '#0a0a14' }}>
              {new Date(d.created_at).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} — {d.status}
            </option>
          ))}
        </select>
        {live && (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Terminal */}
      <div
        className="rounded-xl font-mono text-xs text-green-300 p-4 overflow-y-auto h-80 space-y-0.5"
        style={{ background: 'rgba(0,10,5,0.9)', border: '1px solid rgba(34,197,94,0.15)' }}
      >
        {logs.length === 0 ? (
          <span className="text-gray-600">Waiting for logs…</span>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="leading-5">
              <span className="text-green-800 select-none mr-2">{String(i + 1).padStart(3, ' ')} │</span>
              {line}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
