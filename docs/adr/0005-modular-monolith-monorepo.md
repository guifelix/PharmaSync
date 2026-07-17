---
id: ADR-0005
title: Use a Modular Monolith in a Monorepo for Phase 1
status: accepted
date: 2026-07-17
owners: [architecture]
decision_area: application-architecture
tags: [monorepo, modular-monolith, typescript, phase-1]
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0002, ADR-0003]
---

# ADR-0005: Use a Modular Monolith in a Monorepo for Phase 1

## Context

PharmaSync needs to prove product feasibility before it needs independent service scaling. The first implementation must connect ingestion, inventory, signals, and evidence without creating unnecessary distributed-system overhead.

## Decision

Use a TypeScript monorepo with a modular monolith backend and three deployable processes: web, API, and worker.

## Rationale

- Keeps implementation fast and coherent.
- Preserves module boundaries for later extraction.
- Avoids premature microservice costs around networking, tracing, deployment, and distributed data ownership.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| Single app repository | Fastest initial setup | Boundaries become unclear quickly | Low | Throwaway prototype |
| Modular monolith monorepo | Clear boundaries and simple deployment | Requires discipline to maintain module seams | Medium | Current Phase 1 |
| Microservices | Independent deployability and scaling | High operational overhead too early | High | Larger team or proven independent scaling needs |

## Trade-offs

- Modules share a runtime and database in Phase 1.
- Extraction requires future ADRs and migration work.

## Consequences

- Positive: Clear repo structure with low operational overhead.
- Negative: Runtime isolation is limited.
- Mitigation: Keep module interfaces explicit and avoid cross-module database shortcuts.

## Revisit Triggers

- A module needs independent scaling or deployment.
- Multiple teams own different product areas.
- A regulatory or customer boundary requires runtime isolation.
