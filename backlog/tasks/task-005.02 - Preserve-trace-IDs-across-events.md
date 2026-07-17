---
id: TASK-005.02
title: Preserve trace IDs across events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - eventing
  - R1
dependencies: []
parent_task_id: TASK-005
priority: high
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Compliance Officer, I want trace IDs preserved across ingestion, inventory updates, signals, and evidence so an event can be audited end to end.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Every partner feed receives or propagates a trace ID
- [ ] #2 Inventory movements, risk signals, quarantine records, and audit events reference trace metadata
- [ ] #3 Dashboard views expose trace IDs for investigation
<!-- AC:END -->
