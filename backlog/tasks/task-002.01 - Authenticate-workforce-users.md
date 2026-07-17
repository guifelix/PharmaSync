---
id: TASK-002.01
title: Authenticate workforce users
status: To Do
assignee: []
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 02:47'
labels:
  - story
  - security
  - R1
milestone: m-4
dependencies:
  - TASK-001.03
references:
  - apps/api/app/models/user.ts
  - docs/adr/0007-adonis-lucid-vine-openapi.md
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
- [ ] #4 Local development supports a documented seeded-user or token-based auth path that does not require a live external identity provider
- [ ] #5 OIDC configuration names issuer URL, client ID, audience, JWKS discovery, and accepted claims for pilot deployment
- [ ] #6 Authenticated context contains user ID, organization ID, permitted site IDs, roles, and request trace ID
- [ ] #7 Auth tests cover missing token/session, invalid token/session, valid local auth, and valid OIDC-shaped claims
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Document the selected local auth mode and OIDC boundary before changing code.
2. Define the authenticated context shape: user ID, organization ID, permitted site IDs, roles, and request trace ID.
3. Configure Adonis auth/middleware so protected API routes reject unauthenticated requests and expose typed auth context.
4. Add seeded local-auth fixtures and tests for missing, invalid, and valid auth contexts.
5. Record any decision that changes the identity-provider strategy in an ADR update.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All acceptance criteria are checked through Backlog.md
- [ ] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [ ] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [ ] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
