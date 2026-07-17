# Integration Contracts

Phase 1 supports partner-feed simulation rather than real pharmacy-system access.

Accepted feed types:

- CSV inventory snapshots.
- JSON inventory movement batches.
- Mock healthcare-format payloads that exercise adapter boundaries.

Integration Gateway responsibilities:

- Attach trace IDs to every feed.
- Archive raw payloads.
- Validate required fields and business constraints.
- Map partner-specific records into canonical inventory events.
- Deduplicate by partner, source event ID, and payload hash.
- Quarantine invalid, duplicate, or conflicting payloads with reason codes.
- Publish accepted events through the outbox workflow.

The initial API contract lives in `packages/contracts/openapi/pharmasync.v1.yaml`.
