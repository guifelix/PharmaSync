---
id: TASK-016.06
title: Create operational runbooks
status: To Do
assignee: []
created_date: '2026-07-17 02:54'
labels:
  - operations
  - runbooks
  - engineering-system
  - R0b
milestone: m-7
dependencies:
  - TASK-001.01
  - TASK-001.03
  - TASK-005.03
  - TASK-004.05
references:
  - docs/system-design/production-readiness.md
  - infra/local/docker-compose.yml
  - architecture/processes/operational/platform-deployment.bpmn.ts
  - architecture/processes/operational/backup-restore.bpmn.ts
  - architecture/processes/operational/disaster-recovery.bpmn.ts
parent_task_id: TASK-016
priority: medium
ordinal: 61000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a platform operator, I want practical runbooks for common failures so local and pilot operations are repeatable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Runbooks cover local startup/shutdown, failed migration, stuck outbox, quarantine spike, object storage unavailable, stale partner feeds, and evidence package generation failure
- [ ] #2 Each runbook includes symptoms, likely causes, diagnostic commands, recovery steps, escalation, and verification
- [ ] #3 Runbooks distinguish local development from pilot production expectations
- [ ] #4 Runbooks avoid destructive commands unless a safer recovery path is documented first
- [ ] #5 README or production-readiness docs link to the runbook index
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create docs/runbooks/ with an index and one concise markdown file per high-priority failure mode.
2. Fill each runbook with symptoms, diagnosis, recovery, escalation, and verification.
3. Prefer safe commands and mark destructive steps as last-resort/manual-approval only.
4. Cross-link from production-readiness.md and README as appropriate.
5. Validate commands against the current local compose/app layout where practical.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant validation commands are run and recorded in implementation notes
- [ ] #3 Created or updated docs are linked from the relevant README or system-design index
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
