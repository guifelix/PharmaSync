import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import type { CanonicalInventoryEvent, QuarantineRecord } from '@pharmasync/integration'
import { createInventoryOutboxMessage } from '@pharmasync/integration'
import type {
  InventoryMovement,
  InventoryMovementType,
  InventoryOutboxEvent,
  OutboxMessage,
  RecordedInventoryMovement,
} from '@pharmasync/domain'

import type { PartnerFeedValidatedMovement } from '#services/partner_feed_validation'
import {
  demoMedicationProducts,
  findProductByNormalizedNdc,
} from '#services/medication_product_reference'
import { demoSites } from '#services/organization_site_reference'

// ─── Mapping ────────────────────────────────────────────────────────────────

export type PartnerFeedMappingResult = {
  canonicalEvents: CanonicalInventoryEvent[]
  outboxMessages: OutboxMessage[]
  quarantineRecords: QuarantineRecord[]
}

export function mapAcceptedMovements(
  acceptedMovements: readonly PartnerFeedValidatedMovement[],
  traceId: string,
  partnerId: string,
  feedId: string,
  payloadHash: string,
  rawPayloadUri: string,
  receivedAt: Date
): PartnerFeedMappingResult {
  const canonicalEvents: CanonicalInventoryEvent[] = []
  const outboxMessages: OutboxMessage[] = []
  const quarantineRecords: QuarantineRecord[] = []

  for (const movement of acceptedMovements) {
    const product = findProductByNormalizedNdc(demoMedicationProducts, movement.normalizedNdc)
    if (!product) {
      continue
    }

    const lotId = `${product.productId}:${movement.lot_number}`
    const baseMovementId = `${traceId}:${movement.source_event_id}`
    const baseIdempotencyKey = `${traceId}:${movement.source_event_id}`

    if (movement.event_type === 'transfer') {
      const destinationSite = movement.destination_location
        ? readSiteByCode(movement.destination_location, movement.organizationId)
        : null

      if (!destinationSite) {
        quarantineRecords.push({
          id: `${traceId}:${movement.source_event_id}:UNKNOWN_DESTINATION_SITE`,
          organizationId: movement.organizationId,
          siteId: movement.siteId,
          partnerId,
          feedId,
          traceId,
          payloadHash,
          reasonCode: 'UNKNOWN_SITE',
          reasonCategory: 'reference-data',
          reasonMessage: `Unknown destination site code: ${movement.destination_location}`,
          fieldPath: `movement.source_event_id=${movement.source_event_id}.destination_location`,
          sourceEventId: movement.source_event_id,
          rawPayloadUri,
          status: 'quarantined',
          createdAt: receivedAt.toISOString(),
        })
        continue
      }

      const qty = Math.abs(movement.quantity_delta)

      const sourceMovement: InventoryMovement = {
        id: `${baseMovementId}:transfer-source`,
        type: 'transfer',
        orgId: movement.organizationId,
        siteId: movement.siteId,
        productId: product.productId,
        lotId,
        quantityDelta: -qty,
        occurredAt: movement.occurred_at,
        sourceTraceId: traceId,
      }

      const destMovement: InventoryMovement = {
        id: `${baseMovementId}:transfer-destination`,
        type: 'transfer',
        orgId: destinationSite.organizationId,
        siteId: destinationSite.siteKey,
        productId: product.productId,
        lotId,
        quantityDelta: qty,
        occurredAt: movement.occurred_at,
        sourceTraceId: traceId,
      }

      for (const [invMovement, suffix] of [
        [sourceMovement, 'source'] as const,
        [destMovement, 'destination'] as const,
      ]) {
        canonicalEvents.push({
          traceId,
          partnerId,
          idempotencyKey: `${baseIdempotencyKey}:${suffix}`,
          movement: invMovement,
        })

        const outboxEvent = buildOutboxEvent(invMovement, traceId)
        outboxMessages.push(createInventoryOutboxMessage(outboxEvent, receivedAt))
      }
    } else {
      const invMovement: InventoryMovement = {
        id: baseMovementId,
        type: movement.event_type as InventoryMovementType,
        orgId: movement.organizationId,
        siteId: movement.siteId,
        productId: product.productId,
        lotId,
        quantityDelta: movement.quantity_delta,
        occurredAt: movement.occurred_at,
        sourceTraceId: traceId,
      }

      canonicalEvents.push({
        traceId,
        partnerId,
        idempotencyKey: baseIdempotencyKey,
        movement: invMovement,
      })

      const outboxEvent = buildOutboxEvent(invMovement, traceId)
      outboxMessages.push(createInventoryOutboxMessage(outboxEvent, receivedAt))
    }
  }

  return { canonicalEvents, outboxMessages, quarantineRecords }
}

function buildOutboxEvent(movement: InventoryMovement, traceId: string): InventoryOutboxEvent {
  return {
    id: movement.id,
    eventType: 'inventory.movement.recorded',
    aggregateType: movement.type === 'transfer' ? 'stock-transfer' : 'stock-position',
    aggregateId: movement.siteId,
    orgId: movement.orgId,
    siteId: movement.siteId,
    sourceTraceId: traceId,
    occurredAt: movement.occurredAt,
    payload: {
      movements: [movement as RecordedInventoryMovement],
      updatedStockPositions: [],
    },
  }
}

function readSiteByCode(siteCode: string, orgId?: string) {
  return (
    demoSites.find(
      (site) =>
        site.siteKey === siteCode &&
        site.status === 'active' &&
        (!orgId || site.organizationId === orgId)
    ) ?? null
  )
}

// ─── NDJSON Storage ─────────────────────────────────────────────────────────

const canonicalEventsPath = resolve(
  process.cwd(),
  'storage',
  'partner-feed-canonical-events.ndjson'
)

export async function appendCanonicalEvents(events: readonly CanonicalInventoryEvent[]) {
  if (events.length === 0) {
    return
  }

  await mkdir(dirname(canonicalEventsPath), { recursive: true })
  const lines = events.map((event) => JSON.stringify(event)).join('\n') + '\n'
  await writeFile(canonicalEventsPath, lines, { flag: 'a' })
}

export async function loadCanonicalEvents(): Promise<CanonicalInventoryEvent[]> {
  try {
    const contents = await readFile(canonicalEventsPath, 'utf8')
    return contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as CanonicalInventoryEvent)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function clearCanonicalEvents() {
  try {
    await unlink(canonicalEventsPath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return
    }

    throw error
  }
}
