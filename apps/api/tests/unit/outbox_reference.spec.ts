import {
  acknowledgeOutboxRecord,
  claimOutboxBatch,
  createInventoryOutboxMessage,
  failOutboxRecord,
  processOutboxBatch,
  retryDelayMs,
} from '#services/outbox_reference'
import type { InventoryOutboxEvent, OutboxMessage } from '@pharmasync/domain'
import { test } from '@japa/runner'

const observedAt = new Date('2026-07-17T12:00:00.000Z')

test.group('Outbox reference', () => {
  test('creates versioned inventory outbox messages from inventory events', async ({ assert }) => {
    const message = createInventoryOutboxMessage(event(), observedAt)

    assert.deepEqual(message, {
      id: 'trace-001:receipt:outbox',
      eventType: 'inventory.movement.recorded',
      aggregateType: 'stock-position',
      aggregateId: 'stock_alpha_main_amoxicillin',
      traceId: 'trace-001',
      payloadVersion: 1,
      payload: event().payload,
      status: 'pending',
      attemptCount: 0,
      availableAt: '2026-07-17T12:00:00.000Z',
      lockedAt: null,
      lockedBy: null,
      processedAt: null,
      lastError: null,
      createdAt: '2026-07-17T12:00:00.000Z',
      updatedAt: '2026-07-17T12:00:00.000Z',
    })
  })

  test('claims the oldest due pending records and marks them as processing', async ({ assert }) => {
    const result = claimOutboxBatch(
      [
        record({ id: 'later', availableAt: '2026-07-17T12:10:00.000Z', createdAt: '2026-07-17T12:00:00.000Z' }),
        record({ id: 'due-b', availableAt: '2026-07-17T11:55:00.000Z', createdAt: '2026-07-17T11:50:00.000Z' }),
        record({ id: 'locked', lockedAt: '2026-07-17T11:59:00.000Z' }),
        record({ id: 'due-a', availableAt: '2026-07-17T11:55:00.000Z', createdAt: '2026-07-17T11:40:00.000Z' }),
      ],
      'worker-1',
      observedAt,
      2
    )

    assert.deepEqual(
      result.claimed.map((item) => ({ id: item.id, status: item.status, lockedBy: item.lockedBy })),
      [
        { id: 'due-a', status: 'processing', lockedBy: 'worker-1' },
        { id: 'due-b', status: 'processing', lockedBy: 'worker-1' },
      ]
    )
    assert.deepEqual(
      result.records.find((item) => item.id === 'later'),
      record({ id: 'later', availableAt: '2026-07-17T12:10:00.000Z', createdAt: '2026-07-17T12:00:00.000Z' })
    )
  })

  test('awaits async handlers and keeps unrelated records moving when one fails', async ({ assert }) => {
    const result = await processOutboxBatch(
      [
        record({ id: 'poison' }),
        record({ id: 'healthy' }),
        record({ id: 'future', availableAt: '2026-07-17T13:00:00.000Z' }),
      ],
      async (message) => {
        if (message.id === 'poison') {
          throw new Error('boom')
        }

        await Promise.resolve()
      },
      observedAt,
      'worker-1',
      2,
      3
    )

    assert.deepEqual(result.processedIds, ['healthy'])
    assert.deepEqual(result.failedIds, ['poison'])
    assert.equal(result.records.find((item) => item.id === 'healthy')?.status, 'processed')
    assert.equal(result.records.find((item) => item.id === 'poison')?.status, 'pending')
    assert.equal(result.records.find((item) => item.id === 'poison')?.attemptCount, 1)
    assert.equal(result.records.find((item) => item.id === 'future')?.status, 'pending')
  })

  test('moves exhausted records to failed with bounded retry metadata', async ({ assert }) => {
    const failed = failOutboxRecord(
      record({ attemptCount: 2 }),
      new Error('processor exploded'),
      observedAt,
      3
    )

    assert.equal(failed.status, 'failed')
    assert.equal(failed.attemptCount, 3)
    assert.equal(failed.lastError, 'processor exploded')
    assert.equal(failed.availableAt, '2026-07-17T12:00:00.000Z')
    assert.equal(retryDelayMs(1), 1000)
    assert.equal(retryDelayMs(2), 2000)
  })

  test('acknowledges records as processed without leaving locks behind', async ({ assert }) => {
    const acknowledged = acknowledgeOutboxRecord(
      record({ status: 'processing', lockedAt: '2026-07-17T11:59:00.000Z', lockedBy: 'worker-1' }),
      observedAt
    )

    assert.equal(acknowledged.status, 'processed')
    assert.equal(acknowledged.lockedAt, null)
    assert.equal(acknowledged.lockedBy, null)
    assert.equal(acknowledged.processedAt, '2026-07-17T12:00:00.000Z')
  })
})

function event(): InventoryOutboxEvent {
  return {
    id: 'trace-001:receipt:outbox',
    eventType: 'inventory.movement.recorded',
    aggregateType: 'stock-position',
    aggregateId: 'stock_alpha_main_amoxicillin',
    orgId: 'org_alpha',
    siteId: 'site_main',
    sourceTraceId: 'trace-001',
    occurredAt: '2026-07-17T12:00:00.000Z',
    payload: {
      movements: [
        {
          id: 'trace-001:receipt',
          type: 'receipt',
          orgId: 'org_alpha',
          siteId: 'site_main',
          productId: 'med_amoxicillin_500',
          lotId: 'AMX-2026-08-A',
          quantityDelta: 5,
          occurredAt: '2026-07-17T12:00:00.000Z',
          sourceTraceId: 'trace-001',
        },
      ],
      updatedStockPositions: [
        {
          id: 'stock_alpha_main_amoxicillin',
          organizationId: 'org_alpha',
          siteId: 'site_main',
          medicationProductId: 'med_amoxicillin_500',
          lotNumber: 'AMX-2026-08-A',
          quantityOnHand: 55,
          quantityReserved: 10,
          lowStockThreshold: 15,
          transferCorrelationId: null,
          updatedAt: '2026-07-17T12:00:00.000Z',
        },
      ],
    },
  }
}

function record(overrides: Partial<OutboxMessage> = {}): OutboxMessage {
  return {
    id: 'record-001',
    eventType: 'inventory.movement.recorded',
    aggregateType: 'stock-position',
    aggregateId: 'stock_alpha_main_amoxicillin',
    traceId: 'trace-001',
    payloadVersion: 1,
    payload: { kind: 'inventory' },
    status: 'pending',
    attemptCount: 0,
    availableAt: '2026-07-17T12:00:00.000Z',
    lockedAt: null,
    lockedBy: null,
    processedAt: null,
    lastError: null,
    createdAt: '2026-07-17T11:30:00.000Z',
    updatedAt: '2026-07-17T11:30:00.000Z',
    ...overrides,
  }
}
