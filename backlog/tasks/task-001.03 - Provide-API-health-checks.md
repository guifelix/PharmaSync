---
id: TASK-001.03
title: Provide API health checks
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:14'
labels:
  - story
  - foundation
  - R0
milestone: m-0
dependencies:
  - TASK-001.02
references:
  - packages/contracts/openapi/pharmasync.v1.yaml
  - docs/system-design/production-readiness.md
parent_task_id: TASK-001
priority: high
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want health checks for the API and dependencies so deployment and monitoring tools can detect failures.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Health response includes API status and database connectivity
- [x] #2 Health response includes object-storage and worker/outbox status or heartbeat
- [x] #3 Failed dependencies return a non-healthy status without exposing secrets
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define and test the /health response shape for API, database, object storage, and worker heartbeat checks. 2. Add a worker_heartbeats migration and have the worker upsert an outbox-worker heartbeat. 3. Implement an Adonis health service/controller that runs safe dependency checks and never returns secret values. 4. Expand the OpenAPI /health contract and validate with focused API tests, typecheck, migrations, and curl smoke checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Validation passed: pnpm --filter @pharmasync/api test covers health service success, sanitized dependency failure, snake_case heartbeat reads, and unauthenticated GET /health response shape. Validation passed: pnpm --filter @pharmasync/api typecheck and pnpm --filter @pharmasync/worker typecheck. Validation passed: pnpm --filter @pharmasync/api exec node ace migration:run --force applied worker_heartbeats migration and regenerated schema classes. Validation passed: timeout 3 pnpm dev:worker recorded outbox-worker heartbeat. Validation passed: curl -i http://localhost:3333/health returned HTTP 200 with database, objectStorage, and worker checks up after worker heartbeat. Validation passed: pnpm typecheck completed 15/15 tasks successfully. Validation passed: migration:status shows worker_heartbeats migration completed and pnpm services:ps shows Postgres healthy and MinIO running. OpenAPI /health response contract updated. No ADR or diagram update required because this adds an endpoint and heartbeat table without changing architecture boundaries.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added /health with safe API, database, object storage, and worker heartbeat checks. Added a worker_heartbeats migration, worker heartbeat upsert, OpenAPI health response schema, and focused API tests for healthy/unhealthy responses and secret-safe failures.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
