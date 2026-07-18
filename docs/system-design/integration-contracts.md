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

## Related Processes

- [Feed Ingestion](architecture/processes/system/ingestion/feed-ingestion.bpmn.ts)
- [Feed Validation](architecture/processes/system/ingestion/feed-validation.bpmn.ts)
- [Idempotency Check](architecture/processes/system/ingestion/idempotency-check.bpmn.ts)
- [Canonical Mapping](architecture/processes/system/ingestion/canonical-mapping.bpmn.ts)
- [Data Quality DMN](architecture/processes/dmn/partner/data-quality.dmn.ts)
- [Quarantine Review](architecture/processes/human/quarantine/quarantine-review.bpmn.ts)
