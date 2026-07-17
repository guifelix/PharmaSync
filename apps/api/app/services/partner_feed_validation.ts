import type {
  PartnerFeedReasonCategory,
  PartnerFeedReasonCode,
  QuarantineRecord,
} from '@pharmasync/integration'

import { demoMedicationProducts, normalizeNdc } from '#services/medication_product_reference'
import { demoSites } from '#services/organization_site_reference'
import {
  type PartnerFeedMovementInput,
  type PartnerFeedSubmissionDraft,
} from '#services/partner_feed_reference'

export type PartnerFeedValidatedMovement = {
  source_event_id: string
  event_type: string
  site_code: string
  ndc: string
  normalizedNdc: string
  lot_number: string
  expiration_date: string
  quantity_delta: number
  occurred_at: string
  source_location?: string | null
  destination_location?: string | null
  organizationId: string
  siteId: string
}

export type PartnerFeedValidationIssue = {
  code: PartnerFeedReasonCode
  category: PartnerFeedReasonCategory
  fieldPath: string
  message: string
  sourceEventId: string | null
  organizationId: string
  siteId: string | null
  rowIndex: number
}

export type PartnerFeedValidationResult = {
  acceptedMovements: PartnerFeedValidatedMovement[]
  issues: PartnerFeedValidationIssue[]
}

const allowedEventTypes = new Set(['receipt', 'dispense', 'transfer', 'correction'])

export function validatePartnerFeedSubmission(
  draft: PartnerFeedSubmissionDraft
): PartnerFeedValidationResult {
  const issues: PartnerFeedValidationIssue[] = []
  const acceptedMovements: PartnerFeedValidatedMovement[] = []
  const sourceEventSignatures = new Map<string, string>()

  const topLevelIssues = validateTopLevelFields(draft)
  issues.push(...topLevelIssues)

  for (const [index, movement] of draft.movements.entries()) {
    const movementIssues = validateMovementRow(
      movement,
      index,
      draft.partner_id ?? 'unknown_partner'
    )
    const rowFieldPath = `${draft.archiveFormat === 'csv' ? 'csv.rows' : 'movements'}[${index}]`

    if (movementIssues.length > 0) {
      issues.push(...movementIssues.map((issue) => withRowPath(issue, rowFieldPath)))
      continue
    }

    const sourceEventId = readStringInput(movement.source_event_id)!
    const eventType = readStringInput(movement.event_type)!
    const siteCode = readStringInput(movement.site_code)!
    const ndc = readStringInput(movement.ndc)!
    const lotNumber = readStringInput(movement.lot_number)!
    const expirationDate = readStringInput(movement.expiration_date)!
    const occurredAt = readStringInput(movement.occurred_at)!
    const quantityDelta = readIntegerValue(movement.quantity_delta)!
    const sourceLocation = optionalStringValue(movement.source_location)
    const destinationLocation = optionalStringValue(movement.destination_location)
    const site = readSite(siteCode)!

    const normalizedNdc = normalizeNdc(ndc)
    const candidate: PartnerFeedValidatedMovement = {
      source_event_id: sourceEventId,
      event_type: eventType,
      site_code: siteCode,
      ndc,
      normalizedNdc,
      lot_number: lotNumber,
      expiration_date: expirationDate,
      quantity_delta: quantityDelta,
      occurred_at: occurredAt,
      source_location: sourceLocation,
      destination_location: destinationLocation,
      organizationId: site.organizationId,
      siteId: site.siteKey,
    }

    const signature = movementSignature(candidate)
    const previousSignature = sourceEventSignatures.get(candidate.source_event_id)
    if (previousSignature) {
      const duplicateIssue: PartnerFeedValidationIssue = {
        code: previousSignature === signature ? 'DUPLICATE_EVENT' : 'CONFLICTING_DUPLICATE',
        category: 'duplicate',
        fieldPath: `${rowFieldPath}.source_event_id`,
        message:
          previousSignature === signature
            ? 'Duplicate source_event_id within the submitted batch'
            : 'Conflicting source_event_id within the submitted batch',
        sourceEventId: candidate.source_event_id,
        organizationId: candidate.organizationId,
        siteId: candidate.siteId,
        rowIndex: index,
      }
      issues.push(duplicateIssue)
      continue
    }

    sourceEventSignatures.set(candidate.source_event_id, signature)
    acceptedMovements.push(candidate)
  }

  return { acceptedMovements, issues }
}

export function createPartnerFeedQuarantineRecords(
  draft: PartnerFeedSubmissionDraft,
  traceId: string,
  payloadHash: string,
  rawPayloadUri: string,
  issues: readonly PartnerFeedValidationIssue[],
  receivedAt = new Date()
): QuarantineRecord[] {
  return issues.map((issue) => ({
    id: `${traceId}:${issue.rowIndex}:${issue.code}`,
    organizationId: issue.organizationId,
    siteId: issue.siteId,
    partnerId: draft.partner_id ?? 'unknown_partner',
    feedId: draft.feed_id ?? 'unknown_feed',
    traceId,
    payloadHash,
    reasonCode: issue.code,
    reasonCategory: issue.category,
    reasonMessage: issue.message,
    fieldPath: issue.fieldPath,
    sourceEventId: issue.sourceEventId,
    rawPayloadUri,
    status: 'quarantined',
    createdAt: receivedAt.toISOString(),
  }))
}

function validateTopLevelFields(draft: PartnerFeedSubmissionDraft) {
  const issues: PartnerFeedValidationIssue[] = []
  const submittedAt = draft.submitted_at
  const format = draft.format

  if (!hasText(draft.partner_id)) {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      category: 'schema',
      fieldPath: 'partner_id',
      message: 'partner_id is required',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  }

  if (!hasText(draft.feed_id)) {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      category: 'schema',
      fieldPath: 'feed_id',
      message: 'feed_id is required',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  }

  if (!hasText(draft.submitted_at)) {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      category: 'schema',
      fieldPath: 'submitted_at',
      message: 'submitted_at is required',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  } else if (!isIsoDateTime(submittedAt as string)) {
    issues.push({
      code: 'INVALID_DATE',
      category: 'schema',
      fieldPath: 'submitted_at',
      message: 'submitted_at must be an ISO 8601 date-time',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  }

  if (!hasText(format)) {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      category: 'schema',
      fieldPath: 'format',
      message: 'format is required',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  } else if (format !== 'csv' && format !== 'json') {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      category: 'schema',
      fieldPath: 'format',
      message: 'format must be csv or json',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  }

  if (draft.movements.length === 0) {
    issues.push({
      code: 'MISSING_REQUIRED_FIELD',
      category: 'schema',
      fieldPath: draft.archiveFormat === 'csv' ? 'csv' : 'movements',
      message: 'a feed must include at least one movement row',
      sourceEventId: null,
      organizationId: draft.partner_id ?? 'unknown_partner',
      siteId: null,
      rowIndex: 0,
    })
  }

  return issues
}

function validateMovementRow(
  movement: PartnerFeedMovementInput,
  rowIndex: number,
  partnerId: string
): PartnerFeedValidationIssue[] {
  const issues: PartnerFeedValidationIssue[] = []
  const rowFieldPath = rowIndex >= 0 ? rowPathPrefix(rowIndex) : 'movements'

  const sourceEventId = readStringInput(movement.source_event_id)
  const eventType = readStringInput(movement.event_type)
  const siteCode = readStringInput(movement.site_code)
  const ndc = readStringInput(movement.ndc)
  const lotNumber = readStringInput(movement.lot_number)
  const expirationDate = readStringInput(movement.expiration_date)
  const occurredAt = readStringInput(movement.occurred_at)
  const quantityDelta = movement.quantity_delta

  if (!sourceEventId) {
    issues.push(requiredFieldIssue('source_event_id', rowFieldPath, partnerId, rowIndex))
  }

  if (!eventType) {
    issues.push(requiredFieldIssue('event_type', rowFieldPath, partnerId, rowIndex))
  } else if (!allowedEventTypes.has(eventType)) {
    issues.push({
      code: 'INVALID_EVENT_TYPE',
      category: 'schema',
      fieldPath: `${rowFieldPath}.event_type`,
      message: 'event_type must be one of receipt, dispense, transfer, or correction',
      sourceEventId: sourceEventId ?? null,
      organizationId: partnerId,
      siteId: null,
      rowIndex,
    })
  }

  const site = siteCode ? readSite(siteCode) : null
  if (!siteCode) {
    issues.push(requiredFieldIssue('site_code', rowFieldPath, partnerId, rowIndex))
  } else if (!site) {
    issues.push({
      code: 'UNKNOWN_SITE',
      category: 'reference-data',
      fieldPath: `${rowFieldPath}.site_code`,
      message: `Unknown site_code ${siteCode}`,
      sourceEventId: sourceEventId ?? null,
      organizationId: partnerId,
      siteId: null,
      rowIndex,
    })
  }

  const product = ndc ? readProduct(ndc) : null
  if (!ndc) {
    issues.push(requiredFieldIssue('ndc', rowFieldPath, partnerId, rowIndex))
  } else if (!product) {
    issues.push({
      code: 'UNKNOWN_PRODUCT',
      category: 'reference-data',
      fieldPath: `${rowFieldPath}.ndc`,
      message: `Unknown NDC ${ndc}`,
      sourceEventId: sourceEventId ?? null,
      organizationId: site?.organizationId ?? partnerId,
      siteId: site?.siteKey ?? null,
      rowIndex,
    })
  }

  if (!lotNumber) {
    issues.push(requiredFieldIssue('lot_number', rowFieldPath, partnerId, rowIndex))
  }

  if (!expirationDate) {
    issues.push(requiredFieldIssue('expiration_date', rowFieldPath, partnerId, rowIndex))
  } else if (!isIsoDate(expirationDate)) {
    issues.push({
      code: 'INVALID_DATE',
      category: 'schema',
      fieldPath: `${rowFieldPath}.expiration_date`,
      message: 'expiration_date must be an ISO 8601 date',
      sourceEventId: sourceEventId ?? null,
      organizationId: site?.organizationId ?? partnerId,
      siteId: site?.siteKey ?? null,
      rowIndex,
    })
  }

  if (!occurredAt) {
    issues.push(requiredFieldIssue('occurred_at', rowFieldPath, partnerId, rowIndex))
  } else if (!isIsoDateTime(occurredAt)) {
    issues.push({
      code: 'INVALID_DATE',
      category: 'schema',
      fieldPath: `${rowFieldPath}.occurred_at`,
      message: 'occurred_at must be an ISO 8601 date-time',
      sourceEventId: sourceEventId ?? null,
      organizationId: site?.organizationId ?? partnerId,
      siteId: site?.siteKey ?? null,
      rowIndex,
    })
  }

  if (readIntegerValue(quantityDelta) === null) {
    issues.push({
      code: 'INVALID_QUANTITY',
      category: 'business-rule',
      fieldPath: `${rowFieldPath}.quantity_delta`,
      message: 'quantity_delta must be an integer',
      sourceEventId: sourceEventId ?? null,
      organizationId: site?.organizationId ?? partnerId,
      siteId: site?.siteKey ?? null,
      rowIndex,
    })
  } else if (readIntegerValue(quantityDelta) === 0) {
    issues.push({
      code: 'INVALID_QUANTITY',
      category: 'business-rule',
      fieldPath: `${rowFieldPath}.quantity_delta`,
      message: 'quantity_delta cannot be zero',
      sourceEventId: sourceEventId ?? null,
      organizationId: site?.organizationId ?? partnerId,
      siteId: site?.siteKey ?? null,
      rowIndex,
    })
  }

  return issues
}

function requiredFieldIssue(
  field: string,
  rowFieldPath: string,
  organizationId: string,
  rowIndex: number
): PartnerFeedValidationIssue {
  return {
    code: 'MISSING_REQUIRED_FIELD',
    category: 'schema',
    fieldPath: `${rowFieldPath}.${field}`,
    message: `${field} is required`,
    sourceEventId: null,
    organizationId,
    siteId: null,
    rowIndex,
  }
}

function readSite(siteCode: string) {
  return demoSites.find((site) => site.siteKey === siteCode && site.status === 'active') ?? null
}

function readProduct(ndc: string) {
  const normalized = normalizeNdc(ndc)
  return demoMedicationProducts.find((product) => product.normalizedNdc === normalized) ?? null
}

function movementSignature(movement: PartnerFeedValidatedMovement) {
  return [
    movement.event_type,
    movement.site_code,
    movement.normalizedNdc,
    movement.lot_number,
    movement.expiration_date,
    movement.quantity_delta,
    movement.source_location ?? '',
    movement.destination_location ?? '',
  ].join('|')
}

function rowPathPrefix(rowIndex: number) {
  return `movements[${rowIndex}]`
}

function withRowPath(
  issue: PartnerFeedValidationIssue,
  rowPath: string
): PartnerFeedValidationIssue {
  return {
    ...issue,
    fieldPath: issue.fieldPath.replace(/^(movements|csv\.rows)\[\d+\]/, rowPath),
  }
}

function readStringInput(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function optionalStringValue(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function readIntegerValue(value: unknown) {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && /^-?\d+$/.test(value.trim())
        ? Number.parseInt(value.trim(), 10)
        : Number.NaN
  return Number.isInteger(parsed) ? parsed : null
}

function hasText(value: string | null) {
  return typeof value === 'string' && value.trim().length > 0
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))
}

function isIsoDateTime(value: string) {
  return !Number.isNaN(Date.parse(value))
}
