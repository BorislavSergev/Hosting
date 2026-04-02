const features = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    label: 'Git Push to Deploy',
    color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20',
    title: 'Push code, get a live URL',
    desc: 'Connect your GitHub or GitLab repo and every push auto-deploys. Zero-downtime rolling updates with instant rollback.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4H7a4 4 0 00-4 4v6z" strokeLinecap="round" /><path d="M8 12h8M12 8v8" strokeLinecap="round" /></svg>,
    label: 'European Servers',
    color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20',
    title: 'Hetzner VPS in EU datacenters',
    desc: 'Your data stays in Europe. Servers in Nuremberg, Falkenstein, and Helsinki — low latency for EU users and full GDPR compliance.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /></svg>,
    label: 'Managed Databases',
    color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20',
    title: 'PostgreSQL, MySQL, Redis',
    desc: 'Fully managed databases with automated backups, one-click restores, and private networking between your services.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" strokeLinecap="round" /></svg>,
    label: 'Workers & Cron',
    color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20',
    title: 'Background jobs done right',
    desc: 'Run background workers continuously or on a schedule. Full cron syntax support with execution logs and email alerts on failure.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" /></svg>,
    label: '99.9% Uptime SLA',
    color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20',
    title: 'We guarantee your uptime',
    desc: 'Health checks every 30 seconds, automatic restarts, and multi-region redundancy. If we fail the SLA you get service credits.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" /></svg>,
    label: 'Transparent Pricing',
    color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20',
    title: 'No surprise bills ever',
    desc: 'Fixed monthly price per service. No per-request charges, no bandwidth overages, no hidden fees. Pause or delete anytime.',
  },
]

export default function Features() {
  return (
    <section className="relative py-32 px-4 overflow-hidden" id="features">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/20 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-violet-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Built for developers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to
            <br />
            <span className="gradient-text">ship production apps</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From the first git push to scaling production — NexusBG handles the infrastructure so you can focus on your product.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-glow glass rounded-2xl p-6 flex flex-col gap-4 border border-white/5 transition-all duration-300 cursor-default">
              <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color}`}>
                {f.icon}
              </div>
              <div>
                <span className={`text-xs font-semibold uppercase tracking-widest ${f.color}`}>{f.label}</span>
                <h3 className="text-white font-semibold text-lg mt-1">{f.title}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
