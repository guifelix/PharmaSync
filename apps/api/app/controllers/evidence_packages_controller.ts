import type { HttpContext } from '@adonisjs/core/http'

export default class EvidencePackagesController {
  async store({ workforceAuth }: HttpContext) {
    return {
      data: {
        status: 'queued',
        traceId: workforceAuth.traceId,
      },
    }
  }
}
