---
id: TASK-003.05
title: Record inventory movements
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - inventory
  - R1
milestone: m-5
dependencies:
  - TASK-003.04
  - TASK-005.01
references:
  - docs/system-design/data-model.md
  - packages/domain/src/index.ts
  - docs/adr/0002-queue-outbox-before-kafka.md
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define movement commands for receipt, dispense, transfer, and correction.
2. Apply movement updates and stock-position changes in one transaction.
3. Publish outbox and audit events for accepted movements.
4. Add tests for corrections, negative-quantity prevention, and trace metadata.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
