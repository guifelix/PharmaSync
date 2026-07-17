---
id: TASK-016.04
title: Document database design conventions
status: Done
assignee: []
created_date: '2026-07-17 02:54'
updated_date: '2026-07-17 04:42'
labels:
  - database
  - engineering-system
  - R0b
milestone: m-7
dependencies:
  - TASK-003.01
  - TASK-003.02
  - TASK-005.01
references:
  - docs/system-design/data-model.md
  - apps/api/database/migrations
  - packages/db/README.md
  - docs/adr/0007-adonis-lucid-vine-openapi.md
parent_task_id: TASK-016
priority: high
ordinal: 59000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a backend engineer, I want database design conventions so migrations, tenant scoping, indexes, outbox records, and audit tables are implemented consistently.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Database conventions define naming, IDs, timestamps, soft-delete/archive policy, and migration rules
- [x] #2 Database conventions define tenant-scoping columns and query expectations
- [x] #3 Database conventions define indexing strategy for inventory, feeds, quarantine, audit, and outbox queries
- [x] #4 Database conventions define outbox table and audit immutability rules at design level
- [x] #5 Database conventions identify where ERD/table-level documentation should live
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Write docs/system-design/database-design.md with layered planning guidance, table conventions, indexing rules, tenant scope, and outbox/audit rules.
2. Add a D2 sql_table diagram for the core data model and link it from the data-model and DB package docs.
3. Cross-link the new convention doc from data-model.md, production-readiness.md, and packages/db/README.md, then validate the rendered diagram and task references.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added docs/system-design/database-design.md and architecture/d2/database-model.d2. Rendered architecture/out/database-model.svg with Podman/D2 successfully.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Documented the Phase 1 database design conventions in docs/system-design/database-design.md, added a sql_table D2 model at architecture/d2/database-model.d2, linked the new guidance from the data model, production-readiness, and DB package docs, and rendered architecture/out/database-model.svg with Podman/D2. Committed as bbbadf9 (docs(db): document database design conventions).
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant validation commands are run and recorded in implementation notes
- [x] #3 Created or updated docs are linked from the relevant README or system-design index
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
