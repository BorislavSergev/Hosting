const stats = [
  { value: "50K+", label: "Developers", sub: "building with Nexus" },
  { value: "2.1B", label: "Requests/day", sub: "processed at the edge" },
  { value: "99.99%", label: "Uptime SLA", sub: "guaranteed" },
  { value: "< 30s", label: "Deploy time", sub: "average worldwide" },
];

const testimonials = [
  {
    quote: "We cut our deployment time from 45 minutes to under a minute. Nexus changed how our entire engineering team operates.",
    name: "Sarah Chen",
    role: "VP Engineering, Stripe",
    avatar: "SC",
    color: "from-violet-500 to-blue-500",
  },
  {
    quote: "The AI code review alone saves my team 10 hours per week. It's like having a senior engineer reviewing every PR.",
    name: "Marcus Williams",
    role: "CTO, Linear",
    avatar: "MW",
    color: "from-blue-500 to-cyan-500",
  },
  {
    quote: "Migrating our stack to Nexus was the best infrastructure decision we made in 2024. Zero downtime, instant rollbacks.",
    name: "Priya Sharma",
    role: "Staff Engineer, Notion",
    avatar: "PS",
    color: "from-green-500 to-emerald-500",
  },
];

export default function Stats() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Decorative line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-violet-500/30" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((s) => (
            <div key={s.value} className="text-center glass rounded-2xl p-6 border border-white/5">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{s.value}</div>
              <div className="text-white font-semibold mt-2">{s.label}</div>
              <div className="text-gray-500 text-sm mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">
            Loved by <span className="gradient-text">engineering teams</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-glow glass rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#a78bfa">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
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
  );
}
