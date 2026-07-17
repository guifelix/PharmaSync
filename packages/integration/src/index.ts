import type { InventoryMovement } from '@pharmasync/domain'

export type PartnerFeedFormat = 'csv' | 'json'

export type PartnerFeedEnvelope = {
  partnerId: string
  format: PartnerFeedFormat
  receivedAt: string
  payloadHash: string
  rawPayloadUri?: string
}

export type CanonicalInventoryEvent = {
  traceId: string
  partnerId: string
  idempotencyKey: string
  movement: InventoryMovement
}

export type QuarantineReason = {
  code: string
  message: string
  field?: string
}

export type QuarantineRecord = {
  traceId: string
  partnerId: string
  payloadHash: string
  reasons: QuarantineReason[]
  rawPayloadUri?: string
  createdAt: string
}
