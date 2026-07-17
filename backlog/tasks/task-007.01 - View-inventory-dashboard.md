---
id: TASK-007.01
title: View inventory dashboard
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - frontend
  - R1
milestone: m-6
dependencies:
  - TASK-003.04
  - TASK-010.01
references:
  - apps/web/src/views/InventoryView.vue
  - packages/contracts/openapi/pharmasync.v1.yaml
  - docs/adr/0006-vue-vite-nuxt-ui-reka-ui.md
parent_task_id: TASK-007
priority: high
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want a dashboard of stock positions, expiration exposure, and shortage status so I can coordinate regional inventory decisions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Dashboard shows total products, active lots, at-risk lots, shortage count, and stale-feed indicators
- [ ] #2 Users can filter by organization, site, product, and expiration window
- [ ] #3 Inventory rows show product, lot, site, quantity, expiration date, and last update
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Review current Vue dashboard shell and inventory API contract.
2. Build inventory metrics, filters, table states, and error/loading states.
3. Connect to typed API client or mock data until backend is available.
4. Verify responsive layout and accessibility basics.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
