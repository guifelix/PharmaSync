---
id: TASK-011.01
title: Add structured logs
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:40'
labels:
  - story
  - operations
  - R3
milestone: m-3
dependencies:
  - TASK-005.03
  - TASK-005.02
references:
  - docs/system-design/production-readiness.md
  - packages/observability/src/index.ts
parent_task_id: TASK-011
priority: medium
ordinal: 49000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want structured logs with trace IDs so incidents can be investigated across API and worker processes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 API and worker logs are JSON-structured in production mode
- [ ] #2 Logs include request ID, trace ID where available, safe actor context, and event type
- [ ] #3 Sensitive payload contents and secrets are not logged
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define structured log fields for API and worker processes.
2. Add JSON logging in production mode and safe context in development mode.
3. Include request ID, trace ID, actor context where safe, and event type.
4. Verify secrets and sensitive payload contents are not logged.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
