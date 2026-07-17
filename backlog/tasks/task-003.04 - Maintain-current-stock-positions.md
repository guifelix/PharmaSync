---
id: TASK-003.04
title: Maintain current stock positions
status: Done
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 05:00'
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
- [x] #1 Stock API returns permitted stock positions with site, product, lot, quantities, and update time
- [x] #2 Filters support site, product, expiration window, and low-stock state
- [x] #3 Quantities cannot become negative except through explicit correction workflow
- [x] #4 Stock position identity is organization ID + site ID + product ID + lot ID, with reserved quantity tracked separately from quantity on hand
- [x] #5 Available quantity is calculated as quantity on hand minus reserved quantity and is never returned as negative
- [x] #6 Transfers are represented as paired decrement/increment movements linked by a transfer correlation ID
- [x] #7 Reservations cannot exceed quantity on hand unless an explicit approved exception is added in a later ADR-backed task
- [x] #8 Stock API includes stale-data metadata when last update exceeds the configured freshness threshold
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace the hardcoded stock payload with a stock-position reference service that models organization/site/product/lot identity, quantities, transfer correlation IDs, and staleness metadata.
2. Wire the inventory stock controller to the reference service and add filters for site, product, expiration window, low-stock, and stale-data state.
3. Add focused unit/functional tests for available quantity, reservation limits, tenant scoping, and the stock API response shape.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added a stock-position reference service, controller filters, helper tests, and a paired transfer-movement helper. Filled the stock-position migration, model schema, and seeder scaffold to match the same inventory shape.
Validation: pnpm --filter @pharmasync/api typecheck
Validation: pnpm --filter @pharmasync/api test
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the stock-position slice end to end: the inventory stock endpoint now returns tenant-scoped stock positions with site, product, lot, quantity, availability, freshness, and transfer-correlation metadata; filters now cover site, product, expiration window, low-stock, and stale-data views; and the stock-position migration, schema, seeder, and tests are aligned to the same model. Verified with pnpm --filter @pharmasync/api typecheck and pnpm --filter @pharmasync/api test. Committed as 900b9f7 (feat(api): implement stock position reference slice).
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
