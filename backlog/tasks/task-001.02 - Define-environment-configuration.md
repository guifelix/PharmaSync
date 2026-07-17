---
id: TASK-001.02
title: Define environment configuration
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - foundation
  - R0
milestone: m-0
dependencies:
  - TASK-001.01
references:
  - .env.example
  - apps/api/start/env.ts
  - docs/system-design/production-readiness.md
parent_task_id: TASK-001
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want environment variables validated at startup so misconfigured deployments fail early.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 API validates required app, database, auth, object storage, and logging variables
- [ ] #2 Worker validates database, queue, object storage, and logging variables
- [ ] #3 Example env files document local and pilot deployment settings
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inventory required env vars for API, worker, database, auth, object storage, and logging.
2. Add validation and example values in the appropriate app/root env files.
3. Exercise missing-variable failures and successful startup.
4. Update docs when variable names or defaults change.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
