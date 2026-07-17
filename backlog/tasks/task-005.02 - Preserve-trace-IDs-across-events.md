---
id: TASK-005.02
title: Preserve trace IDs across events
status: Done
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 05:51'
labels:
  - story
  - eventing
  - R1
milestone: m-6
dependencies:
  - TASK-004.01
  - TASK-005.01
  - TASK-008.01
references:
  - docs/solution-design.md
  - docs/system-design/integration-contracts.md
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
parent_task_id: TASK-005
priority: high
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Compliance Officer, I want trace IDs preserved across ingestion, inventory updates, signals, and evidence so an event can be audited end to end.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Every partner feed receives or propagates a trace ID
- [x] #2 Inventory movements, risk signals, quarantine records, and audit events reference trace metadata
- [x] #3 Dashboard views expose trace IDs for investigation
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add traceId-bearing records to the pilot risk, quarantine, and audit list responses, and keep existing meta trace context intact.
2. Update the API contract and functional tests so trace metadata is part of the documented response shape.
3. Refresh the Vue dashboard views to render trace IDs in the visible inventory, signals, integration, and audit surfaces.
4. Run targeted API/web checks and record the validation results in the task notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented the partner feed ingress boundary with trace ID propagation, raw payload archiving, and contract coverage for JSON and CSV feed submission. Updated inventory, signals, quarantine, and audit surfaces to expose trace IDs in both API responses and Vue dashboards. Validation: pnpm --filter @pharmasync/api test; pnpm --filter @pharmasync/api typecheck; pnpm --filter @pharmasync/web typecheck.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added trace ID propagation across feed ingress, inventory/signals/quarantine/audit responses, and the Vue investigation views. Also documented the feed ingress contract in OpenAPI and verified the API/web test and typecheck suites passed.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
