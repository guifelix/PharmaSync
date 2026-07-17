/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const HealthController = () => import('#controllers/health_controller')
const AccessConfigurationController = () => import('#controllers/access_configuration_controller')
const AuditEventsController = () => import('#controllers/audit_events_controller')
const EvidencePackagesController = () => import('#controllers/evidence_packages_controller')
const IntegrationHealthController = () => import('#controllers/integration_health_controller')
const IntegrationMappingsController = () => import('#controllers/integration_mappings_controller')
const MedicationProductsController = () => import('#controllers/medication_products_controller')
const QuarantineRecordsController = () => import('#controllers/quarantine_records_controller')
const QuarantineReprocessingsController = () =>
  import('#controllers/quarantine_reprocessings_controller')
const RiskSignalsController = () => import('#controllers/risk_signals_controller')
const SitesController = () => import('#controllers/sites_controller')
const StockPositionsController = () => import('#controllers/stock_positions_controller')
const WorkforceAuthContextController = () => import('#controllers/workforce_auth_context_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router.get('/health', [HealthController, 'show'])

router
  .group(() => {
    router
      .group(() => {
        router.get('context', [WorkforceAuthContextController, 'show']).use(middleware.workforceAuth())
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router
          .get('stock', [StockPositionsController, 'index'])
          .use(middleware.requirePermission({ permission: 'inventory:read', resource: 'inventory.stock' }))
      })
      .prefix('inventory')
      .use(middleware.workforceAuth())

    router
      .get('signals', [RiskSignalsController, 'index'])
      .use(middleware.workforceAuth())
      .use(middleware.requirePermission({ permission: 'signals:read', resource: 'signals' }))

    router
      .get('medication-products', [MedicationProductsController, 'index'])
      .use(middleware.workforceAuth())
      .use(
        middleware.requirePermission({
          permission: 'inventory:read',
          resource: 'medication-products',
        })
      )

    router
      .get('sites', [SitesController, 'index'])
      .use(middleware.workforceAuth())
      .use(middleware.requirePermission({ permission: 'inventory:read', resource: 'sites' }))

    router
      .group(() => {
        router
          .get('/', [QuarantineRecordsController, 'index'])
          .use(middleware.requirePermission({ permission: 'quarantine:read', resource: 'quarantine' }))
        router.post(':id/reprocessings', [QuarantineReprocessingsController, 'store']).use(
          middleware.requirePermission({
            permission: 'quarantine:reprocess',
            resource: 'quarantine.reprocessings',
          })
        )
      })
      .prefix('quarantine')
      .use(middleware.workforceAuth())

    router
      .group(() => {
        router.get('health', [IntegrationHealthController, 'show']).use(
          middleware.requirePermission({
            permission: 'integration:health:read',
            resource: 'integration.health',
          })
        )
        router.patch('mappings/:id', [IntegrationMappingsController, 'update']).use(
          middleware.requirePermission({
            permission: 'integration:mappings:write',
            resource: 'integration.mappings',
          })
        )
      })
      .prefix('integration')
      .use(middleware.workforceAuth())

    router
      .group(() => {
        router
          .get('events', [AuditEventsController, 'index'])
          .use(middleware.requirePermission({ permission: 'audit:read', resource: 'audit.events' }))
      })
      .prefix('audit')
      .use(middleware.workforceAuth())

    router
      .group(() => {
        router.post('packages', [EvidencePackagesController, 'store']).use(
          middleware.requirePermission({
            permission: 'evidence:generate',
            resource: 'evidence.packages',
          })
        )
      })
      .prefix('evidence')
      .use(middleware.workforceAuth())

    router
      .group(() => {
        router.patch('access', [AccessConfigurationController, 'update']).use(
          middleware.requirePermission({
            permission: 'configuration:manage',
            resource: 'configuration.access',
          })
        )
      })
      .prefix('configuration')
      .use(middleware.workforceAuth())
  })
  .prefix('/api/v1')
