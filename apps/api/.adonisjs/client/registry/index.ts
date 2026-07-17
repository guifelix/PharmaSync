/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'health.show': {
    methods: ["GET","HEAD"],
    pattern: '/health',
    tokens: [{"old":"/health","type":0,"val":"health","end":""}],
    types: placeholder as Registry['health.show']['types'],
  },
  'auth.workforce_auth_context.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/context',
    tokens: [{"old":"/api/v1/auth/context","type":0,"val":"api","end":""},{"old":"/api/v1/auth/context","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/context","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/context","type":0,"val":"context","end":""}],
    types: placeholder as Registry['auth.workforce_auth_context.show']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'stock_positions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/inventory/stock',
    tokens: [{"old":"/api/v1/inventory/stock","type":0,"val":"api","end":""},{"old":"/api/v1/inventory/stock","type":0,"val":"v1","end":""},{"old":"/api/v1/inventory/stock","type":0,"val":"inventory","end":""},{"old":"/api/v1/inventory/stock","type":0,"val":"stock","end":""}],
    types: placeholder as Registry['stock_positions.index']['types'],
  },
  'risk_signals.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/signals',
    tokens: [{"old":"/api/v1/signals","type":0,"val":"api","end":""},{"old":"/api/v1/signals","type":0,"val":"v1","end":""},{"old":"/api/v1/signals","type":0,"val":"signals","end":""}],
    types: placeholder as Registry['risk_signals.index']['types'],
  },
  'quarantine_records.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/quarantine',
    tokens: [{"old":"/api/v1/quarantine","type":0,"val":"api","end":""},{"old":"/api/v1/quarantine","type":0,"val":"v1","end":""},{"old":"/api/v1/quarantine","type":0,"val":"quarantine","end":""}],
    types: placeholder as Registry['quarantine_records.index']['types'],
  },
  'quarantine_reprocessings.store': {
    methods: ["POST"],
    pattern: '/api/v1/quarantine/:id/reprocessings',
    tokens: [{"old":"/api/v1/quarantine/:id/reprocessings","type":0,"val":"api","end":""},{"old":"/api/v1/quarantine/:id/reprocessings","type":0,"val":"v1","end":""},{"old":"/api/v1/quarantine/:id/reprocessings","type":0,"val":"quarantine","end":""},{"old":"/api/v1/quarantine/:id/reprocessings","type":1,"val":"id","end":""},{"old":"/api/v1/quarantine/:id/reprocessings","type":0,"val":"reprocessings","end":""}],
    types: placeholder as Registry['quarantine_reprocessings.store']['types'],
  },
  'integration_health.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/integration/health',
    tokens: [{"old":"/api/v1/integration/health","type":0,"val":"api","end":""},{"old":"/api/v1/integration/health","type":0,"val":"v1","end":""},{"old":"/api/v1/integration/health","type":0,"val":"integration","end":""},{"old":"/api/v1/integration/health","type":0,"val":"health","end":""}],
    types: placeholder as Registry['integration_health.show']['types'],
  },
  'integration_mappings.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/integration/mappings/:id',
    tokens: [{"old":"/api/v1/integration/mappings/:id","type":0,"val":"api","end":""},{"old":"/api/v1/integration/mappings/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/integration/mappings/:id","type":0,"val":"integration","end":""},{"old":"/api/v1/integration/mappings/:id","type":0,"val":"mappings","end":""},{"old":"/api/v1/integration/mappings/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['integration_mappings.update']['types'],
  },
  'audit_events.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/audit/events',
    tokens: [{"old":"/api/v1/audit/events","type":0,"val":"api","end":""},{"old":"/api/v1/audit/events","type":0,"val":"v1","end":""},{"old":"/api/v1/audit/events","type":0,"val":"audit","end":""},{"old":"/api/v1/audit/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['audit_events.index']['types'],
  },
  'evidence_packages.store': {
    methods: ["POST"],
    pattern: '/api/v1/evidence/packages',
    tokens: [{"old":"/api/v1/evidence/packages","type":0,"val":"api","end":""},{"old":"/api/v1/evidence/packages","type":0,"val":"v1","end":""},{"old":"/api/v1/evidence/packages","type":0,"val":"evidence","end":""},{"old":"/api/v1/evidence/packages","type":0,"val":"packages","end":""}],
    types: placeholder as Registry['evidence_packages.store']['types'],
  },
  'access_configuration.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/configuration/access',
    tokens: [{"old":"/api/v1/configuration/access","type":0,"val":"api","end":""},{"old":"/api/v1/configuration/access","type":0,"val":"v1","end":""},{"old":"/api/v1/configuration/access","type":0,"val":"configuration","end":""},{"old":"/api/v1/configuration/access","type":0,"val":"access","end":""}],
    types: placeholder as Registry['access_configuration.update']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
