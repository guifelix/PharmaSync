import assert from "node:assert/strict";
import test from "node:test";
import { validateWorkerEnv } from "./index.ts";

const validWorkerEnv = {
  APP_ENV: "development",
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_USER: "pharmasync",
  DB_PASSWORD: "pharmasync",
  DB_DATABASE: "pharmasync",
  S3_ENDPOINT: "http://localhost:9000",
  S3_REGION: "us-east-1",
  S3_ACCESS_KEY_ID: "pharmasync",
  S3_SECRET_ACCESS_KEY: "pharmasync",
  S3_BUCKET: "pharmasync-evidence",
  S3_FORCE_PATH_STYLE: "true",
  QUEUE_DRIVER: "database",
  WORKER_POLL_INTERVAL_MS: "5000",
  WORKER_CONCURRENCY: "1",
  LOG_LEVEL: "info",
};

test("validateWorkerEnv returns typed worker config for a valid environment", () => {
  const config = validateWorkerEnv(validWorkerEnv);

  assert.equal(config.env, "development");
  assert.equal(config.database.port, 5432);
  assert.equal(config.objectStorage.forcePathStyle, true);
  assert.equal(config.queue.pollIntervalMs, 5000);
  assert.equal(config.logging.level, "info");
});

test("validateWorkerEnv reports all missing required variables", () => {
  assert.throws(
    () => validateWorkerEnv({}),
    (error) =>
      error instanceof Error &&
      error.message.includes("Invalid worker environment configuration") &&
      error.message.includes("DB_HOST is required") &&
      error.message.includes("S3_BUCKET is required") &&
      error.message.includes("QUEUE_DRIVER is required"),
  );
});

test("validateWorkerEnv rejects invalid enum and numeric values", () => {
  assert.throws(
    () =>
      validateWorkerEnv({
        ...validWorkerEnv,
        APP_ENV: "demo",
        LOG_LEVEL: "verbose",
        WORKER_CONCURRENCY: "0",
      }),
    (error) =>
      error instanceof Error &&
      error.message.includes("APP_ENV must be one of") &&
      error.message.includes("LOG_LEVEL must be one of") &&
      error.message.includes(
        "WORKER_CONCURRENCY must be greater than or equal to 1",
      ),
  );
});
