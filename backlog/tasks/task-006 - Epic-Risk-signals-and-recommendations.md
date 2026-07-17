---
id: TASK-006
title: 'Epic: Risk signals and recommendations'
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:40'
labels:
  - epic
  - signals
milestone: m-2
dependencies: []
references:
  - docs/solution-design.md
  - packages/domain/src/index.ts
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Transparent rules for expiration, shortage, overstock, and replenishment signals.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All child stories for this epic are completed or explicitly deferred
- [ ] #2 Open risks and follow-up scope are captured in Backlog.md
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Implement expiration, shortage, and overstock signal rules before recommendation actions.
2. Validate rules against synthetic pilot data and dashboard needs.
3. Close the epic when signals are transparent, configurable, and auditable.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All child stories are Done
- [ ] #2 Milestone outcome is validated against the solution design
- [ ] #3 Relevant docs, ADRs, and Backlog references are current
<!-- DOD:END -->
