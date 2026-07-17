import type { InventoryOutboxEvent, OutboxMessage, OutboxStatus } from '@pharmasync/domain'

export const outboxPayloadVersion = 1
export const outboxWorkerBatchSize = 25
export const outboxRetryBaseDelayMs = 1000
export const outboxRetryMaxDelayMs = 5 * 60 * 1000
export const outboxRetryLimit = 5

export type OutboxClaimResult = {
  claimed: OutboxMessage[]
  records: OutboxMessage[]
}

export type OutboxProcessResult = {
  records: OutboxMessage[]
  processedIds: string[]
  failedIds: string[]
}

export function createInventoryOutboxMessage(
  event: InventoryOutboxEvent,
  now = new Date(),
  payloadVersion = outboxPayloadVersion
): OutboxMessage {
  const timestamp = now.toISOString()

  return {
    id: event.id,
    eventType: event.eventType,
    aggregateType: event.aggregateType,
    aggregateId: event.aggregateId,
    traceId: event.sourceTraceId,
    payloadVersion,
    payload: event.payload,
    status: 'pending',
    attemptCount: 0,
    availableAt: timestamp,
    lockedAt: null,
    lockedBy: null,
    processedAt: null,
    lastError: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function claimOutboxBatch(
  records: readonly OutboxMessage[],
  workerId: string,
  now = new Date(),
  batchSize = outboxWorkerBatchSize
): OutboxClaimResult {
  const availableRecords = records
    .filter((record) => record.status === 'pending' && !record.lockedAt && dueAt(record) <= now)
    .sort((left, right) => {
      const leftDue = dueAt(left).getTime()
      const rightDue = dueAt(right).getTime()
      if (leftDue !== rightDue) {
        return leftDue - rightDue
      }

      const leftCreated = new Date(left.createdAt).getTime()
      const rightCreated = new Date(right.createdAt).getTime()
      if (leftCreated !== rightCreated) {
        return leftCreated - rightCreated
      }

      return left.id.localeCompare(right.id)
    })

  const claimed = availableRecords.slice(0, Math.max(1, batchSize)).map((record) => lockOutboxRecord(record, workerId, now))
  const recordsById = new Map(records.map((record) => [record.id, record]))

  for (const claimedRecord of claimed) {
    recordsById.set(claimedRecord.id, claimedRecord)
  }

  return {
    claimed,
    records: [...recordsById.values()],
  }
}

export async function processOutboxBatch(
  records: readonly OutboxMessage[],
  handler: (record: OutboxMessage) => Promise<void> | void,
  now = new Date(),
  workerId = 'outbox-worker',
  batchSize = outboxWorkerBatchSize,
  retryLimit = outboxRetryLimit
): Promise<OutboxProcessResult> {
  const claimResult = claimOutboxBatch(records, workerId, now, batchSize)
  const recordsById = new Map(claimResult.records.map((record) => [record.id, record]))
  const processedIds: string[] = []
  const failedIds: string[] = []

  for (const record of claimResult.claimed) {
    try {
      await handler(record)
      const acknowledged = acknowledgeOutboxRecord(record, now)
      recordsById.set(record.id, acknowledged)
      processedIds.push(record.id)
    } catch (error) {
      const failedRecord = failOutboxRecord(record, error, now, retryLimit)
      recordsById.set(record.id, failedRecord)
      failedIds.push(record.id)
    }
  }

  return {
    records: [...recordsById.values()],
    processedIds,
    failedIds,
  }
}

export function acknowledgeOutboxRecord(record: OutboxMessage, now = new Date()) {
  const timestamp = now.toISOString()

  return {
    ...record,
    status: 'processed' as OutboxStatus,
    lockedAt: null,
    lockedBy: null,
    processedAt: timestamp,
    lastError: null,
    updatedAt: timestamp,
  }
}

export function failOutboxRecord(
  record: OutboxMessage,
  error: unknown,
  now = new Date(),
  retryLimit = outboxRetryLimit
) {
  const attemptCount = record.attemptCount + 1
  const retryable = attemptCount < retryLimit
  const nextAvailableAt = retryable ? delayAt(now, retryDelayMs(attemptCount)) : now
  const timestamp = now.toISOString()

  return {
    ...record,
    status: (retryable ? 'pending' : 'failed') as OutboxStatus,
    attemptCount,
    availableAt: nextAvailableAt.toISOString(),
    lockedAt: null,
    lockedBy: null,
    processedAt: null,
    lastError: stringifyError(error),
    updatedAt: timestamp,
  }
}

export function retryDelayMs(attemptCount: number) {
  const multiplier = 2 ** Math.max(0, attemptCount - 1)
  return Math.min(outboxRetryBaseDelayMs * multiplier, outboxRetryMaxDelayMs)
}

function lockOutboxRecord(record: OutboxMessage, workerId: string, now = new Date()) {
  const timestamp = now.toISOString()

  return {
    ...record,
    status: 'processing' as OutboxStatus,
    lockedAt: timestamp,
    lockedBy: workerId,
    updatedAt: timestamp,
  }
}

function dueAt(record: OutboxMessage) {
  return new Date(record.availableAt)
}

function delayAt(now: Date, delayMs: number) {
  return new Date(now.getTime() + delayMs)
}

function stringifyError(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Outbox processing failed'
}
