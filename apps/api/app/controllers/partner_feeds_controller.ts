import {
  archivePartnerFeedSubmission,
  normalizePartnerFeedSubmission,
  randomTraceId,
} from '#services/partner_feed_reference'
import type { HttpContext } from '@adonisjs/core/http'

export default class PartnerFeedsController {
  async store({ request, response }: HttpContext) {
    const traceId = request.header('x-request-id')?.trim() || randomTraceId()
    const receivedAt = new Date()
    try {
      const input = request.all() as Record<string, unknown>
      const rawPayload = readRawPayload(input)
      const submission = normalizePartnerFeedSubmission(input)
      const archived = await archivePartnerFeedSubmission(submission, rawPayload, traceId, receivedAt)

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
  if (input.format === 'csv') {
    return String(input.csv ?? '')
  }

  return JSON.stringify(input)
}
