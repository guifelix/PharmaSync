import type { WorkforceAuthContext } from '#services/workforce_auth_service'
import {
  bearerTokenFromHeader,
  traceIdFromHeader,
  verifyWorkforceToken,
} from '#services/workforce_auth_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    workforceAuth: WorkforceAuthContext
  }
}

export default class WorkforceAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const traceId = traceIdFromHeader(ctx.request.header('x-request-id'))
    const token = bearerTokenFromHeader(ctx.request.header('authorization'))
    const authContext = token ? verifyWorkforceToken(token, traceId) : null

    if (!authContext) {
      return ctx.response.unauthorized({
        errors: [
          {
            message: 'Authentication required',
            traceId,
          },
        ],
      })
    }

    ctx.workforceAuth = authContext
    return next()
  }
}
