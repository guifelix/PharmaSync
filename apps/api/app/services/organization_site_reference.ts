import { scopeTenantRecords } from '#services/tenant_scope'

export const organizationTypes = ['distributor', 'facility', 'program-node'] as const
export const siteTypes = ['warehouse', 'pharmacy', 'clinic', 'program-location'] as const

export type OrganizationType = (typeof organizationTypes)[number]
export type SiteType = (typeof siteTypes)[number]

export type OrganizationReference = {
  organizationKey: string
  name: string
  type: OrganizationType
  status: 'active' | 'inactive'
}

export type SiteReference = {
  siteKey: string
  organizationId: string
  name: string
  type: SiteType
  status: 'active' | 'inactive'
  city: string
  region: string
  country: string
}

export const demoOrganizations: OrganizationReference[] = [
  {
    organizationKey: 'org_alpha',
    name: 'Alpha Regional Distribution Network',
    type: 'distributor',
    status: 'active',
  },
  {
    organizationKey: 'org_beta',
    name: 'Beta Hospital Program',
    type: 'facility',
    status: 'active',
  },
  {
    organizationKey: 'org_state_program',
    name: 'State Medication Access Program',
    type: 'program-node',
    status: 'active',
  },
]

export const demoSites: SiteReference[] = [
  {
    siteKey: 'site_main',
    organizationId: 'org_alpha',
    name: 'Alpha Main Warehouse',
    type: 'warehouse',
    status: 'active',
    city: 'Columbus',
    region: 'OH',
    country: 'US',
  },
  {
    siteKey: 'site_overflow',
    organizationId: 'org_alpha',
    name: 'Alpha Overflow Pharmacy',
    type: 'pharmacy',
    status: 'active',
    city: 'Cleveland',
    region: 'OH',
    country: 'US',
  },
  {
    siteKey: 'site_main',
    organizationId: 'org_beta',
    name: 'Beta Main Hospital Pharmacy',
    type: 'pharmacy',
    status: 'active',
    city: 'Pittsburgh',
    region: 'PA',
    country: 'US',
  },
]

export function activeSitesForTenant(
  sites: readonly SiteReference[],
  tenantScope: {
    organizationId: string
    permittedSiteIds: string[]
  }
) {
  return scopeTenantRecords(
    sites
      .filter((site) => site.status === 'active')
      .map((site) => ({ ...site, siteId: site.siteKey })),
    tenantScope
  )
}
