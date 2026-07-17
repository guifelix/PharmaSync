---
id: TASK-001.03
title: Provide API health checks
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
  - TASK-001.02
references:
  - packages/contracts/openapi/pharmasync.v1.yaml
  - docs/system-design/production-readiness.md
parent_task_id: TASK-001
priority: high
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want health checks for the API and dependencies so deployment and monitoring tools can detect failures.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Health response includes API status and database connectivity
- [ ] #2 Health response includes object-storage and worker/outbox status or heartbeat
- [ ] #3 Failed dependencies return a non-healthy status without exposing secrets
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define the health response contract in OpenAPI.
2. Add API checks for service, database, object storage, and worker/outbox status.
3. Return safe unhealthy responses when dependencies fail.
4. Add tests or manual curl verification and document results.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
