---
id: TASK-009.02
title: Generate synthetic pilot inventory
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - pilot-data
  - R1
milestone: m-4
dependencies:
  - TASK-003.01
  - TASK-003.02
  - TASK-003.03
  - TASK-003.04
  - TASK-009.01
references:
  - docs/solution-design.md
  - docs/system-design/data-model.md
parent_task_id: TASK-009
priority: high
ordinal: 44000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want synthetic inventory across a distributor, two facilities, and a program node so the pilot can demonstrate realistic flows.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Synthetic data includes multiple organizations, sites, products, lots, and expiration windows
- [ ] #2 Synthetic events do not contain patient-identifiable data
- [ ] #3 Dataset produces at least one shortage, one overstock, and one expiration-risk case
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define synthetic organizations, sites, products, lots, and expiration windows.
2. Generate non-PHI receipt, dispense, transfer, and correction events.
3. Ensure the dataset triggers shortage, overstock, and expiration-risk scenarios.
4. Document reset and seed workflow.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
