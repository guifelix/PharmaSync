---
id: TASK-005.01
title: Publish inventory events through outbox
status: Done
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 05:21'
labels:
  - story
  - eventing
  - R1
milestone: m-5
dependencies:
  - TASK-001.03
references:
  - docs/adr/0005-modular-monolith-monorepo.md
parent_task_id: TASK-005
priority: high
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want accepted inventory changes published through a transactional outbox so downstream processing is reliable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Inventory changes and outbox records commit in the same database transaction
- [x] #2 Worker processes pending outbox records asynchronously
- [x] #3 Failed processing attempts are retried with bounded retry metadata
- [x] #4 Outbox record includes id, event_type, aggregate_type, aggregate_id, trace_id, payload JSON, status, attempt_count, available_at, locked_at, locked_by, created_at, and processed_at
- [x] #5 Worker claims records with database locking or compare-and-set semantics so two workers do not process the same event concurrently
- [x] #6 Retry policy uses bounded exponential backoff and moves exhausted records to a failed status with last_error
- [x] #7 Poison records do not block unrelated pending records
- [x] #8 Outbox payloads are versioned so future event changes remain compatible
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add an outbox message schema, migration, and Lucid model with status, retry, locking, and payload version fields.
2. Add outbox reference helpers for creating inventory outbox messages, claiming pending records, and processing retries/failures with bounded backoff.
3. Add unit tests for transaction-shaped message creation, claim safety, retries, poison handling, and payload versioning.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented shared outbox helpers in @pharmasync/integration so API and worker share payload versioning, claim semantics, retries, and finalization helpers. Added transactional outbox schema/model and a real worker poll loop using PostgreSQL row locking (FOR UPDATE SKIP LOCKED) to claim pending outbox rows asynchronously. Validation passed: pnpm typecheck; pnpm --filter @pharmasync/api test.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a versioned transactional outbox for inventory events, including the outbox table/model, shared queue helpers, API event-to-message shaping, and a worker loop that claims and settles records with retry/backoff semantics. Verified with workspace typecheck and the API test suite.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
