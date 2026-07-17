---
id: TASK-003.04
title: Maintain current stock positions
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - inventory
  - R1
milestone: m-4
dependencies:
  - TASK-003.01
  - TASK-003.02
  - TASK-003.03
  - TASK-002.03
references:
  - docs/adr/0001-phase-1-pilot-scope.md
parent_task_id: TASK-003
priority: high
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want current quantity on hand and reserved quantity by site, product, and lot so I can understand available stock.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Stock API returns permitted stock positions with site, product, lot, quantities, and update time
- [ ] #2 Filters support site, product, expiration window, and low-stock state
- [ ] #3 Quantities cannot become negative except through explicit correction workflow
- [ ] #4 Stock position identity is organization ID + site ID + product ID + lot ID, with reserved quantity tracked separately from quantity on hand
- [ ] #5 Available quantity is calculated as quantity on hand minus reserved quantity and is never returned as negative
- [ ] #6 Transfers are represented as paired decrement/increment movements linked by a transfer correlation ID
- [ ] #7 Reservations cannot exceed quantity on hand unless an explicit approved exception is added in a later ADR-backed task
- [ ] #8 Stock API includes stale-data metadata when last update exceeds the configured freshness threshold
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define stock-position identity and invariants in the domain package before persistence changes.
2. Add migration/model/API response fields for quantity on hand, reserved quantity, available quantity, and last-updated/staleness metadata.
3. Implement filters for site, product, expiration window, low-stock state, and stale-data state.
4. Enforce non-negative available quantity, reservation limits, and tenant scoping in the write/read paths.
5. Add tests for filter combinations, transfer-linked positions, stale metadata, authorization, and quantity invariants.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
