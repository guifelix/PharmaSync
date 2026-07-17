---
id: TASK-004.02
title: Validate partner payloads
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
  - TASK-004.01
  - TASK-010.02
references:
  - packages/contracts/openapi/pharmasync.v1.yaml
  - docs/adr/0004-compliance-evidence-not-automated-compliance.md
parent_task_id: TASK-004
priority: high
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Partner Integration Engineer, I want payload validation errors returned with clear reasons so I can fix feed issues quickly.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Required fields, data types, dates, quantities, and business constraints are validated
- [ ] #2 Invalid payloads do not update inventory
- [ ] #3 Invalid payloads create quarantine records with reason codes and trace IDs
- [ ] #4 Reason codes include MISSING_REQUIRED_FIELD, INVALID_DATE, INVALID_QUANTITY, UNKNOWN_SITE, UNKNOWN_PRODUCT, INVALID_EVENT_TYPE, DUPLICATE_EVENT, and CONFLICTING_DUPLICATE
- [ ] #5 Validation distinguishes schema errors, reference-data errors, business-rule errors, duplicates, and conflicting duplicates
- [ ] #6 Quarantine records include original field path, reason code, human-readable message, trace ID, feed ID, partner ID, and raw payload reference
- [ ] #7 A batch can partially accept valid records only if rejected records are individually quarantined and accepted records remain idempotent
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define a validation reason-code enum and quarantine payload shape in shared contracts/integration package.
2. Implement schema validation before reference-data/business-rule validation.
3. Persist quarantine records with field paths, reason codes, trace/feed/partner metadata, and raw payload reference.
4. Decide and document batch partial-acceptance behavior before processing mixed-validity feeds.
5. Add tests for every reason-code category, malformed batches, partial acceptance if enabled, and no inventory mutation for invalid records.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
