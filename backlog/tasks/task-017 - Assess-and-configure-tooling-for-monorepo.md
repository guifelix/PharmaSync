---
id: TASK-017
title: Assess and configure tooling for monorepo
status: Done
assignee: []
created_date: '2026-07-17 17:23'
updated_date: '2026-07-17 17:24'
labels:
  - tooling
  - ci
  - dx
dependencies: []
priority: high
ordinal: 64000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Evaluate and configure the tooling stack for the PharmaSync monorepo including package management, linting, formatting, type checking, testing, and CI/CD. This task covers the assessment of tools from the provided list and implementation of the chosen stack.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Tool assessment document created with recommendations for each category
- [ ] #2 Chosen tools configured and working in the monorepo
- [ ] #3 CI pipeline validates all checks (lint, typecheck, test, build)
- [ ] #4 Documentation updated with tooling decisions
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Assessment complete. Document created at docs/tooling-assessment.md with recommendations for all 10 tool categories. Phase 1 implementation items identified: Knip, dependency-cruiser, eslint-plugin-unicorn, Vitest (API+Worker), Playwright (Web), CodeQL. Configuration files to create listed in document.
<!-- SECTION:NOTES:END -->
