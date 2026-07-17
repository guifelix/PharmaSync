import type {
  CorrectionInventoryMovementCommand,
  DispenseInventoryMovementCommand,
  InventoryOutboxEvent,
  RecordedInventoryMovement,
  ReceiptInventoryMovementCommand,
  TransferInventoryMovementCommand,
} from '@pharmasync/domain'
import { createInventoryOutboxMessage } from '@pharmasync/integration'

import type { StockPositionReference } from '#services/stock_position_reference'
import { ensureValidStockPosition } from '#services/stock_position_reference'

export type InventoryMovementResult = {
  updatedStockPosition: StockPositionReference
  movement: RecordedInventoryMovement
  outboxEvent: InventoryOutboxEvent
  outboxMessage: ReturnType<typeof createInventoryOutboxMessage>
}

export type InventoryTransferResult = {
  updatedSourceStockPosition: StockPositionReference
  updatedDestinationStockPosition: StockPositionReference
  movements: [RecordedInventoryMovement, RecordedInventoryMovement]
  outboxEvent: InventoryOutboxEvent
  outboxMessage: ReturnType<typeof createInventoryOutboxMessage>
}

export function recordReceipt(
  stockPosition: StockPositionReference,
  command: ReceiptInventoryMovementCommand
): InventoryMovementResult {
  validatePosition(stockPosition, command)
  assertPositiveQuantity(command.quantity, 'receipt quantity')

  const updatedStockPosition = {
    ...stockPosition,
    quantityOnHand: stockPosition.quantityOnHand + command.quantity,
    updatedAt: command.occurredAt,
  }

  const movement = movementRecord(stockPosition, command, command.quantity, 'receipt')
  const outboxEvent = outboxForSingleMovement(stockPosition, command, movement, updatedStockPosition)
  const outboxMessage = createInventoryOutboxMessage(outboxEvent, new Date(command.occurredAt))

  return { updatedStockPosition, movement, outboxEvent, outboxMessage }
}

export function recordDispense(
  stockPosition: StockPositionReference,
  command: DispenseInventoryMovementCommand
): InventoryMovementResult {
  validatePosition(stockPosition, command)
  assertPositiveQuantity(command.quantity, 'dispense quantity')

  const availableQuantity = stockPosition.quantityOnHand - stockPosition.quantityReserved
  if (command.quantity > availableQuantity) {
    throw new Error('dispense quantity cannot exceed available quantity')
  }

  const updatedStockPosition = {
    ...stockPosition,
    quantityOnHand: stockPosition.quantityOnHand - command.quantity,
    updatedAt: command.occurredAt,
  }

  const movement = movementRecord(stockPosition, command, -command.quantity, 'dispense')
  const outboxEvent = outboxForSingleMovement(stockPosition, command, movement, updatedStockPosition)
  const outboxMessage = createInventoryOutboxMessage(outboxEvent, new Date(command.occurredAt))

  return { updatedStockPosition, movement, outboxEvent, outboxMessage }
}

export function recordCorrection(
  stockPosition: StockPositionReference,
  command: CorrectionInventoryMovementCommand
): InventoryMovementResult {
  validatePosition(stockPosition, command)
  ensureValidStockPosition(stockPosition)

  if (command.beforeQuantityOnHand !== stockPosition.quantityOnHand) {
    throw new Error('correction before quantity must match the current quantity on hand')
  }

  if (command.afterQuantityOnHand < 0) {
    throw new Error('correction after quantity must not be negative')
  }

  if (command.afterQuantityOnHand < stockPosition.quantityReserved) {
    throw new Error('correction after quantity cannot be less than reserved quantity')
  }

  const quantityDelta = command.afterQuantityOnHand - command.beforeQuantityOnHand
  const updatedStockPosition = {
    ...stockPosition,
    quantityOnHand: command.afterQuantityOnHand,
    updatedAt: command.occurredAt,
  }

  const movement: RecordedInventoryMovement = {
    ...baseMovement(stockPosition, command, quantityDelta, 'correction'),
    actorId: command.actorId,
    reason: command.reason,
    beforeQuantityOnHand: command.beforeQuantityOnHand,
    afterQuantityOnHand: command.afterQuantityOnHand,
  }
  const outboxEvent = outboxForSingleMovement(stockPosition, command, movement, updatedStockPosition)
  const outboxMessage = createInventoryOutboxMessage(outboxEvent, new Date(command.occurredAt))

  return { updatedStockPosition, movement, outboxEvent, outboxMessage }
}

export function recordTransfer(
  sourceStockPosition: StockPositionReference,
  destinationStockPosition: StockPositionReference,
  command: TransferInventoryMovementCommand
): InventoryTransferResult {
  validatePosition(sourceStockPosition, command)
  validatePosition(destinationStockPosition, {
    ...command,
    siteId: command.destinationSiteId,
  })
  ensureValidStockPosition(sourceStockPosition)
  ensureValidStockPosition(destinationStockPosition)

  if (sourceStockPosition.organizationId !== destinationStockPosition.organizationId) {
    throw new Error('transfer positions must belong to the same organization')
  }

  if (sourceStockPosition.siteId === destinationStockPosition.siteId) {
    throw new Error('transfer destination site must differ from source site')
  }

  if (sourceStockPosition.medicationProductId !== destinationStockPosition.medicationProductId) {
    throw new Error('transfer positions must reference the same medication product')
  }

  if (sourceStockPosition.lotNumber !== destinationStockPosition.lotNumber) {
    throw new Error('transfer positions must reference the same lot')
  }

  assertPositiveQuantity(command.quantity, 'transfer quantity')

  const availableQuantity = sourceStockPosition.quantityOnHand - sourceStockPosition.quantityReserved
  if (command.quantity > availableQuantity) {
    throw new Error('transfer quantity cannot exceed available quantity')
  }

  const updatedSourceStockPosition = {
    ...sourceStockPosition,
    quantityOnHand: sourceStockPosition.quantityOnHand - command.quantity,
    updatedAt: command.occurredAt,
  }
  const updatedDestinationStockPosition = {
    ...destinationStockPosition,
    quantityOnHand: destinationStockPosition.quantityOnHand + command.quantity,
    updatedAt: command.occurredAt,
  }

  const sourceMovement: RecordedInventoryMovement = {
    ...baseMovement(sourceStockPosition, command, -command.quantity, 'transfer'),
    actorId: command.actorId,
    reason: command.reason,
    destinationSiteId: command.destinationSiteId,
    transferCorrelationId: command.transferCorrelationId,
    transferDirection: 'source',
  }
  const destinationMovement: RecordedInventoryMovement = {
    ...baseMovement(destinationStockPosition, command, command.quantity, 'transfer'),
    actorId: command.actorId,
    reason: command.reason,
    destinationSiteId: command.destinationSiteId,
    transferCorrelationId: command.transferCorrelationId,
    transferDirection: 'destination',
    siteId: command.destinationSiteId,
  }
  const outboxEvent: InventoryOutboxEvent = {
    id: `${command.sourceTraceId}:transfer`,
    eventType: 'inventory.movement.recorded',
    aggregateType: 'stock-transfer',
    aggregateId: command.transferCorrelationId,
    orgId: sourceStockPosition.organizationId,
    siteId: sourceStockPosition.siteId,
    sourceTraceId: command.sourceTraceId,
    occurredAt: command.occurredAt,
    payload: {
      movements: [sourceMovement, destinationMovement],
      updatedStockPositions: [updatedSourceStockPosition, updatedDestinationStockPosition],
    },
  }
  const outboxMessage = createInventoryOutboxMessage(outboxEvent, new Date(command.occurredAt))

  return {
    updatedSourceStockPosition,
    updatedDestinationStockPosition,
    movements: [sourceMovement, destinationMovement],
    outboxEvent,
    outboxMessage,
  }
}

function baseMovement(
  stockPosition: StockPositionReference,
  command:
    | ReceiptInventoryMovementCommand
    | DispenseInventoryMovementCommand
    | CorrectionInventoryMovementCommand
    | TransferInventoryMovementCommand,
  quantityDelta: number,
  type: 'receipt' | 'dispense' | 'correction' | 'transfer'
): RecordedInventoryMovement {
  return {
    id: `${command.sourceTraceId}:${type}`,
    type,
    orgId: stockPosition.organizationId,
    siteId: stockPosition.siteId,
    productId: stockPosition.medicationProductId,
    lotId: stockPosition.lotNumber,
    quantityDelta,
    occurredAt: command.occurredAt,
    sourceTraceId: command.sourceTraceId,
  }
}

function movementRecord(
  stockPosition: StockPositionReference,
  command:
    | ReceiptInventoryMovementCommand
    | DispenseInventoryMovementCommand
    | CorrectionInventoryMovementCommand,
  quantityDelta: number,
  type: 'receipt' | 'dispense' | 'correction'
): RecordedInventoryMovement {
  const movement = baseMovement(stockPosition, command, quantityDelta, type)

  if (type === 'correction') {
    const correction = command as CorrectionInventoryMovementCommand
    return {
      ...movement,
      actorId: correction.actorId,
      reason: correction.reason,
      beforeQuantityOnHand: correction.beforeQuantityOnHand,
      afterQuantityOnHand: correction.afterQuantityOnHand,
    }
  }

  return movement
}

function outboxForSingleMovement(
  stockPosition: StockPositionReference,
  command:
    | ReceiptInventoryMovementCommand
    | DispenseInventoryMovementCommand
    | CorrectionInventoryMovementCommand,
  movement: RecordedInventoryMovement,
  updatedStockPosition: StockPositionReference
): InventoryOutboxEvent {
  return {
    id: `${command.sourceTraceId}:${movement.type}:outbox`,
    eventType: 'inventory.movement.recorded',
    aggregateType: 'stock-position',
    aggregateId: stockPosition.id,
    orgId: stockPosition.organizationId,
    siteId: stockPosition.siteId,
    sourceTraceId: command.sourceTraceId,
    occurredAt: command.occurredAt,
    payload: {
      movements: [movement],
      updatedStockPositions: [updatedStockPosition],
    },
  }
}

function validatePosition(
  stockPosition: StockPositionReference,
  command: {
    orgId: string
    siteId: string
    productId?: string
    lotId?: string
  }
) {
  if (stockPosition.organizationId !== command.orgId) {
    throw new Error('movement organization must match the stock position')
  }

  if (stockPosition.siteId !== command.siteId) {
    throw new Error('movement site must match the stock position')
  }

  if (command.productId && stockPosition.medicationProductId !== command.productId) {
    throw new Error('movement product must match the stock position')
  }

  if (command.lotId && stockPosition.lotNumber !== command.lotId) {
    throw new Error('movement lot must match the stock position')
  }
}

function assertPositiveQuantity(quantity: number, label: string) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error(`${label} must be a positive integer`)
  }
}
