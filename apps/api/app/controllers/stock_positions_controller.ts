import { scopeTenantRecords, tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import type { HttpContext } from '@adonisjs/core/http'

const pilotStockPositions = [
  {
    id: 'stock_alpha_main',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    medicationName: 'Amoxicillin 500mg',
    quantityOnHand: 120,
  },
  {
    id: 'stock_alpha_overflow',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    medicationName: 'Atorvastatin 20mg',
    quantityOnHand: 80,
  },
  {
    id: 'stock_beta_main',
    organizationId: 'org_beta',
    siteId: 'site_main',
    medicationName: 'Metformin 500mg',
    quantityOnHand: 60,
  },
]

export default class StockPositionsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: scopeTenantRecords(pilotStockPositions, tenantScopeFromAuth(workforceAuth)),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
