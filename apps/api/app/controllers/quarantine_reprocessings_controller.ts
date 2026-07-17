import type { HttpContext } from '@adonisjs/core/http'

export default class QuarantineReprocessingsController {
  async store({ params, workforceAuth }: HttpContext) {
    return {
      data: {
        quarantineRecordId: params.id,
        status: 'queued',
        traceId: workforceAuth.traceId,
      },
    }
  }
}
