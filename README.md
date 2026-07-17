# PharmaSync Protocol POC

Pilot-ready reference system for PharmaSync Protocol, focused on pharmaceutical inventory integration, operational visibility, shortage/expiration signals, and compliance evidence.

## What is included

- `apps/` - Deployable web, API, and worker applications.
- `packages/` - Shared domain, integration, contracts, database, configuration, observability, and testkit packages.
- `infra/` - Local and AWS infrastructure foundations.
- `docs/solution-design.md` - POC scope, architecture rationale, implementation phases, risks, and success metrics.
- `docs/adr/` - Indexed Architecture Decision Records and ADR template.
- `docs/system-design/` - Production system design notes.
- `architecture/workspace.dsl` - Structurizr DSL model with C4 context, container, component, dynamic, and deployment views.
- `architecture/d2/context.d2` - D2 C4-style system context diagram.
- `architecture/d2/container.d2` - D2 C4-style container diagram.
- `architecture/d2/component-inventory-api.d2` - D2 component view for the Inventory API.
- `architecture/d2/component-integration-gateway.d2` - D2 component view for the Integration Gateway.
- `architecture/README.md` - Local viewing and export commands.

## Development

```bash
pnpm install
pnpm dev
```

Local services:

```bash
docker compose -f infra/local/docker-compose.yml up -d
```
