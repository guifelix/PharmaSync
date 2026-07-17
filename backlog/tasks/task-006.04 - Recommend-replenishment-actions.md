---
id: TASK-006.04
title: Recommend replenishment actions
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
  - TASK-006.01
  - TASK-006.02
  - TASK-006.03
  - TASK-008.01
references:
  - docs/solution-design.md
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
parent_task_id: TASK-006
priority: medium
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Pharmacy Operations User, I want transparent replenishment recommendations so I understand why action is suggested.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Recommendations show rule, input quantities, threshold, and suggested action
- [ ] #2 Recommendations can be accepted, dismissed, or exported for review
- [ ] #3 User decisions create audit events
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define recommendation response shape with rule inputs and suggested action.
2. Generate recommendations from active risk signals and thresholds.
3. Allow accept, dismiss, or export decisions with audit events.
4. Add tests that recommendations remain transparent and non-autonomous.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
