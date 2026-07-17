import { expirationStatus } from '#services/medication_lot_reference'
import { scopeTenantRecords, tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import type { HttpContext } from '@adonisjs/core/http'

const pilotStockPositions = [
  {
    id: 'stock_alpha_main',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    medicationName: 'Amoxicillin 500mg',
    lotNumber: 'AMX-2026-08-A',
    expirationDate: '2026-08-15',
    quantityOnHand: 120,
  },
  {
    id: 'stock_alpha_overflow',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    medicationName: 'Atorvastatin 20mg',
    lotNumber: 'ATO-2027-01-B',
    expirationDate: '2027-01-31',
    quantityOnHand: 80,
  },
  {
    id: 'stock_beta_main',
    organizationId: 'org_beta',
    siteId: 'site_main',
    medicationName: 'Metformin 500mg',
    lotNumber: 'MET-2025-12-C',
    expirationDate: '2025-12-31',
    quantityOnHand: 60,
  },
]

export default class StockPositionsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: scopeTenantRecords(pilotStockPositions, tenantScopeFromAuth(workforceAuth)).map(
        (stockPosition) => ({
          ...stockPosition,
          expirationStatus: expirationStatus(stockPosition.expirationDate),
        })
      ),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
