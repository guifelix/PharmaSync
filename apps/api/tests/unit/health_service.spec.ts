import { test } from '@japa/runner'
import {
  HealthService,
  readWorkerHeartbeatResult,
  type WorkerHeartbeatRecord,
} from '#services/health_service'

const healthyChecks = {
  database: async () => ({
    name: 'database' as const,
    status: 'up' as const,
    message: 'Database connection succeeded',
  }),
  objectStorage: async () => ({
    name: 'objectStorage' as const,
    status: 'up' as const,
    message: 'Object storage endpoint is reachable',
  }),
  worker: async () => ({
    name: 'worker' as const,
    status: 'up' as const,
    message: 'Worker heartbeat is fresh',
    observedAt: '2026-07-17T03:00:00.000Z',
  }),
}

test.group('HealthService', () => {
  test('returns an up status when every dependency is healthy', async ({ assert }) => {
    const service = new HealthService(healthyChecks)

    const health = await service.check()

    assert.equal(health.status, 'up')
    assert.equal(health.service.name, 'pharmasync-api-test')
    assert.equal(health.checks.database.status, 'up')
    assert.equal(health.checks.objectStorage.status, 'up')
    assert.equal(health.checks.worker.status, 'up')
  })

  test('returns a down status without leaking dependency error details', async ({ assert }) => {
    const service = new HealthService({
      ...healthyChecks,
      objectStorage: async () => {
        throw new Error('S3_SECRET_ACCESS_KEY=super-secret failed against http://localhost:9000')
      },
    })

    const health = await service.check()

    assert.equal(health.status, 'down')
    assert.equal(health.checks.objectStorage.status, 'down')
    assert.equal(health.checks.objectStorage.message, 'Object storage health check failed')
    assert.notInclude(JSON.stringify(health), 'super-secret')
    assert.notInclude(JSON.stringify(health), 'S3_SECRET_ACCESS_KEY')
  })

  test('reads snake_case worker heartbeat timestamps returned by the database', ({ assert }) => {
    const record: WorkerHeartbeatRecord = {
      last_seen_at: '2026-07-17T03:00:00.000Z',
    }

    assert.equal(readWorkerHeartbeatResult(record)?.toISOString(), '2026-07-17T03:00:00.000Z')
  })
})
