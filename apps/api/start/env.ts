/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const),

  // App
  APP_NAME: Env.schema.string(),
  APP_ENV: Env.schema.enum(['development', 'test', 'staging', 'pilot', 'production'] as const),
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Workforce authentication
  AUTH_LOCAL_JWT_SECRET: Env.schema.string(),
  OIDC_ISSUER_URL: Env.schema.string({ format: 'url', tld: false }),
  OIDC_CLIENT_ID: Env.schema.string(),
  OIDC_AUDIENCE: Env.schema.string(),
  OIDC_JWKS_URL: Env.schema.string({ format: 'url', tld: false }),
  OIDC_ACCEPTED_CLAIMS: Env.schema.string(),

  // Database
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),

  // Object storage
  S3_ENDPOINT: Env.schema.string({ format: 'url', tld: false }),
  S3_REGION: Env.schema.string(),
  S3_ACCESS_KEY_ID: Env.schema.string(),
  S3_SECRET_ACCESS_KEY: Env.schema.secret(),
  S3_BUCKET: Env.schema.string(),
  S3_FORCE_PATH_STYLE: Env.schema.boolean(),
})
