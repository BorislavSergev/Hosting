import Link from 'next/link'
import type { Project, Service } from '@/lib/types'
import StatusBadge from './StatusBadge'

interface Props { project: Project & { services?: Service[] } }

export default function ProjectCard({ project }: Props) {
  const services = project.services ?? []
  const running = services.filter((s) => s.status === 'running').length
  const failed = services.filter((s) => s.status === 'failed').length

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="card-glow glass border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-violet-500/30 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                <path d="M3 7v13h18V7M3 7l9-4 9 4M3 7h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-white font-semibold">{project.name}</h3>
          </div>
          {project.description && (
            <p className="text-gray-500 text-xs line-clamp-1">{project.description}</p>
          )}
        </div>
        <span className="text-xs text-gray-600 shrink-0">
          {new Date(project.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {services.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {services.slice(0, 4).map((s) => (
            <span key={s.id} className="flex items-center gap-1 text-xs glass px-2 py-0.5 rounded-full text-gray-400">
              <span className={`w-1 h-1 rounded-full ${s.status === 'running' ? 'bg-green-400' : s.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'}`} />
              {s.name}
            </span>
          ))}
          {services.length > 4 && <span className="text-xs text-gray-600">+{services.length - 4} more</span>}
        </div>
      ) : (
        <p className="text-xs text-gray-600">No services yet — add one to get started</p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t border-white/5">
        <span>{services.length} service{services.length !== 1 ? 's' : ''}</span>
        {running > 0 && <span className="text-green-400">{running} running</span>}
        {failed > 0 && <span className="text-red-400">{failed} failed</span>}
      </div>
    </Link>
  )
}
