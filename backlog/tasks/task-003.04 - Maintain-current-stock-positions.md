---
id: TASK-003.04
title: Maintain current stock positions
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - inventory
  - R1
milestone: m-1
dependencies:
  - TASK-003.01
  - TASK-003.02
  - TASK-003.03
  - TASK-002.03
references:
  - docs/system-design/data-model.md
  - packages/domain/src/index.ts
  - packages/contracts/openapi/pharmasync.v1.yaml
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
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define stock-position table/model keyed by organization, site, product, and lot.
2. Implement stock query filters and response shape.
3. Enforce quantity invariants and tenant scoping.
4. Add API tests for filters, empty states, and authorization.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
