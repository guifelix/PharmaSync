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
  })
  .prefix('/api/v1')
