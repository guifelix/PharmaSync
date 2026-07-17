---
id: TASK-009.01
title: Seed public medication reference data
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - pilot-data
  - R1
milestone: m-4
dependencies:
  - TASK-003.01
references:
  - docs/system-design/data-model.md
  - packages/domain/src/index.ts
parent_task_id: TASK-009
priority: medium
ordinal: 43000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As a Platform Operator, I want to seed medication reference data from public sources so demos use realistic product information without PHI.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Seed command loads representative medication products
- [ ] #2 Seed data includes NDC and descriptive product fields where available
- [ ] #3 Seed command is repeatable without creating duplicates
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Choose a representative public medication reference subset for pilot demos.
2. Implement an idempotent seed command or script.
3. Record source metadata and load time.
4. Verify repeat runs do not create duplicates.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
