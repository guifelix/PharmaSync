import Organization from '#models/organization'
import { demoOrganizations } from '#services/organization_site_reference'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Organization.updateOrCreateMany('organizationKey', demoOrganizations)
  }
}
