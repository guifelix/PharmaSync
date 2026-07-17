import env from '#start/env'
import db from '@adonisjs/lucid/services/db'

export type HealthStatus = 'up' | 'down'
export type HealthCheckName = 'database' | 'objectStorage' | 'worker'

export type HealthCheckResult = {
  name: HealthCheckName
  status: HealthStatus
  message: string
  observedAt?: string
}

export type HealthResponse = {
  status: HealthStatus
  checkedAt: string
  service: {
    name: string
    status: 'up'
  }
  checks: Record<HealthCheckName, HealthCheckResult>
}

export type WorkerHeartbeatRecord = {
  last_seen_at?: string | Date
  lastSeenAt?: string | Date
}

export function readWorkerHeartbeatResult(result: WorkerHeartbeatRecord | null): Date | null {
  const lastSeenValue = result?.last_seen_at ?? result?.lastSeenAt
  return lastSeenValue ? new Date(lastSeenValue) : null
}

type HealthCheckDependencies = {
  database: () => Promise<HealthCheckResult>
  objectStorage: () => Promise<HealthCheckResult>
  worker: () => Promise<HealthCheckResult>
}

const workerHeartbeatName = 'outbox-worker'
const workerHeartbeatFreshnessMs = 2 * 60 * 1000
const objectStorageTimeoutMs = 1500

export class HealthService {
  constructor(private readonly checks: HealthCheckDependencies = defaultHealthChecks()) {}

  async check(now = new Date()): Promise<HealthResponse> {
    const [database, objectStorage, worker] = await Promise.all([
      this.runCheck('database', this.checks.database),
      this.runCheck('objectStorage', this.checks.objectStorage),
      this.runCheck('worker', this.checks.worker),
    ])

    const checks = { database, objectStorage, worker }
    const status = Object.values(checks).every((check) => check.status === 'up') ? 'up' : 'down'

    return {
      status,
      checkedAt: now.toISOString(),
      service: {
        name: env.get('APP_NAME'),
        status: 'up',
      },
      checks,
    }
  }

  private async runCheck(
    name: HealthCheckName,
    check: () => Promise<HealthCheckResult>
  ): Promise<HealthCheckResult> {
    try {
      return await check()
    } catch {
      return {
        name,
        status: 'down',
        message: `${displayName(name)} health check failed`,
      }
    }
  }
}

function defaultHealthChecks(): HealthCheckDependencies {
  return {
    database: checkDatabase,
    objectStorage: checkObjectStorage,
    worker: checkWorkerHeartbeat,
  }
}

async function checkDatabase(): Promise<HealthCheckResult> {
  await db.rawQuery('select 1 as ok')

  return {
    name: 'database',
    status: 'up',
    message: 'Database connection succeeded',
  }
}

async function checkObjectStorage(): Promise<HealthCheckResult> {
  const endpoint = env.get('S3_ENDPOINT')
  const healthUrl = new URL('/minio/health/live', endpoint)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), objectStorageTimeoutMs)

  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Object storage endpoint returned an unhealthy status')
    }

    return {
      name: 'objectStorage',
      status: 'up',
      message: 'Object storage endpoint is reachable',
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function checkWorkerHeartbeat(now = new Date()): Promise<HealthCheckResult> {
  const result = (await db
    .from('worker_heartbeats')
    .select('last_seen_at')
    .where('name', workerHeartbeatName)
    .first()) as WorkerHeartbeatRecord | null

  const lastSeenAt = readWorkerHeartbeatResult(result)

  if (!lastSeenAt) {
    return {
      name: 'worker',
      status: 'down',
      message: 'Worker heartbeat has not been recorded',
    }
  }

  const ageMs = now.getTime() - lastSeenAt.getTime()

  return {
    name: 'worker',
    status: ageMs <= workerHeartbeatFreshnessMs ? 'up' : 'down',
    message:
      ageMs <= workerHeartbeatFreshnessMs
        ? 'Worker heartbeat is fresh'
        : 'Worker heartbeat is stale',
    observedAt: lastSeenAt.toISOString(),
  }
}

function displayName(name: HealthCheckName): string {
  if (name === 'objectStorage') {
    return 'Object storage'
  }

  return name.charAt(0).toUpperCase() + name.slice(1)
}
