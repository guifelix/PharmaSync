import {
  archivePartnerFeedSubmission,
  parsePartnerFeedSubmission,
  randomTraceId,
} from '#services/partner_feed_reference'
import {
  createPartnerFeedQuarantineRecords,
  validatePartnerFeedSubmission,
} from '#services/partner_feed_validation'
import { appendQuarantineRecords } from '#services/quarantine_record_reference'
import { appendCanonicalEvents, mapAcceptedMovements } from '#services/partner_feed_mapping'
import type { HttpContext } from '@adonisjs/core/http'

export default class PartnerFeedsController {
  async store({ request, response }: HttpContext) {
    const traceId = request.header('x-request-id')?.trim() || randomTraceId()
    const receivedAt = new Date()

    try {
      const input = request.all() as Record<string, unknown>
      const rawPayload = readRawPayload(input)
      const submission = parsePartnerFeedSubmission(input)
      const archived = await archivePartnerFeedSubmission(
        submission,
        rawPayload,
        traceId,
        receivedAt
      )
      const validation = validatePartnerFeedSubmission(submission)
      const validationQuarantineRecords = createPartnerFeedQuarantineRecords(
        submission,
        archived.traceId,
        archived.payloadHash,
        archived.archivePath,
        validation.issues,
        receivedAt
      )

      const mappingResult = mapAcceptedMovements(
        validation.acceptedMovements,
        archived.traceId,
        archived.partnerId,
        archived.feedId,
        archived.payloadHash,
        archived.archivePath,
        receivedAt
      )

      const allQuarantineRecords = [
        ...validationQuarantineRecords,
        ...mappingResult.quarantineRecords,
      ]

      await appendQuarantineRecords(allQuarantineRecords)
      await appendCanonicalEvents(mappingResult.canonicalEvents)

      const issues = validation.issues.map((issue) => ({
        code: issue.code,
        category: issue.category,
        fieldPath: issue.fieldPath,
        message: issue.message,
        sourceEventId: issue.sourceEventId,
        rowIndex: issue.rowIndex,
      }))

      if (validation.acceptedMovements.length === 0) {
        return response.unprocessableEntity({
          data: {
            status: 'rejected',
            traceId: archived.traceId,
            partnerId: archived.partnerId,
            feedId: archived.feedId,
            issues,
          },
        })
      }

      return response.status(202).send({
        data: {
          status: 'accepted',
          traceId: archived.traceId,
          partnerId: archived.partnerId,
          feedId: archived.feedId,
          payloadHash: archived.payloadHash,
          archivePath: archived.archivePath,
          receivedAt: archived.receivedAt,
          format: archived.format,
          acceptedCount: validation.acceptedMovements.length,
          quarantinedCount: allQuarantineRecords.length,
          canonicalEventCount: mappingResult.canonicalEvents.length,
          outboxMessageCount: mappingResult.outboxMessages.length,
          issues,
        },
      })
    } catch (error) {
      return response.unprocessableEntity({
        data: {
          status: 'rejected',
          traceId,
          error: error instanceof Error ? error.message : 'Partner feed submission failed',
        },
      })
    }
  }
}

function readRawPayload(input: Record<string, unknown>) {
  if (input.format === 'csv' || input.csv !== undefined) {
    return String(input.csv ?? '')
  }

  return JSON.stringify(input)
}
