---
id: TASK-005.02
title: Preserve trace IDs across events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
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
- [ ] #1 Every partner feed receives or propagates a trace ID
- [ ] #2 Inventory movements, risk signals, quarantine records, and audit events reference trace metadata
- [ ] #3 Dashboard views expose trace IDs for investigation
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Standardize trace metadata across feed, event, movement, signal, quarantine, and audit records.
2. Propagate trace IDs through integration, inventory, worker, signal, and compliance paths.
3. Expose trace IDs in relevant API and dashboard responses.
4. Add an end-to-end traceability test or simulation.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
