---
id: TASK-007.02
title: View risk signals
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - frontend
  - R2
milestone: m-2
dependencies:
  - TASK-006.01
  - TASK-006.02
  - TASK-006.03
  - TASK-010.01
references:
  - apps/web/src/views/SignalsView.vue
  - packages/contracts/openapi/pharmasync.v1.yaml
parent_task_id: TASK-007
priority: high
ordinal: 37000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Pharmacy Operations User, I want a signal view that separates shortage, overstock, and expiration alerts so I can focus on the most urgent action.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Signal view is driven by the signals API
- [ ] #2 Signals can be filtered by type, severity, site, product, and status
- [ ] #3 Selecting a signal shows supporting inventory and rule details
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define signal list and detail UI from the signal API contract.
2. Add filters for type, severity, site, product, and status.
3. Display supporting inventory and rule details for selected signals.
4. Verify accessible status colors and keyboard navigation.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
