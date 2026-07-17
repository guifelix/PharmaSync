---
id: TASK-002.02
title: Enforce role-based access
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
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
- [ ] #1 Roles exist for operations, compliance, integration, and platform administration
- [ ] #2 Inventory, audit, evidence, and remediation endpoints enforce role permissions
- [ ] #3 Authorization failures are audited
- [ ] #4 Permission matrix is documented for operations, compliance, integration, and platform-admin roles before endpoint enforcement is implemented
- [ ] #5 Operations role can read inventory and signals but cannot export evidence or reprocess quarantined feeds
- [ ] #6 Compliance role can read audit events and generate evidence packages but cannot change integration mappings
- [ ] #7 Integration role can read integration health, inspect quarantine records, and reprocess permitted payloads
- [ ] #8 Platform-admin role can manage configuration and cross-site access, with every privileged action audited
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add a concise role-permission matrix to implementation notes or a referenced docs file before coding endpoint checks.
2. Implement authorization as reusable Adonis middleware/policies rather than scattered inline conditionals.
3. Enforce the matrix on inventory, signals, quarantine, audit, evidence, and configuration routes.
4. Emit audit events for denied privileged actions and cross-site/cross-org attempts.
5. Add tests for each role covering allowed, denied, and tenant-mismatched access.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
