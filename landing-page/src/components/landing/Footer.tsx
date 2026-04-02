import Link from 'next/link'

const links = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
  Developers: ['Docs', 'API Reference', 'GitHub', 'Discord', 'Examples'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'GDPR'],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 15a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4H7a4 4 0 00-4 4v6z" stroke="white" strokeWidth="1.5" />
                  <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-white">NexusBG</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Bulgarian cloud hosting built for developers. 🇧🇬
            </p>
            <div className="flex gap-3">
              {['X', 'GH', 'LI'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors text-xs font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <div className="text-white text-sm font-semibold mb-4">{cat}</div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 NexusBG Ltd. All rights reserved. Sofia, Bulgaria.</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
