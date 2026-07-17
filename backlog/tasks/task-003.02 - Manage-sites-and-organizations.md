---
id: TASK-003.02
title: Manage sites and organizations
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - inventory
  - R1
milestone: m-1
dependencies:
  - TASK-001.03
references:
  - docs/system-design/data-model.md
  - packages/domain/src/index.ts
parent_task_id: TASK-003
priority: high
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want organizations and sites modeled explicitly so stock positions can be tied to real pilot locations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Organizations represent distributors, facilities, and program nodes
- [ ] #2 Sites belong to organizations
- [ ] #3 Stock positions require a site
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Model organizations and sites for distributor, facility, and program-node tenants.
2. Add persistence and API/query support for active sites.
3. Require site references where stock is stored.
4. Add tests for organization-site relationships.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
