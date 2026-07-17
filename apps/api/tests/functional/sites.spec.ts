import {
  activeSitesForTenant,
  demoOrganizations,
  demoSites,
  organizationTypes,
} from '#services/organization_site_reference'
import { signLocalWorkforceToken } from '#services/workforce_auth_service'
import { test } from '@japa/runner'

const expiresAt = Math.floor(Date.now() / 1000) + 300

test.group('sites and organizations', () => {
  test('models distributor, facility, and program-node organizations', async ({ assert }) => {
    assert.sameMembers(
      demoOrganizations.map((organization) => organization.type),
      [...organizationTypes]
    )
  })

  test('sites belong to known organizations', async ({ assert }) => {
    const organizationKeys = new Set(
      demoOrganizations.map((organization) => organization.organizationKey)
    )

    assert.isTrue(demoSites.every((site) => organizationKeys.has(site.organizationId)))
  })

  test('site lookup is scoped to organization and permitted sites', async ({ client, assert }) => {
    const response = await client
      .get('/api/v1/sites')
      .bearerToken(tokenFor({ organizationId: 'org_alpha', siteIds: ['site_main'] }))

    response.assertStatus(200)
    assert.deepEqual(
      response.body().data.map((site: { siteKey: string; organizationId: string }) => ({
        siteKey: site.siteKey,
        organizationId: site.organizationId,
      })),
      [{ siteKey: 'site_main', organizationId: 'org_alpha' }]
    )
  })

  test('active site helper does not leak same-key sites across organizations', async ({ assert }) => {
    assert.deepEqual(
      activeSitesForTenant(demoSites, {
        organizationId: 'org_beta',
        permittedSiteIds: ['site_main'],
      }).map((site) => site.name),
      ['Beta Main Hospital Pharmacy']
    )
  })
})

function tokenFor({
  organizationId,
  siteIds,
}: {
  organizationId: string
  siteIds: string[]
}) {
  return signLocalWorkforceToken({
    iss: 'https://auth.local.pharmasync.test',
    sub: `usr_${organizationId}_operations`,
    aud: 'pharmasync-api',
    exp: expiresAt,
    org_id: organizationId,
    site_ids: siteIds,
    roles: ['operations'],
  })
}
