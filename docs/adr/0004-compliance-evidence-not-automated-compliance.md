---
id: ADR-0004
title: Generate Compliance Evidence, Do Not Claim Automated Compliance
status: accepted
date: 2026-07-16
owners: [architecture]
decision_area: compliance
tags: [compliance, audit, evidence, traceability, governance]
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0003]
---

# ADR-0004: Generate Compliance Evidence, Do Not Claim Automated Compliance

## Context

PharmaSync operates in a regulated domain, but software should not imply that regulatory compliance is automatic.

## Decision

The system captures audit evidence, trace IDs, policy findings, and evidence packages for authorized review.

## Rationale

- This is credible and implementable in Phase 1.
- It supports audits and regulated operations without overstating system responsibility.
- It keeps human governance and formal compliance review in the process.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| No compliance module | Smaller build | Misses a key trust and governance requirement | Low | Internal prototype only |
| Evidence generation and traceability | Useful, credible, review-friendly | Does not automate formal compliance decisions | Medium | Current Phase 1 |
| Automated regulatory workflow | Strong workflow coverage | High legal/process risk, requires exact regulatory scope | High | Later product module with defined regulatory requirements |

## Trade-offs

- Regulatory workflows remain outside Phase 1 automation.
- Human review is required for official submissions and compliance conclusions.

## Consequences

- Positive: Strong audit trail without overstated claims.
- Negative: Users still need governance processes outside the system.
- Mitigation: Export evidence packages with trace IDs, source metadata, and action history.

## Revisit Triggers

- A formal regulated workflow is selected for product expansion.
- Specific submission APIs, legal requirements, or customer compliance controls are in scope.

## References

- [Solution Design](../solution-design.md)
- [Structurizr Workspace](../../architecture/workspace.dsl)
- Process: [Evidence Collection](../../architecture/processes/system/evidence/evidence-collection.bpmn.ts)
- Process: [Evidence Packaging](../../architecture/processes/system/evidence/evidence-packaging.bpmn.ts)
- Process: [Evidence Export](../../architecture/processes/system/evidence/evidence-export.bpmn.ts)
- Process: [Evidence Review](../../architecture/processes/human/evidence/evidence-review.bpmn.ts)
- Process: [Compliance Signoff](../../architecture/processes/human/evidence/compliance-signoff.bpmn.ts)
- Decision Table: [Evidence Requirements](../../architecture/processes/dmn/compliance/evidence-requirements.dmn.ts)

