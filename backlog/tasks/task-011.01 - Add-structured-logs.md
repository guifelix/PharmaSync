---
id: TASK-011.01
title: Add structured logs
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - operations
  - R3
dependencies: []
parent_task_id: TASK-011
priority: medium
ordinal: 49000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want structured logs with trace IDs so incidents can be investigated across API and worker processes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 API and worker logs are JSON-structured in production mode
- [ ] #2 Logs include request ID, trace ID where available, safe actor context, and event type
- [ ] #3 Sensitive payload contents and secrets are not logged
<!-- AC:END -->
