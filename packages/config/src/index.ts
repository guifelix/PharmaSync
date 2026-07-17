export type RuntimeEnvironment = 'development' | 'test' | 'staging' | 'pilot' | 'production'

export type PharmaSyncConfig = {
  env: RuntimeEnvironment
  databaseUrl: string
  objectStorage: {
    endpoint?: string
    bucket: string
  }
}
