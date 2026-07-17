# BPMN Process Models

This directory contains executable BPMN 2.0 process models for PharmaSync, organized by process category. Models are created with `@bpmnkit/core` and renderable via `@bpmnkit/canvas` in the Operations Web App.

## Structure

```
architecture/processes/
├── system/                    # Fully automated, machine-to-machine
│   ├── ingestion/             # Partner feed → canonical → outbox
│   ├── signals/               # Rule-based signal calculation
│   ├── inventory/             # Core inventory operations
│   ├── outbox/                # Reliable event publishing
│   └── evidence/              # Automated evidence packaging
├── human/                     # Human-in-the-loop (user tasks)
│   ├── quarantine/            # Quarantine review & remediation
│   ├── evidence/              # Evidence review & approval
│   ├── exceptions/            # Exception handling
│   └── onboarding/            # Partner onboarding (Phase 2+)
├── dmn/                       # Business rules as decision tables
│   ├── signals/               # Signal thresholds & logic
│   ├── inventory/             # Inventory business rules
│   ├── compliance/            # Compliance rules
│   └── partner/               # Partner-specific rules
├── cross-org/                 # Multi-organization workflows
├── regulatory/                # Regulatory workflows
└── operational/               # Platform operations
```

## Category Definitions

| Category       | Description                                | Execution             |
| -------------- | ------------------------------------------ | --------------------- |
| `system/`      | Fully automated, no human tasks            | Zeebe / worker queue  |
| `human/`       | Contains user tasks requiring human action | Zeebe + Tasklist      |
| `dmn/`         | Business rules as decision tables          | FEEL engine           |
| `cross-org/`   | Spans multiple organizations               | Zeebe + external APIs |
| `regulatory/`  | Regulatory compliance workflows            | Zeebe + audit trail   |
| `operational/` | Platform operations (deploy, backup, DR)   | CI/CD + runbooks      |

## Naming Conventions

- Files: `kebab-case.bpmn.ts` (e.g., `feed-ingestion.bpmn.ts`)
- DMN files: `kebab-case.dmn.ts` (e.g., `shortage-threshold.dmn.ts`)
- Export: `xml` (BPMN 2.0 XML), `svg` (rendered diagram)

## Phase 1 Scope (POC)

| Category            | Processes                                                                                  | Status     |
| ------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| `system/ingestion/` | feed-ingestion, feed-validation, canonical-mapping, idempotency-check, quarantine-handling | ✅ Planned |
| `system/signals/`   | shortage-detection, expiry-risk, overstock-detection, replenishment-recommendation         | ✅ Planned |
| `system/inventory/` | movement-recording, correction-workflow, stock-adjustment                                  | ✅ Planned |
| `system/outbox/`    | outbox-publisher, retry-handling, dead-letter                                              | ✅ Planned |
| `system/evidence/`  | evidence-collection, evidence-packaging, evidence-export                                   | ✅ Planned |
| `human/quarantine/` | quarantine-review, payload-remediation, reprocess-decision                                 | ✅ Planned |
| `human/evidence/`   | evidence-review, compliance-signoff, audit-package-approval                                | ✅ Planned |
| `dmn/signals/`      | shortage-threshold, expiry-windows, overstock-threshold, replenishment-priority            | ✅ Planned |
| `dmn/inventory/`    | allocation-rules, correction-validation, lot-disposition                                   | ✅ Planned |
| `dmn/compliance/`   | evidence-requirements, audit-trigger, retention-policy                                     | ✅ Planned |

## Deferred (Phase 2+)

| Category            | Processes                                                                        |
| ------------------- | -------------------------------------------------------------------------------- |
| `human/onboarding/` | partner-certification, feed-testing, go-live-approval                            |
| `human/exceptions/` | manual-correction, override-approval, escalation                                 |
| `cross-org/`        | partner-feed-certification, sla-monitoring, data-sharing-agreement, joint-recall |
| `regulatory/`       | fda-submission, recall-initiation, dea-reporting, hipaa-breach                   |
| `operational/`      | deployment, backup-restore, disaster-recovery, capacity-scaling, secret-rotation |

## Rendering

```bash
# Render single model to SVG
pnpm --filter @pharmasync/integration exec tsx architecture/processes/system/ingestion/feed-ingestion.bpmn.ts

# Render all (CI)
pnpm run render:processes
```

Outputs to `architecture/out/processes/` mirroring the source structure.

## Cross-References

- **Structurizr**: `architecture/workspace.dsl` (canonical C4 model)
- **D2**: `architecture/d2/` (portable C4 diagrams)
- **Dynamic views**: `workspace.dsl` dynamic views map to `system/ingestion/` and `system/signals/`
- **ADRs**: `docs/adr/` reference process models by path
