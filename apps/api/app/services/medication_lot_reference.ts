export type ExpirationStatus = 'expired' | 'near-expiry' | 'ok'

export type MedicationLotReference = {
  medicationProductNdc: string
  lotNumber: string
  expirationDate: string
  source: string
}

export const nearExpiryWindowDays = 90

export const demoMedicationLots: MedicationLotReference[] = [
  {
    medicationProductNdc: '0378615501',
    lotNumber: 'AMX-2026-08-A',
    expirationDate: '2026-08-15',
    source: 'demo-public-reference',
  },
  {
    medicationProductNdc: '6050526713',
    lotNumber: 'ATO-2027-01-B',
    expirationDate: '2027-01-31',
    source: 'demo-public-reference',
  },
  {
    medicationProductNdc: '0002821501',
    lotNumber: 'HUM-2025-12-C',
    expirationDate: '2025-12-31',
    source: 'demo-public-reference',
  },
]

export function expirationStatus(
  expirationDate: string,
  observedAt = new Date(),
  nearExpiryDays = nearExpiryWindowDays
): ExpirationStatus {
  const expiration = dateOnly(expirationDate)
  const observed = dateOnly(observedAt.toISOString())

  if (expiration.getTime() < observed.getTime()) {
    return 'expired'
  }

  const nearExpiryThreshold = new Date(observed)
  nearExpiryThreshold.setUTCDate(nearExpiryThreshold.getUTCDate() + nearExpiryDays)

  return expiration.getTime() <= nearExpiryThreshold.getTime() ? 'near-expiry' : 'ok'
}

export function requireLotTracking(input: {
  lotNumber?: string | null
  expirationDate?: string | null
}) {
  return Boolean(input.lotNumber?.trim() && input.expirationDate?.trim())
}

function dateOnly(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}
