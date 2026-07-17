---
id: TASK-002.01
title: Authenticate workforce users
status: Done
assignee:
  - '@codex'
created_date: '2026-07-17 02:22'
updated_date: '2026-07-17 03:44'
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
- [x] #1 Users authenticate through OIDC-compatible configuration
- [x] #2 API rejects unauthenticated requests to protected endpoints
- [x] #3 Authenticated requests include user identity and organization context
- [x] #4 Local development supports a documented seeded-user or token-based auth path that does not require a live external identity provider
- [x] #5 OIDC configuration names issuer URL, client ID, audience, JWKS discovery, and accepted claims for pilot deployment
- [x] #6 Authenticated context contains user ID, organization ID, permitted site IDs, roles, and request trace ID
- [x] #7 Auth tests cover missing token/session, invalid token/session, valid local auth, and valid OIDC-shaped claims
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inspect current Adonis routing, auth config, API contract, and test patterns.
2. Add a framework-local auth context shape and bearer-token middleware that supports documented local development tokens and OIDC-shaped JWT claims.
3. Protect a minimal authenticated context endpoint so unauthenticated/invalid/valid cases are testable without changing inventory architecture.
4. Update OpenAPI/docs with issuer, client ID, audience, JWKS discovery, accepted claims, and local auth path.
5. Run focused API tests/typechecks, check acceptance criteria, finalize the Backlog task, and commit atomically.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented workforce bearer authentication without adding a JWT package. Added a Node crypto HS256 verifier for local/test OIDC-shaped tokens, auth context middleware, /api/v1/auth/context endpoint, OpenAPI schema/security scheme, and security documentation for issuer URL, client ID, audience, JWKS discovery URL, and accepted claims. Local ignored apps/api/.env was updated so strict env validation continues to boot.

Validation: pnpm --filter @pharmasync/api test -- --files tests/functional/workforce_auth_context.spec.ts (4 passed); pnpm --filter @pharmasync/api test (8 passed; health test logs expected missing pharmasync_test DB warning and returns degraded health); pnpm --filter @pharmasync/api typecheck (passed); pnpm typecheck (15 tasks passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented a protected workforce auth context endpoint backed by OIDC-shaped signed bearer claims, documented local auth and pilot OIDC configuration, updated the OpenAPI contract, and verified with focused/full API tests plus root typecheck.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 All acceptance criteria are checked through Backlog.md
- [x] #2 Relevant tests, typechecks, or manual validation are run and recorded in implementation notes
- [x] #3 API contracts, docs, or ADRs are updated when behavior or architecture changes
- [x] #4 Work is committed as an atomic Conventional Commit
<!-- DOD:END -->
