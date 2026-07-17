---
id: TASK-005.01
title: Publish inventory events through outbox
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
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
- [ ] #1 Inventory changes and outbox records commit in the same database transaction
- [ ] #2 Worker processes pending outbox records asynchronously
- [ ] #3 Failed processing attempts are retried with bounded retry metadata
- [ ] #4 Outbox record includes id, event_type, aggregate_type, aggregate_id, trace_id, payload JSON, status, attempt_count, available_at, locked_at, locked_by, created_at, and processed_at
- [ ] #5 Worker claims records with database locking or compare-and-set semantics so two workers do not process the same event concurrently
- [ ] #6 Retry policy uses bounded exponential backoff and moves exhausted records to a failed status with last_error
- [ ] #7 Poison records do not block unrelated pending records
- [ ] #8 Outbox payloads are versioned so future event changes remain compatible
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define the outbox table, event envelope, statuses, payload version, and retry/backoff policy before worker logic.
2. Implement transactional outbox writes alongside inventory or integration state changes.
3. Implement worker claim/process/ack/fail behavior with database locking or compare-and-set safety.
4. Add poison-message handling that marks exhausted records failed without blocking other events.
5. Add concurrency, retry, failure, and transaction rollback tests.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
