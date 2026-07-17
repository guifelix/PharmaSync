import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'health.show': { paramsTuple?: []; params?: {} }
    'auth.workforce_auth_context.show': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'stock_positions.index': { paramsTuple?: []; params?: {} }
    'risk_signals.index': { paramsTuple?: []; params?: {} }
    'quarantine_records.index': { paramsTuple?: []; params?: {} }
    'quarantine_reprocessings.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'integration_health.show': { paramsTuple?: []; params?: {} }
    'integration_mappings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_events.index': { paramsTuple?: []; params?: {} }
    'evidence_packages.store': { paramsTuple?: []; params?: {} }
    'access_configuration.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'health.show': { paramsTuple?: []; params?: {} }
    'auth.workforce_auth_context.show': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'stock_positions.index': { paramsTuple?: []; params?: {} }
    'risk_signals.index': { paramsTuple?: []; params?: {} }
    'quarantine_records.index': { paramsTuple?: []; params?: {} }
    'integration_health.show': { paramsTuple?: []; params?: {} }
    'audit_events.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'health.show': { paramsTuple?: []; params?: {} }
    'auth.workforce_auth_context.show': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'stock_positions.index': { paramsTuple?: []; params?: {} }
    'risk_signals.index': { paramsTuple?: []; params?: {} }
    'quarantine_records.index': { paramsTuple?: []; params?: {} }
    'integration_health.show': { paramsTuple?: []; params?: {} }
    'audit_events.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'quarantine_reprocessings.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'evidence_packages.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'integration_mappings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'access_configuration.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}