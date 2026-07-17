import type { WorkforceAuthContext } from '#services/workforce_auth_service'

export type TenantScope = {
  organizationId: string
  permittedSiteIds: string[]
}

export type TenantOwnedRecord = {
  organizationId: string
  siteId?: string | null
}

export function tenantScopeFromAuth(workforceAuth: WorkforceAuthContext): TenantScope {
  return {
    organizationId: workforceAuth.organizationId,
    permittedSiteIds: workforceAuth.permittedSiteIds,
  }
}

export function scopeTenantRecords<T extends TenantOwnedRecord>(records: readonly T[], scope: TenantScope) {
  return records.filter((record) => {
    if (record.organizationId !== scope.organizationId) {
      return false
    }

    if (!record.siteId) {
      return true
    }

    return scope.permittedSiteIds.includes(record.siteId)
  })
}

export function tenantScopeMeta(workforceAuth: WorkforceAuthContext) {
  return {
    organizationId: workforceAuth.organizationId,
    permittedSiteIds: workforceAuth.permittedSiteIds,
    traceId: workforceAuth.traceId,
  }
}
