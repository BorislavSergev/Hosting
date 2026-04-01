'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Crumb { label: string; href?: string }

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-600">/</span>}
          {c.href ? (
            <Link href={c.href} className="text-gray-400 hover:text-white transition-colors">{c.label}</Link>
          ) : (
            <span className="text-white font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default function DashboardHeader({ crumbs }: { crumbs?: Crumb[] }) {
  const defaultCrumbs: Crumb[] = crumbs ?? [{ label: 'Dashboard' }]
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
      <Breadcrumbs crumbs={defaultCrumbs} />
      <Link
        href="/dashboard/services/new"
        className="btn-primary text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
        New Service
      </Link>
    </header>
  )
}
