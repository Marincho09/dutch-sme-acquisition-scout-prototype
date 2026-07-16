# Architecture

## System shape

Dutch SME Acquisition Scout is a stateless Next.js interactive prototype with one server-side analysis boundary and browser-local result persistence.

- `components/dashboard.tsx` owns CSV selection, progress, ranking, export, and navigation state.
- `app/api/analyze/route.ts` validates each request, selects live or demo mode, and returns one assessment.
- `lib/schema.ts` defines the Zod contract shared across the API and UI.
- `lib/scoring.ts` owns weights and deterministic total-score calculation.
- `lib/mock.ts` contains curated sample profiles and conservative fallback behavior.
- `app/targets/[id]/page.tsx` renders the detailed profile shell; the client reads its validated assessment from local storage.

## Key decisions

### One company per request

Sequential requests keep progress visible and isolate company-level failures. A production-scale version would move long runs to resumable background jobs.

### Scoring belongs to application code

The model provides criterion-level evidence and proposed 1–5 values. The total is always recalculated using fixed weights in application code, making the ranking reproducible and testable.

### Structured validation at every boundary

CSV rows, API requests, model output, and restored browser data are validated with Zod before use. Invalid saved profiles are discarded.

### Evidence-safe fallback

Without an API key, the ten sample companies use curated official sources. Any other company receives a conservative mock profile that labels unsupported facts as `Information unavailable`.

### Browser-local persistence

Local storage is enough for an install-free MVP and detailed profile navigation. It is deliberately not positioned as multi-user or durable storage.

## Production evolution

A production version would add authenticated workspaces, encrypted database persistence, asynchronous batch jobs, source snapshots, configurable scorecards, audit trails, and rate-limit/retry controls.
