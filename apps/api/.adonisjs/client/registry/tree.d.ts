/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  health: {
    show: typeof routes['health.show']
  }
  auth: {
    workforceAuthContext: {
      show: typeof routes['auth.workforce_auth_context.show']
    }
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  stockPositions: {
    index: typeof routes['stock_positions.index']
  }
  riskSignals: {
    index: typeof routes['risk_signals.index']
  }
  medicationProducts: {
    index: typeof routes['medication_products.index']
  }
  quarantineRecords: {
    index: typeof routes['quarantine_records.index']
  }
  quarantineReprocessings: {
    store: typeof routes['quarantine_reprocessings.store']
  }
  integrationHealth: {
    show: typeof routes['integration_health.show']
  }
  integrationMappings: {
    update: typeof routes['integration_mappings.update']
  }
  auditEvents: {
    index: typeof routes['audit_events.index']
  }
  evidencePackages: {
    store: typeof routes['evidence_packages.store']
  }
  accessConfiguration: {
    update: typeof routes['access_configuration.update']
  }
}
