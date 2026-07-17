---
id: TASK-005.03
title: Monitor worker processing
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - eventing
  - R3
milestone: m-3
dependencies:
  - TASK-005.01
  - TASK-001.03
references:
  - docs/system-design/production-readiness.md
  - apps/worker/src/worker.ts
parent_task_id: TASK-005
priority: medium
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want worker processing metrics so I can detect stale inventory pipelines before users lose trust.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Metrics include pending outbox count, oldest pending age, failed attempts, and processed count
- [ ] #2 Logs include trace ID and event type
- [ ] #3 Health check reports unhealthy when pending age exceeds configured threshold
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define worker health metrics and stale-processing thresholds.
2. Emit pending count, oldest pending age, failed attempts, and processed count.
3. Include worker state in health checks and structured logs.
4. Document common operational investigations.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
