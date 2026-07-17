---
id: TASK-003.01
title: Define medication product reference data
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:56'
labels:
  - story
  - inventory
  - R1
milestone: m-4
dependencies:
  - TASK-001.03
references:
  - docs/system-design/data-model.md
  - packages/domain/src/index.ts
parent_task_id: TASK-003
priority: high
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want medication products represented consistently so partner feeds can map to a shared inventory view.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Medication products include NDC and descriptive product fields
- [x] #2 Public reference seed data can be loaded for demo usage
- [x] #3 Product lookup supports NDC and name search
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Use Adonis/Lucid generators for the medication product model, migration, seeder, controller, and tests.
2. Define medication product fields for NDC and descriptive reference data, including duplicate protection.
3. Add representative public/demo seed data for local pilot usage.
4. Implement product lookup by normalized NDC and name search behind an authenticated inventory-read route.
5. Update OpenAPI/data-model docs and add tests for lookup and duplicate handling.
6. Run focused/full API tests and typechecks, finalize the task, and commit atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Used Adonis Ace generators for model, migration, seeder, controller, and functional test before editing generated files. Added medication product persistence fields for NDC, normalized NDC, names, dosage form, route, labeler, product type, marketing category, active ingredient, strength, and source. Added unique normalized NDC and searchable indexes.

Added demo public-reference seed data through MedicationProduct.updateOrCreateMany and shared NDC normalization/deduplication/search helpers used by tests and seed data. Added authenticated /api/v1/medication-products lookup route protected by inventory:read and documented the OpenAPI response.

Validation: pnpm --filter @pharmasync/api test -- --files tests/functional/medication_products.spec.ts (3 passed); pnpm --filter @pharmasync/api typecheck (passed); pnpm --filter @pharmasync/api exec node ace migration:run --dry-run --compact-output --no-schema-generate (generated expected medication_products SQL); pnpm --filter @pharmasync/api test (23 passed; health test logs expected missing pharmasync_test DB warning and returns degraded health); pnpm typecheck (15 tasks passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Defined medication product reference data with Lucid migration/model/seeder, demo public seed records, NDC normalization/deduplication/search behavior, an authenticated lookup endpoint, OpenAPI updates, and focused tests. Verified with medication tests, migration dry run, full API tests, API typecheck, and root typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
