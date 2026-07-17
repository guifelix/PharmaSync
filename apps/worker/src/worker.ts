import { validateWorkerEnv } from '@pharmasync/config'

const config = validateWorkerEnv()

console.log(
  `PharmaSync worker ready; queue=${config.queue.driver}, poll interval=${config.queue.pollIntervalMs}ms, concurrency=${config.queue.concurrency}`
)

setInterval(() => {
  console.log('Worker heartbeat: outbox processing placeholder')
}, config.queue.pollIntervalMs)
