import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for static sites and experiments.',
    features: ['Static sites only', '1 project', 'Shared CDN', 'Community support', '100GB bandwidth'],
    cta: 'Get started',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$5',
    period: '/mo per service',
    desc: 'Your first web service or database.',
    features: ['Web services from $5/mo', 'Databases from $7/mo', '0.5–1 vCPU', 'Up to 1GB RAM', 'EU servers (Hetzner)', 'Email support', 'Auto-deploy from Git'],
    cta: 'Start free trial',
    href: '/signup',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Pro',
    price: '$25',
    period: '/mo per service',
    desc: 'Scale your production workloads.',
    features: ['Everything in Starter', 'Up to 4 vCPU / 4GB RAM', 'Managed PostgreSQL, MySQL, Redis', 'Background workers', 'Cron jobs', 'Priority support', 'Custom domains + SSL'],
    cta: 'Contact us',
    href: 'mailto:hello@nexusbg.com',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section className="relative py-32 px-4 overflow-hidden" id="pricing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-900/15 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-blue-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Simple pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pay per service,
            <br />
            <span className="gradient-text">nothing more</span>
          </h2>
          <p className="text-gray-400 text-lg">No hidden fees. No surprise bills. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col rounded-2xl p-6 border transition-all duration-300 ${plan.highlight ? 'border-violet-500/50 bg-violet-900/20 shadow-[0_0_60px_rgba(139,92,246,0.15)]' : 'glass border-white/5'}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <div className="text-gray-400 text-sm font-medium mb-2">{plan.name}</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 mb-1">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlight ? 'btn-primary text-white' : 'glass text-gray-300 hover:text-white hover:bg-white/10'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm">
          Prices shown in USD. Each service is billed independently — only pay for what you use.
        </p>
      </div>
    </section>
  )
}
