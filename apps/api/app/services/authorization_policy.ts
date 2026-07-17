import type { WorkforceAuthContext } from '#services/workforce_auth_service'

export const workforceRoles = ['operations', 'compliance', 'integration', 'platform-admin'] as const

export const permissions = [
  'inventory:read',
  'signals:read',
  'audit:read',
  'evidence:generate',
  'integration:health:read',
  'quarantine:read',
  'quarantine:reprocess',
  'integration:mappings:write',
  'configuration:manage',
] as const

export type WorkforceRole = (typeof workforceRoles)[number]
export type Permission = (typeof permissions)[number]

const privilegedPermissions: readonly Permission[] = [
  'configuration:manage',
  'integration:mappings:write',
]

const rolePermissions: Record<WorkforceRole, readonly Permission[]> = {
  'operations': ['inventory:read', 'signals:read'],
  'compliance': ['audit:read', 'evidence:generate'],
  'integration': ['integration:health:read', 'quarantine:read', 'quarantine:reprocess'],
  'platform-admin': [...permissions],
}

export function hasPermission(authContext: WorkforceAuthContext, permission: Permission) {
  return authContext.roles.some((role) => {
    if (!isWorkforceRole(role)) {
      return false
    }

    return rolePermissions[role].includes(permission)
  })
}

export function isWorkforceRole(role: string): role is WorkforceRole {
  return workforceRoles.includes(role as WorkforceRole)
}

export function shouldAuditPrivilegedPermission(permission: Permission) {
  return privilegedPermissions.includes(permission)
}

export function permissionMatrix() {
  return rolePermissions
}
