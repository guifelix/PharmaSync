---
id: TASK-015
title: Document C4 and D2 workflow guidance
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:50'
updated_date: '2026-07-17 02:50'
labels:
  - process
  - agents
  - architecture
  - R0
milestone: m-0
dependencies: []
references:
  - AGENTS.md
  - architecture/README.md
  - architecture/workspace.dsl
  - architecture/d2
priority: high
ordinal: 54000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update AGENTS.md so agents know when to check, create, update, and validate Structurizr C4 and D2 architecture diagrams.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md states that Structurizr workspace.dsl is the canonical C4 model
- [x] #2 AGENTS.md explains when to check architecture diagrams before implementation
- [x] #3 AGENTS.md explains when to update Structurizr and D2 diagrams
- [x] #4 AGENTS.md explains when diagram updates are not required
- [x] #5 AGENTS.md requires relevant diagram validation/render commands to be recorded in Backlog notes
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add an Architecture Diagrams section under the existing architecture workflow guidance.
2. Define Structurizr workspace.dsl as canonical and D2 as companion/shareable views.
3. Specify when to check diagrams, when to update them, when not to update them, and how to validate/render them.
4. Finalize the task and commit AGENTS.md plus the Backlog task atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Validation passed: reviewed AGENTS.md diagram workflow text and ran git diff --check for AGENTS.md and TASK-015.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added C4/D2 workflow guidance to AGENTS.md: Structurizr workspace.dsl is canonical, D2 diagrams are companion views, and future agents must check/update/validate diagrams when architecture relationships change.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 Existing Backlog, ADR, workflow, and version-control rules are preserved
- [x] #2 AGENTS.md is clear enough for future implementation agents
- [x] #3 Change is committed as an atomic Conventional Commit
<!-- DOD:END -->
