# NarrativeKit — web

B2B SaaS messaging platform. Canonical narrative + pitch deck + one-pager + sales enablement deck, structured around MEDDIC and Command of the Message.

## Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- An Anthropic API key

## Setup

### 1. Install dependencies

```bash
cd web
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local |

### 3. Run the database migration

If using the Supabase CLI:

```bash
supabase db push
```

Or paste `supabase/migrations/001_init.sql` into the Supabase SQL Editor and run it.

### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project structure

```
web/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Public site: /, /product, /pricing, /examples, /faq
│   │   ├── (auth)/             # /login, /signup
│   │   └── app/                # Protected app: /app/*
│   │       └── projects/[id]/  # Per-project views
│   ├── components/
│   │   ├── ui/                 # Design system primitives
│   │   ├── marketing/          # Navbar, Footer
│   │   ├── app/                # Sidebar, TopBar, ProjectNav
│   │   └── shared/             # Logo, PageHeader, EmptyState, StatusBadge
│   ├── lib/
│   │   ├── ai/                 # AI pipeline: normalizer, narrative, assets
│   │   ├── db/                 # Supabase client
│   │   ├── prompts/            # System + user prompts for each AI stage
│   │   ├── renderers/          # Asset rendering (Phase 2: PDF)
│   │   ├── schemas/            # Zod schemas for all pipeline I/O
│   │   └── utils/              # cn, activation, confidence
│   └── types/                  # TypeScript interfaces
└── supabase/
    └── migrations/001_init.sql
```

## AI pipeline

| Stage | Input | Output | File |
|---|---|---|---|
| 1 — Intake normalization | 4 form fields | Structured JSON | `lib/ai/normalizer.ts` |
| 2 — Narrative synthesis | Normalized JSON | MEDDIC + CotM narrative | `lib/ai/narrative.ts` |
| 3a — Pitch deck | Narrative | 8 sections | `lib/ai/assets/pitch-deck.ts` |
| 3b — One-pager | Narrative | 7 sections | `lib/ai/assets/one-pager.ts` |
| 3c — Sales deck | Narrative | 10 sections | `lib/ai/assets/sales-deck.ts` |

All AI calls are server-side only. No Anthropic API key is ever sent to the browser.

## What is mocked

All app pages currently use hardcoded placeholder data. The following are stubs pending Supabase integration:

- Auth (login/signup forms are UI-only)
- Project list (`app/projects/page.tsx` uses `MOCK_PROJECTS`)
- Per-project data (narrative, inputs, assets use hardcoded mock objects)
- Settings profile form
- Billing page

## Deployment

Deploy to Vercel by connecting the GitHub repo and setting the root directory to `web/`.

Add all environment variables from `.env.local.example` to your Vercel project settings.

## Roadmap

| Phase | Focus |
|---|---|
| 1 (current) | Activation MVP — intake → narrative → first asset |
| 2 | All 3 assets, PDF export, narrative versioning, PostHog |
| 3 | Stripe billing, team workspaces, Resend emails |
