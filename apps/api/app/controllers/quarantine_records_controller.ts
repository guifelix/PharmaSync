import { scopeTenantRecords, tenantScopeFromAuth, tenantScopeMeta } from '#services/tenant_scope'
import { loadQuarantineRecords } from '#services/quarantine_record_reference'
import type { HttpContext } from '@adonisjs/core/http'

const pilotQuarantineRecords = [
  {
    id: 'qrn_alpha_main',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    partnerId: 'partner_alpha',
    feedId: 'feed_alpha_001',
    traceId: 'trace-quarantine-alpha-main',
    payloadHash: 'seed-hash-alpha-main',
    reasonCode: 'MISSING_REQUIRED_FIELD',
    reasonCategory: 'schema',
    reasonMessage: 'lot_number is required',
    fieldPath: 'movements[0].lot_number',
    sourceEventId: 'event-alpha-main-001',
    rawPayloadUri: 'seed://quarantine/alpha-main',
    status: 'quarantined',
    createdAt: '2026-07-17T00:00:00.000Z',
  },
  {
    id: 'qrn_alpha_overflow',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    partnerId: 'partner_alpha',
    feedId: 'feed_alpha_002',
    traceId: 'trace-quarantine-alpha-overflow',
    payloadHash: 'seed-hash-alpha-overflow',
    reasonCode: 'DUPLICATE_EVENT',
    reasonCategory: 'duplicate',
    reasonMessage: 'Duplicate source_event_id within the submitted batch',
    fieldPath: 'movements[1].source_event_id',
    sourceEventId: 'event-alpha-overflow-002',
    rawPayloadUri: 'seed://quarantine/alpha-overflow',
    status: 'quarantined',
    createdAt: '2026-07-17T00:00:01.000Z',
  },
  {
    id: 'qrn_beta_main',
    organizationId: 'org_beta',
    siteId: 'site_main',
    partnerId: 'partner_beta',
    feedId: 'feed_beta_001',
    traceId: 'trace-quarantine-beta-main',
    payloadHash: 'seed-hash-beta-main',
    reasonCode: 'INVALID_QUANTITY',
    reasonCategory: 'business-rule',
    reasonMessage: 'quantity_delta must be an integer',
    fieldPath: 'movements[0].quantity_delta',
    sourceEventId: 'event-beta-main-001',
    rawPayloadUri: 'seed://quarantine/beta-main',
    status: 'quarantined',
    createdAt: '2026-07-17T00:00:02.000Z',
  },
]

export default class QuarantineRecordsController {
  async index({ workforceAuth }: HttpContext) {
    const storedQuarantineRecords = await loadQuarantineRecords()
    return {
      data: scopeTenantRecords(
        [...pilotQuarantineRecords, ...storedQuarantineRecords],
        tenantScopeFromAuth(workforceAuth)
      ),
      meta: tenantScopeMeta(workforceAuth),
    }
  }
}
