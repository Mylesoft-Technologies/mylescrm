# convex

## Purpose

Convex backend schema, functions, and generated API bindings for MylesCRM.

## Ownership

- Product owner: Myles.

## Local Contracts

- Authenticate first, authorize second, tenant-scope third, business logic last.
- All mutations require full input validation.
- Tenant-scoped queries must use tenant indexes.
- Keep generated files out of manual edits.

## Work Guidance

- Build backend functions before UI pages that depend on them.

## Verification

- Run typecheck and test valid, invalid, and wrong-tenant function paths.

## Child DOX Index

- No child DOX files yet.
