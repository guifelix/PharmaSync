import { scopeTenantRecords, tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import type { HttpContext } from '@adonisjs/core/http'

const pilotAuditEvents = [
  {
    id: 'audit_alpha_org',
    organizationId: 'org_alpha',
    siteId: null,
    action: 'evidence_package_requested',
    traceId: 'trace-audit-alpha-org',
  },
  {
    id: 'audit_alpha_main',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    action: 'inventory_stock_viewed',
    traceId: 'trace-audit-alpha-main',
  },
  {
    id: 'audit_alpha_overflow',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    action: 'quarantine_record_viewed',
    traceId: 'trace-audit-alpha-overflow',
  },
  {
    id: 'audit_beta_main',
    organizationId: 'org_beta',
    siteId: 'site_main',
    action: 'configuration_changed',
    traceId: 'trace-audit-beta-main',
  },
]

export default class AuditEventsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: scopeTenantRecords(pilotAuditEvents, tenantScopeFromAuth(workforceAuth)),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
