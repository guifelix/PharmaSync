---
id: TASK-004.03
title: Map partner records to canonical events
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - integration
  - R1
milestone: m-5
dependencies:
  - TASK-004.02
  - TASK-003.04
references:
  - docs/system-design/data-model.md
  - docs/adr/0005-modular-monolith-monorepo.md
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
- [ ] #4 Mapping examples exist for receipt, dispense, transfer, and correction movement types
- [ ] #5 Partner site_code maps to canonical site ID through an explicit partner-site mapping table or seed fixture
- [ ] #6 NDC maps to medication product ID and lot_number + expiration_date maps or creates the lot according to documented rules
- [ ] #7 Transfer mapping requires source and destination locations and produces linked movement events
- [ ] #8 Unmapped partner identifiers are quarantined rather than creating ambiguous canonical records
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add mapping examples for receipt, dispense, transfer, and correction in partner feed docs or test fixtures.
2. Implement partner-site and product/lot lookup rules before emitting canonical events.
3. Map accepted records into CanonicalInventoryEvent with idempotency key, trace ID, partner ID, and InventoryMovement payload.
4. Quarantine unknown product/site/lot conflicts with specific reason codes instead of creating ambiguous data.
5. Add table-driven mapping tests for each movement type and unmapped identifier case.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
