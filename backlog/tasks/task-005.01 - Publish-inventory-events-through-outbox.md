---
id: TASK-005.01
title: Publish inventory events through outbox
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - eventing
  - R1
milestone: m-1
dependencies:
  - TASK-001.03
references:
  - docs/adr/0002-queue-outbox-before-kafka.md
  - apps/worker/src/worker.ts
  - docs/system-design/production-readiness.md
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
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define outbox schema and worker processing contract.
2. Write inventory and outbox records in the same transaction.
3. Implement async processing with bounded retries and poison-message handling.
4. Add tests or simulation proving failed processing does not lose events.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
