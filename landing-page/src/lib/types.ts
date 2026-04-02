export type ServiceType = 'web' | 'database' | 'worker' | 'cron' | 'static'
export type ServiceStatus = 'building' | 'running' | 'stopped' | 'failed' | 'suspended'
export type DeploymentStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
export type ServerStatus = 'active' | 'maintenance' | 'offline'
export type DbType = 'postgresql' | 'mysql' | 'redis' | 'mongodb'
export type HetznerServerType = 'cx23' | 'cx33' | 'cx43' | 'cx53'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  services?: Service[]
}

export interface Server {
  id: string
  name: string
  hetzner_server_id: number | null
  hetzner_server_type: HetznerServerType
  ip_address: string
  location: string
  coolify_server_uuid: string | null
  total_cpu: number
  total_ram_mb: number
  total_disk_gb: number
  available_cpu: number
  available_ram_mb: number
  available_disk_gb: number
  status: ServerStatus
  created_at: string
  updated_at: string
}

export interface BillingPlan {
  id: string
  name: string
  service_type: ServiceType
  cpu_cores: number
  ram_mb: number
  disk_gb: number
  monthly_price: number
  stripe_price_id: string | null
  description: string | null
}

export interface Service {
  id: string
  project_id: string
  user_id: string
  name: string
  type: ServiceType
  status: ServiceStatus
  plan_id: string
  server_id: string | null
  coolify_resource_uuid: string | null
  coolify_server_uuid: string | null
  git_repo: string | null
  git_branch: string
  build_command: string | null
  start_command: string | null
  docker_image: string | null
  port: number
  cron_schedule: string | null
  db_type: DbType | null
  db_version: string | null
  db_name: string | null
  internal_url: string | null
  external_url: string | null
  stripe_subscription_id: string | null
  monthly_cost: number | null
  created_at: string
  updated_at: string
  plan?: BillingPlan
  server?: Server
}

export interface Deployment {
  id: string
  service_id: string
  user_id: string
  coolify_deployment_uuid: string | null
  status: DeploymentStatus
  triggered_by: string
  commit_sha: string | null
  commit_message: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export interface EnvVar {
  id: string
  service_id: string
  key: string
  value: string
  is_secret: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  service_id: string | null
  stripe_subscription_id: string
  stripe_customer_id: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
}

// Service wizard config passed through checkout
export interface ServiceConfig {
  name: string
  type: ServiceType
  project_id: string
  plan_id: string
  git_repo?: string
  git_branch?: string
  build_command?: string
  start_command?: string
  docker_image?: string
  port?: number
  cron_schedule?: string
  db_type?: DbType
  db_version?: string
  db_name?: string
  db_password?: string
}
