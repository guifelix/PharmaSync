---
id: ADR-0002
title: Use Queue/Outbox Before Kafka-Compatible Streaming
status: accepted
date: 2026-07-16
owners: [architecture]
decision_area: eventing
tags: [eventing, queue, outbox, reliability, scalability]
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0003]
---

# ADR-0002: Use Queue/Outbox Before Kafka-Compatible Streaming

## Context

The Phase 1 freshness target is near-real-time inventory visibility, with a practical target under five minutes for pilot sources.

## Decision

Use a workflow queue plus transactional outbox for Phase 1 asynchronous processing.

## Rationale

- Simpler to implement and operate for a pilot.
- Reliable enough for inventory, audit, and signal workflows at initial scale.
- Preserves the event-driven model without committing to Kafka operational complexity too early.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| Synchronous REST only | Simplest runtime | Weak reliability for ingestion, harder retries, tighter coupling | Low | Very small demo only |
| Queue plus transactional outbox | Reliable, buildable, supports retries and audit trail | Less powerful than stream processing | Medium | Current Phase 1 |
| Kafka-compatible event streaming | High throughput, replay, many consumers | More operational burden and design complexity | High | Multi-consumer, high-volume, replay-heavy scale |

## Trade-offs

- Lower throughput and ecosystem flexibility than Kafka.
- Fewer native stream-processing capabilities.

## Consequences

- Positive: Faster implementation and simpler operations.
- Negative: Later migration may be required for high-scale streaming.
- Mitigation: Keep event contracts explicit and avoid queue-specific domain logic.

## Revisit Triggers

- Multiple independent downstream consumers need replayable event streams.
- Throughput, retention, or replay requirements exceed the queue/outbox implementation.

## References

- [Solution Design](../solution-design.md)
- [Container D2 Diagram](../../architecture/d2/container.d2)

