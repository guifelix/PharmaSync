import { signLocalWorkforceToken } from '#services/workforce_auth_service'
import { test } from '@japa/runner'

const expiresAt = Math.floor(Date.now() / 1000) + 300

test.group('tenant-aware query scope', () => {
  test('scopes inventory stock to the authenticated organization and permitted sites', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/api/v1/inventory/stock')
      .bearerToken(tokenFor({ roles: ['operations'], siteIds: ['site_main'] }))

    response.assertStatus(200)
    assert.deepEqual(recordIds(response.body().data), ['stock_alpha_main_amoxicillin'])
    assert.deepEqual(recordTraceIds(response.body().data), ['trace-stock-alpha-main-amoxicillin'])
  })

  test('scopes risk signals to the authenticated organization and permitted sites', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/api/v1/signals')
      .bearerToken(tokenFor({ roles: ['operations'], siteIds: ['site_main'] }))

    response.assertStatus(200)
    assert.deepEqual(recordIds(response.body().data), ['signal_alpha_main'])
    assert.deepEqual(recordTraceIds(response.body().data), ['trace-signal-alpha-main'])
  })

  test('scopes quarantine records to the authenticated organization and permitted sites', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/api/v1/quarantine')
      .bearerToken(tokenFor({ roles: ['integration'], siteIds: ['site_main'] }))

    response.assertStatus(200)
    assert.deepEqual(recordIds(response.body().data), ['qrn_alpha_main'])
    assert.deepEqual(recordTraceIds(response.body().data), ['trace-quarantine-alpha-main'])
  })

  test('scopes audit events to organization-owned and permitted-site records', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/api/v1/audit/events')
      .bearerToken(tokenFor({ roles: ['compliance'], siteIds: ['site_main'] }))

    response.assertStatus(200)
    assert.deepEqual(recordIds(response.body().data), ['audit_alpha_org', 'audit_alpha_main'])
    assert.deepEqual(recordTraceIds(response.body().data), [
      'trace-audit-alpha-org',
      'trace-audit-alpha-main',
    ])
  })

  test('does not leak records from another organization with the same site id', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/api/v1/inventory/stock')
      .bearerToken(
        tokenFor({ roles: ['operations'], organizationId: 'org_beta', siteIds: ['site_main'] })
      )

    response.assertStatus(200)
    assert.deepEqual(recordIds(response.body().data), ['stock_beta_main_metformin'])
  })
})

function tokenFor({
  roles,
  organizationId = 'org_alpha',
  siteIds,
}: {
  roles: string[]
  organizationId?: string
  siteIds: string[]
}) {
  return signLocalWorkforceToken({
    iss: 'https://auth.local.pharmasync.test',
    sub: `usr_${organizationId}_${roles.join('_')}`,
    aud: 'pharmasync-api',
    exp: expiresAt,
    org_id: organizationId,
    site_ids: siteIds,
    roles,
  })
}

function recordIds(records: Array<{ id: string }>) {
  return records.map((record) => record.id)
}

function recordTraceIds(records: Array<{ traceId: string }>) {
  return records.map((record) => record.traceId)
}
