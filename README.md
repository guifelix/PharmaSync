# PharmaSync Protocol

PharmaSync is a work-in-progress pharmaceutical platform for real-time inventory integration, traceability, operational monitoring, and compliance evidence.

The intended product direction is a unified system that helps reduce medication waste, improve supply-chain visibility, and support coordinated operations across pharmaceutical workflows.

## Current Status

This repository is actively under development.

- The core monorepo structure is in place.
- The API, web app, worker, and shared packages are scaffolded.
- Architecture and system-design docs are maintained alongside the code.
- Backlog items track the delivery slices and their dependencies.
- The current implementation is the foundation of a larger platform, not the full product.

## What This Project Covers

- Pharmaceutical inventory intake and canonicalization
- Lot, expiration, and stock position tracking
- Outbox-backed event propagation
- Operational visibility and auditability
- Compliance evidence capture and packaging
- Shared contracts, architecture decisions, and process models

Planned product capabilities include:

- An integrated drug inventory and control system
- A secure training experience for pharmaceutical representatives
- Automated system integrations and API-based connectivity
- Approval, auditing, and reporting support for regulated workflows

## Repository Layout

- `apps/` - Deployable applications: API, web, and worker
- `packages/` - Shared domain, contracts, integration, configuration, observability, and test utilities
- `infra/` - Local and cloud infrastructure foundations
- `architecture/` - Structurizr C4 model, D2 diagrams, and local rendering guidance
- `docs/` - ADRs, solution design, and system-design notes
- `backlog/` - Structured delivery tasks and milestones
- `tools/` - Supporting tools and viewers

## Design References

Start here when you need the intended shape of the system:

- [Solution design](docs/solution-design.md)
- [Architecture README](architecture/README.md)
- [ADRs](docs/adr/README.md)
- [System design docs](docs/system-design/)
- [Process model docs](architecture/processes/README.md)

## Local Development

Prerequisites:

- Node.js and pnpm versions compatible with `package.json`
- Docker or Podman-compatible Docker CLI for local services
- A root `.env` file for shared local settings
- `apps/api/.env` based on `apps/api/.env.example`

Install dependencies:

```bash
pnpm install
```

Start local services:

```bash
pnpm services:up
```

Run the full stack:

```bash
pnpm dev
```

The stack includes:

- API: `http://localhost:3333`
- Web app: `http://localhost:5173`
- Worker: background process in the same terminal
- Postgres: `localhost:5432`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

Useful checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
