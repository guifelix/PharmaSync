import type { HttpContext } from '@adonisjs/core/http'

export default class WorkforceAuthContextController {
  async show({ workforceAuth }: HttpContext) {
    return {
      data: workforceAuth,
    }
  }
}
