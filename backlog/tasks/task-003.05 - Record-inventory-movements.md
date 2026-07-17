---
id: TASK-003.05
title: Record inventory movements
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - inventory
  - R1
dependencies: []
parent_task_id: TASK-003
priority: high
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want receipts, dispenses, transfers, and corrections recorded as movements so stock changes are traceable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Movement types include receipt, dispense, transfer, and correction
- [ ] #2 Accepted movements update stock positions transactionally
- [ ] #3 Corrections require actor, reason, before quantity, and after quantity
- [ ] #4 Every accepted movement publishes an outbox event
<!-- AC:END -->
