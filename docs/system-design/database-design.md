# Database Design

This document is the working convention set for PharmaSync's Phase 1 data layer.

It answers two questions:

1. How do we plan the database before writing migrations?
2. How do we keep the schema consistent as the app grows?

## Modeling Layers

- **Conceptual model:** what the business means. Keep this in [data-model.md](data-model.md).
- **Logical model:** entities, keys, relationships, ownership, and query shapes. Keep this in the table-level D2 diagram under `architecture/d2/`.
- **Physical model:** Lucid migrations, models, seeders, constraints, and indexes in `apps/api/database`.

Do not jump from business nouns directly to migrations. First define the query paths and ownership rules, then materialize only the Phase 1 slice that is actually needed.

## Planning Workflow

Use this order when introducing or changing data structures:

1. Start from the use case or query shape.
2. Update the conceptual model in [data-model.md](data-model.md) if the business boundary changed.
3. Update the logical table diagram in `architecture/d2/database-model.d2`.
4. Review the design against tenant scoping, immutability, and query volume.
5. Only then create or modify migrations.

For larger changes, do three reviews before implementation:

- **Domain review:** does the model match the business concept?
- **Access review:** does the model enforce tenant and site boundaries?
- **Physical review:** do the keys, indexes, and migration steps match the expected workload?

## Naming Conventions

- Table names use plural `snake_case`.
- Primary keys use an integer surrogate `id` in Phase 1.
- Natural business identifiers stay as unique columns when they matter for lookup or ingress mapping.
- Foreign key columns use `{table}_id`.
- Timestamp columns use `created_at` and `updated_at`.
- Reference data can use a `status` field when lifecycle state matters.

## ID and Key Policy

- Use surrogate integer IDs for local relational joins.
- Use stable external keys where tenant context or partner payloads need a durable business identifier, such as `organization_key` and `site_key`.
- Normalize externally sourced identifiers before enforcing uniqueness, such as normalized NDC values.
- Prefer unique constraints on canonical identifiers rather than duplicating the same business fact in multiple places.

## Soft Delete and Archive Policy

- Soft delete is not the default.
- Use append-only records for audit, outbox, and evidence tables.
- Use `status` or an explicit archive marker for operational reference data when business recovery matters.
- If a table needs reversible deletion, add `deleted_at` and make all read paths explicitly filter it.
- Never physically delete audit or outbox history once written.

## Tenant Scoping Rules

- Every tenant-owned table must carry `organization_id`.
- Any table that is queried at site granularity must also carry `site_id`.
- Public reference tables may be shared, but tenant-owned joins must still apply organization and site filters in the application layer.
- Query code must always scope by organization first, then by site when the request has a permitted site context.
- Do not rely on denormalized key columns as the only protection boundary.

## Indexing Strategy

Design indexes from query patterns, not from instinct.

- Inventory reads should optimize for `organization_id`, `site_id`, `medication_product_id`, `medication_lot_id`, and current status.
- Feed ingestion should optimize for partner keys, payload hashes, received timestamps, and quarantine lookup.
- Quarantine workflows should optimize for `organization_id`, `site_id`, `status`, and error category.
- Audit and evidence lookups should optimize for `organization_id`, `site_id`, `created_at`, `actor_id`, and trace identifiers.
- Outbox processing should optimize for delivery state, availability time, and event type.

Index every column only when there is a proven lookup path. Composite indexes are preferred over many single-column indexes when the query always scopes by the same tenant prefix.

## Outbox and Audit Rules

- Outbox rows are the delivery contract between transactional writes and asynchronous workers.
- Outbox rows should capture aggregate type, aggregate ID, event type, tenant scope, payload, trace ID, available time, publish time, and attempt count.
- Outbox records are append-only. Worker bookkeeping can change; the event payload cannot.
- Audit rows are the immutable record of who did what, when, and under which scope.
- Audit records should include actor, subject, action, trace ID, and enough before/after context to reconstruct the decision later.

## Current Phase 1 Data Surface

The target Phase 1 model is intentionally small and should grow only with proven workflows:

- Organizations and sites as tenant boundaries.
- Medication products and lots as reference and traceability data.
- Stock positions and inventory movements as operational truth.
- Partner feeds and quarantine records as ingestion control points.
- Risk signals as derived operational outputs.
- Audit events and evidence packages as governance records.
- Outbox events as the asynchronous delivery boundary.

## Where Documentation Lives

- Business boundaries and core nouns: [data-model.md](data-model.md)
- Table-level logical model: `architecture/d2/database-model.d2`
- Rendered table diagram: `architecture/out/database-model.svg`
- Physical schema: `apps/api/database/migrations`
- Shared SQL utilities and cross-app helpers: `packages/db/README.md`

## What Good Looks Like

A database design change is ready when:

- The business use case is documented.
- Tenant and site scope are explicit.
- The primary lookup paths are described.
- The migration is reversible or has a documented one-way reason.
- The diagram and docs match the current schema intent.
- The change is small enough to review without guessing.
