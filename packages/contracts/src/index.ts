export type { MedicationProduct, RiskSignal, StockPosition } from '@pharmasync/domain'
export type { PartnerFeedEnvelope, QuarantineRecord } from '@pharmasync/integration'

export type ApiPage<T> = {
  data: T[]
  nextCursor: string | null
}
