---
id: TASK-010.02
title: Document partner feed formats
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - contracts
  - R1
milestone: m-5
dependencies:
  - TASK-010.01
references:
  - docs/system-design/integration-contracts.md
  - packages/integration/src/index.ts
parent_task_id: TASK-010
priority: high
ordinal: 47000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Partner Integration Engineer, I want feed format documentation and examples so I can submit valid pilot feeds.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 CSV required columns and JSON required fields are documented
- [ ] #2 Example valid and invalid payloads are included
- [ ] #3 Reason codes and idempotency behavior are documented
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Document CSV columns and JSON fields required by the integration gateway.
2. Add valid and invalid payload examples.
3. Document validation reason codes and idempotency behavior.
4. Cross-link docs to OpenAPI and integration architecture.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
