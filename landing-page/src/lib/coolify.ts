import type { ServiceType, DbType } from './types'

const BASE_URL = process.env.COOLIFY_API_URL
const TOKEN = process.env.COOLIFY_API_TOKEN

interface CoolifyAppConfig {
  serverUuid: string
  name: string
  gitRepo?: string
  gitBranch?: string
  buildCommand?: string
  startCommand?: string
  dockerImage?: string
  port?: number
  envVars?: Record<string, string>
}

interface CoolifyDbConfig {
  serverUuid: string
  name: string
  dbType: DbType
  dbVersion?: string
  dbName?: string
  dbPassword?: string
}

interface CoolifyResource {
  uuid: string
  url?: string
  status?: string
}

class CoolifyClient {
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}/api/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Coolify API ${method} ${path} → ${res.status}: ${text}`)
    }

    return res.json()
  }

  async listServers() {
    return this.request<CoolifyResource[]>('GET', '/servers')
  }

  async createApplication(config: CoolifyAppConfig): Promise<CoolifyResource> {
    const payload = config.dockerImage
      ? {
          server_uuid: config.serverUuid,
          name: config.name,
          type: 'dockerfile',
          docker_image: config.dockerImage,
          ports_exposes: String(config.port ?? 3000),
        }
      : {
          server_uuid: config.serverUuid,
          name: config.name,
          type: 'public',
          git_repository: config.gitRepo,
          git_branch: config.gitBranch ?? 'main',
          build_pack: 'nixpacks',
          build_command: config.buildCommand ?? '',
          start_command: config.startCommand ?? '',
          ports_exposes: String(config.port ?? 3000),
        }

    return this.request<CoolifyResource>('POST', '/applications', payload)
  }

  async createDatabase(config: CoolifyDbConfig): Promise<CoolifyResource> {
    const typeMap: Record<DbType, string> = {
      postgresql: 'postgresql',
      mysql: 'mysql',
      redis: 'redis',
      mongodb: 'mongodb',
    }
    return this.request<CoolifyResource>('POST', '/databases', {
      server_uuid: config.serverUuid,
      name: config.name,
      type: typeMap[config.dbType],
      postgres_db: config.dbName,
      postgres_password: config.dbPassword,
    })
  }

  async getApplication(uuid: string): Promise<CoolifyResource> {
    return this.request<CoolifyResource>('GET', `/applications/${uuid}`)
  }

  async getDatabase(uuid: string): Promise<CoolifyResource> {
    return this.request<CoolifyResource>('GET', `/databases/${uuid}`)
  }

  async triggerDeploy(appUuid: string): Promise<{ deployment_uuid: string }> {
    return this.request<{ deployment_uuid: string }>(
      'POST',
      `/applications/${appUuid}/deploy`
    )
  }

  async getDeploymentLogs(deploymentUuid: string): Promise<{ logs: string }> {
    return this.request<{ logs: string }>(
      'GET',
      `/deployments/${deploymentUuid}`
    )
  }

  async deleteApplication(uuid: string): Promise<void> {
    await this.request('DELETE', `/applications/${uuid}`)
  }

  async deleteDatabase(uuid: string): Promise<void> {
    await this.request('DELETE', `/databases/${uuid}`)
  }

  isDbType(type: ServiceType): boolean {
    return type === 'database'
  }
}

export const coolify = new CoolifyClient()
