---
id: TASK-016.04
title: Document database design conventions
status: To Do
assignee: []
created_date: '2026-07-17 02:54'
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
- [ ] #1 Database conventions define naming, IDs, timestamps, soft-delete/archive policy, and migration rules
- [ ] #2 Database conventions define tenant-scoping columns and query expectations
- [ ] #3 Database conventions define indexing strategy for inventory, feeds, quarantine, audit, and outbox queries
- [ ] #4 Database conventions define outbox table and audit immutability rules at design level
- [ ] #5 Database conventions identify where ERD/table-level documentation should live
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create docs/system-design/database-design.md with table/migration conventions.
2. Define tenant scoping, index expectations, outbox table shape, and audit immutability rules.
3. Cross-link with data-model.md, production-readiness.md, and ADR-0007.
4. Add examples for inventory, partner feed, quarantine, audit, and outbox tables.
5. Validate against existing Adonis/Lucid migration conventions.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant validation commands are run and recorded in implementation notes
- [ ] #3 Created or updated docs are linked from the relevant README or system-design index
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
