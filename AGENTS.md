# MylesCRM

## Purpose

MylesCRM product codebase. This repository currently uses a Next.js app structure with `app/`, `components/`, `convex/`, `hooks/`, `lib/`, `public/`, and `types/`.

## Ownership

- Product owner: Myles.

## Local Contracts

- Do not touch source code while performing DOX maintenance.
- Panel naming must use `platform` for Master Admin, `admin` for Super Admin, and `dashboard` for Tenant App where panel concepts apply.
- Do not add placeholder UI, mock data, fake users, hardcoded secrets, or raw user-facing system errors.
- Keep environment values in `.env.local` and document variable names in `.env.example`.

## Work Guidance

- Read the nearest child `AGENTS.md` before editing a folder.
- Build backend contracts before UI that depends on them.
- Use the vault, product notes, Git state, and handoff notes as the default operating record.

## Verification

- Run `npm run typecheck`, `npm run lint`, and relevant tests for code changes.
- Read changed `AGENTS.md` files back after DOX updates.

# DOX Framework

- DOX is a self-documenting `AGENTS.md` hierarchy installed here.
- Agents must follow DOX instructions across any edits.

## Core Contract

- `AGENTS.md` files are binding work contracts for their subtrees.
- Source files, tests, scripts, docs, and assets must stay understandable from the nearest applicable `AGENTS.md` plus every parent `AGENTS.md` above it.

## Read Before Editing

1. Read this root `AGENTS.md`.
2. Identify every file or folder you expect to touch.
3. Walk from the repository root to each target path.
4. Read every `AGENTS.md` found along each route.
5. Use the nearest `AGENTS.md` as the local contract and parent docs for repo-wide rules.
6. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done. Update the closest owning `AGENTS.md` when structure, contracts, workflows, ownership, or child indexes change.

## Child Doc Shape

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Child DOX Index

- [app/AGENTS.md](app/AGENTS.md): Next.js routes, public pages, auth routes, API routes, and dashboard surface.
- [components/AGENTS.md](components/AGENTS.md): layout, marketing, and UI components.
- [convex/AGENTS.md](convex/AGENTS.md): Convex schema and backend functions.
- [docs/AGENTS.md](docs/AGENTS.md): repository documentation and plans.
- [hooks/AGENTS.md](hooks/AGENTS.md): React hooks.
- [lib/AGENTS.md](lib/AGENTS.md): shared application utilities.
- [public/AGENTS.md](public/AGENTS.md): public assets.
- [types/AGENTS.md](types/AGENTS.md): shared TypeScript types.
