# PharmaSync Protocol Phase 1 POC Solution Design

## Objective

Design a credible Phase 1 proof of concept for PharmaSync Protocol: an integration-first Health IT system that improves pharmaceutical supply chain visibility, reduces medication waste, supports shortage response, and creates audit-ready evidence for regulated operations.

The POC should prove the hardest operational claim first: multiple organizations can share near-real-time medication inventory and movement data without replacing their existing systems.

The architecture should show more than a concept diagram. It should demonstrate a practical execution path: a buildable pilot, measurable outcomes, and a credible roadmap toward broader U.S. public-health and pharmaceutical infrastructure impact.

## Product Capabilities

PharmaSync is organized around four product capabilities:

- Integrated drug inventory and control for distribution centers and government-supported medication programs.
- Secure training for pharmaceutical sales representatives.
- Healthcare system integrations and API-driven migration/connectivity.
- Technology-enhanced drug approval and auditing support for SOC 2, FDA, and HIPAA-aligned operations.

It also proposes a phased rollout:

- Phase 1: pilot in a distribution center, VA Medical Center, SNS facility, or similar program.
- Phase 2: expand across multiple sites in the same network.
- Phase 3: present results to distributors, agencies, and healthcare providers.
- Phase 4: scale nationally and adapt to other healthcare supply chains.

## POC Scope

Build the first POC around a single regional pilot network:

- 1 distribution center.
- 2 healthcare facilities.
- 1 government program node.
- Synthetic or de-identified medication inventory, expiry, shipment, and dispense events.
- External-system adapters that simulate ERP/WMS/EHR feeds.

Included:

- Real-time stock and expiration visibility.
- Inventory event ingestion and normalization.
- Shortage, overstock, and expiration-risk alerts.
- Rules-based demand signals and replenishment recommendations.
- Compliance evidence capture and immutable audit trail.
- Role-based operational dashboard.

Deferred:

- Sales representative training platform.
- Full drug approval workflow.
- Production integrations with FDA, VA, DoD, distributors, or manufacturers.
- Patient-level clinical workflows.
- National-scale event streaming and multi-region deployment.
- Advanced AI/ML forecasting.

## Architecture

The Phase 1 POC uses a modular architecture with asynchronous ingestion. It should be deployable as a small number of services while preserving clean boundaries for later extraction.

- Operations Web App: authenticated dashboard for inventory, alerts, and compliance views.
- API Gateway: single entry point for user and partner API traffic.
- Inventory API: canonical medication inventory, lots, expirations, locations, and movements.
- Integration Gateway: adapters, payload validation, canonical mapping, idempotency, quarantine, and event publishing.
- Signal Service: shortage, overstock, expiration, and replenishment rules.
- Compliance Service: policy checks, audit evidence, and report generation.
- PostgreSQL: transactional system of record.
- Workflow Queue and Outbox: reliable asynchronous processing without requiring Kafka at pilot scale.
- Object Storage: evidence packages, regulatory exports, and integration payload archives.

## Why This Shape

Structurizr is the canonical model because it supports architecture as code, a shared model, multiple C4 views, stable view keys, validation, and exports. D2 is included as a lightweight companion because its C4-oriented features support reusable model fragments, filtered views, C4 person shapes, legends, and linked zoom-style diagrams.

The POC intentionally avoids premature national-scale infrastructure. Kafka, multi-region active-active deployment, and advanced AI forecasting are valid future options, but the first build needs to prove data integration, trust, and operational value.

Related decisions:

- [ADR-0001: Build Phase 1 as a Pilot-Ready Reference System](adr/0001-phase-1-pilot-scope.md)
- [ADR-0002: Use Queue/Outbox Before Kafka-Compatible Streaming](adr/0002-queue-outbox-before-kafka.md)
- [ADR-0003: Make Integration Gateway the Primary Component View](adr/0003-integration-gateway-boundary.md)
- [ADR-0004: Generate Compliance Evidence, Do Not Claim Automated Compliance](adr/0004-compliance-evidence-not-automated-compliance.md)
- [ADR-0005: Use a Modular Monolith in a Monorepo for Phase 1](adr/0005-modular-monolith-monorepo.md)
- [ADR-0006: Use Vue and Vite with Nuxt UI and Reka UI](adr/0006-vue-vite-nuxt-ui-reka-ui.md)
- [ADR-0007: Use AdonisJS, Lucid ORM, VineJS, and OpenAPI](adr/0007-adonis-lucid-vine-openapi.md)

## Data Flow

1. External systems publish inventory snapshots, shipment events, and dispense events.
2. Integration Gateway validates, maps, and normalizes each payload into the canonical model.
3. Inventory API updates current inventory and emits domain events.
4. Signal Service consumes events and produces shortage, overstock, and expiration-risk signals.
5. Compliance Service records evidence for every critical action and generates audit-ready reports.
6. Operations Web App presents stock, risk, recommendations, and compliance status to authorized users.

## Security and Compliance Baseline

The POC should be designed as if it will later handle regulated data:

- OAuth/OIDC for users and partner clients.
- Role-based access control by organization, site, and responsibility.
- Tenant-aware data partitioning.
- Encryption in transit and at rest.
- Append-only audit events for inventory corrections, overrides, exports, and integration failures.
- PHI minimization; the POC should not require patient-identifiable data.
- Evidence generation for SOC 2 control areas such as access, change tracking, logging, monitoring, and incident response.

The POC should not claim automated regulatory compliance. It should claim traceability, evidence generation, and operational controls that can support regulated review.

## Success Metrics

- Inventory freshness under 5 minutes for pilot sources.
- 95%+ successful ingestion rate for valid partner payloads.
- Invalid partner payloads are quarantined with clear error reasons and trace IDs.
- Expiration-risk report identifies items within configurable 30/60/90-day windows.
- Shortage alerts generated from configurable stock thresholds and demand forecasts.
- Every inventory correction and regulatory export has traceable audit evidence.
- Pilot operators can answer: what is available, where it is, when it expires, and whether action is needed.

## Suggested Implementation Backlog

1. Define canonical medication, lot, inventory, location, shipment, dispense, and audit event schemas.
2. Build Integration Gateway with CSV, JSON API, and mock HL7/FHIR-style adapter inputs.
3. Add validation, canonical mapping, idempotency, quarantine, and trace IDs.
4. Build Inventory API and PostgreSQL schema.
5. Emit inventory domain events through a transactional outbox and worker queue.
6. Build dashboard views for stock, expiration, shortages, and integration health.
7. Add rules-based shortage, overstock, and expiration signals.
8. Add compliance evidence capture and export package generation.
9. Run a pilot simulation with synthetic data across three organizations.

## Expansion Roadmap

After the Phase 1 POC is credible, expand in this order:

1. Add more partner adapters and partner self-service onboarding.
2. Introduce advanced forecasting once historical demand data is available.
3. Add secure sales representative training as a separate bounded context.
4. Add drug approval and audit workflow support for pharmaceutical organizations.
5. Move from queue/outbox to Kafka-compatible event streaming if event volume or independent consumers justify it.
6. Add regional and then national deployment patterns with stronger data governance.

## Risks

- Real partner integrations will vary widely; the POC should make adapter contracts explicit.
- Regulatory claims must stay scoped to evidence support, not automated legal compliance.
- Forecasting accuracy depends on historical demand data quality.
- Cross-organization data sharing will require governance, contracts, and access boundaries beyond the technical POC.
