'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 15a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4H7a4 4 0 00-4 4v6z" stroke="white" strokeWidth="1.5" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">NexusBG</span>
          <span className="text-xs px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-medium">CLOUD</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {[['Features', '#features'], ['Pricing', '#pricing'], ['Docs', '#'], ['Status', '#']].map(([label, href]) => (
            <li key={label}>
              <a href={href} className="hover:text-white transition-colors">{label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
          <Link href="/signup" className="btn-primary text-sm text-white px-4 py-2 rounded-xl font-medium">
            Start free →
          </Link>
        </div>

        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="glass md:hidden max-w-6xl mx-auto mt-2 rounded-2xl px-6 py-4 flex flex-col gap-4">
          {[['Features', '#features'], ['Pricing', '#pricing'], ['Docs', '#'], ['Status', '#']].map(([label, href]) => (
            <a key={label} href={href} className="text-gray-400 hover:text-white transition-colors">{label}</a>
          ))}
          <Link href="/signup" className="btn-primary text-center text-white px-4 py-2 rounded-xl font-medium">
            Start free →
          </Link>
        </div>
      )}
    </header>
  )
}
