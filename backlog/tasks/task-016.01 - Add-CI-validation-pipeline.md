---
id: TASK-016.01
title: Add CI validation pipeline
status: To Do
assignee: []
created_date: '2026-07-17 02:54'
labels:
  - ci
  - engineering-system
  - R0b
milestone: m-7
dependencies:
  - TASK-001.01
references:
  - package.json
  - pnpm-lock.yaml
  - turbo.json
  - architecture/README.md
parent_task_id: TASK-016
priority: high
ordinal: 56000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a maintainer, I want CI to run the repo's core checks automatically so every trunk commit stays releasable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 CI installs dependencies with the locked package manager configuration
- [ ] #2 CI runs monorepo typecheck and build checks for API and web
- [ ] #3 CI runs future test commands without blocking on missing tests
- [ ] #4 CI validates Structurizr when architecture/workspace.dsl changes
- [ ] #5 CI renders or checks D2 diagrams when architecture/d2 files change
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Choose the CI provider convention already expected by the repo, defaulting to GitHub Actions if none exists.
2. Add workflow steps for dependency install, pnpm typecheck, API build, web build, and placeholder/future test commands.
3. Add conditional architecture validation for Structurizr and D2 diagram changes using documented container commands.
4. Document CI behavior and required local parity commands.
5. Run equivalent local commands and record results.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant validation commands are run and recorded in implementation notes
- [ ] #3 Created or updated docs are linked from the relevant README or system-design index
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
