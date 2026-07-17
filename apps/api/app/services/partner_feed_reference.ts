import { randomUUID, createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export type PartnerFeedFormat = 'csv' | 'json'

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

export function normalizePartnerFeedSubmission(input: Record<string, unknown>): PartnerFeedSubmission {
  const partnerId = readString(input.partner_id, 'partner_id')
  const feedId = readString(input.feed_id, 'feed_id')
  const submittedAt = readString(input.submitted_at, 'submitted_at')
  const format = readFormat(input.format)

  if (format === 'json') {
    const movements = readMovements(input.movements)
    return {
      partner_id: partnerId,
      feed_id: feedId,
      submitted_at: submittedAt,
      format,
      movements,
    }
  }

  const csv = readString(input.csv, 'csv')
  return {
    partner_id: partnerId,
    feed_id: feedId,
    submitted_at: submittedAt,
    format,
    movements: parseCsvFeed(csv),
  }
}

export async function archivePartnerFeedSubmission(
  submission: PartnerFeedSubmission,
  rawPayload: string,
  traceId = randomTraceId(),
  receivedAt = new Date()
): Promise<ArchivedPartnerFeed> {
  const payloadHash = createHash('sha256').update(rawPayload).digest('hex')
  const archivePath = partnerFeedArchivePath(submission.partner_id, traceId, receivedAt, payloadHash, submission.format)
  const absolutePath = resolve(process.cwd(), archivePath)

  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, rawPayload, 'utf8')

  return {
    traceId,
    partnerId: submission.partner_id,
    feedId: submission.feed_id,
    payloadHash,
    archivePath,
    receivedAt: receivedAt.toISOString(),
    format: submission.format,
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

function readMovements(value: unknown): PartnerFeedMovement[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('movements must be a non-empty array')
  }

  return value.map((movement) => {
    if (!movement || typeof movement !== 'object') {
      throw new Error('movements entries must be objects')
    }

    const entry = movement as Record<string, unknown>

    return {
      source_event_id: readString(entry.source_event_id, 'source_event_id'),
      event_type: readString(entry.event_type, 'event_type'),
      site_code: readString(entry.site_code, 'site_code'),
      ndc: readString(entry.ndc, 'ndc'),
      lot_number: readString(entry.lot_number, 'lot_number'),
      expiration_date: readString(entry.expiration_date, 'expiration_date'),
      quantity_delta: readInteger(entry.quantity_delta, 'quantity_delta'),
      occurred_at: readString(entry.occurred_at, 'occurred_at'),
      source_location: optionalString(entry.source_location),
      destination_location: optionalString(entry.destination_location),
    }
  })
}

function parseCsvFeed(csv: string): PartnerFeedMovement[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    throw new Error('csv must include a header row and at least one data row')
  }

  const headers = lines[0]?.split(',').map((header) => header.trim()) ?? []
  const requiredHeaders = [
    'partner_id',
    'source_event_id',
    'event_type',
    'site_code',
    'ndc',
    'lot_number',
    'expiration_date',
    'quantity_delta',
    'occurred_at',
  ]

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`csv missing required column ${header}`)
    }
  }

  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((cell) => cell.trim())
    const entry = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))

    return {
      source_event_id: readString(entry.source_event_id, 'source_event_id'),
      event_type: readString(entry.event_type, 'event_type'),
      site_code: readString(entry.site_code, 'site_code'),
      ndc: readString(entry.ndc, 'ndc'),
      lot_number: readString(entry.lot_number, 'lot_number'),
      expiration_date: readString(entry.expiration_date, 'expiration_date'),
      quantity_delta: readInteger(entry.quantity_delta, 'quantity_delta'),
      occurred_at: readString(entry.occurred_at, 'occurred_at'),
      source_location: optionalString(entry.source_location),
      destination_location: optionalString(entry.destination_location),
    }
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
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_')
}
