---
id: TASK-006.01
title: Generate expiration risk signals
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - signals
  - R2
milestone: m-2
dependencies:
  - TASK-003.04
  - TASK-005.02
references:
  - docs/solution-design.md
  - packages/domain/src/index.ts
  - architecture/processes/system/signals/expiry-risk-detection.bpmn.ts
  - architecture/processes/dmn/signals/expiry-windows.dmn.ts
parent_task_id: TASK-006
priority: high
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Pharmacy Operations User, I want expiration-risk signals for 30/60/90 day windows so expiring medication can be used, transferred, or reviewed before waste occurs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Rules evaluate lots by configurable expiration windows
- [ ] #2 Signals include severity, site, product, lot, reason, and created time
- [ ] #3 Dashboard displays expiration risk by site and product
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define configurable expiration windows and severity rules.
2. Evaluate stock lots and create expiration risk signals.
3. Close or supersede stale signals when conditions change.
4. Add tests for 30/60/90-day windows and dashboard response data.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
