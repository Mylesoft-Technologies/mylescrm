# components

## Purpose

Reusable MylesCRM components for layouts, marketing pages, and UI primitives.

## Ownership

- Product owner: Myles.

## Local Contracts

- Components must be fully typed.
- Text must come from props or real data, not fake placeholder content.
- Icons must use the approved icon system already present in the app.
- User-facing errors must not expose internal stack details.

## Work Guidance

- Reuse existing component patterns before adding new abstractions.

## Verification

- Run typecheck and visually verify affected surfaces for UI changes.

## Child DOX Index

- `layout/`: app and page layout components.
- `marketing/`: public marketing components.
- `ui/`: reusable UI primitives.
