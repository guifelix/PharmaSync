import type { Permission } from '#services/authorization_policy'
import type { WorkforceAuthContext } from '#services/workforce_auth_service'
import type { Logger } from '@adonisjs/core/logger'

type AuthorizationDeniedInput = {
  logger: Logger
  authContext: WorkforceAuthContext
  permission: Permission
  resource: string
}

type AuthorizationGrantedInput = AuthorizationDeniedInput

export function auditPrivilegedAuthorizationGranted({
  logger,
  authContext,
  permission,
  resource,
}: AuthorizationGrantedInput) {
  logger.info(
    {
      event: 'privileged_authorization_granted',
      permission,
      resource,
      traceId: authContext.traceId,
      userId: authContext.userId,
      organizationId: authContext.organizationId,
      permittedSiteIds: authContext.permittedSiteIds,
      roles: authContext.roles,
    },
    'Privileged authorization granted'
  )
}

export function auditAuthorizationDenied({
  logger,
  authContext,
  permission,
  resource,
}: AuthorizationDeniedInput) {
  logger.warn(
    {
      event: 'authorization_denied',
      permission,
      resource,
      traceId: authContext.traceId,
      userId: authContext.userId,
      organizationId: authContext.organizationId,
      permittedSiteIds: authContext.permittedSiteIds,
      roles: authContext.roles,
    },
    'Authorization denied'
  )
}
