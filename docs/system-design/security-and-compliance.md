# Security and Compliance

Phase 1 security posture:

- OIDC-compatible workforce authentication with Cognito in AWS for pilot deployment.
- Local development may use signed bearer tokens with the same required workforce claim shape. This avoids a live identity provider for local testing while preserving the API contract expected from OIDC.
- Required OIDC configuration names the issuer URL, client ID, API audience, JWKS discovery URL, and accepted claims.
- Accepted workforce claims are `sub`, `iss`, `aud`, `exp`, `nbf`, `org_id` or `organization_id`, `site_ids` or `permitted_site_ids`, and `roles`.
- The authenticated request context must expose user ID, organization ID, permitted site IDs, roles, and request trace ID.
- Role-based access by organization, site, and responsibility.
- Tenant-aware data access in every inventory, signal, integration, and audit query.
- Encryption in transit and at rest.
- No patient-identifiable data required for the pilot.
- Append-only audit events for imports, corrections, quarantine actions, exports, and configuration changes.

Compliance stance:

PharmaSync should generate traceability and evidence packages. It should not claim automated regulatory compliance. Human governance remains responsible for formal review and submission decisions.
