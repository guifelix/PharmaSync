import {
  recordCorrection,
  recordDispense,
  recordReceipt,
  recordTransfer,
} from '#services/inventory_movement_reference'
import type { StockPositionReference } from '#services/stock_position_reference'
import { test } from '@japa/runner'

const observedAt = '2026-07-17T12:00:00.000Z'

test.group('Inventory movement reference', () => {
  test('records receipt movements and outbox events', async ({ assert }) => {
    const result = recordReceipt(
      position({
        quantityOnHand: 100,
        quantityReserved: 20,
      }),
      {
        type: 'receipt',
        orgId: 'org_alpha',
        siteId: 'site_main',
        productId: 'med_amoxicillin_500',
        lotId: 'AMX-2026-08-A',
        quantity: 25,
        occurredAt: observedAt,
        sourceTraceId: 'trace-receipt-001',
      }
    )

    assert.equal(result.updatedStockPosition.quantityOnHand, 125)
    assert.equal(result.movement.type, 'receipt')
    assert.equal(result.movement.quantityDelta, 25)
    assert.equal(result.outboxEvent.eventType, 'inventory.movement.recorded')
    assert.equal(result.outboxEvent.aggregateType, 'stock-position')
    assert.deepEqual(result.outboxEvent.payload.movements, [result.movement])
    assert.deepEqual(result.outboxEvent.payload.updatedStockPositions, [result.updatedStockPosition])
  })

  test('records dispense movements without allowing negative availability', async ({ assert }) => {
    const result = recordDispense(
      position({
        quantityOnHand: 100,
        quantityReserved: 20,
      }),
      {
        type: 'dispense',
        orgId: 'org_alpha',
        siteId: 'site_main',
        productId: 'med_amoxicillin_500',
        lotId: 'AMX-2026-08-A',
        quantity: 15,
        occurredAt: observedAt,
        sourceTraceId: 'trace-dispense-001',
      }
    )

    assert.equal(result.updatedStockPosition.quantityOnHand, 85)
    assert.equal(result.movement.type, 'dispense')
    assert.equal(result.movement.quantityDelta, -15)
    assert.throws(() =>
      recordDispense(position({ quantityOnHand: 10, quantityReserved: 4 }), {
        type: 'dispense',
        orgId: 'org_alpha',
        siteId: 'site_main',
        productId: 'med_amoxicillin_500',
        lotId: 'AMX-2026-08-A',
        quantity: 7,
        occurredAt: observedAt,
        sourceTraceId: 'trace-dispense-002',
      })
    )
  })

  test('records corrections with actor, reason, before quantity, and after quantity', async ({
    assert,
  }) => {
    const result = recordCorrection(
      position({
        quantityOnHand: 100,
        quantityReserved: 20,
      }),
      {
        type: 'correction',
        orgId: 'org_alpha',
        siteId: 'site_main',
        productId: 'med_amoxicillin_500',
        lotId: 'AMX-2026-08-A',
        actorId: 'usr_ops_01',
        reason: 'cycle count adjustment',
        beforeQuantityOnHand: 100,
        afterQuantityOnHand: 92,
        occurredAt: observedAt,
        sourceTraceId: 'trace-correction-001',
      }
    )

    assert.equal(result.updatedStockPosition.quantityOnHand, 92)
    assert.equal(result.movement.type, 'correction')
    assert.equal(result.movement.actorId, 'usr_ops_01')
    assert.equal(result.movement.reason, 'cycle count adjustment')
    assert.equal(result.movement.beforeQuantityOnHand, 100)
    assert.equal(result.movement.afterQuantityOnHand, 92)
    assert.throws(() =>
      recordCorrection(position({ quantityOnHand: 100, quantityReserved: 20 }), {
        type: 'correction',
        orgId: 'org_alpha',
        siteId: 'site_main',
        productId: 'med_amoxicillin_500',
        lotId: 'AMX-2026-08-A',
        actorId: 'usr_ops_01',
        reason: 'cycle count adjustment',
        beforeQuantityOnHand: 99,
        afterQuantityOnHand: 92,
        occurredAt: observedAt,
        sourceTraceId: 'trace-correction-002',
      })
    )
  })

  test('records paired transfer movements transactionally', async ({ assert }) => {
    const result = recordTransfer(
      position({
        quantityOnHand: 120,
        quantityReserved: 20,
        siteId: 'site_main',
        transferCorrelationId: 'transfer-alpha-001',
      }),
      position({
        id: 'stock_alpha_overflow_amoxicillin',
        siteId: 'site_overflow',
        medicationProductId: 'med_amoxicillin_500',
        lotNumber: 'AMX-2026-08-A',
        quantityOnHand: 10,
        quantityReserved: 0,
        transferCorrelationId: 'transfer-alpha-001',
      }),
      {
        type: 'transfer',
        orgId: 'org_alpha',
        siteId: 'site_main',
        productId: 'med_amoxicillin_500',
        lotId: 'AMX-2026-08-A',
        destinationSiteId: 'site_overflow',
        transferCorrelationId: 'transfer-alpha-001',
        actorId: 'usr_ops_01',
        quantity: 30,
        occurredAt: observedAt,
        sourceTraceId: 'trace-transfer-001',
      }
    )

    assert.equal(result.updatedSourceStockPosition.quantityOnHand, 90)
    assert.equal(result.updatedDestinationStockPosition.quantityOnHand, 40)
    assert.equal(result.movements[0].transferDirection, 'source')
    assert.equal(result.movements[1].transferDirection, 'destination')
    assert.equal(result.outboxEvent.aggregateType, 'stock-transfer')
    assert.equal(result.outboxEvent.aggregateId, 'transfer-alpha-001')
    assert.deepEqual(result.outboxEvent.payload.movements, result.movements)
    assert.deepEqual(result.outboxEvent.payload.updatedStockPositions, [
      result.updatedSourceStockPosition,
      result.updatedDestinationStockPosition,
    ])
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
    quantityOnHand: 100,
    quantityReserved: 20,
    lowStockThreshold: 15,
    transferCorrelationId: 'transfer-alpha-001',
    updatedAt: observedAt,
    ...overrides,
  }
}
