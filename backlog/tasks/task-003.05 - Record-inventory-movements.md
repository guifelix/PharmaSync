---
id: TASK-003.05
title: Record inventory movements
status: Done
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 05:08'
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
- [x] #1 Movement types include receipt, dispense, transfer, and correction
- [x] #2 Accepted movements update stock positions transactionally
- [x] #3 Corrections require actor, reason, before quantity, and after quantity
- [x] #4 Every accepted movement publishes an outbox event
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add inventory movement application helpers in packages/domain for receipt, dispense, transfer, and correction.
2. Wire the API reference layer to those helpers so stock changes and outbox events are produced from one transaction-shaped operation.
3. Add unit and functional tests covering movement validation, correction requirements, transaction updates, and outbox event metadata.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented inventory movement commands and outbox envelopes in packages/domain/src/index.ts, then added API reference helpers for receipt, dispense, correction, and paired transfer handling. Verified the movement layer with dedicated unit tests and kept the data model in sync with correction/outbox rules.
Validation: pnpm --filter @pharmasync/api typecheck
Validation: pnpm --filter @pharmasync/api test
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the inventory movement slice end to end: the shared domain now defines receipt, dispense, transfer, and correction movement commands plus outbox envelopes; the API reference layer records receipts, dispenses, corrections, and paired transfers with stock-position updates and outbox metadata; and the data model now reflects transactional movement handling and correction requirements. Verified with pnpm --filter @pharmasync/api typecheck and pnpm --filter @pharmasync/api test. Committed as 65def51 (feat(domain): record inventory movements).
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
