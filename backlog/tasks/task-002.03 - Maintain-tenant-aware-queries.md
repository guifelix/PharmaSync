---
id: TASK-002.03
title: Maintain tenant-aware queries
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:53'
labels:
  - story
  - security
  - R1
milestone: m-4
dependencies:
  - TASK-002.02
references:
  - docs/system-design/security-and-compliance.md
  - docs/system-design/data-model.md
parent_task_id: TASK-002
priority: high
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want every data query scoped to a tenant boundary so pilot organizations cannot see each other's data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Core records include organization ownership where required
- [x] #2 Inventory, signal, quarantine, and audit queries require organization scope
- [x] #3 Tests prove cross-organization records are not returned
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define tenant-owned record shapes and query helpers that require the authenticated workforce context.
2. Apply the helper to inventory, signal, quarantine, and audit query controllers using pilot fixtures with organization and site ownership.
3. Add tests proving cross-organization records and non-permitted-site records are not returned.
4. Update data-model/security docs to make organization ownership and site scoping explicit for tenant-owned records.
5. Run focused/full API tests and typechecks, finalize the task, and commit atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented reusable tenant-scope query helpers requiring authenticated organization ID and permitted site IDs. Applied them to current inventory, signal, quarantine, and audit query controllers using pilot tenant-owned records that include organization and site ownership. Updated data-model/security docs with tenant-owned query rules for later Lucid repositories.

Validation: pnpm --filter @pharmasync/api test -- --files tests/functional/tenant_scope.spec.ts (5 passed); pnpm --filter @pharmasync/api typecheck (passed); pnpm --filter @pharmasync/api test (20 passed; health test logs expected missing pharmasync_test DB warning and returns degraded health); pnpm typecheck (15 tasks passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented tenant-aware query scoping for the current protected query surfaces, documented organization/site ownership rules, and added cross-organization/site isolation tests. Verified with focused tenant tests, full API tests, API typecheck, and root typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
