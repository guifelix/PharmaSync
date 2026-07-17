---
id: TASK-001.01
title: Run the local pilot stack
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:58'
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
- [x] #1 Postgres and MinIO start through the local docker compose file
- [x] #2 API, web app, and worker start from documented pnpm commands
- [x] #3 API health returns HTTP 200 and the web dashboard loads locally
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Review README, root package scripts, and local compose services.
2. Make the local startup path deterministic for Postgres, MinIO, API, web, and worker.
3. Verify documented commands from a clean shell.
4. Record local URLs and validation results in the task notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Validation passed: pnpm services:ps shows Postgres 17 and MinIO running, with Postgres healthy. Validation passed: pnpm --filter @pharmasync/api exec node ace migration:run --force reports migrations already up to date. Validation passed: pnpm dev starts @pharmasync/api, @pharmasync/web, and @pharmasync/worker; worker heartbeat is visible. Validation passed: curl -i http://localhost:3333 returns HTTP 200 with {"hello":"world"}; curl -I http://localhost:5173 returns HTTP 200. Validation passed: pnpm typecheck completed 14/14 tasks successfully. Updated README with env setup, service scripts, local URLs, targeted dev commands, validation commands, and service shutdown instructions. Added root scripts services:up, services:ps, services:down, dev:api, dev:web, and dev:worker.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Hardened the local development loop by adding root service/dev scripts and documenting the full local startup, migration, validation, URL, and shutdown workflow. Verified Docker services, migrations, pnpm dev, API, web, worker, and monorepo typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
