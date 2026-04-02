import type { ServiceStatus, DeploymentStatus } from '@/lib/types'

type Status = ServiceStatus | DeploymentStatus

const config: Record<Status, { dot: string; label: string }> = {
  building:  { dot: 'bg-yellow-400 animate-pulse', label: 'Building' },
  running:   { dot: 'bg-green-400',                label: 'Running' },
  stopped:   { dot: 'bg-gray-500',                 label: 'Stopped' },
  failed:    { dot: 'bg-red-400',                  label: 'Failed' },
  suspended: { dot: 'bg-orange-400',               label: 'Suspended' },
  pending:   { dot: 'bg-gray-400 animate-pulse',   label: 'Pending' },
  success:   { dot: 'bg-green-400',                label: 'Success' },
  cancelled: { dot: 'bg-gray-500',                 label: 'Cancelled' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const { dot, label } = config[status] ?? { dot: 'bg-gray-500', label: status }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-300">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
