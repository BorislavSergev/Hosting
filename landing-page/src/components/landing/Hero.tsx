import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 overflow-hidden">
      <div className="noise-overlay absolute inset-0" />
      <div className="animate-float absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="animate-float-delay absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-violet-500/10 pointer-events-none" />

      {/* Badge */}
      <div className="animate-fade-in relative mb-8 flex items-center gap-2 glass rounded-full px-4 py-2 text-sm flex-wrap justify-center">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-gray-300">🇧🇬 Bulgarian Cloud · 🇪🇺 EU Servers · GDPR Compliant</span>
      </div>

      {/* Headline */}
      <h1 className="animate-slide-up relative text-center font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: '1.1' }}>
        Deploy faster with
        <br />
        <span className="gradient-text">European cloud</span>
      </h1>

      <p className="animate-slide-up relative mt-6 max-w-xl text-center text-gray-400 text-lg" style={{ animationDelay: '0.1s' }}>
        Bulgarian-owned hosting built for developers. Deploy apps, databases, and workers in seconds on Hetzner infrastructure — no DevOps needed.
      </p>

      <div className="animate-slide-up relative mt-10 flex flex-col sm:flex-row items-center gap-4" style={{ animationDelay: '0.2s' }}>
        <Link href="/signup" className="btn-primary animate-pulse-glow text-white px-8 py-4 rounded-2xl font-semibold text-lg">
          Start for free →
        </Link>
        <a href="#features" className="glass text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
          See features
        </a>
      </div>

      <div className="animate-fade-in relative mt-12 flex flex-col items-center gap-3" style={{ animationDelay: '0.4s' }}>
        <p className="text-gray-500 text-sm">Trusted infrastructure from</p>
        <div className="flex items-center gap-8 flex-wrap justify-center">
          {['Hetzner', 'Coolify', 'Supabase', 'Stripe', 'Cloudflare'].map((c) => (
            <span key={c} className="text-gray-500 font-semibold text-sm tracking-wider uppercase">{c}</span>
          ))}
        </div>
      </div>

      {/* Dashboard preview */}
      <div className="animate-float-slow relative mt-20 w-full max-w-4xl">
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-4">
              <div className="glass rounded-md px-3 py-1 text-xs text-gray-500 text-center">app.nexusbg.com/dashboard</div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4" style={{ background: 'rgba(10,10,20,0.6)' }}>
            <div className="col-span-1 space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-3">Projects</div>
              {['my-saas', 'api-service', 'landing-page'].map((p, i) => (
                <div key={p} className={`px-3 py-2 rounded-lg text-sm ${i === 0 ? 'bg-violet-500/20 text-violet-300' : 'text-gray-500'}`}>
                  {p}
                </div>
              ))}
            </div>
            <div className="col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Services', value: '6', color: 'text-green-400' },
                  { label: 'Deployments', value: '143', color: 'text-violet-400' },
                  { label: 'Uptime', value: '99.98%', color: 'text-blue-400' },
                  { label: 'Monthly', value: '$47', color: 'text-yellow-400' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-3">
                    <div className="text-xs text-gray-500">{s.label}</div>
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="glass rounded-xl p-3 space-y-2">
                {[
                  { name: 'web-app', type: 'Web', status: 'running', color: 'bg-green-400' },
                  { name: 'postgres-db', type: 'PostgreSQL', status: 'running', color: 'bg-green-400' },
                  { name: 'worker', type: 'Worker', status: 'building', color: 'bg-yellow-400 animate-pulse' },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.color}`} />
                      <span className="text-gray-300">{svc.name}</span>
                      <span className="text-gray-600">{svc.type}</span>
                    </div>
                    <span className="text-gray-500">{svc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
