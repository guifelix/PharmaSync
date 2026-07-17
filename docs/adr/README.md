# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for PharmaSync.

## Conventions

- Use one ADR per file.
- Keep ADR IDs stable once created.
- Prefer lowercase kebab-case filenames: `0001-phase-1-pilot-scope.md`.
- Start every ADR with YAML front matter for search, indexing, and future automation.
- Do not silently rewrite accepted decisions. Create a new ADR and mark the older one as superseded.
- Keep decisions about PharmaSync product and architecture only.

## Status Values

- `proposed`
- `accepted`
- `deprecated`
- `superseded`

## Index

| ID | Title | Status | Date | Area |
|---|---|---|---|---|
| [ADR-0001](0001-phase-1-pilot-scope.md) | Build Phase 1 as a Pilot-Ready Reference System | accepted | 2026-07-16 | product-scope |
| [ADR-0002](0002-queue-outbox-before-kafka.md) | Use Queue/Outbox Before Kafka-Compatible Streaming | accepted | 2026-07-16 | eventing |
| [ADR-0003](0003-integration-gateway-boundary.md) | Make Integration Gateway the Primary Component View | accepted | 2026-07-16 | integration |
| [ADR-0004](0004-compliance-evidence-not-automated-compliance.md) | Generate Compliance Evidence, Do Not Claim Automated Compliance | accepted | 2026-07-16 | compliance |
| [ADR-0005](0005-modular-monolith-monorepo.md) | Use a Modular Monolith in a Monorepo for Phase 1 | accepted | 2026-07-17 | application-architecture |
| [ADR-0006](0006-vue-vite-nuxt-ui-reka-ui.md) | Use Vue and Vite with Nuxt UI and Reka UI | accepted | 2026-07-17 | frontend |
| [ADR-0007](0007-adonis-lucid-vine-openapi.md) | Use AdonisJS, Lucid ORM, VineJS, and OpenAPI | accepted | 2026-07-17 | backend |

## By Area

### Product Scope

- [ADR-0001: Build Phase 1 as a Pilot-Ready Reference System](0001-phase-1-pilot-scope.md)

### Eventing

- [ADR-0002: Use Queue/Outbox Before Kafka-Compatible Streaming](0002-queue-outbox-before-kafka.md)

### Integration

- [ADR-0003: Make Integration Gateway the Primary Component View](0003-integration-gateway-boundary.md)

### Compliance

- [ADR-0004: Generate Compliance Evidence, Do Not Claim Automated Compliance](0004-compliance-evidence-not-automated-compliance.md)

### Application Architecture

- [ADR-0005: Use a Modular Monolith in a Monorepo for Phase 1](0005-modular-monolith-monorepo.md)

### Frontend

- [ADR-0006: Use Vue and Vite with Nuxt UI and Reka UI](0006-vue-vite-nuxt-ui-reka-ui.md)

### Backend

- [ADR-0007: Use AdonisJS, Lucid ORM, VineJS, and OpenAPI](0007-adonis-lucid-vine-openapi.md)

## By Tag

- `adapters`: [ADR-0003](0003-integration-gateway-boundary.md)
- `audit`: [ADR-0004](0004-compliance-evidence-not-automated-compliance.md)
- `compliance`: [ADR-0004](0004-compliance-evidence-not-automated-compliance.md)
- `eventing`: [ADR-0002](0002-queue-outbox-before-kafka.md), [ADR-0003](0003-integration-gateway-boundary.md)
- `evidence`: [ADR-0004](0004-compliance-evidence-not-automated-compliance.md)
- `integration`: [ADR-0003](0003-integration-gateway-boundary.md)
- `outbox`: [ADR-0002](0002-queue-outbox-before-kafka.md)
- `pilot`: [ADR-0001](0001-phase-1-pilot-scope.md)
- `product-scope`: [ADR-0001](0001-phase-1-pilot-scope.md)
- `queue`: [ADR-0002](0002-queue-outbox-before-kafka.md)
- `roadmap`: [ADR-0001](0001-phase-1-pilot-scope.md)
- `traceability`: [ADR-0004](0004-compliance-evidence-not-automated-compliance.md)
- `adonisjs`: [ADR-0007](0007-adonis-lucid-vine-openapi.md)
- `lucid`: [ADR-0007](0007-adonis-lucid-vine-openapi.md)
- `modular-monolith`: [ADR-0005](0005-modular-monolith-monorepo.md)
- `monorepo`: [ADR-0005](0005-modular-monolith-monorepo.md)
- `nuxt-ui`: [ADR-0006](0006-vue-vite-nuxt-ui-reka-ui.md)
- `openapi`: [ADR-0007](0007-adonis-lucid-vine-openapi.md)
- `reka-ui`: [ADR-0006](0006-vue-vite-nuxt-ui-reka-ui.md)
- `vinejs`: [ADR-0007](0007-adonis-lucid-vine-openapi.md)
- `vue`: [ADR-0006](0006-vue-vite-nuxt-ui-reka-ui.md)
 
