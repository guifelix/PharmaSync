---
id: TASK-004.03
title: Map partner records to canonical events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - integration
  - R1
dependencies: []
parent_task_id: TASK-004
priority: high
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want partner-specific records mapped into canonical inventory events so downstream services use a stable domain model.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Mapping supports product, lot, site, movement type, quantity delta, and occurred time
- [ ] #2 Mapping failures create quarantine records
- [ ] #3 Canonical events match the shared domain package types
<!-- AC:END -->
