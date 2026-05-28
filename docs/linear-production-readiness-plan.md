# MylesCRM Production Readiness Linear Plan

## Project

**Name:** MylesCRM Production Readiness  
**Team:** Mylesoft Technologies  
**Target:** 2026-06-30  
**Priority:** High  

## Project Summary

Take MylesCRM from the current deployed build to a fully production-ready CRM product, covering the public buyer journey, dashboard panels, authentication, Convex backend, payments, AI, email, QA, observability, documentation, and launch operations.

## Clarification Questions

1. What is the production launch target date and which customer segment should be prioritized first: SMEs, real estate, insurance, field sales, or enterprise?
2. Should paid plans remain fixed at KSh 3,500, KSh 9,500, and KSh 24,000, or should pricing be finalized after a sales review?
3. Which payment methods are required at launch: M-Pesa only, Stripe only, or both?
4. Should WorkOS support only personal accounts first, or organization-based SSO/multi-tenant invites from day one?
5. What data retention, export, audit log, and compliance requirements should be treated as launch blockers?
6. Who owns production support after launch: MylesCRM team, MylesCorp central support, or a named support rota?

## Milestones

1. Public Site and Buyer Journey
2. Dashboard Panels and CRM Workflows
3. Auth, Data, and Backend Hardening
4. Integrations: Payments, Email, and AI
5. QA, Observability, and Launch

## Issues

### Public Site and Buyer Journey

1. **Finalize public navigation and information architecture**
   - Verify all public routes are intentional and unauthenticated.
   - Confirm navbar, footer, CTA hierarchy, and route order.
   - Acceptance: Home, Features, Industries, Implementation, Security, Resources, Pricing, About, Contact, Privacy, and Terms load publicly with no WorkOS redirect.

2. **Polish landing page for production conversion**
   - Tighten hero copy, proof points, product preview, MylesCorp band, and CTA flow.
   - Add stronger buyer outcomes and local market positioning.
   - Acceptance: Home page has a clear demo CTA, KSh positioning, MylesCorp ownership, WhatsApp, and live chat.

3. **Expand Features page into product capability map**
   - Cover contacts, companies, deals, pipeline, activities, AI, reporting, email, invoices, billing, settings, and admin.
   - Acceptance: Feature page maps each core panel to user value and launch readiness.

4. **Build Industries page content for priority segments**
   - Add pages or sections for SMEs, real estate, insurance/finance, field sales, education, and AI-ready teams.
   - Acceptance: Each segment has use case, workflow fit, and CTA.

5. **Build Implementation page into deployment playbook**
   - Include discovery, configuration, migration, training, launch, and optimization.
   - Acceptance: Buyers understand implementation timeline and responsibilities.

6. **Build Security page into trust center foundation**
   - Cover authentication boundary, user access model, infrastructure, data habits, and responsible outreach.
   - Acceptance: Security claims match current implementation and do not overpromise.

7. **Create Resources page content backlog**
   - Add readiness checklist, pipeline hygiene guide, KSh-first revenue operations guide, and security basics.
   - Acceptance: Resource links are useful and not empty placeholders.

8. **Review legal pages for production**
   - Privacy and Terms should mention MylesCRM as a MylesCorp Technologies product, KSh/KES billing, providers, data responsibilities, and customer obligations.
   - Acceptance: Legal copy is accurate enough for launch review and flagged for legal counsel if needed.

### Dashboard Panels and CRM Workflows

9. **Harden dashboard shell and navigation**
   - Review sidebar, header, mobile behavior, active states, auth redirects, and logout.
   - Acceptance: Dashboard navigation works consistently across all panels.

10. **Productionize main dashboard panel**
    - Replace mock KPI data with Convex-backed queries or clearly scoped demo mode.
    - Acceptance: Revenue, pipeline, activity, lead source, AI insight, and hot deal widgets have real data strategy.

11. **Productionize contacts panel**
    - Complete create/edit/search/filter/sort/contact detail flow.
    - Acceptance: Contacts can be managed end-to-end with validation and empty states.

12. **Productionize companies panel**
    - Add company list, detail, linked contacts/deals, status, and ownership.
    - Acceptance: Company records are useful for account-based selling.

13. **Productionize deals panel**
    - Complete deal create/edit, stage assignment, probability, value, priority, and related contact/company.
    - Acceptance: Deals can move through full sales lifecycle.

14. **Productionize pipeline kanban panel**
    - Persist drag-and-drop stage changes to Convex.
    - Add empty states, loading states, error handling, and mobile layout.
    - Acceptance: Pipeline movement is saved and reflected in reports.

15. **Productionize activities panel**
    - Add activity creation, filtering, and relationship links to contacts/deals.
    - Acceptance: Calls, emails, meetings, notes, and tasks are captured and queryable.

16. **Productionize calendar panel**
    - Decide whether calendar is internal-only or integrated with Google/Outlook later.
    - Acceptance: Launch version has useful CRM follow-up scheduling behavior.

17. **Productionize email panel**
    - Connect sent email records to Resend or define initial manual email logging flow.
    - Acceptance: Email activity is stored against CRM records.

18. **Productionize invoices panel**
    - Connect invoice list, detail, status, totals, and payment tracking to Convex.
    - Acceptance: Invoices use KES/KSh only and support launch payment flow.

19. **Productionize billing panel**
    - Replace demo payment modal with real M-Pesa/Stripe flow or gated beta behavior.
    - Acceptance: Users cannot trigger misleading fake production payments.

20. **Productionize reports panel**
    - Define report queries for revenue, deal stage, conversion, sales activity, and forecast.
    - Acceptance: Reports reflect real CRM data and KSh formatting.

21. **Productionize AI assistant panel**
    - Connect AI chat, lead scoring, email drafting, and forecasting to real context with safety checks.
    - Acceptance: AI features have loading, error, rate-limit, and fallback behavior.

22. **Productionize settings panel**
    - Persist organization name, timezone, currency, website, user preferences, and admin controls.
    - Acceptance: Settings update Convex and respect KES-only currency requirement.

### Auth, Data, and Backend Hardening

23. **Review WorkOS AuthKit production configuration**
    - Confirm client ID, redirect URI, logout behavior, callback route, and production app URL.
    - Acceptance: Login works on production custom domain.

24. **Define multi-tenant organization model**
    - Confirm personal org behavior, WorkOS org mapping, invite model, roles, and permissions.
    - Acceptance: Tenancy boundaries are documented and enforced in Convex queries/mutations.

25. **Audit protected vs public routes**
    - Verify public routes remain public and dashboard/API routes remain protected.
    - Acceptance: No public page redirects to WorkOS and no private page leaks unauthenticated data.

26. **Harden Convex schema for production**
    - Review indexes, required fields, org scoping, soft delete strategy, and timestamps.
    - Acceptance: Schema supports expected queries without table scans or tenant leaks.

27. **Audit Convex functions for authorization**
    - Ensure every query/mutation validates org/user access.
    - Acceptance: Unauthorized users cannot read or mutate another org's data.

28. **Create production seed/demo data strategy**
    - Decide whether demo data is created per org, hidden behind demo mode, or removed.
    - Acceptance: Production users do not see misleading shared mock data.

29. **Standardize KSh/KES formatting across backend and frontend**
    - Ensure `formatCurrency` defaults to KES and all persisted currency defaults use KES.
    - Acceptance: No USD pricing or sample financial values remain in user-facing production screens.

### Integrations: Payments, Email, and AI

30. **Complete M-Pesa Daraja production readiness**
    - Verify credentials, callback URLs, STK push flow, status query, error handling, and reconciliation.
    - Acceptance: M-Pesa payment can be tested safely in sandbox and configured for production.

31. **Review Stripe launch role**
    - Decide whether Stripe remains enabled, hidden, or secondary to M-Pesa.
    - Acceptance: Stripe UI/API behavior matches business decision.

32. **Productionize webhook handling**
    - Verify Daraja and Stripe webhooks validate payloads, update invoices/payments, and log failures.
    - Acceptance: Webhooks are idempotent and observable.

33. **Productionize Resend email sending**
    - Confirm sending domain, from address, templates, error handling, and activity logging.
    - Acceptance: Emails send from approved domain and are recorded where relevant.

34. **Productionize AI provider integration**
    - Review OpenRouter/Myles AI key handling, prompts, context limits, JSON parsing, and cost control.
    - Acceptance: AI features are safe, bounded, and can fail gracefully.

35. **Add integration environment checklist**
    - Document required env vars for Vercel and Convex.
    - Acceptance: Production deploy can be reproduced without tribal knowledge.

### QA, Observability, and Launch

36. **Add public route smoke tests**
    - Test `/`, `/features`, `/industries`, `/implementation`, `/security`, `/resources`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`.
    - Acceptance: Each returns 200 and has no unauthenticated redirect.

37. **Add dashboard smoke tests**
    - Validate login, dashboard route access, panel navigation, and basic render state.
    - Acceptance: Authenticated user can reach every dashboard panel.

38. **Add critical workflow tests**
    - Cover contact creation, deal creation, pipeline move, invoice creation, payment status update, AI draft, and report visibility.
    - Acceptance: Core workflows pass locally and in preview.

39. **Set up production error monitoring**
    - Decide on Vercel logs, drains, Sentry, or other error tracking.
    - Acceptance: Runtime errors are visible after deploy.

40. **Set up analytics and conversion tracking**
    - Track landing page CTA clicks, WhatsApp clicks, live chat clicks, demo requests, and signup/login starts.
    - Acceptance: Product team can see marketing funnel performance.

41. **Create launch checklist document**
    - Include env vars, domains, WorkOS redirects, Convex deploy, Vercel deploy, smoke tests, rollback, and owner contacts.
    - Acceptance: Launch can be run by someone other than the original developer.

42. **Create support and incident workflow**
    - Define support inbox, WhatsApp owner, triage SLA, incident severity, and escalation path.
    - Acceptance: Customer issues have a clear owner after production launch.

43. **Dependency and vulnerability cleanup**
    - Resolve or explicitly accept npm audit moderate vulnerabilities.
    - Acceptance: Security review has a recorded decision.

44. **Mobile responsiveness QA**
    - Verify public site and dashboard panels across phone, tablet, and desktop viewports.
    - Acceptance: No text overlap, unusable nav, or broken cards on common viewports.

45. **Performance and SEO pass**
    - Review metadata, Open Graph, sitemap/robots, image strategy, Core Web Vitals, and accessibility.
    - Acceptance: Public site is professional, discoverable, and fast.
