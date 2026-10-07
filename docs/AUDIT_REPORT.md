# LaunchCraft AI — Baseline Audit (pre-architecture)

Audited: commit `cbc6325` on `main` · Date: 2026-10-06 · Scope: full repo read (≈8.9k lines), `tsc --noEmit` run.
Purpose: establish the true current state before the architecture/SDLC rewrite. Nothing in the existing product is being removed; this is the baseline we build on.

---

## 1. What the system is today

A single Next.js 15 (App Router) monolith. UI, API routes, business logic, AI calls and DB access all run in one deployable.

| Layer | Current implementation |
|---|---|
| UI | React 19, Tailwind, shadcn/Radix, Framer Motion |
| Auth | NextAuth v5 **beta**, Credentials only, JWT sessions, bcryptjs (cost 10) |
| API | `app/api/*` route handlers; `app/actions/auth.actions.ts` server actions |
| Logic | `lib/services/*` (class singletons) → `lib/repositories/*` (Prisma) |
| DB | PostgreSQL via Prisma 6, `db push` (no migrations) |
| AI | OpenAI SDK, `gpt-4-turbo-preview`, synchronous in-request, JSON mode |
| Billing | Stripe Checkout/Portal/Webhook, plans FREE/PRO/GROWTH |
| Email | `resend` installed, **unused** |
| Infra | Nothing defined: no CI, Docker, IaC, tests, logging, monitoring |

Domain model: `User 1-1 Subscription`, `User 1-N Project`, `Project 1-1 {LandingPage, PitchDeck, BusinessPlan}`, `Project 1-N {Lead, ValidationEntry}`.

Features: AI Launch Wizard, landing-page builder + public page `/lp/[id]` + lead capture, pitch deck, business plan, idea validation, lead table, admin panel (read-only), plan gating.

Architecture is already cleanly layered (route → service → repository) with Zod at the edges. That is a good base to evolve; the problems below are mostly missing production concerns, plus several real bugs.

---

## 2. Findings

Severity: **P0** blocks production / exploitable · **P1** must fix before public launch · **P2** scale/quality · **P3** hygiene.

### 2.1 Correctness / build

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| B-1 | P0 | **Project does not compile.** Mismatched JSX closing tags break `next build`. | `app/admin/users/page.tsx:116,119,123` (`</MenuItem>` vs `<DropdownMenuItem>`); `tsc` reports TS17002 ×3 |
| B-2 | P1 | **Billing is unreachable.** `subscriptionService.createCheckoutSession` / `createBillingPortalSession` exist but no API route or UI calls them. Users cannot upgrade. | grep: no callers |
| B-3 | P1 | **Idea-validation results are never persisted.** `validateIdeaSchema` has no `projectId`, Zod strips it, so `validateWithAI` skips saving. Also no `canAccessIdeaValidation` check on this path (FREE users get it). | `feature.schema.ts:116`, `route.ts:80-84` |
| B-4 | P1 | **Monthly AI quota is not enforced.** `aiGenerationsPerMonth` is defined but never read; only an in-memory rate limit exists. Free users are effectively unlimited → direct OpenAI cost exposure. | `feature-gate.ts` |
| B-5 | P2 | Lead `status` is a free `String` (default `"new"`) while the API uses `"NEW"` — inconsistent data. | `schema.prisma:134` vs `feature.schema.ts:41` |
| B-6 | P2 | Admin panel is display-only (suspend / permissions buttons do nothing). | `admin/users/page.tsx` |
| B-7 | P2 | `gpt-4-turbo-preview` is a deprecated alias; model is hardcoded in 6 places. | `openai.service.ts` |
| B-8 | P3 | `experimental.turbo` is deprecated config; `@prisma/extension-accelerate` and `resend` unused. | `next.config.ts`, `package.json` |

### 2.2 Security

| ID | Sev | Finding | Evidence / impact |
|---|---|---|---|
| S-1 | P0 | **Stored XSS via AI/user HTML.** `content.rawCode` (LLM output, and editable by the owner through `PATCH /api/landing-pages/[id]`) is rendered with `<iframe srcDoc>` and **no `sandbox` attribute** on the public same-origin page `/lp/[id]`. Visitors run arbitrary script on the app origin. Prompt injection via the project description makes this reachable without the owner being malicious. | `startup-landing-page.tsx:108-112`, `landing-page-editor.tsx:320` |
| S-2 | P0 | **Broken access control — lead data leak.** `GET /api/leads?projectId=` returns any project's leads to any logged-in user; `userId` is ignored. Same pattern in `validationService.findByProjectId` / `getAverageScore`. This is PII. | `lead.service.ts:39-41`, `validation.service.ts:60-62` |
| S-3 | P0 | **Broken access control — write.** `landingPageService.create` only checks ownership when a page already exists; `pitchDeckService.create` and `validationService.create` / `leadService`-style paths connect to any `projectId` without an ownership check. | `landing-page.service.ts:7-11`, `pitch-deck.service.ts:6-22` |
| S-4 | P1 | **Rate limiter is per-process memory.** On serverless / multi-instance it does not limit anything, and the store never evicts (memory leak). No limits at all on login, register, public lead POST. | `rate-limit.ts` |
| S-5 | P1 | **Public lead endpoint is abusable:** unauthenticated, no CAPTCHA/honeypot, no per-IP limit, no consent record; exhausts the owner's lead quota, spams owner's CRM. | `api/leads/route.ts` |
| S-6 | P1 | **Auth hardening missing:** no email verification, no password reset, no MFA, no lockout/throttle, JWT lifetime default (30 d) and role baked into the token — a suspended/demoted user keeps access until expiry. Register reveals whether an email exists. | `auth.config.ts`, `user.service.ts` |
| S-7 | P1 | **Prompt injection / untrusted output.** User text is interpolated straight into prompts; output is `JSON.parse`d and stored/rendered with no schema validation, size cap or sanitisation. | `prompts.ts`, `openai.service.ts` |
| S-8 | P1 | **Stripe webhook is not idempotent** and has no event ledger; `past_due`/`unpaid`/`incomplete` all collapse to `CANCELED`; `invoice.payment_failed`, `checkout.session.expired`, refunds/disputes not handled; plan derived from price-id env equality only. | `subscription.service.ts` |
| S-9 | P1 | **No security headers / CSP**, middleware matcher excludes `/api`, `images.remotePatterns` allows any https host (`**`), no CSRF review for cookie-authed JSON routes beyond NextAuth defaults. | `next.config.ts`, `middleware.ts` |
| S-10 | P1 | **Error leakage:** raw `error.message` (incl. Prisma/OpenAI errors) returned to clients; `console.error` of full errors/PII. | all routes |
| S-11 | P1 | **Seed script prints a default admin password** (`Admin123!`) and falls back to it if env missing. | `prisma/seed-admin.ts` |
| S-12 | P2 | No audit log, no secrets validation at boot (env read ad-hoc, some modules throw at import), no dependency scanning, `next-auth` pinned to a beta. | — |
| S-13 | P2 | Privacy/compliance gaps: no data export/delete (GDPR/CCPA), no consent for lead capture, no retention policy, PII (lead email/phone) stored unencrypted, no DPA story for sending user content to OpenAI. | — |

### 2.3 Scalability & performance

| ID | Sev | Finding |
|---|---|---|
| P-1 | P0 | AI generation (landing page with full HTML can take 30–90 s) runs **synchronously inside the HTTP request**. Will hit serverless timeouts and ties up workers; no retry, timeout, cancellation, or streaming. Needs async jobs + status polling/SSE. |
| P-2 | P1 | No usage metering/cost ledger; no per-user token accounting; no provider fallback or circuit breaker. |
| P-3 | P1 | No caching: public `/lp/[id]` hits Postgres on every view (needs ISR/CDN); `getUserLimits` re-queries per call (several round-trips per request). |
| P-4 | P2 | `userRepository.findById` includes all projects; admin `list()` unpaginated; no pagination on leads/projects. |
| P-5 | P2 | Prisma without pooled connection strategy documented for serverless; `directUrl` is set but `prisma.config.ts` requires `DATABASE_URL` at generate time (breaks fresh CI/build — observed). |
| P-6 | P2 | Large generated HTML stored inline in a JSON column with no versioning, size limit or object storage. |

### 2.4 Maintainability, delivery & operations

| ID | Sev | Finding |
|---|---|---|
| O-1 | P1 | **Zero automated tests** (unit, integration, e2e). No CI, no lint/type gate (which is why B-1 shipped). |
| O-2 | P1 | **No migrations** (`prisma db push` only) — no safe, reviewable schema evolution or rollback. |
| O-3 | P1 | No observability: structured logging, tracing, metrics, error tracking, health/readiness endpoints, uptime/SLOs. |
| O-4 | P1 | No environments strategy (dev/staging/prod), no IaC, no deployment pipeline, no backup/restore/DR plan. |
| O-5 | P2 | Services are singletons that import each other and the OpenAI client at module load (throws if key missing) → hard to test/mock; business rules (limits) live in `middleware/` and are re-queried ad hoc. |
| O-6 | P2 | Inconsistent error handling/HTTP status mapping (everything `400`/`500`); no typed error model or API contract (no OpenAPI). |
| O-7 | P3 | Docs are marketing-style phase reports (`PHASE_1..5_COMPLETE.md`), `README` has no ops/architecture content and a dated credit line; no ADRs. |

---

## 3. What is solid and should be kept

- Route → service → repository layering and Zod input validation.
- Ownership-checked `findById` pattern in most services (just needs to be universal).
- Stripe signature verification on the webhook; Stripe API version pinned.
- Plan/limit concept (`PLAN_LIMITS`) — good seed for an entitlements engine.
- Cascade deletes, FK indexes, cuid IDs, passwords never returned from `UserService`.
- Prompt module separated from the AI client.

---

## 4. Implications for the architecture (inputs, not decisions yet)

1. **Async AI pipeline** (queue + workers + job table + streaming status) is the single biggest structural change (P-1, B-4, P-2).
2. **Central authorization layer** (policy functions / row-level scoping) instead of per-service ad-hoc checks (S-2, S-3).
3. **Untrusted-content boundary** for all generated HTML: sandboxed iframe on a separate origin/domain, strict CSP, structured sections instead of raw HTML where possible (S-1, S-7).
4. **Entitlements + usage ledger** as first-class domain (B-4, S-8), with idempotent Stripe event processing.
5. **Distributed rate limiting/caching** (Redis-class store) and CDN/ISR for public pages (S-4, P-3).
6. **Platform baseline:** migrations, CI/CD with quality gates, tests, observability, environments, backups (O-1…O-4).

---

## 5. Recommended immediate fixes (before/alongside architecture)

Small, low-risk, independent of the redesign: **B-1** (build break), **S-2/S-3** (access control), **S-1** (add `sandbox`, no `allow-same-origin`), **B-3**, **S-11**. These should be the first Sprint-0 stories.

## 6. Open questions for product owner

1. Target region(s) and data-residency/compliance needs (GDPR? SOC 2 later?).
2. Hosting preference: stay on Vercel + managed services, or containers on AWS/GCP?
3. Expected load: users at launch, peak concurrent AI generations, public-page traffic.
4. LLM strategy: OpenAI only, or multi-provider (Anthropic/OpenAI) with fallback? Monthly AI budget per plan?
5. Custom domains for published landing pages, and "API access" (listed in Growth plan) — in scope for v1?
6. Payment scope: Stripe only; tax/VAT handling; free trial?
7. Team size/cadence for sprint planning.
