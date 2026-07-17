---
id: TASK-004.04
title: Deduplicate partner submissions
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
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want duplicate feeds ignored safely so repeated partner submissions do not double-count inventory.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Deduplication uses partner ID, source event ID where present, and payload hash
- [ ] #2 Duplicate valid submissions do not create duplicate movements
- [ ] #3 Conflicting duplicates are quarantined for review
<!-- AC:END -->
