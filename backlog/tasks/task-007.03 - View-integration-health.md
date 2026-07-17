---
id: TASK-007.03
title: View integration health
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - frontend
  - R2
milestone: m-2
dependencies:
  - TASK-004.01
  - TASK-004.02
  - TASK-010.01
references:
  - apps/web/src/views/IntegrationHealthView.vue
  - docs/system-design/integration-contracts.md
parent_task_id: TASK-007
priority: high
ordinal: 38000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Partner Integration Engineer, I want integration health views so I can see feed success rates, failures, and freshness by partner.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Dashboard shows last feed time, accepted count, quarantined count, duplicate count, and failure rate by partner
- [ ] #2 Freshness warnings appear when a partner has not submitted within the expected interval
- [ ] #3 Selecting a partner shows recent feed attempts and trace IDs
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define integration-health summary and partner detail data needs.
2. Build partner cards/table for freshness, accepted, duplicate, quarantined, and failure-rate metrics.
3. Link partner details to feed attempts and trace IDs.
4. Verify empty, stale, degraded, and healthy states.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
