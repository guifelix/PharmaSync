import { signLocalWorkforceToken } from '#services/workforce_auth_service'
import { test } from '@japa/runner'

const expiresAt = Math.floor(Date.now() / 1000) + 300

test.group('role-based access control', () => {
  test('allows operations users to read inventory and signals', async ({ client }) => {
    const token = tokenFor(['operations'])

    const inventory = await client.get('/api/v1/inventory/stock').bearerToken(token)
    const signals = await client.get('/api/v1/signals').bearerToken(token)

    inventory.assertStatus(200)
    signals.assertStatus(200)
  })

  test('denies operations users from evidence export and quarantine reprocessing', async ({
    client,
  }) => {
    const token = tokenFor(['operations'])

    const evidence = await client.post('/api/v1/evidence/packages').bearerToken(token)
    const reprocessing = await client
      .post('/api/v1/quarantine/qrn_123/reprocessings')
      .bearerToken(token)

    evidence.assertStatus(403)
    reprocessing.assertStatus(403)
  })

  test('allows compliance users to read audit events and generate evidence packages', async ({
    client,
  }) => {
    const token = tokenFor(['compliance'])

    const audit = await client.get('/api/v1/audit/events').bearerToken(token)
    const evidence = await client.post('/api/v1/evidence/packages').bearerToken(token)

    audit.assertStatus(200)
    evidence.assertStatus(200)
  })

  test('denies compliance users from changing integration mappings', async ({ client }) => {
    const token = tokenFor(['compliance'])

    const response = await client.patch('/api/v1/integration/mappings/map_123').bearerToken(token)

    response.assertStatus(403)
  })

  test('allows integration users to inspect health, inspect quarantine, and reprocess payloads', async ({
    client,
  }) => {
    const token = tokenFor(['integration'])

    const health = await client.get('/api/v1/integration/health').bearerToken(token)
    const quarantine = await client.get('/api/v1/quarantine').bearerToken(token)
    const reprocessing = await client
      .post('/api/v1/quarantine/qrn_123/reprocessings')
      .bearerToken(token)

    health.assertStatus(200)
    quarantine.assertStatus(200)
    reprocessing.assertStatus(200)
  })

  test('allows platform administrators to manage configuration and integration mappings', async ({
    client,
  }) => {
    const token = tokenFor(['platform-admin'])

    const configuration = await client.patch('/api/v1/configuration/access').bearerToken(token)
    const mappings = await client.patch('/api/v1/integration/mappings/map_123').bearerToken(token)

    configuration.assertStatus(200)
    mappings.assertStatus(200)
  })

  test('rejects unknown roles for protected permissions', async ({ client }) => {
    const token = tokenFor(['contractor'])

    const response = await client.get('/api/v1/inventory/stock').bearerToken(token)

    response.assertStatus(403)
  })
})

function tokenFor(roles: string[]) {
  return signLocalWorkforceToken({
    iss: 'https://auth.local.pharmasync.test',
    sub: `usr_${roles.join('_')}`,
    aud: 'pharmasync-api',
    exp: expiresAt,
    org_id: 'org_alpha',
    site_ids: ['site_main', 'site_overflow'],
    roles,
  })
}
