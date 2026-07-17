---
id: TASK-016.02
title: Document testing strategy
status: To Do
assignee: []
created_date: '2026-07-17 02:54'
labels:
  - testing
  - engineering-system
  - R0b
milestone: m-7
dependencies:
  - TASK-001.03
references:
  - AGENTS.md
  - apps/api/tests/bootstrap.ts
  - docs/solution-design.md
parent_task_id: TASK-016
priority: high
ordinal: 57000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a maintainer, I want a concrete testing strategy so implementation agents know which tests to add for each kind of change.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Testing strategy defines unit, API/functional, integration, contract, frontend, accessibility, and pilot simulation test layers
- [ ] #2 Testing strategy maps test types to packages/apps and expected commands
- [ ] #3 Testing strategy defines when TDD is mandatory versus when documented exception is acceptable
- [ ] #4 Testing strategy includes fixture isolation and no-PHI test data rules
- [ ] #5 Testing strategy defines minimum test expectations for each Backlog implementation task
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create docs/testing-strategy.md with the test pyramid and repository-specific commands.
2. Map domain, API, worker, integration, contract, frontend, and simulation tasks to appropriate test layers.
3. Define fixture isolation, no-PHI fixture rules, and local service requirements.
4. Link the strategy from README and AGENTS.md if useful.
5. Validate that planned commands exist or create follow-up tasks for missing tooling.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant validation commands are run and recorded in implementation notes
- [ ] #3 Created or updated docs are linked from the relevant README or system-design index
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
