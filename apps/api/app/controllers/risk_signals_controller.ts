import type { HttpContext } from '@adonisjs/core/http'

export default class RiskSignalsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: [],
      meta: {
        organizationId: workforceAuth.organizationId,
        permittedSiteIds: workforceAuth.permittedSiteIds,
        traceId: workforceAuth.traceId,
      },
    }
  }
}
