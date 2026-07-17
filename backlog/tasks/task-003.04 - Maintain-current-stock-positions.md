---
id: TASK-003.04
title: Maintain current stock positions
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - inventory
  - R1
dependencies: []
parent_task_id: TASK-003
priority: high
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Distribution Operations Manager, I want current quantity on hand and reserved quantity by site, product, and lot so I can understand available stock.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Stock API returns permitted stock positions with site, product, lot, quantities, and update time
- [ ] #2 Filters support site, product, expiration window, and low-stock state
- [ ] #3 Quantities cannot become negative except through explicit correction workflow
<!-- AC:END -->
