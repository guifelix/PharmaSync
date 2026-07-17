import Organization from '#models/organization'
import Site from '#models/site'
import { demoSites } from '#services/organization_site_reference'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const organizations = await Organization.query().select(['id', 'organizationKey'])
    const organizationIdsByKey = new Map(
      organizations.map((organization) => [organization.organizationKey, organization.id])
    )

    await Site.updateOrCreateMany(
      ['organizationKey', 'siteKey'],
      demoSites.map((site) => ({
        ...site,
        organizationId: organizationIdsByKey.get(site.organizationId)!,
        organizationKey: site.organizationId,
      }))
    )
  }
}
