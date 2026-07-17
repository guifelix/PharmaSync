---
id: TASK-001.03
title: Provide API health checks
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - foundation
  - R0
dependencies: []
parent_task_id: TASK-001
priority: high
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want health checks for the API and dependencies so deployment and monitoring tools can detect failures.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Health response includes API status and database connectivity
- [ ] #2 Health response includes object-storage and worker/outbox status or heartbeat
- [ ] #3 Failed dependencies return a non-healthy status without exposing secrets
<!-- AC:END -->
