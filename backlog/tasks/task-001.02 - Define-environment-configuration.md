---
id: TASK-001.02
title: Define environment configuration
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:07'
labels:
  - story
  - foundation
  - R0
milestone: m-0
dependencies:
  - TASK-001.01
references:
  - .env.example
  - apps/api/start/env.ts
  - docs/system-design/production-readiness.md
parent_task_id: TASK-001
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want environment variables validated at startup so misconfigured deployments fail early.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 API validates required app, database, auth, object storage, and logging variables
- [x] #2 Worker validates database, queue, object storage, and logging variables
- [x] #3 Example env files document local and pilot deployment settings
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inventory required env vars for API, worker, database, auth, object storage, and logging.
2. Add validation and example values in the appropriate app/root env files.
3. Exercise missing-variable failures and successful startup.
4. Update docs when variable names or defaults change.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Validation passed: pnpm --filter @pharmasync/config test covers valid worker env, missing required variables, invalid enum values, and invalid numeric values. Validation passed: pnpm --filter @pharmasync/config typecheck, pnpm --filter @pharmasync/worker typecheck, pnpm --filter @pharmasync/api typecheck. Validation passed: pnpm --filter @pharmasync/api exec node ace list bootstraps Adonis env validation. Validation passed: timeout 3 pnpm dev:worker loads root .env and starts worker config validation. Validation passed: env -i PATH=... HOME=... node apps/worker/src/worker.ts fails fast with required variable errors. Validation passed: pnpm services:up and pnpm services:ps keep Postgres and MinIO running with Postgres healthy. Validation passed: pnpm typecheck completed 15/15 tasks successfully. No ADR or diagram update required because this adds startup configuration validation without changing architecture boundaries.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added API startup env validation for app, database, auth/session, object storage, and logging variables. Added shared worker env validation in @pharmasync/config, wired the worker to load root .env and fail fast, updated env examples and README setup, and verified the runtime and typecheck paths.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
