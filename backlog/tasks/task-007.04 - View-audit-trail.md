---
id: TASK-007.04
title: View audit trail
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - frontend
  - R2
milestone: m-2
dependencies:
  - TASK-008.01
  - TASK-010.01
references:
  - apps/web/src/views/AuditTrailView.vue
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
parent_task_id: TASK-007
priority: high
ordinal: 39000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Compliance Officer, I want an audit trail view so I can review inventory corrections, exports, quarantine actions, and configuration changes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Audit view returns authorized audit events
- [ ] #2 Audit events include actor, action, timestamp, organization, site where relevant, trace ID, and source
- [ ] #3 Filters support actor, action, date, organization, site, and trace ID
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define audit-event filters and table columns from the audit API contract.
2. Build audit trail view with actor, action, time, organization, site, trace ID, and source.
3. Enforce compliance/admin-only access behavior in the UI.
4. Verify filtering, pagination or limits, and empty/error states.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
