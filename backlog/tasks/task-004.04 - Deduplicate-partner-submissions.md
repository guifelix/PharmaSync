---
id: TASK-004.04
title: Deduplicate partner submissions
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
  - TASK-004.03
references:
  - docs/system-design/integration-contracts.md
  - docs/adr/0003-integration-gateway-boundary.md
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define idempotency keys from partner ID, source event ID, and payload hash.
2. Persist processed keys and detect duplicate submissions.
3. Ignore safe duplicates and quarantine conflicting duplicates.
4. Add tests proving duplicates do not double-count stock.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
