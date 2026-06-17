-- 003_messaging_foundation.sql
-- Adds Messaging Foundation storage, prompt versioning, and richer generation
-- run logging. Additive and idempotent: safe to run on an existing database.

-- ─────────────────────────────────────────────────────────────────────────────
-- New run_type values for the finer-grained pipeline steps.
-- (ADD VALUE is safe inside a transaction in PG12+ as long as the new values are
--  not used in the same transaction, which they are not here.)
-- ─────────────────────────────────────────────────────────────────────────────
alter type run_type add value if not exists 'enrichment';
alter type run_type add value if not exists 'gap_analysis';
alter type run_type add value if not exists 'foundation';

-- ─────────────────────────────────────────────────────────────────────────────
-- narrative_versions: store the full Messaging Foundation document plus the
-- prompt version and generation metadata that produced it, and approval state.
-- The legacy meddic_blocks / cotm_blocks columns are retained and kept in sync.
-- ─────────────────────────────────────────────────────────────────────────────
alter table narrative_versions
  add column if not exists foundation          jsonb,
  add column if not exists prompt_version       text,
  add column if not exists generation_metadata  jsonb,
  add column if not exists approved_at          timestamptz,
  add column if not exists approved_by          uuid references auth.users(id) on delete set null;

-- ─────────────────────────────────────────────────────────────────────────────
-- asset_versions: track the prompt version and metadata behind each asset.
-- ─────────────────────────────────────────────────────────────────────────────
alter table asset_versions
  add column if not exists prompt_version      text,
  add column if not exists generation_metadata jsonb;

-- ─────────────────────────────────────────────────────────────────────────────
-- generation_runs: record prompt version, attempt count, and debug payload so
-- failures are inspectable and runs are reproducible.
-- ─────────────────────────────────────────────────────────────────────────────
alter table generation_runs
  add column if not exists prompt_version text,
  add column if not exists attempts       int not null default 0,
  add column if not exists debug          jsonb;
