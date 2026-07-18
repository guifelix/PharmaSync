# Production Readiness

Phase 1 targets pilot production, not enterprise-wide rollout.

Required before pilot deployment:

- Health checks for API, database, object storage, and worker processing.
- Environment validation for all required secrets and connection strings.
- Database migrations and indexes reviewed against [database-design.md](database-design.md).
- Structured logs with trace IDs.
- Database migrations run automatically or as a controlled release step.
- S3 buckets encrypted with KMS.
- RDS encryption enabled.
- Least-privilege IAM roles for web, API, worker, and deployment.
- Synthetic or de-identified data only.

Operational targets:

- Inventory freshness under five minutes for pilot feeds.
- Valid feed ingestion success rate at or above 95%.
- Duplicate feeds do not double-count inventory.
- Invalid feeds produce quarantine records with actionable error reasons.
- Inventory corrections produce audit evidence.

## Related Processes

- [Platform Deployment](architecture/processes/operational/platform-deployment.bpmn.ts) — deployment workflow for pilot environments
- [Backup and Restore](architecture/processes/operational/backup-restore.bpmn.ts) — database and object storage backup procedures
- [Disaster Recovery](architecture/processes/operational/disaster-recovery.bpmn.ts) — recovery steps for infrastructure failure
