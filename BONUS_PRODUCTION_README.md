# Bonus: Production Endpoint Design (AWS Lambda + Amazon DocumentDB)

This document outlines a production-ready approach for implementing the tickets search endpoint.

## 1. AWS Lambda Implementation

### Assumptions

- Infrastructure is defined as code using either Amazon SAM or the Serverless Framework.
- Deployments are done through CI/CD (for example, GitHub Actions) with separate stages/environments (dev, staging, prod).
- API Gateway, Lambda, IAM roles/policies, CloudWatch alarms, VPC config, and DocumentDB connectivity are all provisioned by IaC templates.
- Snyk is used in CI/CD for dependency and container/code security scanning, with blocking thresholds for high/critical findings.
- Husky-managed Git hooks are enabled locally (for example, pre-commit or pre-push) to run linting/tests before code is pushed.

### Runtime and API shape

- Use API Gateway HTTP API -> Lambda (Node.js/TypeScript).
- Keep one handler per endpoint (`GET /tickets`) and share cross-cutting middleware:
  - request validation
  - structured logging
  - error mapping
  - request ID propagation

### Lambda execution flow

1. Parse and validate query params (`search`, optional filters, pagination).
2. Build a safe query object (no regex injection, bounded limits).
3. Query DocumentDB with projected fields and pagination.
4. Return `{ data, meta }` with request ID in headers and body.

### Operational hardening

- Configure reserved concurrency for predictable capacity.
- Use CloudWatch logs and metrics (latency, error rate, empty-result rate).
- Set alarms for p95 latency and 5xx error spikes.
- Keep DB credentials in AWS Secrets Manager.
- Place Lambda in VPC subnets with security-group access to DocumentDB.

## 2. DocumentDB Data Model

Use a single collection for tickets.

Example ticket document:

```json
{
  "_id": "TICK-100023",
  "subject": "Printer failure on floor 2",
  "requester": {
    "id": "usr_991",
    "name": "Alice Kim",
    "email": "alice@example.com"
  },
  "status": "open",
  "priority": "high",
  "tags": ["hardware", "printer"],
  "searchText": "printer failure on floor 2 alice kim alice@example.com hardware printer",
  "createdAt": "2026-06-30T11:20:00.000Z",
  "updatedAt": "2026-06-30T12:05:00.000Z"
}
```

Modeling notes:

- For this assessment, tickets are requester-owned in a single-tenant setup (no `tenantId` required).
- Keep user-facing search fields denormalized into `searchText` to simplify query paths.
- Store canonical enums for `status` and `priority`.
- Keep immutable `createdAt` and mutable `updatedAt` for sorting and troubleshooting.
- If this evolves into a SaaS multi-tenant platform, add `tenantId` and include it in all filter/index patterns.

## 3. Efficient Searching

Preferred production strategy:

- Use Atlas Search/OpenSearch for advanced full-text needs (stemming, typo tolerance, relevance).
- If staying in DocumentDB only, keep search bounded and predictable:
  - Normalize query text to lowercase and trim.
  - Tokenize query into words.
  - Query `searchText` with anchored patterns where possible.
  - Always combine with selective filters (`requester.id`, `status`) and pagination.

Suggested query pattern:

- Required filter: access scope (`requester.id` for end-user views, or no requester filter for support-agent views).
- Optional filter: `status`, `priority`.
- Text condition: token match on `searchText`.
- Sort: `createdAt` descending.
- Pagination: cursor-based (`createdAt` + `_id`) for stable paging at scale.

Performance safeguards:

- Enforce max page size (for example, 50).
- Reject very short search terms (for example, <2 chars).
- Project only fields needed by list views.

## 4. Index Design

Create indexes to support the dominant query patterns.

### Core indexes

```js
// Fast recent tickets listing for support-agent view
db.tickets.createIndex({ createdAt: -1, _id: -1 });

// End-user scoped listing: requester + recent
db.tickets.createIndex({ "requester.id": 1, createdAt: -1, _id: -1 });

// End-user scoped with status filter
db.tickets.createIndex({
  "requester.id": 1,
  status: 1,
  createdAt: -1,
  _id: -1,
});

// End-user scoped with priority filter
db.tickets.createIndex({
  "requester.id": 1,
  priority: 1,
  createdAt: -1,
  _id: -1,
});
```

### Text-search index option (DocumentDB capability dependent)

```js
// If your DocumentDB version supports text indexes for your use case
db.tickets.createIndex({
  subject: "text",
  "requester.name": "text",
  "requester.email": "text",
  tags: "text",
});
```

If native text behavior is insufficient:

- Move text search to OpenSearch and keep DocumentDB for source-of-truth ticket records.
- Index requester scope fields (`requester.id`), `status`, `priority`, and timestamps in DocumentDB for filtering and consistency checks.

## 5. Production Notes

- Keep Lambda handlers stateless and idempotent.
- Version the API contract and validate inputs strictly.
- Add integration tests for:
  - query validation
  - index-backed filter combinations
  - pagination correctness
  - empty and high-volume result sets
- Use gradual rollout (canary or weighted routing) before full traffic cutover.
