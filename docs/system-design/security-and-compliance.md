# Security and Compliance

Phase 1 security posture:

- OIDC-compatible workforce authentication with Cognito in AWS for pilot deployment.
- Local development may use signed bearer tokens with the same required workforce claim shape. This avoids a live identity provider for local testing while preserving the API contract expected from OIDC.
- Required OIDC configuration names the issuer URL, client ID, API audience, JWKS discovery URL, and accepted claims.
- Accepted workforce claims are `sub`, `iss`, `aud`, `exp`, `nbf`, `org_id` or `organization_id`, `site_ids` or `permitted_site_ids`, and `roles`.
- The authenticated request context must expose user ID, organization ID, permitted site IDs, roles, and request trace ID.
- Role-based access by organization, site, and responsibility. The Phase 1 permission matrix lives in [Permissions Matrix](permissions-matrix.md).
- Tenant-aware data access in every inventory, signal, integration, and audit query. Query code must use authenticated organization and permitted-site scope before returning tenant-owned records.
- Operational dashboard views should surface the trace IDs needed to investigate inventory, signal, quarantine, and audit events end to end.
- Encryption in transit and at rest.
- No patient-identifiable data required for the pilot.
- Append-only audit events for imports, corrections, quarantine actions, exports, and configuration changes.
- Authorization failures and allowed privileged actions produce structured audit logs with user, organization, role, permission, resource, and trace metadata until persisted audit events are introduced.

Compliance stance:

PharmaSync should generate traceability and evidence packages. It should not claim automated regulatory compliance. Human governance remains responsible for formal review and submission decisions.

## Related Processes

- [Evidence Collection](architecture/processes/system/evidence/evidence-collection.bpmn.ts) — captures audit events for every action
- [Evidence Packaging](architecture/processes/system/evidence/evidence-packaging.bpmn.ts) — bundles raw and normalized payloads
- [Evidence Export](architecture/processes/system/evidence/evidence-export.bpmn.ts) — exports evidence packages for external review
- [Evidence Requirements DMN](architecture/processes/dmn/compliance/evidence-requirements.dmn.ts) — decision table governing what evidence is required
- [Evidence Review](architecture/processes/human/evidence/evidence-review.bpmn.ts) — human review of exported evidence
- [Compliance Signoff](architecture/processes/human/evidence/compliance-signoff.bpmn.ts) — final human attestation for compliance packages
