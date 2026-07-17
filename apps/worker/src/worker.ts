const intervalMs = Number(process.env.WORKER_INTERVAL_MS ?? 5000)

console.log(`PharmaSync worker ready; polling interval ${intervalMs}ms`)

setInterval(() => {
  console.log('Worker heartbeat: outbox processing placeholder')
}, intervalMs)
