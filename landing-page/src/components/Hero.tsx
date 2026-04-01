export default function Hero() {
  return (
    <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0" />

      {/* Floating orbs */}
      <div className="animate-float absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="animate-float-delay absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="animate-float-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-3xl pointer-events-none" />

      {/* Rotating ring */}
      <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-violet-500/10 pointer-events-none" />
      <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-blue-500/5 pointer-events-none" style={{ animationDuration: "30s", animationDirection: "reverse" }} />

      {/* Badge */}
      <div className="animate-fade-in relative mb-8 flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-gray-300">Now in public beta</span>
        <span className="text-violet-400 font-medium ml-1">→ Join waitlist</span>
      </div>

      {/* Headline */}
      <h1 className="animate-slide-up relative text-center font-bold text-white" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: "1.1" }}>
        Build the future
        <br />
        <span className="gradient-text">without limits</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-slide-up relative mt-6 max-w-xl text-center text-gray-400 text-lg" style={{ animationDelay: "0.1s" }}>
        Nexus is the AI-powered platform that transforms how teams collaborate, ship products, and scale without friction.
      </p>

      {/* CTAs */}
      <div className="animate-slide-up relative mt-10 flex flex-col sm:flex-row items-center gap-4" style={{ animationDelay: "0.2s" }}>
        <a href="#" className="btn-primary animate-pulse-glow text-white px-8 py-4 rounded-2xl font-semibold text-lg">
          Start for free →
        </a>
        <a href="#" className="glass text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
          Watch demo
        </a>
      </div>

      {/* Trust badges */}
      <div className="animate-fade-in relative mt-12 flex flex-col items-center gap-3" style={{ animationDelay: "0.4s" }}>
        <p className="text-gray-500 text-sm">Trusted by teams at</p>
        <div className="flex items-center gap-8 flex-wrap justify-center">
          {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map((company) => (
            <span key={company} className="text-gray-500 font-semibold text-sm tracking-wider uppercase">{company}</span>
          ))}
        </div>
      </div>

      {/* Hero UI preview */}
      <div className="animate-float-slow relative mt-20 w-full max-w-4xl">
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-4">
              <div className="glass rounded-md px-3 py-1 text-xs text-gray-500 text-center">app.nexus.dev/dashboard</div>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div className="p-6 grid grid-cols-3 gap-4" style={{ background: "rgba(10, 10, 20, 0.6)" }}>
            {/* Sidebar */}
            <div className="col-span-1 space-y-3">
              {["Overview", "Projects", "Team", "Analytics", "Settings"].map((item, i) => (
                <div key={item} className={`px-3 py-2 rounded-lg text-sm ${i === 0 ? "bg-violet-500/20 text-violet-300" : "text-gray-500 hover:text-gray-300"}`}>
                  {item}
                </div>
              ))}
            </div>
            {/* Main content */}
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Active Users", value: "12,847", color: "text-green-400" },
                  { label: "Revenue", value: "$98.2K", color: "text-violet-400" },
                  { label: "Uptime", value: "99.98%", color: "text-blue-400" },
                  { label: "Deployments", value: "2,391", color: "text-yellow-400" },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-3">
                    <div className="text-xs text-gray-500">{stat.label}</div>
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
              {/* Chart placeholder */}
              <div className="glass rounded-xl p-4 h-24 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `rgba(139, 92, 246, ${0.3 + (h / 100) * 0.5})` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
