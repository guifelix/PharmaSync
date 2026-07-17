import { scopeTenantRecords, tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import type { HttpContext } from '@adonisjs/core/http'

const pilotRiskSignals = [
  {
    id: 'signal_alpha_main',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    type: 'expiration',
    severity: 'medium',
  },
  {
    id: 'signal_alpha_overflow',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    type: 'overstock',
    severity: 'low',
  },
  {
    id: 'signal_beta_main',
    organizationId: 'org_beta',
    siteId: 'site_main',
    type: 'shortage',
    severity: 'high',
  },
]

export default class RiskSignalsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: scopeTenantRecords(pilotRiskSignals, tenantScopeFromAuth(workforceAuth)),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
