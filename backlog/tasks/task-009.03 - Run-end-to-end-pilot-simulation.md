---
id: TASK-009.03
title: Run end-to-end pilot simulation
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - pilot-data
  - R3
milestone: m-3
dependencies:
  - TASK-004.04
  - TASK-006.01
  - TASK-006.02
  - TASK-006.03
  - TASK-008.03
  - TASK-007.01
  - TASK-007.02
  - TASK-007.03
references:
  - docs/system-design/integration-contracts.md
  - docs/adr/0001-phase-1-pilot-scope.md
parent_task_id: TASK-009
priority: high
ordinal: 45000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want a repeatable pilot simulation so PharmaSync can demonstrate ingestion, inventory updates, signals, and evidence in one flow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Simulation submits feeds for distributor, facility, and program-node scenarios
- [ ] #2 Inventory changes appear in the dashboard within five minutes
- [ ] #3 Signals, quarantine records, and evidence package generation are demonstrated
- [ ] #4 Simulation fixture defines exactly one distributor, two facilities, and one government program node with stable organization/site codes
- [ ] #5 Scenario includes at least one valid receipt feed, one dispense feed, one transfer feed, one duplicate feed, and one intentionally invalid feed
- [ ] #6 Expected outputs include stock counts, one expiration signal, one shortage signal, one overstock signal, one quarantine record, and one evidence package
- [ ] #7 Simulation records start/end timestamps and reports whether inventory freshness stayed under five minutes
- [ ] #8 Demo runbook includes reset, seed, run, verify, and troubleshoot steps
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define the simulation fixture with stable organizations, sites, products, lots, and partner feed files.
2. Implement reset and seed commands so every run starts from a known state.
3. Submit valid, duplicate, transfer, dispense, and invalid feeds through the public feed endpoint.
4. Verify expected stock counts, signals, quarantine records, audit events, and evidence package output.
5. Write a demo runbook with timing, expected results, and troubleshooting steps.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
