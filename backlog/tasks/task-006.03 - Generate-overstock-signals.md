---
id: TASK-006.03
title: Generate overstock signals
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
parent_task_id: TASK-006
priority: medium
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want overstock signals so excess medication can be redistributed before it becomes waste.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Overstock thresholds can be configured by site and product
- [ ] #2 Signals identify quantity above target threshold
- [ ] #3 Overstock calculations exclude expired or quarantined stock
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define overstock thresholds and exclusion rules.
2. Evaluate excess stock while excluding expired or quarantined stock.
3. Generate overstock signals with review or transfer recommendations.
4. Add tests for normal, excess, and excluded-stock cases.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
