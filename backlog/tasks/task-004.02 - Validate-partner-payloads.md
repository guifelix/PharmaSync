---
id: TASK-004.02
title: Validate partner payloads
status: Done
assignee:
  - '@felix'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 06:24'
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
- [x] #1 Required fields, data types, dates, quantities, and business constraints are validated
- [x] #2 Invalid payloads do not update inventory
- [x] #3 Invalid payloads create quarantine records with reason codes and trace IDs
- [x] #4 Reason codes include MISSING_REQUIRED_FIELD, INVALID_DATE, INVALID_QUANTITY, UNKNOWN_SITE, UNKNOWN_PRODUCT, INVALID_EVENT_TYPE, DUPLICATE_EVENT, and CONFLICTING_DUPLICATE
- [x] #5 Validation distinguishes schema errors, reference-data errors, business-rule errors, duplicates, and conflicting duplicates
- [x] #6 Quarantine records include original field path, reason code, human-readable message, trace ID, feed ID, partner ID, and raw payload reference
- [x] #7 A batch can partially accept valid records only if rejected records are individually quarantined and accepted records remain idempotent
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add shared validation reason codes and quarantine record metadata to the integration package so the API and docs use one canonical shape.\n2. Implement partner feed validation for schema, reference-data, and business-rule checks, mapping failures to structured quarantine issues.\n3. Persist quarantine records with trace, partner, feed, field-path, and raw-payload references, then return 422 for fully rejected feeds while keeping partial acceptance behavior explicit.\n4. Update the OpenAPI contract, quarantine list shape, and tests for invalid payloads, mixed payloads, and no inventory mutation on rejected records.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented structured partner-feed validation and quarantine persistence.

Validation result:
- 
> @pharmasync/api@0.0.0 typecheck /home/felix/projects/personal/pharmaSync/apps/api
> tsc --noEmit
- 
> @pharmasync/api@0.0.0 test /home/felix/projects/personal/pharmaSync/apps/api
> node ace test

c[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 5 file(s)
[ info ] booting application to run tests...

unit / HealthService (tests/unit/health_service.spec.ts)
  ✔ returns an up status when every dependency is healthy (1.12ms)
  ✔ returns a down status without leaking dependency error details (1.06ms)
  ✔ reads snake_case worker heartbeat timestamps returned by the database (0.17ms)

unit / Inventory movement reference (tests/unit/inventory_movement_reference.spec.ts)
  ✔ records receipt movements and outbox events (0.75ms)
  ✔ records dispense movements without allowing negative availability (0.54ms)
  ✔ records corrections with actor, reason, before quantity, and after quantity (0.45ms)
  ✔ records paired transfer movements transactionally (0.36ms)

unit / Outbox reference (tests/unit/outbox_reference.spec.ts)
  ✔ creates versioned inventory outbox messages from inventory events (0.45ms)
  ✔ claims the oldest due pending records and marks them as processing (0.59ms)
  ✔ awaits async handlers and keeps unrelated records moving when one fails (0.71ms)
  ✔ moves exhausted records to failed with bounded retry metadata (0.22ms)
  ✔ acknowledges records as processed without leaving locks behind (0.4ms)

unit / Stock position reference (tests/unit/stock_position_reference.spec.ts)
  ✔ calculates available quantity and validates invariants (0.49ms)
  ✔ marks stale records after the freshness threshold (0.25ms)
  ✔ filters by tenant scope, site, product, expiry window, low stock, and stale state (0.43ms)
  ✔ builds a response view with expiration, availability, and freshness metadata (0.31ms)
  ✔ creates paired transfer movements linked by a correlation id (0.25ms)

functional / GET /health (tests/functional/health.spec.ts)
{"level":40,"time":1784269427397,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","msg":"Acquire connection error: error: database \"pharmasync_test\" does not exist\n    at parseErrorMessage (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/parser.ts:394:9)\n    at Parser.handlePacket (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/parser.ts:212:19)\n    at Parser.parse (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/parser.ts:105:30)\n    at Socket.<anonymous> (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/index.ts:7:48)\n    at Socket.emit (node:events:509:28)\n    at Socket.emit (node:domain:489:12)\n    at addChunk (node:internal/streams/readable:563:12)\n    at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)\n    at Readable.push (node:internal/streams/readable:394:5)\n    at TCP.onStreamRead (node:internal/stream_base_commons:189:23)"}
{"level":40,"time":1784269427398,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","msg":"Acquire connection error: error: database \"pharmasync_test\" does not exist\n    at parseErrorMessage (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/parser.ts:394:9)\n    at Parser.handlePacket (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/parser.ts:212:19)\n    at Parser.parse (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/parser.ts:105:30)\n    at Socket.<anonymous> (/home/felix/projects/personal/pharmaSync/node_modules/.pnpm/pg-protocol@1.15.0/node_modules/pg-protocol/src/index.ts:7:48)\n    at Socket.emit (node:events:509:28)\n    at Socket.emit (node:domain:489:12)\n    at addChunk (node:internal/streams/readable:563:12)\n    at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)\n    at Readable.push (node:internal/streams/readable:394:5)\n    at TCP.onStreamRead (node:internal/stream_base_commons:189:23)"}
  ✔ returns dependency health without authentication (81.85ms)

functional / Medication lots (tests/functional/medication_lots.spec.ts)
  ✔ requires lot number and expiration date for lot-tracked records (0.26ms)
  ✔ classifies expired, near-expiry, and ok lots (0.17ms)
  ✔ includes lot and expiration status in inventory responses (39.28ms)

functional / Medication products (tests/functional/medication_products.spec.ts)
  ✔ normalizes NDC values for lookup (0.12ms)
  ✔ deduplicates products by normalized NDC (0.13ms)
  ✔ searches by NDC and product name fields (0.27ms)

functional / Partner feeds (tests/functional/partner_feeds.spec.ts)
  ✔ accepts JSON batches and archives the raw payload with a trace ID (29.11ms)
  ✔ accepts CSV feeds and archives the raw payload with a trace ID (11.01ms)
  ✔ rejects malformed batches with structured validation issues and quarantines them (9.42ms)
  ✔ accepts mixed batches while quarantining rejected rows (7.27ms)

functional / role-based access control (tests/functional/role_based_access.spec.ts)
  ✔ allows operations users to read inventory and signals (11.75ms)
{"level":40,"time":1784269427521,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","request_id":"1bcc39d6-d616-4a43-8ecf-f3db08a9d05b","event":"authorization_denied","permission":"evidence:generate","resource":"evidence.packages","traceId":"1bcc39d6-d616-4a43-8ecf-f3db08a9d05b","userId":"usr_operations","organizationId":"org_alpha","permittedSiteIds":["site_main","site_overflow"],"roles":["operations"],"msg":"Authorization denied"}
{"level":40,"time":1784269427527,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","request_id":"d9fe8532-ee8e-4158-96c6-460d9da0f824","event":"authorization_denied","permission":"quarantine:reprocess","resource":"quarantine.reprocessings","traceId":"d9fe8532-ee8e-4158-96c6-460d9da0f824","userId":"usr_operations","organizationId":"org_alpha","permittedSiteIds":["site_main","site_overflow"],"roles":["operations"],"msg":"Authorization denied"}
  ✔ denies operations users from evidence export and quarantine reprocessing (11.73ms)
  ✔ allows compliance users to read audit events and generate evidence packages (14.67ms)
{"level":40,"time":1784269427547,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","request_id":"80f43652-c176-420f-8fa5-493ffa60c0d6","event":"authorization_denied","permission":"integration:mappings:write","resource":"integration.mappings","traceId":"80f43652-c176-420f-8fa5-493ffa60c0d6","userId":"usr_compliance","organizationId":"org_alpha","permittedSiteIds":["site_main","site_overflow"],"roles":["compliance"],"msg":"Authorization denied"}
  ✔ denies compliance users from changing integration mappings (5.36ms)
  ✔ allows integration users to inspect health, inspect quarantine, and reprocess payloads (21.71ms)
{"level":30,"time":1784269427575,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","request_id":"3f5b9a60-a5f3-46c0-96f9-2813a4d241e0","event":"privileged_authorization_granted","permission":"configuration:manage","resource":"configuration.access","traceId":"3f5b9a60-a5f3-46c0-96f9-2813a4d241e0","userId":"usr_platform-admin","organizationId":"org_alpha","permittedSiteIds":["site_main","site_overflow"],"roles":["platform-admin"],"msg":"Privileged authorization granted"}
{"level":30,"time":1784269427581,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","request_id":"ae2de003-8d7f-41eb-82bb-a6d2fc36d2ce","event":"privileged_authorization_granted","permission":"integration:mappings:write","resource":"integration.mappings","traceId":"ae2de003-8d7f-41eb-82bb-a6d2fc36d2ce","userId":"usr_platform-admin","organizationId":"org_alpha","permittedSiteIds":["site_main","site_overflow"],"roles":["platform-admin"],"msg":"Privileged authorization granted"}
  ✔ allows platform administrators to manage configuration and integration mappings (13.31ms)
{"level":40,"time":1784269427588,"pid":629894,"hostname":"LAPTOP-IDAPC8B4","name":"pharmasync-api-test","request_id":"e8b3db4e-452c-43c6-a4e2-6339b84bc01f","event":"authorization_denied","permission":"inventory:read","resource":"inventory.stock","traceId":"e8b3db4e-452c-43c6-a4e2-6339b84bc01f","userId":"usr_contractor","organizationId":"org_alpha","permittedSiteIds":["site_main","site_overflow"],"roles":["contractor"],"msg":"Authorization denied"}
  ✔ rejects unknown roles for protected permissions (4.8ms)

functional / sites and organizations (tests/functional/sites.spec.ts)
  ✔ models distributor, facility, and program-node organizations (0.35ms)
  ✔ sites belong to known organizations (0.13ms)
  ✔ site lookup is scoped to organization and permitted sites (7.78ms)
  ✔ active site helper does not leak same-key sites across organizations (0.13ms)

functional / Stock positions (tests/functional/stock_positions.spec.ts)
  ✔ returns permitted stock positions with site, product, lot, quantities, and update metadata (5.27ms)
  ✔ supports site, product, expiration window, low-stock, and stale-data filters (24.36ms)
  ✔ keeps available quantity non-negative and exposes stale metadata only when applicable (4.88ms)

functional / tenant-aware query scope (tests/functional/tenant_scope.spec.ts)
  ✔ scopes inventory stock to the authenticated organization and permitted sites (5.67ms)
  ✔ scopes risk signals to the authenticated organization and permitted sites (4.86ms)
  ✔ scopes quarantine records to the authenticated organization and permitted sites (4.44ms)
  ✔ scopes audit events to organization-owned and permitted-site records (4.52ms)
  ✔ does not leak records from another organization with the same site id (7.07ms)

functional / GET /api/v1/auth/context (tests/functional/workforce_auth_context.spec.ts)
  ✔ rejects requests without a bearer token (5.3ms)
  ✔ rejects requests with an invalid bearer token (4.98ms)
  ✔ returns local authenticated workforce context (6.51ms)
  ✔ returns context from OIDC-shaped claims (4.54ms)

 PASSED 

Tests  51 passed (51)
 Time  385ms
- 
> @pharmasync/web@0.1.0 typecheck /home/felix/projects/personal/pharmaSync/apps/web
> vue-tsc --noEmit

Notes:
- API returns 422 for fully rejected batches and 202 for partially accepted batches.
- Quarantine records now carry reason code, category, field path, trace ID, feed ID, partner ID, raw payload URI, and timestamps.
- OpenAPI contract updated for accepted and rejected feed responses plus the richer quarantine record shape.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented structured partner-feed validation with canonical reason codes, quarantine persistence, partial-acceptance handling, and contract/test coverage. The API now returns 422 for fully rejected feeds and 202 for mixed batches with quarantined rows, and quarantine records are persisted with trace, partner, feed, payload, and field-path metadata.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
