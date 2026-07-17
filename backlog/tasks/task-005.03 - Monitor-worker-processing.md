---
id: TASK-005.03
title: Monitor worker processing
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - eventing
  - R3
dependencies: []
parent_task_id: TASK-005
priority: medium
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want worker processing metrics so I can detect stale inventory pipelines before users lose trust.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Metrics include pending outbox count, oldest pending age, failed attempts, and processed count
- [ ] #2 Logs include trace ID and event type
- [ ] #3 Health check reports unhealthy when pending age exceeds configured threshold
<!-- AC:END -->
