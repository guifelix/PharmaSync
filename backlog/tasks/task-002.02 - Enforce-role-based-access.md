---
id: TASK-002.02
title: Enforce role-based access
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:51'
labels:
  - story
  - security
  - R1
milestone: m-4
dependencies:
  - TASK-002.01
references:
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
  - docs/system-design/integration-contracts.md
parent_task_id: TASK-002
priority: high
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Compliance Officer, I want access controlled by organization, site, and role so users only see permitted inventory and audit data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Roles exist for operations, compliance, integration, and platform administration
- [x] #2 Inventory, audit, evidence, and remediation endpoints enforce role permissions
- [x] #3 Authorization failures are audited
- [x] #4 Permission matrix is documented for operations, compliance, integration, and platform-admin roles before endpoint enforcement is implemented
- [x] #5 Operations role can read inventory and signals but cannot export evidence or reprocess quarantined feeds
- [x] #6 Compliance role can read audit events and generate evidence packages but cannot change integration mappings
- [x] #7 Integration role can read integration health, inspect quarantine records, and reprocess permitted payloads
- [x] #8 Platform-admin role can manage configuration and cross-site access, with every privileged action audited
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Document the Phase 1 role-permission matrix before endpoint enforcement.
2. Add shared role/permission definitions and configurable Adonis named middleware using the existing workforce auth context.
3. Protect inventory, signals, quarantine, audit, evidence, integration-health, and configuration route stubs according to the matrix.
4. Emit structured audit logs for denied authorization attempts with user, organization, roles, permission, resource, and trace ID.
5. Update OpenAPI/security docs and add tests for allowed and denied operations across operations, compliance, integration, and platform-admin roles.
6. Run focused/full API tests and typechecks, finalize the task, and commit atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented Phase 1 RBAC using existing Adonis named middleware instead of adding @adonisjs/bouncer. Rationale: checked Adonis authorization and middleware docs; Bouncer is the canonical policy/ability package, but it is not installed and is most useful once authorization depends on real Lucid resources. This slice is route-level role gating over the existing workforce auth context, and Adonis named middleware is an official route-authorization pattern. Revisit Bouncer when resource-level policies appear in inventory/audit models.

Added docs/system-design/permissions-matrix.md before endpoint enforcement. Added shared permissions, requirePermission middleware, structured authorization_denied audit logs, protected endpoint stubs for inventory, signals, quarantine reprocessing, integration health/mappings, audit events, evidence packages, and access configuration, plus OpenAPI/security docs updates.

Validation: pnpm --filter @pharmasync/api test -- --files tests/functional/role_based_access.spec.ts (7 passed); pnpm --filter @pharmasync/api typecheck (passed); pnpm --filter @pharmasync/api test (15 passed; health test logs expected missing pharmasync_test DB warning and returns degraded health); pnpm typecheck (15 tasks passed).

Final adjustment: allowed privileged actions now emit privileged_authorization_granted logs for configuration and integration-mapping changes, in addition to authorization_denied logs for failed checks. Revalidated with focused RBAC tests, full API tests, API typecheck, and root typecheck after this change.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented Phase 1 role-based access with a documented permission matrix, reusable Adonis named middleware, protected API route stubs, structured authorization-denied audit logs, OpenAPI/security documentation updates, and role coverage tests. Verified with focused RBAC tests, full API tests, API typecheck, and root typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
