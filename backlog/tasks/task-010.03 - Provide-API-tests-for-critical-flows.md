---
id: TASK-010.03
title: Provide API tests for critical flows
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - testing
  - R2
dependencies: []
parent_task_id: TASK-010
priority: medium
ordinal: 48000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want automated tests for critical flows so regressions are caught before a pilot demo.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Tests cover health, auth rejection, feed acceptance, quarantine, stock query, signal query, and audit event query
- [ ] #2 Tests run from the monorepo root
- [ ] #3 Tests can run against isolated local test data
<!-- AC:END -->
