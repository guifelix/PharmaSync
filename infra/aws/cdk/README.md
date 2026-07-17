# AWS CDK Infrastructure

Phase 1 production target:

- ECS Fargate services for `web`, `api`, and `worker`.
- RDS PostgreSQL for operational state.
- S3 for integration payload archives and evidence packages.
- Cognito for OIDC authentication.
- CloudWatch for logs and metrics.
- KMS and Secrets Manager / SSM Parameter Store for secrets and encryption.
- VPC private subnets for API, worker, and database runtime.

The CDK app should be added after the local vertical slice is running.
