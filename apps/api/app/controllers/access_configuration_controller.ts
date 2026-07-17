import type { HttpContext } from '@adonisjs/core/http'

export default class AccessConfigurationController {
  async update({ workforceAuth }: HttpContext) {
    return {
      data: {
        status: 'accepted',
        traceId: workforceAuth.traceId,
      },
    }
  }
}
