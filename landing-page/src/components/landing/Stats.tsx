const stats = [
  { value: '500+', label: 'Apps deployed', sub: 'on NexusBG' },
  { value: '99.98%', label: 'Uptime', sub: 'last 12 months' },
  { value: '< 35s', label: 'Deploy time', sub: 'average' },
  { value: '3', label: 'EU locations', sub: 'Nuremberg · Falkenstein · Helsinki' },
]

const testimonials = [
  {
    quote: 'Switched from a German provider to NexusBG and cut our hosting bill in half. Setup took 20 minutes.',
    name: 'Georgi Petrov',
    role: 'CTO, Softuni Labs',
    avatar: 'GP',
    color: 'from-violet-500 to-blue-500',
  },
  {
    quote: 'Finally a Bulgarian hosting provider that is actually developer-friendly. Git push deploy is a game changer.',
    name: 'Maria Ivanova',
    role: 'Lead Developer, StartupBG',
    avatar: 'MI',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'Our data stays in Europe, GDPR compliance is automatic, and the pricing is transparent. What more do you need?',
    name: 'Dimitar Nikolov',
    role: 'Founder, E-commerce BG',
    avatar: 'DN',
    color: 'from-green-500 to-emerald-500',
  },
]

export default function Stats() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((s) => (
            <div key={s.value} className="text-center glass rounded-2xl p-6 border border-white/5">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{s.value}</div>
              <div className="text-white font-semibold mt-2">{s.label}</div>
              <div className="text-gray-500 text-sm mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">
            Loved by <span className="gradient-text">Bulgarian developers</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-glow glass rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#a78bfa">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
