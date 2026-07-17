---
id: TASK-008.01
title: Capture audit events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - compliance
  - R1
dependencies: []
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
