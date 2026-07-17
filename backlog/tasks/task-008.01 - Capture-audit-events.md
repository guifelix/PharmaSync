---
id: TASK-008.01
title: Capture audit events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:40'
labels:
  - story
  - compliance
  - R1
milestone: m-1
dependencies:
  - TASK-005.01
  - TASK-002.03
references:
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
  - docs/system-design/security-and-compliance.md
  - packages/domain/src/index.ts
parent_task_id: TASK-008
priority: high
ordinal: 40000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Compliance Officer, I want critical actions captured as audit events so operational decisions are reviewable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Audit events are created for imports, accepted movements, corrections, quarantine actions, exports, and configuration changes
- [ ] #2 Audit events include actor or system source, trace metadata, before/after values when relevant, and timestamp
- [ ] #3 Audit events are append-only from the application perspective
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define audit event schema and append-only write path.
2. Emit audit events for imports, movements, corrections, quarantine actions, exports, and configuration changes.
3. Include actor/source, trace metadata, timestamps, and before/after values when relevant.
4. Add tests for audit creation and immutability constraints.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
