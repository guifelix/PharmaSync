import { signLocalWorkforceToken } from '#services/workforce_auth_service'
import { test } from '@japa/runner'

const now = Math.floor(Date.now() / 1000)

test.group('GET /api/v1/auth/context', () => {
  test('rejects requests without a bearer token', async ({ client }) => {
    const response = await client.get('/api/v1/auth/context')

    response.assertStatus(401)
  })

  test('rejects requests with an invalid bearer token', async ({ client }) => {
    const response = await client
      .get('/api/v1/auth/context')
      .header('authorization', 'Bearer not-a-jwt')

    response.assertStatus(401)
  })

  test('returns local authenticated workforce context', async ({ client, assert }) => {
    const token = signLocalWorkforceToken({
      iss: 'https://auth.local.pharmasync.test',
      sub: 'usr_local_ops',
      aud: 'pharmasync-api',
      exp: now + 300,
      org_id: 'org_alpha',
      site_ids: ['site_main', 'site_overflow'],
      roles: ['operations'],
    })

    const response = await client
      .get('/api/v1/auth/context')
      .header('authorization', `Bearer ${token}`)
      .header('x-request-id', 'trace-local-auth')

    response.assertStatus(200)
    assert.deepInclude(response.body().data, {
      userId: 'usr_local_ops',
      organizationId: 'org_alpha',
      traceId: 'trace-local-auth',
    })
    assert.deepEqual(response.body().data.permittedSiteIds, ['site_main', 'site_overflow'])
    assert.deepEqual(response.body().data.roles, ['operations'])
  })

  test('returns context from OIDC-shaped claims', async ({ client, assert }) => {
    const token = signLocalWorkforceToken({
      iss: 'https://auth.local.pharmasync.test',
      sub: 'usr_oidc_ops',
      aud: ['pharmasync-api', 'pharmasync-web'],
      exp: now + 300,
      organization_id: 'org_beta',
      permitted_site_ids: ['site_north'],
      roles: ['operations', 'auditor'],
    })

    const response = await client
      .get('/api/v1/auth/context')
      .header('authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.deepInclude(response.body().data, {
      userId: 'usr_oidc_ops',
      organizationId: 'org_beta',
    })
    assert.deepEqual(response.body().data.permittedSiteIds, ['site_north'])
    assert.deepEqual(response.body().data.roles, ['operations', 'auditor'])
    assert.isString(response.body().data.traceId)
  })
})
