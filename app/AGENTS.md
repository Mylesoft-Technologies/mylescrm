# app

## Purpose

Next.js App Router routes for MylesCRM, including public marketing pages, auth routes, API routes, and the `/dashboard` tenant app surface.

## Ownership

- Product owner: Myles.

## Local Contracts

- Tenant app routes live under `/dashboard`.
- Protected routes must verify identity and role server-side.
- API routes must return professional user-facing errors and log technical details server-side only.
- No placeholder data, fake records, or hardcoded operational values.

## Work Guidance

- Confirm backend functions exist before rendering data-dependent UI.
- Keep public routes separate from authenticated dashboard routes.

## Verification

- Verify route loads, auth redirects, and error states after route changes.

## Child DOX Index

- `api/`: route handlers and webhooks.
- `dashboard/`: tenant app surface.
