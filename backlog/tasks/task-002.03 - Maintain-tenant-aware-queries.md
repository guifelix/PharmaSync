---
id: TASK-002.03
title: Maintain tenant-aware queries
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - security
  - R1
dependencies: []
parent_task_id: TASK-002
priority: high
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want every data query scoped to a tenant boundary so pilot organizations cannot see each other's data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Core records include organization ownership where required
- [ ] #2 Inventory, signal, quarantine, and audit queries require organization scope
- [ ] #3 Tests prove cross-organization records are not returned
<!-- AC:END -->
