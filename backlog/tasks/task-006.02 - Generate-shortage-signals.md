---
id: TASK-006.02
title: Generate shortage signals
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
  - architecture/processes/system/signals/shortage-detection.bpmn.ts
  - architecture/processes/dmn/signals/shortage-threshold.dmn.ts
parent_task_id: TASK-006
priority: high
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want low-stock and shortage signals so I can prioritize replenishment actions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Thresholds can be configured by site and product
- [ ] #2 Signals are generated when available quantity falls below threshold
- [ ] #3 Duplicate active shortage signals are not created for the same site/product condition
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define low-stock threshold configuration by site and product.
2. Evaluate available quantity and generate shortage signals.
3. Prevent duplicate active shortage signals for the same condition.
4. Add tests for threshold crossing, recovery, and severity.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
