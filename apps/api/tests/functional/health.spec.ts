import { test } from '@japa/runner'

type HealthBody = {
  status: string
  checkedAt: string
  service: {
    name: string
    status: string
  }
  checks: {
    database: unknown
    objectStorage: unknown
    worker: unknown
  }
}

test.group('GET /health', () => {
  test('returns dependency health without authentication', async ({ client, assert }) => {
    const response = await client.get('/health')

    assert.include([200, 503], response.status())
    const body = response.body() as unknown as HealthBody
    assert.properties(body, ['status', 'service', 'checks', 'checkedAt'])
    assert.equal(body.service.status, 'up')
    assert.isString(body.service.name)
    assert.properties(body.checks, ['database', 'objectStorage', 'worker'])
    assert.notInclude(JSON.stringify(body), 'S3_SECRET_ACCESS_KEY')
    assert.notInclude(JSON.stringify(body), 'DB_PASSWORD')
  })
})
