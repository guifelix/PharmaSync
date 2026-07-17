---
id: TASK-004.03
title: Map partner records to canonical events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - integration
  - R1
milestone: m-1
dependencies:
  - TASK-004.02
  - TASK-003.04
references:
  - docs/system-design/integration-contracts.md
  - packages/domain/src/index.ts
  - packages/integration/src/index.ts
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Map validated partner records to canonical inventory events.
2. Handle product, lot, site, movement type, quantity, and occurred-at fields.
3. Route mapping failures into quarantine with trace metadata.
4. Add mapping tests with representative CSV and JSON examples.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
