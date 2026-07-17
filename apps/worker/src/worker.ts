import { validateWorkerEnv } from '@pharmasync/config'
import pg from 'pg'

const config = validateWorkerEnv()
const pool = new pg.Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
})

console.log(
  `PharmaSync worker ready; queue=${config.queue.driver}, poll interval=${config.queue.pollIntervalMs}ms, concurrency=${config.queue.concurrency}`
)

async function recordHeartbeat() {
  await pool.query(
    `
      insert into worker_heartbeats (name, last_seen_at, metadata, created_at, updated_at)
      values ($1, now(), $2::jsonb, now(), now())
      on conflict (name)
      do update set last_seen_at = excluded.last_seen_at,
                    metadata = excluded.metadata,
                    updated_at = now()
    `,
    [
      'outbox-worker',
      JSON.stringify({
        queue: config.queue.driver,
        concurrency: config.queue.concurrency,
      }),
    ]
  )
}

async function tick() {
  await recordHeartbeat()
  console.log('Worker heartbeat: outbox processing placeholder')
}

await tick()
setInterval(() => {
  tick().catch((error: unknown) => {
    console.error('Worker heartbeat failed', error instanceof Error ? error.message : error)
  })
}, config.queue.pollIntervalMs)
