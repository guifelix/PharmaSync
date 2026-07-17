export type OrgId = string
export type SiteId = string
export type MedicationProductId = string
export type LotId = string

export type MedicationProduct = {
  id: MedicationProductId
  ndc: string
  proprietaryName: string
  nonProprietaryName: string
  dosageForm?: string
  route?: string
  labelerName?: string
}

export type InventoryLot = {
  id: LotId
  productId: MedicationProductId
  lotNumber: string
  expirationDate: string
}

export type StockPosition = {
  orgId: OrgId
  siteId: SiteId
  productId: MedicationProductId
  lotId: LotId
  quantityOnHand: number
  quantityReserved: number
  updatedAt: string
}

export type InventoryMovementType = 'receipt' | 'dispense' | 'transfer' | 'correction'

export type InventoryMovement = {
  id: string
  type: InventoryMovementType
  orgId: OrgId
  siteId: SiteId
  productId: MedicationProductId
  lotId: LotId
  quantityDelta: number
  occurredAt: string
  sourceTraceId: string
}

export type InventoryMovementBaseCommand = {
  orgId: OrgId
  siteId: SiteId
  productId: MedicationProductId
  lotId: LotId
  occurredAt: string
  sourceTraceId: string
  actorId?: string
  reason?: string
}

export type ReceiptInventoryMovementCommand = InventoryMovementBaseCommand & {
  type: 'receipt'
  quantity: number
}

export type DispenseInventoryMovementCommand = InventoryMovementBaseCommand & {
  type: 'dispense'
  quantity: number
}

export type TransferInventoryMovementCommand = InventoryMovementBaseCommand & {
  type: 'transfer'
  quantity: number
  destinationSiteId: SiteId
  transferCorrelationId: string
  actorId: string
}

export type CorrectionInventoryMovementCommand = InventoryMovementBaseCommand & {
  type: 'correction'
  actorId: string
  reason: string
  beforeQuantityOnHand: number
  afterQuantityOnHand: number
}

export type InventoryMovementCommand =
  | ReceiptInventoryMovementCommand
  | DispenseInventoryMovementCommand
  | TransferInventoryMovementCommand
  | CorrectionInventoryMovementCommand

export type RecordedInventoryMovement = InventoryMovement & {
  actorId?: string
  reason?: string
  destinationSiteId?: SiteId
  transferCorrelationId?: string
  transferDirection?: 'source' | 'destination'
  beforeQuantityOnHand?: number
  afterQuantityOnHand?: number
}

export type InventoryOutboxEvent = {
  id: string
  eventType: 'inventory.movement.recorded'
  aggregateType: 'stock-position' | 'stock-transfer'
  aggregateId: string
  orgId: OrgId
  siteId: SiteId
  sourceTraceId: string
  occurredAt: string
  payload: {
    movements: RecordedInventoryMovement[]
    updatedStockPositions: Array<Record<string, unknown>>
  }
}

export type OutboxStatus = 'pending' | 'processing' | 'processed' | 'failed'

export type OutboxMessage = {
  id: string
  eventType: string
  aggregateType: string
  aggregateId: string
  traceId: string
  payloadVersion: number
  payload: Record<string, unknown>
  status: OutboxStatus
  attemptCount: number
  availableAt: string
  lockedAt: string | null
  lockedBy: string | null
  processedAt: string | null
  lastError: string | null
  createdAt: string
  updatedAt: string | null
}

export type RiskSignalType = 'expiration' | 'shortage' | 'overstock'
export type RiskSignalSeverity = 'low' | 'medium' | 'high'

export type RiskSignal = {
  id: string
  type: RiskSignalType
  severity: RiskSignalSeverity
  siteId: SiteId
  productId: MedicationProductId
  lotId?: LotId
  reason: string
  createdAt: string
}
