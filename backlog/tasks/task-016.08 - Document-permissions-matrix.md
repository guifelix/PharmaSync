---
id: TASK-016.08
title: Document permissions matrix
status: To Do
assignee: []
created_date: '2026-07-17 02:54'
labels:
  - security
  - rbac
  - engineering-system
  - R0b
milestone: m-7
dependencies:
  - TASK-002.02
  - TASK-002.03
references:
  - docs/system-design/security-and-compliance.md
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
parent_task_id: TASK-016
priority: high
ordinal: 63000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As an implementation agent, I want an explicit permissions matrix so authz behavior is consistent across API, UI, audit, and evidence workflows.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Matrix lists operations, compliance, integration, and platform-admin roles
- [ ] #2 Matrix covers inventory, signals, feeds, quarantine, reprocessing, audit events, evidence packages, configuration, and cross-site/cross-org access
- [ ] #3 Matrix distinguishes read, create, update, approve, export, and admin actions
- [ ] #4 Matrix states which authorization failures must emit audit events
- [ ] #5 Matrix is referenced by RBAC implementation tasks
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create docs/permissions-matrix.md with roles, resources, actions, scopes, and audit expectations.
2. Include site/org scoping and cross-tenant admin constraints.
3. Cross-link from security-and-compliance.md and TASK-002.02/TASK-002.03.
4. Add test-case guidance derived from the matrix.
5. Keep wording product-focused and avoid compliance certification claims.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant validation commands are run and recorded in implementation notes
- [ ] #3 Created or updated docs are linked from the relevant README or system-design index
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
