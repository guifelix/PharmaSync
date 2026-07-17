---
id: TASK-004.01
title: Submit partner feed
status: Done
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 05:53'
labels:
  - story
  - integration
  - R1
milestone: m-5
dependencies:
  - TASK-001.03
  - TASK-010.01
references:
  - docs/adr/0003-integration-gateway-boundary.md
parent_task_id: TASK-004
priority: high
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Partner Integration Engineer, I want to submit a partner inventory feed so external system data enters PharmaSync through a controlled boundary.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Feed submission accepts CSV and JSON payloads
- [x] #2 Accepted submissions return HTTP 202 with a trace ID
- [x] #3 Raw payloads are archived before processing
- [x] #4 CSV feed contract includes partner_id, source_event_id, event_type, site_code, ndc, lot_number, expiration_date, quantity_delta, occurred_at, and optional source_location/destination_location
- [x] #5 JSON feed contract accepts a batch envelope with partner_id, feed_id, submitted_at, and movements array using the same canonical field names
- [x] #6 Feed submission calculates and stores payload hash before validation
- [x] #7 Raw payload archive path includes partner ID, received date, trace ID, and payload hash
- [x] #8 Multipart/file upload limits and JSON body limits are documented or enforced
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Expand OpenAPI and partner docs with CSV columns and JSON batch envelope before endpoint implementation.
2. Implement feed submission for JSON first, then CSV parsing with the same normalized feed metadata.
3. Generate trace ID, compute payload hash, store raw payload archive, and persist feed metadata before validation.
4. Return HTTP 202 with trace ID, feed ID, and processing status for accepted submissions.
5. Add tests for JSON, CSV, oversized/malformed payloads, archive path generation, and metadata persistence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented the partner feed ingress boundary with JSON and CSV support, raw payload archiving, trace ID propagation, payload hashing, and explicit body-size limits for JSON and multipart submissions. Validation: pnpm --filter @pharmasync/api test; pnpm --filter @pharmasync/api typecheck; pnpm --filter @pharmasync/web typecheck.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented partner feed submission for JSON and CSV, returning HTTP 202 with trace IDs while archiving raw payloads and hashing submissions before normalization. Added explicit body-size limits, contract coverage, and tests for both formats.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
