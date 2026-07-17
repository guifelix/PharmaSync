import { randomUUID, createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export type PartnerFeedFormat = 'csv' | 'json'

export type PartnerFeedMovementInput = Record<string, unknown>

export type PartnerFeedSubmissionDraft = {
  partner_id: string | null
  feed_id: string | null
  submitted_at: string | null
  format: string | null
  archiveFormat: PartnerFeedFormat
  movements: PartnerFeedMovementInput[]
}

export type PartnerFeedMovement = {
  source_event_id: string
  event_type: string
  site_code: string
  ndc: string
  lot_number: string
  expiration_date: string
  quantity_delta: number
  occurred_at: string
  source_location?: string | null
  destination_location?: string | null
}

export type PartnerFeedSubmission = {
  partner_id: string
  feed_id: string
  submitted_at: string
  format: PartnerFeedFormat
  movements: PartnerFeedMovement[]
}

export type ArchivedPartnerFeed = {
  traceId: string
  partnerId: string
  feedId: string
  payloadHash: string
  archivePath: string
  receivedAt: string
  format: PartnerFeedFormat
}

export function parsePartnerFeedSubmission(
  input: Record<string, unknown>
): PartnerFeedSubmissionDraft {
  const partnerId = optionalString(input.partner_id)
  const feedId = optionalString(input.feed_id)
  const submittedAt = optionalString(input.submitted_at)
  const format = optionalString(input.format)
  const archiveFormat: PartnerFeedFormat =
    format === 'csv' || input.csv !== undefined ? 'csv' : 'json'

  if (archiveFormat === 'json') {
    const movements = readMovementInputs(input.movements)
    return {
      partner_id: partnerId,
      feed_id: feedId,
      submitted_at: submittedAt,
      format,
      archiveFormat,
      movements,
    }
  }

  const csv = optionalString(input.csv)
  return {
    partner_id: partnerId,
    feed_id: feedId,
    submitted_at: submittedAt,
    format,
    archiveFormat,
    movements: parseCsvFeed(csv),
  }
}

export function normalizePartnerFeedSubmission(
  input: Record<string, unknown>
): PartnerFeedSubmission {
  const submission = parsePartnerFeedSubmission(input)
  return {
    partner_id: readString(submission.partner_id, 'partner_id'),
    feed_id: readString(submission.feed_id, 'feed_id'),
    submitted_at: readString(submission.submitted_at, 'submitted_at'),
    format: readFormat(submission.format ?? submission.archiveFormat),
    movements: submission.movements.map((movement) => ({
      source_event_id: readString(movement.source_event_id, 'source_event_id'),
      event_type: readString(movement.event_type, 'event_type'),
      site_code: readString(movement.site_code, 'site_code'),
      ndc: readString(movement.ndc, 'ndc'),
      lot_number: readString(movement.lot_number, 'lot_number'),
      expiration_date: readString(movement.expiration_date, 'expiration_date'),
      quantity_delta: readInteger(movement.quantity_delta, 'quantity_delta'),
      occurred_at: readString(movement.occurred_at, 'occurred_at'),
      source_location: optionalString(movement.source_location),
      destination_location: optionalString(movement.destination_location),
    })),
  }
}

export async function archivePartnerFeedSubmission(
  submission: Pick<PartnerFeedSubmissionDraft, 'partner_id' | 'feed_id' | 'archiveFormat'>,
  rawPayload: string,
  traceId = randomTraceId(),
  receivedAt = new Date()
): Promise<ArchivedPartnerFeed> {
  const payloadHash = createHash('sha256').update(rawPayload).digest('hex')
  const partnerId = submission.partner_id ?? 'unknown_partner'
  const feedId = submission.feed_id ?? 'unknown_feed'
  const archivePath = partnerFeedArchivePath(
    partnerId,
    traceId,
    receivedAt,
    payloadHash,
    submission.archiveFormat
  )
  const absolutePath = resolve(process.cwd(), archivePath)

  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, rawPayload, 'utf8')

  return {
    traceId,
    partnerId,
    feedId,
    payloadHash,
    archivePath,
    receivedAt: receivedAt.toISOString(),
    format: submission.archiveFormat,
  }
}

export function partnerFeedArchivePath(
  partnerId: string,
  traceId: string,
  receivedAt: Date,
  payloadHash: string,
  format: PartnerFeedFormat
) {
  const dateParts = receivedAt.toISOString().slice(0, 10).split('-')
  const safePartnerId = slugify(partnerId)
  const safeTraceId = slugify(traceId)
  const extension = format === 'json' ? 'json' : 'csv'

  return resolve(
    'storage',
    'partner-feeds',
    dateParts[0] ?? '1970',
    dateParts[1] ?? '01',
    dateParts[2] ?? '01',
    safePartnerId,
    `${safeTraceId}-${payloadHash}.${extension}`
  )
}

export function randomTraceId() {
  return `feed-${randomUUID()}`
}

function readString(value: unknown, field: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required`)
  }

  return value.trim()
}

function readFormat(value: unknown): PartnerFeedFormat {
  const format = readString(value, 'format')

  if (format !== 'csv' && format !== 'json') {
    throw new Error('format must be csv or json')
  }

  return format
}

function readMovementInputs(value: unknown): PartnerFeedMovementInput[] {
  if (!Array.isArray(value) || value.length === 0) {
    return []
  }

  return value.map((movement) => {
    if (!movement || typeof movement !== 'object') {
      return {}
    }

    return movement as Record<string, unknown>
  })
}

function parseCsvFeed(csv: string | null): PartnerFeedMovementInput[] {
  if (!csv) {
    return []
  }

  const csvText = csv
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    return []
  }

  const headers = lines[0]?.split(',').map((header) => header.trim()) ?? []

  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((cell) => cell.trim())
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))
  })
}

function readInteger(value: unknown, field: string) {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10)
  if (!Number.isInteger(parsed)) {
    throw new Error(`${field} must be an integer`)
  }

  return parsed
}

function optionalString(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
}
