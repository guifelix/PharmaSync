import { scopeTenantRecords, tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import type { HttpContext } from '@adonisjs/core/http'

const pilotQuarantineRecords = [
  {
    id: 'qrn_alpha_main',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    reason: 'missing_lot_number',
  },
  {
    id: 'qrn_alpha_overflow',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    reason: 'duplicate_source_event',
  },
  {
    id: 'qrn_beta_main',
    organizationId: 'org_beta',
    siteId: 'site_main',
    reason: 'invalid_quantity',
  },
]

export default class QuarantineRecordsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: scopeTenantRecords(pilotQuarantineRecords, tenantScopeFromAuth(workforceAuth)),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
