---
id: TASK-003.03
title: Track lots and expiration dates
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
references:
  - docs/system-design/data-model.md
  - packages/domain/src/index.ts
parent_task_id: TASK-003
priority: high
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Pharmacy Operations User, I want inventory tracked by lot and expiration date so I can identify items that need action before they expire.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Lots belong to medication products
- [ ] #2 Lot number and expiration date are required for lot-tracked products
- [ ] #3 Expired and near-expiry lots are visible in inventory responses
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Model lots against medication products with expiration dates.
2. Enforce lot number and expiration requirements for lot-tracked stock.
3. Expose expired and near-expiry lot metadata in inventory responses.
4. Add persistence and validation tests.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
