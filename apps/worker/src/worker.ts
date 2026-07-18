import { validateWorkerEnv } from "@pharmasync/config";
import {
  acknowledgeOutboxRecord,
  failOutboxRecord,
  outboxWorkerBatchSize,
} from "@pharmasync/integration";
import type { OutboxMessage } from "@pharmasync/domain";
import pg, { type QueryResultRow } from "pg";

const config = validateWorkerEnv();
const pool = new pg.Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

console.log(
  `PharmaSync worker ready; queue=${config.queue.driver}, poll interval=${config.queue.pollIntervalMs}ms, concurrency=${config.queue.concurrency}`,
);

const workerId = `outbox-worker:${process.pid}`;
const outboxBatchSize = Math.max(
  1,
  Math.min(config.queue.concurrency, outboxWorkerBatchSize),
);
let tickInProgress = false;

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
      "outbox-worker",
      JSON.stringify({
        queue: config.queue.driver,
        concurrency: config.queue.concurrency,
      }),
    ],
  );
}

async function claimPendingOutboxMessages(
  batchSize: number,
): Promise<OutboxMessage[]> {
  const result = await pool.query<OutboxRow>(
    `
      with claimed as (
        select id
        from outbox_messages
        where status = 'pending'
          and locked_at is null
          and available_at <= now()
        order by available_at asc, created_at asc, id asc
        for update skip locked
        limit $2
      )
      update outbox_messages as message
      set status = 'processing',
          locked_at = now(),
          locked_by = $1,
          updated_at = now()
      from claimed
      where message.id = claimed.id
      returning message.*
    `,
    [workerId, batchSize],
  );

  return result.rows.map(mapOutboxRow);
}

async function persistOutboxMessage(record: OutboxMessage) {
  await pool.query(
    `
      update outbox_messages
      set status = $2,
          attempt_count = $3,
          available_at = $4,
          locked_at = $5,
          locked_by = $6,
          processed_at = $7,
          last_error = $8,
          updated_at = now()
      where id = $1
    `,
    [
      record.id,
      record.status,
      record.attemptCount,
      record.availableAt,
      record.lockedAt,
      record.lockedBy,
      record.processedAt,
      record.lastError,
    ],
  );
}

async function publishOutboxMessage(record: OutboxMessage) {
  console.log(
    `Worker processing outbox message ${record.id} (${record.eventType})`,
  );
}

async function processPendingOutboxMessages() {
  const claimed = await claimPendingOutboxMessages(outboxBatchSize);

  if (claimed.length === 0) {
    return 0;
  }

  let processed = 0;

  for (const record of claimed) {
    try {
      await publishOutboxMessage(record);
      await persistOutboxMessage(acknowledgeOutboxRecord(record));
      processed += 1;
    } catch (error) {
      await persistOutboxMessage(failOutboxRecord(record, error));
    }
  }

  return processed;
}

async function tick() {
  if (tickInProgress) {
    return;
  }

  tickInProgress = true;

  try {
    await recordHeartbeat();
    const processed = await processPendingOutboxMessages();
    console.log(`Worker heartbeat: processed ${processed} outbox record(s)`);
  } finally {
    tickInProgress = false;
  }
}

try {
  await tick();
} catch (error: unknown) {
  console.error(
    "Worker initial tick failed (DB may not be ready yet)",
    error instanceof Error ? error.message : error,
  );
}
setInterval(() => {
  tick().catch((error: unknown) => {
    console.error(
      "Worker heartbeat failed",
      error instanceof Error ? error.message : error,
    );
  });
}, config.queue.pollIntervalMs);

type OutboxRow = QueryResultRow & {
  id: string;
  event_type: string;
  aggregate_type: string;
  aggregate_id: string;
  trace_id: string;
  payload_version: number;
  payload: Record<string, unknown>;
  status: "pending" | "processing" | "processed" | "failed";
  attempt_count: number;
  available_at: string | Date;
  locked_at: string | Date | null;
  locked_by: string | null;
  processed_at: string | Date | null;
  last_error: string | null;
  created_at: string | Date;
  updated_at: string | Date | null;
};

function mapOutboxRow(row: OutboxRow): OutboxMessage {
  return {
    id: row.id,
    eventType: row.event_type,
    aggregateType: row.aggregate_type,
    aggregateId: row.aggregate_id,
    traceId: row.trace_id,
    payloadVersion: row.payload_version,
    payload: row.payload,
    status: row.status,
    attemptCount: row.attempt_count,
    availableAt: new Date(row.available_at).toISOString(),
    lockedAt: row.locked_at ? new Date(row.locked_at).toISOString() : null,
    lockedBy: row.locked_by,
    processedAt: row.processed_at
      ? new Date(row.processed_at).toISOString()
      : null,
    lastError: row.last_error,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}
