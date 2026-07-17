export const runtimeEnvironments = ['development', 'test', 'staging', 'pilot', 'production'] as const
export const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const
export const queueDrivers = ['database'] as const

export type RuntimeEnvironment = (typeof runtimeEnvironments)[number]
export type LogLevel = (typeof logLevels)[number]
export type QueueDriver = (typeof queueDrivers)[number]

export type DatabaseConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export type ObjectStorageConfig = {
  endpoint: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  forcePathStyle: boolean
}

export type QueueConfig = {
  driver: QueueDriver
  pollIntervalMs: number
  concurrency: number
}

export type LoggingConfig = {
  level: LogLevel
}

export type WorkerConfig = {
  env: RuntimeEnvironment
  database: DatabaseConfig
  objectStorage: ObjectStorageConfig
  queue: QueueConfig
  logging: LoggingConfig
}

type EnvSource = Record<string, string | undefined>

class EnvReader {
  readonly #errors: string[] = []
  readonly #source: EnvSource

  constructor(source: EnvSource) {
    this.#source = source
  }

  string(name: string): string {
    const value = this.#source[name]?.trim()

    if (!value) {
      this.#errors.push(`${name} is required`)
      return ''
    }

    return value
  }

  number(name: string, options: { min?: number } = {}): number {
    const value = this.string(name)

    if (value === '') {
      return 0
    }

    const parsed = Number(value)

    if (!Number.isFinite(parsed)) {
      this.#errors.push(`${name} must be a number`)
      return 0
    }

    if (options.min !== undefined && parsed < options.min) {
      this.#errors.push(`${name} must be greater than or equal to ${options.min}`)
    }

    return parsed
  }

  boolean(name: string): boolean {
    const value = this.string(name).toLowerCase()

    if (value === '') {
      return false
    }

    if (['true', '1', 'yes'].includes(value)) {
      return true
    }

    if (['false', '0', 'no'].includes(value)) {
      return false
    }

    this.#errors.push(`${name} must be a boolean`)
    return false
  }

  enum<const Value extends string>(name: string, values: readonly Value[]): Value {
    const value = this.string(name)

    if (value === '') {
      return values[0]!
    }

    if (values.includes(value as Value)) {
      return value as Value
    }

    this.#errors.push(`${name} must be one of: ${values.join(', ')}`)
    return values[0]!
  }

  url(name: string): string {
    const value = this.string(name)

    if (value === '') {
      return value
    }

    try {
      new URL(value)
    } catch {
      this.#errors.push(`${name} must be a valid URL`)
    }

    return value
  }

  assertValid(context: string): void {
    if (this.#errors.length > 0) {
      throw new Error(`Invalid ${context} environment configuration:\n- ${this.#errors.join('\n- ')}`)
    }
  }
}

export function validateWorkerEnv(source: EnvSource = process.env): WorkerConfig {
  const env = new EnvReader(source)

  const config: WorkerConfig = {
    env: env.enum('APP_ENV', runtimeEnvironments),
    database: {
      host: env.string('DB_HOST'),
      port: env.number('DB_PORT', { min: 1 }),
      user: env.string('DB_USER'),
      password: env.string('DB_PASSWORD'),
      database: env.string('DB_DATABASE'),
    },
    objectStorage: {
      endpoint: env.url('S3_ENDPOINT'),
      region: env.string('S3_REGION'),
      accessKeyId: env.string('S3_ACCESS_KEY_ID'),
      secretAccessKey: env.string('S3_SECRET_ACCESS_KEY'),
      bucket: env.string('S3_BUCKET'),
      forcePathStyle: env.boolean('S3_FORCE_PATH_STYLE'),
    },
    queue: {
      driver: env.enum('QUEUE_DRIVER', queueDrivers),
      pollIntervalMs: env.number('WORKER_POLL_INTERVAL_MS', { min: 1000 }),
      concurrency: env.number('WORKER_CONCURRENCY', { min: 1 }),
    },
    logging: {
      level: env.enum('LOG_LEVEL', logLevels),
    },
  }

  env.assertValid('worker')

  return config
}
