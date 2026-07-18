---
id: ADR-0001
title: Build Phase 1 as a Pilot-Ready Reference System
status: accepted
date: 2026-07-16
owners: [architecture]
decision_area: product-scope
tags: [pilot, product-scope, roadmap, implementation-strategy]
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0003, ADR-0004]
---

# ADR-0001: Build Phase 1 as a Pilot-Ready Reference System

## Context

PharmaSync needs to prove that fragmented pharmaceutical inventory data can be integrated, normalized, monitored, and audited without replacing partner systems.

## Decision

Build Phase 1 as a pilot-ready reference system focused on one regional supply chain network instead of a full national-scale platform.

## Rationale

- The hardest product risk is integration credibility, not national infrastructure scale.
- A focused pilot can produce measurable outcomes: inventory freshness, ingestion success rate, shortage/expiry alerts, and evidence traceability.
- The architecture keeps clear boundaries so services can be extracted or scaled as usage grows.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| Full platform from the start | Shows ambition and broad capability coverage | High delivery risk, harder to validate, more speculative | High | Large funded team with committed partners |
| Pilot-ready reference system | Buildable, measurable, easier to demonstrate | Defers some product modules | Medium | Current Phase 1 |
| Static architecture-only concept | Fast to document | Does not prove execution feasibility | Low | Early ideation only |

## Trade-offs

- Phase 1 does not include the full training platform, approval workflow, or national-scale event streaming.
- Some future platform capabilities remain roadmap items rather than active runtime components.

## Consequences

- Positive: Clearer product story, smaller implementation surface, measurable pilot outcomes.
- Negative: Some stakeholder-facing modules remain deferred.
- Mitigation: Model deferred capabilities in the expansion roadmap rather than the active runtime.

## Revisit Triggers

- More than three live partner organizations are onboarded.
- Event volume or independent consumer needs exceed the queue/outbox model.
- Advanced forecasting requires dedicated data science workflows and historical demand datasets.

## References

- [Solution Design](../solution-design.md)
- [Structurizr Workspace](../../architecture/workspace.dsl)
- Process: [Feed Ingestion](../../architecture/processes/system/ingestion/feed-ingestion.bpmn.ts)
- Process: [Canonical Mapping](../../architecture/processes/system/ingestion/canonical-mapping.bpmn.ts)
- Process: [Outbox Publisher](../../architecture/processes/system/outbox/outbox-publisher.bpmn.ts)
- Process: [Expiry Risk Detection](../../architecture/processes/system/signals/expiry-risk-detection.bpmn.ts)

