'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ServiceType, DbType, BillingPlan } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface ServiceWizardProps {
  projectId: string
  plans: BillingPlan[]
}

const SERVICE_TYPES: { type: ServiceType; label: string; desc: string; icon: string }[] = [
  { type: 'web',      label: 'Web Service',       desc: 'HTTP server — Next.js, Node, Python, Docker',  icon: '🌐' },
  { type: 'database', label: 'Database',           desc: 'Managed PostgreSQL, MySQL, Redis, MongoDB',    icon: '🗄️' },
  { type: 'worker',   label: 'Background Worker',  desc: 'Persistent process, polls a queue',            icon: '⚙️' },
  { type: 'cron',     label: 'Cron Job',           desc: 'Scheduled task with cron syntax',              icon: '⏰' },
  { type: 'static',   label: 'Static Site',        desc: 'HTML/CSS/JS hosted on CDN, free',              icon: '📄' },
]

const DB_TYPES: { value: DbType; label: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql',      label: 'MySQL' },
  { value: 'redis',      label: 'Redis' },
  { value: 'mongodb',    label: 'MongoDB' },
]

export default function ServiceWizard({ projectId, plans }: ServiceWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [serviceType, setServiceType] = useState<ServiceType>('web')
  const [planId, setPlanId] = useState('')
  const [name, setName] = useState('')
  const [gitRepo, setGitRepo] = useState('')
  const [gitBranch, setGitBranch] = useState('main')
  const [buildCmd, setBuildCmd] = useState('')
  const [startCmd, setStartCmd] = useState('')
  const [dockerImage, setDockerImage] = useState('')
  const [useDocker, setUseDocker] = useState(false)
  const [port, setPort] = useState('3000')
  const [cronSchedule, setCronSchedule] = useState('0 * * * *')
  const [dbType, setDbType] = useState<DbType>('postgresql')
  const [dbName, setDbName] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredPlans = plans.filter(
    (p) => p.service_type === (serviceType === 'worker' || serviceType === 'cron' ? 'web' : serviceType === 'static' ? 'web' : serviceType)
  )
  const selectedPlan = plans.find((p) => p.id === planId)

  async function handleDeploy() {
    if (!planId) { setError('Please select a plan'); return }
    if (!name.trim()) { setError('Service name is required'); return }

    // Static sites are free — create directly without Stripe
    if (serviceType === 'static') {
      setLoading(true)
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, type: serviceType, project_id: projectId,
          plan_id: planId, git_repo: gitRepo, git_branch: gitBranch,
        }),
      })
      if (res.ok) {
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        setError('Failed to create service')
        setLoading(false)
      }
      return
    }

    if (!selectedPlan?.stripe_price_id) {
      setError('This plan is not yet configured for purchase. Please contact support.')
      return
    }

    setLoading(true)
    setError('')
    const serviceConfig = {
      name, type: serviceType, project_id: projectId, plan_id: planId,
      ...(serviceType !== 'database' && {
        git_repo: useDocker ? undefined : gitRepo,
        git_branch: useDocker ? undefined : gitBranch,
        build_command: useDocker ? undefined : buildCmd,
        start_command: useDocker ? undefined : startCmd,
        docker_image: useDocker ? dockerImage : undefined,
        port: parseInt(port) || 3000,
      }),
      ...(serviceType === 'cron' && { cron_schedule: cronSchedule }),
      ...(serviceType === 'database' && { db_type: dbType, db_name: dbName, db_password: dbPassword }),
    }

    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId, service_config: serviceConfig }),
    })

    if (res.ok) {
      const { url } = await res.json()
      window.location.href = url
    } else {
      const { error: msg } = await res.json()
      setError(msg || 'Checkout failed')
      setLoading(false)
    }
  }

  const steps = ['Type', 'Configure', 'Plan', 'Review']

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-all ${
                i < step ? 'bg-violet-500 text-white cursor-pointer' :
                i === step ? 'btn-primary text-white' :
                'glass text-gray-500 border border-white/10'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </button>
            <span className={`text-sm ${i === step ? 'text-white font-medium' : 'text-gray-500'}`}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-white/10 mx-2 w-8" />}
          </div>
        ))}
      </div>

      {/* Step 0: Type */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">What would you like to deploy?</h2>
          <div className="grid grid-cols-1 gap-3">
            {SERVICE_TYPES.map((t) => (
              <button
                key={t.type}
                onClick={() => setServiceType(t.type)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  serviceType === t.type
                    ? 'border-violet-500/60 bg-violet-500/10 text-white'
                    : 'glass border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </div>
                {serviceType === t.type && (
                  <svg className="ml-auto text-violet-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(1)}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 1: Configure */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-white mb-2">Configure your service</h2>
          <Input label="Service name" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-app" required hint="Lowercase, hyphens allowed" />

          {serviceType === 'database' && (
            <>
              <Select label="Database type" value={dbType} onChange={(e) => setDbType(e.target.value as DbType)}>
                {DB_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </Select>
              <Input label="Database name" value={dbName} onChange={(e) => setDbName(e.target.value)} placeholder="mydb" />
              <Input label="Root password" type="password" value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} placeholder="Strong password" hint="Stored securely" />
            </>
          )}

          {(serviceType === 'web' || serviceType === 'worker' || serviceType === 'cron' || serviceType === 'static') && (
            <>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                  <input type="checkbox" checked={useDocker} onChange={(e) => setUseDocker(e.target.checked)} className="accent-violet-500" />
                  Deploy from Docker image instead of Git
                </label>
              </div>
              {useDocker ? (
                <Input label="Docker image" value={dockerImage} onChange={(e) => setDockerImage(e.target.value)} placeholder="nginx:alpine or ghcr.io/user/app:latest" />
              ) : (
                <>
                  <Input label="Git repository URL" value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} placeholder="https://github.com/user/repo" />
                  <Input label="Branch" value={gitBranch} onChange={(e) => setGitBranch(e.target.value)} placeholder="main" />
                  {serviceType !== 'static' && (
                    <>
                      <Input label="Build command" value={buildCmd} onChange={(e) => setBuildCmd(e.target.value)} placeholder="npm run build" hint="Leave blank to auto-detect" />
                      <Input label="Start command" value={startCmd} onChange={(e) => setStartCmd(e.target.value)} placeholder="npm start" hint="Leave blank to auto-detect" />
                    </>
                  )}
                </>
              )}
              {(serviceType === 'web') && (
                <Input label="Port" type="number" value={port} onChange={(e) => setPort(e.target.value)} placeholder="3000" hint="Port your app listens on" />
              )}
              {serviceType === 'cron' && (
                <Input label="Cron schedule" value={cronSchedule} onChange={(e) => setCronSchedule(e.target.value)} placeholder="0 * * * *" hint="Standard cron syntax — runs in UTC" />
              )}
            </>
          )}

          <div className="flex justify-between mt-2">
            <Button variant="secondary" onClick={() => setStep(0)}>← Back</Button>
            <Button onClick={() => setStep(2)}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 2: Plan */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Choose a plan</h2>
          {filteredPlans.length === 0 ? (
            <p className="text-gray-400">No plans available for this service type.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredPlans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlanId(p.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    planId === p.id
                      ? 'border-violet-500/60 bg-violet-500/10'
                      : 'glass border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-white font-semibold text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.description}</div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-white font-bold">${p.monthly_price}<span className="text-gray-500 font-normal text-xs">/mo</span></div>
                    {!p.stripe_price_id && <div className="text-xs text-yellow-500 mt-0.5">Coming soon</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
            <Button onClick={() => setStep(3)} disabled={!planId}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Review & Deploy</h2>
          <div className="glass border border-white/10 rounded-xl divide-y divide-white/5 mb-6">
            {[
              ['Service name', name],
              ['Type', serviceType],
              ['Plan', selectedPlan?.name ?? planId],
              ['Monthly cost', selectedPlan ? `$${selectedPlan.monthly_price}/mo` : '—'],
              ...(serviceType !== 'database' && !useDocker ? [['Git repo', gitRepo || '—'], ['Branch', gitBranch]] : []),
              ...(useDocker ? [['Docker image', dockerImage]] : []),
              ...(serviceType === 'cron' ? [['Schedule', cronSchedule]] : []),
              ...(serviceType === 'database' ? [['Database', dbType], ['DB name', dbName]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <p className="text-xs text-gray-500 mb-4">
            {serviceType === 'static'
              ? 'Static sites are free. No payment needed.'
              : "You'll be redirected to Stripe to complete payment. Your service will be provisioned automatically after payment."}
          </p>

          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
            <Button onClick={handleDeploy} loading={loading} size="lg">
              {serviceType === 'static' ? 'Deploy free →' : `Deploy & Pay $${selectedPlan?.monthly_price}/mo →`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
