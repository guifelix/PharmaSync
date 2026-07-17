import type { HttpContext } from '@adonisjs/core/http'

export default class IntegrationMappingsController {
  async update({ params, workforceAuth }: HttpContext) {
    return {
      data: {
        mappingId: params.id,
        status: 'accepted',
        traceId: workforceAuth.traceId,
      },
    }
  }
}
