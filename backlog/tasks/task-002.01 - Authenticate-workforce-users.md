---
id: TASK-002.01
title: Authenticate workforce users
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:39'
labels:
  - story
  - security
  - R1
milestone: m-1
dependencies:
  - TASK-001.03
references:
  - docs/system-design/security-and-compliance.md
  - apps/api/config/auth.ts
  - apps/api/app/middleware/auth_middleware.ts
parent_task_id: TASK-002
priority: high
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As an operations user, I want to sign in securely so only authorized users can access PharmaSync dashboards and APIs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Users authenticate through OIDC-compatible configuration
- [ ] #2 API rejects unauthenticated requests to protected endpoints
- [ ] #3 Authenticated requests include user identity and organization context
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Review Adonis auth configuration and security requirements.
2. Configure OIDC-compatible auth boundaries and a documented local development mode.
3. Ensure authenticated API requests expose user and organization context.
4. Add route or functional tests for authenticated and unauthenticated access.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
