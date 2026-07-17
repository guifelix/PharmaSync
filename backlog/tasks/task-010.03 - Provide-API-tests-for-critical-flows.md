---
id: TASK-010.03
title: Provide API tests for critical flows
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:40'
labels:
  - story
  - testing
  - R2
milestone: m-2
dependencies:
  - TASK-004.05
  - TASK-007.04
  - TASK-008.03
references:
  - packages/contracts/openapi/pharmasync.v1.yaml
  - apps/api/tests/bootstrap.ts
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Identify critical API flows and required test fixtures.
2. Add tests for health, auth rejection, feed acceptance, quarantine, stock, signals, and audit queries.
3. Ensure tests run from the monorepo root with isolated data.
4. Document local service requirements for running the suite.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
