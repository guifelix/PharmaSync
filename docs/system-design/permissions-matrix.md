# Permissions Matrix

Phase 1 uses four workforce roles from OIDC-compatible `roles` claims. A user may have multiple roles. `platform-admin` has explicit access to every Phase 1 permission because it owns configuration and cross-site administration.

| Capability | Permission | operations | compliance | integration | platform-admin |
|---|---|---:|---:|---:|---:|
| Read inventory stock positions | `inventory:read` | Yes | No | No | Yes |
| Read risk signals | `signals:read` | Yes | No | No | Yes |
| Read audit events | `audit:read` | No | Yes | No | Yes |
| Generate evidence packages | `evidence:generate` | No | Yes | No | Yes |
| Read integration health | `integration:health:read` | No | No | Yes | Yes |
| Inspect quarantine records | `quarantine:read` | No | No | Yes | Yes |
| Reprocess quarantined payloads | `quarantine:reprocess` | No | No | Yes | Yes |
| Change integration mappings | `integration:mappings:write` | No | No | No | Yes |
| Manage access/configuration | `configuration:manage` | No | No | No | Yes |

Authorization failures must produce structured audit logs with the denied permission, resource, user ID, organization ID, roles, permitted site IDs, and trace ID. Allowed privileged actions, including configuration changes and integration mapping changes, must also produce structured audit logs. Append-only persisted audit events are introduced by the audit-event task; until then, authorization logs are the enforceable audit trail for this boundary.
