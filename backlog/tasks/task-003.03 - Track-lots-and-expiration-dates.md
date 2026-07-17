---
id: TASK-003.03
title: Track lots and expiration dates
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 04:02'
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
- [x] #1 Lots belong to medication products
- [x] #2 Lot number and expiration date are required for lot-tracked products
- [x] #3 Expired and near-expiry lots are visible in inventory responses
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Use Adonis/Lucid generators for lot model, migration, seeder, and tests.
2. Model lots as medication-product-owned records with required lot number and expiration date.
3. Add reusable expiration status logic for expired, near-expiry, and ok lots.
4. Surface lot number, expiration date, and expiration status in inventory stock responses.
5. Update OpenAPI/data-model docs and add tests for lot ownership, required fields, and expiration status.
6. Run focused/full API tests and typechecks, finalize the task, and commit atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Used Adonis Ace generators for medication lot model, migration, seeder, and functional test. Added medication_lots persistence with medication_product_id foreign key, required lot_number and expiration_date, unique product/lot constraint, and expiration_date index.

Added expiration status logic with 90-day near-expiry window, lot-tracking requirement checks, demo lot seed data, and surfaced lotNumber, expirationDate, and expirationStatus in inventory stock responses. Updated OpenAPI stock-position schema and data-model docs.

Validation: pnpm --filter @pharmasync/api test -- --files tests/functional/medication_lots.spec.ts (3 passed); pnpm --filter @pharmasync/api typecheck (passed); pnpm --filter @pharmasync/api exec node ace migration:run --dry-run --compact-output --no-schema-generate (generated expected medication_lots SQL); pnpm --filter @pharmasync/api test (30 passed; health test logs expected missing pharmasync_test DB warning and returns degraded health); pnpm typecheck (15 tasks passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Modeled medication lots with required lot number and expiration date, added expiration-status behavior, exposed lot metadata in inventory responses, updated docs/OpenAPI, and verified with focused lot tests, migration dry run, full API tests, API typecheck, and root typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
