import Link from 'next/link'
import type { Service } from '@/lib/types'
import StatusBadge from './StatusBadge'

const typeIcons: Record<string, React.ReactNode> = {
  web: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" /></svg>,
  database: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /></svg>,
  worker: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" /></svg>,
  cron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" /></svg>,
  static: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" /></svg>,
}

const typeColors: Record<string, string> = {
  web: 'text-violet-400 bg-violet-400/10',
  database: 'text-green-400 bg-green-400/10',
  worker: 'text-blue-400 bg-blue-400/10',
  cron: 'text-yellow-400 bg-yellow-400/10',
  static: 'text-pink-400 bg-pink-400/10',
}

export default function ServiceCard({ service }: { service: Service }) {
  const colorClass = typeColors[service.type] ?? 'text-gray-400 bg-gray-400/10'

  return (
    <Link href={`/dashboard/services/${service.id}`} className="card-glow glass border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-violet-500/30 transition-all">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
        {typeIcons[service.type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-white font-medium text-sm truncate">{service.name}</span>
          <StatusBadge status={service.status} />
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-500 capitalize">{service.type}{service.db_type ? ` · ${service.db_type}` : ''}</span>
          {service.external_url && (
            <a
              href={service.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 truncate max-w-[180px] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {service.external_url.replace('https://', '')}
            </a>
          )}
        </div>
      </div>

      {service.monthly_cost != null && (
        <span className="text-xs text-gray-500 shrink-0">${service.monthly_cost}/mo</span>
      )}
    </Link>
  )
}
