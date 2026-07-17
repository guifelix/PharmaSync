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

Prerequisites:

- Node.js and pnpm matching `package.json`.
- Docker or Podman-compatible Docker CLI for local Postgres and MinIO.
- A root env file for local services and worker configuration.
- A local API env file at `apps/api/.env`. Start from `apps/api/.env.example`, then generate an Adonis app key:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
pnpm --filter @pharmasync/api exec node ace generate:key
```

Install dependencies:

```bash
pnpm install
```

Local services:

```bash
pnpm services:up
pnpm services:ps
```

Run database migrations:

```bash
pnpm --filter @pharmasync/api exec node ace migration:run --force
```

Run the full local stack:

```bash
pnpm dev
```

This starts:

- API: `http://localhost:3333`
- Web app: `http://localhost:5173`
- Worker: background process in the same terminal
- Postgres: `localhost:5432`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

Targeted dev commands:

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:worker
```

Basic validation:

```bash
curl -i http://localhost:3333
curl -I http://localhost:5173
pnpm typecheck
```

Stop local services:

```bash
pnpm services:down
```
