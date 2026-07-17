import {
  availableQuantity,
  ensureValidStockPosition,
  filterStockPositions,
  freshnessMetadata,
  demoStockPositions,
  type StockPositionReference,
  pairedTransferMovements,
  toStockPositionView,
} from '#services/stock_position_reference'
import { test } from '@japa/runner'

const observedAt = new Date('2026-07-17T12:00:00.000Z')

test.group('Stock position reference', () => {
  test('calculates available quantity and validates invariants', async ({ assert }) => {
    const stockPosition = position({
      quantityOnHand: 50,
      quantityReserved: 12,
    })

    assert.equal(availableQuantity(stockPosition), 38)
    assert.doesNotThrow(() => ensureValidStockPosition(stockPosition))
    assert.throws(() => ensureValidStockPosition(position({ quantityOnHand: -1 })))
    assert.throws(() =>
      ensureValidStockPosition(position({ quantityOnHand: 10, quantityReserved: 11 }))
    )
  })

  test('marks stale records after the freshness threshold', async ({ assert }) => {
    const fresh = position({
      updatedAt: '2026-07-17T11:45:00.000Z',
    })
    const stale = position({
      updatedAt: '2026-07-17T10:00:00.000Z',
    })

    assert.isNull(
      freshnessMetadata(fresh, observedAt, 90),
      'records inside the freshness window stay fresh'
    )

    assert.deepEqual(freshnessMetadata(stale, observedAt, 30), {
      isStale: true,
      ageMinutes: 120,
      freshnessThresholdMinutes: 30,
      updatedAt: '2026-07-17T10:00:00.000Z',
      observedAt: '2026-07-17T12:00:00.000Z',
    })
  })

  test('filters by tenant scope, site, product, expiry window, low stock, and stale state', async ({
    assert,
  }) => {
    const alphaScope = {
      organizationId: 'org_alpha',
      permittedSiteIds: ['site_main', 'site_overflow'],
    }

    assert.deepEqual(
      filterStockPositions(demoStockPositions, alphaScope, { siteId: 'site_main' }).map(
        (item) => item.id
      ),
      ['stock_alpha_main_amoxicillin']
    )

    assert.deepEqual(
      filterStockPositions(demoStockPositions, alphaScope, {
        medicationProductId: 'med_atorvastatin_20',
      }).map((item) => item.id),
      ['stock_alpha_overflow_atorvastatin']
    )

    assert.deepEqual(
      filterStockPositions(demoStockPositions, alphaScope, { expirationWindowDays: 120 }).map(
        (item) => item.id
      ),
      ['stock_alpha_main_amoxicillin']
    )

    assert.deepEqual(
      filterStockPositions(demoStockPositions, alphaScope, { lowStockOnly: true }).map(
        (item) => item.id
      ),
      ['stock_alpha_overflow_atorvastatin']
    )

    assert.deepEqual(
      filterStockPositions(demoStockPositions, alphaScope, { staleOnly: true }).map(
        (item) => item.id
      ),
      ['stock_alpha_main_amoxicillin']
    )
  })

  test('builds a response view with expiration, availability, and freshness metadata', async ({
    assert,
  }) => {
    const view = toStockPositionView(
      position({
        quantityOnHand: 12,
        quantityReserved: 2,
        lowStockThreshold: 15,
        updatedAt: '2026-07-17T10:00:00.000Z',
        expirationDate: '2026-08-15',
      }),
      observedAt,
      30
    )

    assert.equal(view.availableQuantity, 10)
    assert.equal(view.expirationStatus, 'near-expiry')
    assert.isTrue(view.isLowStock)
    assert.equal(view.traceId, 'trace-stock-alpha-main-amoxicillin')
    assert.deepEqual(view.freshness, {
      isStale: true,
      ageMinutes: 120,
      freshnessThresholdMinutes: 30,
      updatedAt: '2026-07-17T10:00:00.000Z',
      observedAt: '2026-07-17T12:00:00.000Z',
    })
  })

  test('creates paired transfer movements linked by a correlation id', async ({ assert }) => {
    const [decrement, increment] = pairedTransferMovements(
      position({
        transferCorrelationId: 'transfer-alpha-001',
        quantityOnHand: 40,
        quantityReserved: 10,
      }),
      'site_overflow',
      12,
      observedAt
    )

    assert.deepEqual(decrement, {
      id: 'stock_alpha_main_amoxicillin:transfer-decrement',
      organizationId: 'org_alpha',
      sourceSiteId: 'site_main',
      destinationSiteId: 'site_overflow',
      transferCorrelationId: 'transfer-alpha-001',
      movementType: 'transfer-decrement',
      quantityDelta: -12,
      occurredAt: '2026-07-17T12:00:00.000Z',
    })
    assert.deepEqual(increment, {
      id: 'stock_alpha_main_amoxicillin:transfer-increment',
      organizationId: 'org_alpha',
      sourceSiteId: 'site_main',
      destinationSiteId: 'site_overflow',
      transferCorrelationId: 'transfer-alpha-001',
      movementType: 'transfer-increment',
      quantityDelta: 12,
      occurredAt: '2026-07-17T12:00:00.000Z',
    })
  })
})

function position(overrides: Partial<StockPositionReference> = {}): StockPositionReference {
  return {
    id: 'stock_alpha_main_amoxicillin',
    organizationId: 'org_alpha',
    siteId: 'site_main',
    siteName: 'Alpha Main Warehouse',
    medicationProductId: 'med_amoxicillin_500',
    medicationProductName: 'Amoxicillin 500mg',
    medicationProductNdc: '0378615501',
    lotNumber: 'AMX-2026-08-A',
    expirationDate: '2026-08-15',
    quantityOnHand: 50,
    quantityReserved: 10,
    lowStockThreshold: 15,
    transferCorrelationId: null,
    traceId: 'trace-stock-alpha-main-amoxicillin',
    updatedAt: '2026-07-17T11:00:00.000Z',
    ...overrides,
  }
}
