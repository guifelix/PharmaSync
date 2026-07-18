---
id: TASK-004.03
title: Map partner records to canonical events
status: In Progress
assignee:
  - '@felix'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-18 18:19'
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
- [x] #1 Mapping supports product, lot, site, movement type, quantity delta, and occurred time
- [x] #2 Mapping failures create quarantine records
- [x] #3 Canonical events match the shared domain package types
- [x] #4 Mapping examples exist for receipt, dispense, transfer, and correction movement types
- [x] #5 Partner site_code maps to canonical site ID through an explicit partner-site mapping table or seed fixture
- [x] #6 NDC maps to medication product ID and lot_number + expiration_date maps or creates the lot according to documented rules
- [x] #7 Transfer mapping requires source and destination locations and produces linked movement events
- [x] #8 Unmapped partner identifiers are quarantined rather than creating ambiguous canonical records
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add mapping examples for receipt, dispense, transfer, and correction in partner feed docs or test fixtures.
2. Implement partner-site and product/lot lookup rules before emitting canonical events.
3. Map accepted records into CanonicalInventoryEvent with idempotency key, trace ID, partner ID, and InventoryMovement payload.
4. Quarantine unknown product/site/lot conflicts with specific reason codes instead of creating ambiguous data.
5. Add table-driven mapping tests for each movement type and unmapped identifier case.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented partner_feed_mapping.ts with mapAcceptedMovements() function handling receipt, dispense, correction, and transfer types. Added NDJSON canonical event storage (append/load/clear). Wired mapping into PartnerFeedsController after validation. Added productId to MedicationProductReference type and all 3 demo products. Added findProductByNormalizedNdc() lookup. Added 4 new functional tests verifying receipt, dispense, transfer (2 events), and unknown destination quarantine. Typecheck: ✅. Tests: 55/55 pass.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented partner feed canonical mapping: added productId to medication_product_reference.ts, created partner_feed_mapping.ts (pure mapping + NDJSON storage), wired into controller. Mapping handles receipt/dispense/correction (1 canonical event) and transfer (2 events or quarantine for unknown destination). Verified with 55/55 passing tests and clean typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
