import { HealthService } from '#services/health_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class HealthController {
  async show({ response }: HttpContext) {
    const health = await new HealthService().check()
    return response.status(health.status === 'up' ? 200 : 503).send(health)
  }
}
