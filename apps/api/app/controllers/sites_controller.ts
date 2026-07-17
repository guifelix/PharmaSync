import { activeSitesForTenant, demoSites } from '#services/organization_site_reference'
import { tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import type { HttpContext } from '@adonisjs/core/http'

export default class SitesController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: activeSitesForTenant(demoSites, tenantScopeFromAuth(workforceAuth)),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
