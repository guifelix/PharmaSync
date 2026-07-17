import type { HttpContext } from '@adonisjs/core/http'

export default class IntegrationHealthController {
  async show({ workforceAuth }: HttpContext) {
    return {
      data: {
        status: 'not_configured',
        traceId: workforceAuth.traceId,
      },
    }
  }
}
