---
id: TASK-010.01
title: Expand OpenAPI contract
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:40'
labels:
  - story
  - contracts
  - R1
milestone: m-1
dependencies:
  - TASK-001.03
references:
  - packages/contracts/openapi/pharmasync.v1.yaml
  - docs/system-design/integration-contracts.md
  - docs/system-design/data-model.md
parent_task_id: TASK-010
priority: high
ordinal: 46000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As an integration developer, I want accurate OpenAPI contracts so frontend and partner clients can implement against stable APIs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 OpenAPI schemas exist for health, feed submission, stock positions, signals, quarantine records, and audit events
- [ ] #2 Error response schemas include trace ID and reason codes
- [ ] #3 Contract examples cover successful, duplicate, invalid, and unauthorized cases
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Expand OpenAPI schemas for health, feeds, stock, signals, quarantine, and audit events.
2. Add shared error responses with trace IDs and reason codes.
3. Add examples for success, duplicate, invalid, and unauthorized cases.
4. Validate the contract and update dependent docs.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
