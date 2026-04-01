"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">Nexus</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {["Features", "Pricing", "Docs", "Blog"].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-white transition-colors">{item}</a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</a>
          <a href="#" className="btn-primary text-sm text-white px-4 py-2 rounded-xl font-medium">
            Get started
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="glass md:hidden max-w-6xl mx-auto mt-2 rounded-2xl px-6 py-4 flex flex-col gap-4">
          {["Features", "Pricing", "Docs", "Blog"].map((item) => (
            <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
          ))}
          <a href="#" className="btn-primary text-center text-white px-4 py-2 rounded-xl font-medium">
            Get started
          </a>
        </div>
      )}
    </header>
  );
}
