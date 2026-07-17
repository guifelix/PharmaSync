---
id: TASK-013
title: Harden agent development workflow instructions
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:42'
updated_date: '2026-07-17 02:43'
labels:
  - process
  - agents
  - workflow
  - R0
milestone: m-0
dependencies: []
references:
  - AGENTS.md
  - docs/adr/README.md
  - 'https://martinfowler.com/bliki/TestDrivenDevelopment.html'
  - 'https://martinfowler.com/bliki/ArchitectureDecisionRecord.html'
  - 'https://trunkbaseddevelopment.com/continuous-integration/'
priority: high
ordinal: 52000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update AGENTS.md with a disciplined development workflow for this repo: Backlog.md planning, ADR review, TDD, small-batch implementation, validation, and atomic conventional commits.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md requires starting file-changing work from a Backlog task with plan, AC, DoD, refs, and dependencies
- [x] #2 AGENTS.md requires ADR review or ADR creation/update when architecture-significant decisions change
- [x] #3 AGENTS.md defines a pragmatic TDD workflow for implementation tasks
- [x] #4 AGENTS.md requires validation, task finalization, and atomic Conventional Commits before handoff
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Preserve the existing Backlog.md and version-control sections.
2. Add a development workflow section covering task intake, ADR review, TDD/red-green-refactor, small-batch implementation, validation, and task finalization.
3. Add repository-specific quality bars for TypeScript, Adonis, Vue, OpenAPI, security, and docs.
4. Verify AGENTS.md is clear and commit the process update atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Validation passed: reviewed AGENTS.md content and ran git diff --check for AGENTS.md and TASK-013.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Hardened AGENTS.md with a file-changing development workflow covering Backlog task intake, ADR review, TDD, small-batch implementation, contract/data discipline, validation, task finalization, and atomic Conventional Commits.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 AGENTS.md preserves existing Backlog.md and version-control rules
- [x] #2 AGENTS.md is reviewed for clear, actionable workflow steps
- [x] #3 Change is committed as an atomic Conventional Commit
<!-- DOD:END -->
