import { expirationStatus } from '#services/medication_lot_reference'
import { scopeTenantRecords, type TenantScope } from '#services/tenant_scope'

export const stockPositionFreshnessThresholdMinutes = 30

export type StockPositionReference = {
  id: string
  organizationId: string
  siteId: string
  siteName: string
  medicationProductId: string
  medicationProductName: string
  medicationProductNdc: string
  lotNumber: string
  expirationDate: string
  quantityOnHand: number
  quantityReserved: number
  lowStockThreshold: number
  transferCorrelationId: string | null
  traceId: string
  updatedAt: string
}

export type StockPositionFreshness = {
  isStale: boolean
  ageMinutes: number
  freshnessThresholdMinutes: number
  updatedAt: string
  observedAt: string
}

export type StockPositionView = StockPositionReference & {
  availableQuantity: number
  expirationStatus: ReturnType<typeof expirationStatus>
  isLowStock: boolean
  freshness: StockPositionFreshness | null
}

export type InventoryTransferMovement = {
  id: string
  organizationId: string
  sourceSiteId: string
  destinationSiteId: string
  transferCorrelationId: string
  movementType: 'transfer-decrement' | 'transfer-increment'
  quantityDelta: number
  occurredAt: string
}

export type StockPositionFilters = {
  siteId?: string | null
  medicationProductId?: string | null
  expirationWindowDays?: number | null
  lowStockOnly?: boolean | null
  staleOnly?: boolean | null
}

type StockPositionSeed = Omit<StockPositionReference, 'updatedAt'> & { updatedAt: Date }

const demoStockPositionsSeed: StockPositionSeed[] = [
  {
    id: 'stock_alpha_main_amoxicillin',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    siteName: 'Alpha Main Warehouse',
    medicationProductId: 'med_amoxicillin_500',
    medicationProductName: 'Amoxicillin 500mg',
    medicationProductNdc: '0378615501',
    lotNumber: 'AMX-2026-08-A',
    expirationDate: '2026-08-15',
    quantityOnHand: 120,
    quantityReserved: 20,
    lowStockThreshold: 30,
    transferCorrelationId: 'transfer-alpha-001',
    traceId: 'trace-stock-alpha-main-amoxicillin',
    updatedAt: hoursAgo(2),
  },
  {
    id: 'stock_alpha_overflow_atorvastatin',
    organizationId: 'org_alpha',
    siteId: 'site_overflow',
    siteName: 'Alpha Overflow Pharmacy',
    medicationProductId: 'med_atorvastatin_20',
    medicationProductName: 'Atorvastatin Calcium 20mg',
    medicationProductNdc: '6050526713',
    lotNumber: 'ATO-2027-01-B',
    expirationDate: '2027-01-31',
    quantityOnHand: 18,
    quantityReserved: 4,
    lowStockThreshold: 20,
    transferCorrelationId: null,
    traceId: 'trace-stock-alpha-overflow-atorvastatin',
    updatedAt: minutesAgo(10),
  },
  {
    id: 'stock_beta_main_metformin',
    organizationId: 'org_beta',
    siteId: 'site_main',
    siteName: 'Beta Main Hospital Pharmacy',
    medicationProductId: 'med_metformin_500',
    medicationProductName: 'Metformin 500mg',
    medicationProductNdc: '0002821501',
    lotNumber: 'MET-2025-12-C',
    expirationDate: '2025-12-31',
    quantityOnHand: 60,
    quantityReserved: 0,
    lowStockThreshold: 15,
    transferCorrelationId: 'transfer-beta-002',
    traceId: 'trace-stock-beta-main-metformin',
    updatedAt: minutesAgo(5),
  },
] satisfies readonly StockPositionSeed[]

export const demoStockPositions: StockPositionReference[] = demoStockPositionsSeed.map((position) => ({
  ...position,
  updatedAt: position.updatedAt.toISOString(),
}))

export function availableQuantity(stockPosition: Pick<StockPositionReference, 'quantityOnHand' | 'quantityReserved'>) {
  ensureValidStockPosition(stockPosition)
  return stockPosition.quantityOnHand - stockPosition.quantityReserved
}

export function ensureValidStockPosition(
  stockPosition: Pick<StockPositionReference, 'quantityOnHand' | 'quantityReserved'>
) {
  if (stockPosition.quantityOnHand < 0) {
    throw new Error('quantityOnHand must not be negative')
  }

  if (stockPosition.quantityReserved < 0) {
    throw new Error('quantityReserved must not be negative')
  }

  if (stockPosition.quantityReserved > stockPosition.quantityOnHand) {
    throw new Error('quantityReserved cannot exceed quantityOnHand')
  }
}

export function isLowStock(stockPosition: StockPositionReference) {
  return availableQuantity(stockPosition) <= stockPosition.lowStockThreshold
}

export function freshnessMetadata(
  stockPosition: StockPositionReference,
  observedAt = new Date(),
  freshnessThresholdMinutes = stockPositionFreshnessThresholdMinutes
): StockPositionFreshness | null {
  const updatedAt = new Date(stockPosition.updatedAt)
  const ageMinutes = Math.floor((observedAt.getTime() - updatedAt.getTime()) / 60000)

  if (ageMinutes <= freshnessThresholdMinutes) {
    return null
  }

  return {
    isStale: true,
    ageMinutes,
    freshnessThresholdMinutes,
    updatedAt: updatedAt.toISOString(),
    observedAt: observedAt.toISOString(),
  }
}

export function toStockPositionView(
  stockPosition: StockPositionReference,
  observedAt = new Date(),
  freshnessThresholdMinutes = stockPositionFreshnessThresholdMinutes
): StockPositionView {
  ensureValidStockPosition(stockPosition)

  return {
    ...stockPosition,
    availableQuantity: availableQuantity(stockPosition),
    expirationStatus: expirationStatus(stockPosition.expirationDate, observedAt),
    isLowStock: isLowStock(stockPosition),
    freshness: freshnessMetadata(stockPosition, observedAt, freshnessThresholdMinutes),
  }
}

export function pairedTransferMovements(
  stockPosition: StockPositionReference,
  destinationSiteId: string,
  quantity = availableQuantity(stockPosition),
  occurredAt = new Date()
): [InventoryTransferMovement, InventoryTransferMovement] {
  ensureValidStockPosition(stockPosition)

  if (quantity < 0) {
    throw new Error('transfer quantity must not be negative')
  }

  if (quantity > availableQuantity(stockPosition)) {
    throw new Error('transfer quantity cannot exceed available quantity')
  }

  if (!stockPosition.transferCorrelationId) {
    throw new Error('transferCorrelationId is required to represent a paired transfer')
  }

  const transferCorrelationId = stockPosition.transferCorrelationId
  const occurredAtIso = occurredAt.toISOString()
  const decrementId = `${stockPosition.id}:transfer-decrement`
  const incrementId = `${stockPosition.id}:transfer-increment`

  return [
    {
      id: decrementId,
      organizationId: stockPosition.organizationId,
      sourceSiteId: stockPosition.siteId,
      destinationSiteId,
      transferCorrelationId,
      movementType: 'transfer-decrement',
      quantityDelta: -quantity,
      occurredAt: occurredAtIso,
    },
    {
      id: incrementId,
      organizationId: stockPosition.organizationId,
      sourceSiteId: stockPosition.siteId,
      destinationSiteId,
      transferCorrelationId,
      movementType: 'transfer-increment',
      quantityDelta: quantity,
      occurredAt: occurredAtIso,
    },
  ]
}

export function filterStockPositions(
  records: readonly StockPositionReference[],
  scope: TenantScope,
  filters: StockPositionFilters = {},
  observedAt = new Date(),
  freshnessThresholdMinutes = stockPositionFreshnessThresholdMinutes
) {
  return scopeTenantRecords(records, scope).filter((record) => {
    if (filters.siteId && record.siteId !== filters.siteId) {
      return false
    }

    if (filters.medicationProductId && record.medicationProductId !== filters.medicationProductId) {
      return false
    }

    if (typeof filters.expirationWindowDays === 'number') {
      const expirationWindowEnd = addDays(observedAt, filters.expirationWindowDays)
      if (dateOnly(record.expirationDate).getTime() > expirationWindowEnd.getTime()) {
        return false
      }
    }

    if (filters.lowStockOnly && !isLowStock(record)) {
      return false
    }

    if (filters.staleOnly && !freshnessMetadata(record, observedAt, freshnessThresholdMinutes)) {
      return false
    }

    return true
  })
}

export function parseStockPositionQuery(input: {
  siteId?: unknown
  medicationProductId?: unknown
  expirationWindowDays?: unknown
  lowStock?: unknown
  staleOnly?: unknown
}) {
  return {
    siteId: parseOptionalString(input.siteId),
    medicationProductId: parseOptionalString(input.medicationProductId),
    expirationWindowDays: parseOptionalInteger(input.expirationWindowDays),
    lowStockOnly: parseOptionalBoolean(input.lowStock),
    staleOnly: parseOptionalBoolean(input.staleOnly),
  }
}

export function stockPositionMeta(input: {
  organizationId: string
  permittedSiteIds: string[]
  traceId: string
  filters: ReturnType<typeof parseStockPositionQuery>
}) {
  return {
    organizationId: input.organizationId,
    permittedSiteIds: input.permittedSiteIds,
    traceId: input.traceId,
    filters: input.filters,
    freshnessThresholdMinutes: stockPositionFreshnessThresholdMinutes,
  }
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function dateOnly(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`)
}

function parseOptionalString(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseOptionalInteger(value: unknown) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null
}

function parseOptionalBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false
  }

  return null
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000)
}
