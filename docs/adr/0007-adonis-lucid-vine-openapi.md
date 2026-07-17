---
id: ADR-0007
title: Use AdonisJS, Lucid ORM, VineJS, and OpenAPI
status: accepted
date: 2026-07-17
owners: [backend, architecture]
decision_area: backend
tags: [adonisjs, lucid, vinejs, openapi, postgresql]
supersedes: []
superseded_by: null
related: [ADR-0005]
---

# ADR-0007: Use AdonisJS, Lucid ORM, VineJS, and OpenAPI

## Context

PharmaSync needs a production-oriented TypeScript backend with clear conventions for HTTP APIs, validation, database access, migrations, and background commands.

## Decision

Use AdonisJS for the API foundation, Lucid ORM for PostgreSQL persistence, VineJS for backend validation, and OpenAPI for cross-boundary API contracts.

## Rationale

- AdonisJS provides a cohesive backend structure.
- Lucid is the idiomatic AdonisJS persistence layer.
- VineJS aligns with AdonisJS validation conventions.
- OpenAPI gives the Vue app and future integrations a stable contract.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| AdonisJS + Lucid + VineJS | Cohesive framework and conventions | More framework-specific | Medium | Current Phase 1 |
| Fastify + TypeBox/Ajv | Lightweight and fast | More architecture decisions required | Medium | Smaller API or extracted service |
| NestJS | Enterprise-style modules | More verbose than needed | High | Larger backend team |

## Trade-offs

- Framework conventions shape the backend structure.
- OpenAPI generation/documentation needs discipline.

## Consequences

- Positive: Faster path to a complete backend.
- Negative: Less framework neutrality.
- Mitigation: Keep domain logic in shared packages where practical.

## Revisit Triggers

- A service needs a lighter runtime or independent performance profile.
- API contracts drift from route implementation.
