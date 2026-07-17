---
id: TASK-003.02
title: Manage sites and organizations
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:59'
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
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want organizations and sites modeled explicitly so stock positions can be tied to real pilot locations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Organizations represent distributors, facilities, and program nodes
- [x] #2 Sites belong to organizations
- [x] #3 Stock positions require a site
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Use Adonis/Lucid generators for organization and site models, migrations, seeders, controllers, and tests.
2. Model organization types for distributor, facility, and program-node tenants, and model sites as organization-owned locations.
3. Add demo seed data for pilot organizations and active sites.
4. Add authenticated site lookup scoped to the workforce organization and permitted sites.
5. Document the organization-site relationship and stock-position site requirement.
6. Run focused/full API tests and typechecks, finalize the task, and commit atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Used Adonis Ace generators for organization/site models, migrations, seeders, sites controller, and functional tests. Added organization types for distributor, facility, and program-node tenants. Added sites with organization_id foreign key, organization_key, stable site_key, site type, active status, and location fields.

Added demo organization/site reference data, seeders, and /api/v1/sites lookup scoped by authenticated organization and permitted site keys. Documented that stock positions must reference a site; full stock-position persistence remains in TASK-003.04.

Validation: pnpm --filter @pharmasync/api test -- --files tests/functional/sites.spec.ts (4 passed); pnpm --filter @pharmasync/api typecheck (passed); pnpm --filter @pharmasync/api exec node ace migration:run --dry-run --compact-output --no-schema-generate (generated expected organization/site SQL); pnpm --filter @pharmasync/api test (27 passed; health test logs expected missing pharmasync_test DB warning and returns degraded health); pnpm typecheck (15 tasks passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Modeled organizations and sites with Lucid migrations/models/seeders, added tenant-scoped active-site lookup, documented organization/site ownership and stock-position site requirements, and verified with focused site tests, migration dry run, full API tests, API typecheck, and root typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
