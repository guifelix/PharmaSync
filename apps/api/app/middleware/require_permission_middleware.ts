import {
  hasPermission,
  shouldAuditPrivilegedPermission,
  type Permission,
} from '#services/authorization_policy'
import {
  auditAuthorizationDenied,
  auditPrivilegedAuthorizationGranted,
} from '#services/authorization_audit'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type RequirePermissionOptions = {
  permission: Permission
  resource: string
}

export default class RequirePermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: RequirePermissionOptions) {
    if (hasPermission(ctx.workforceAuth, options.permission)) {
      if (shouldAuditPrivilegedPermission(options.permission)) {
        auditPrivilegedAuthorizationGranted({
          logger: ctx.logger,
          authContext: ctx.workforceAuth,
          permission: options.permission,
          resource: options.resource,
        })
      }

      return next()
    }

    auditAuthorizationDenied({
      logger: ctx.logger,
      authContext: ctx.workforceAuth,
      permission: options.permission,
      resource: options.resource,
    })

    return ctx.response.forbidden({
      errors: [
        {
          code: 'authorization_denied',
          message: 'Insufficient role permission',
          permission: options.permission,
          resource: options.resource,
          traceId: ctx.workforceAuth.traceId,
        },
      ],
    })
  }
}
