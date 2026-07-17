---
id: TASK-001.01
title: Run the local pilot stack
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - foundation
  - R0
milestone: m-0
dependencies: []
references:
  - README.md
  - infra/local/docker-compose.yml
  - package.json
  - turbo.json
parent_task_id: TASK-001
priority: high
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want to run the web app, API, worker, Postgres, and object storage locally so the team can develop and demonstrate the pilot consistently.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Postgres and MinIO start through the local docker compose file
- [ ] #2 API, web app, and worker start from documented pnpm commands
- [ ] #3 API health returns HTTP 200 and the web dashboard loads locally
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Review README, root package scripts, and local compose services.
2. Make the local startup path deterministic for Postgres, MinIO, API, web, and worker.
3. Verify documented commands from a clean shell.
4. Record local URLs and validation results in the task notes.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
