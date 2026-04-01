import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-violet-500/20 p-px">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-blue-600/20 to-violet-600/30 animate-gradient" />
          <div className="relative rounded-3xl p-16 text-center" style={{ background: 'rgba(15,10,30,0.9)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-violet-600/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to deploy on
                <br />
                <span className="gradient-text">European cloud?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                Join developers who trust Bulgarian infrastructure. Get started in minutes, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="btn-primary animate-pulse-glow text-white px-10 py-4 rounded-2xl font-semibold text-lg">
                  Deploy your first app free
                </Link>
                <a href="mailto:hello@nexusbg.com" className="glass text-gray-300 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10">
                  Talk to us
                </a>
              </div>
              <p className="text-gray-600 text-sm mt-6">Free static site hosting. No credit card required.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
