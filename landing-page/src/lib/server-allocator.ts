import { supabaseAdmin } from './supabase/server'
import type { Server, BillingPlan } from './types'

interface ResourceRequirements {
  cpu: number
  ram_mb: number
  disk_gb: number
}

/**
 * Finds the best available Hetzner VPS to place a new service on.
 * Scores servers by available resource ratio and picks the most free one
 * (spreads load evenly across the fleet).
 */
export async function allocateServer(
  requirements: ResourceRequirements
): Promise<Server> {
  const { data: candidates, error } = await supabaseAdmin
    .from('servers')
    .select('*')
    .eq('status', 'active')
    .gte('available_cpu', requirements.cpu)
    .gte('available_ram_mb', requirements.ram_mb)
    .gte('available_disk_gb', requirements.disk_gb)

  if (error) throw new Error(`Server query failed: ${error.message}`)
  if (!candidates || candidates.length === 0) {
    throw new Error('NO_CAPACITY: No servers have sufficient available resources.')
  }

  // Score: average of 3 ratios (available / total). Higher = more free.
  const scored = candidates
    .map((s: Server) => ({
      server: s,
      score:
        (s.available_cpu / s.total_cpu +
          s.available_ram_mb / s.total_ram_mb +
          s.available_disk_gb / s.total_disk_gb) /
        3,
    }))
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)

  const selected = scored[0].server

  // Reserve resources
  const { error: updateError } = await supabaseAdmin
    .from('servers')
    .update({
      available_cpu: selected.available_cpu - requirements.cpu,
      available_ram_mb: selected.available_ram_mb - requirements.ram_mb,
      available_disk_gb: selected.available_disk_gb - requirements.disk_gb,
      updated_at: new Date().toISOString(),
    })
    .eq('id', selected.id)

  if (updateError) throw new Error(`Failed to reserve server: ${updateError.message}`)

  return selected
}

/**
 * Releases resources back to a server when a service is deleted.
 */
export async function releaseServer(
  serverId: string,
  plan: BillingPlan
): Promise<void> {
  const { data: server } = await supabaseAdmin
    .from('servers')
    .select('available_cpu, available_ram_mb, available_disk_gb, total_cpu, total_ram_mb, total_disk_gb')
    .eq('id', serverId)
    .single()

  if (!server) return

  await supabaseAdmin
    .from('servers')
    .update({
      available_cpu: Math.min(server.available_cpu + plan.cpu_cores, server.total_cpu),
      available_ram_mb: Math.min(server.available_ram_mb + plan.ram_mb, server.total_ram_mb),
      available_disk_gb: Math.min(server.available_disk_gb + plan.disk_gb, server.total_disk_gb),
      updated_at: new Date().toISOString(),
    })
    .eq('id', serverId)
}
