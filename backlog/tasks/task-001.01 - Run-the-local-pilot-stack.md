---
id: TASK-001.01
title: Run the local pilot stack
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
labels:
  - story
  - foundation
  - R0
dependencies: []
references:
  - README.md
  - infra/local/docker-compose.yml
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
