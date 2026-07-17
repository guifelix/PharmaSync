import type { HttpContext } from '@adonisjs/core/http'

export default class StockPositionsController {
  async index({ workforceAuth }: HttpContext) {
    return {
      data: [],
      meta: contextMeta(workforceAuth),
    }
  }
}

function contextMeta(workforceAuth: HttpContext['workforceAuth']) {
  return {
    organizationId: workforceAuth.organizationId,
    permittedSiteIds: workforceAuth.permittedSiteIds,
    traceId: workforceAuth.traceId,
  }
}
