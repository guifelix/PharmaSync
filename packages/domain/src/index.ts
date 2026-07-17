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
