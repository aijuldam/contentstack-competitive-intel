-- NarrativeKit — initial schema
-- Run via: supabase db push

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────────────────────────────────────
create type project_status as enum ('draft', 'active', 'archived');

create table projects (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  status       project_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table projects enable row level security;

create policy "Users can manage own projects"
  on projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- PROJECT INTAKES
-- ─────────────────────────────────────────────────────────────────────────────
create type normalization_status as enum ('pending', 'complete', 'error');

create table project_intakes (
  id                    uuid primary key default uuid_generate_v4(),
  project_id            uuid not null references projects(id) on delete cascade,
  raw_input             jsonb not null,
  normalized_json       jsonb,
  confidence_score      int check (confidence_score between 0 and 100),
  normalization_status  normalization_status not null default 'pending',
  created_at            timestamptz not null default now()
);

alter table project_intakes enable row level security;

create policy "Users can manage own intakes"
  on project_intakes for all
  using (
    exists (
      select 1 from projects
      where projects.id = project_intakes.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- CANONICAL NARRATIVES
-- ─────────────────────────────────────────────────────────────────────────────
create type generation_status as enum ('pending', 'complete', 'error');

create table canonical_narratives (
  id                  uuid primary key default uuid_generate_v4(),
  project_id          uuid not null unique references projects(id) on delete cascade,
  meddic_blocks       jsonb,
  cotm_blocks         jsonb,
  generation_status   generation_status not null default 'pending',
  last_edited_at      timestamptz,
  created_at          timestamptz not null default now()
);

alter table canonical_narratives enable row level security;

create policy "Users can manage own narratives"
  on canonical_narratives for all
  using (
    exists (
      select 1 from projects
      where projects.id = canonical_narratives.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- ASSETS
-- ─────────────────────────────────────────────────────────────────────────────
create type asset_type as enum ('pitch_deck', 'one_pager', 'sales_deck');

create table assets (
  id                  uuid primary key default uuid_generate_v4(),
  project_id          uuid not null references projects(id) on delete cascade,
  narrative_id        uuid not null references canonical_narratives(id),
  asset_type          asset_type not null,
  sections            jsonb,
  generation_status   generation_status not null default 'pending',
  first_opened_at     timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (project_id, asset_type)
);

alter table assets enable row level security;

create policy "Users can manage own assets"
  on assets for all
  using (
    exists (
      select 1 from projects
      where projects.id = assets.project_id
        and projects.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- ACTIVATION EVENTS
-- ─────────────────────────────────────────────────────────────────────────────
create type activation_event_type as enum (
  'project_created',
  'narrative_generated',
  'asset_opened'
);

create table activation_events (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  project_id   uuid not null references projects(id) on delete cascade,
  event_type   activation_event_type not null,
  asset_type   text,
  created_at   timestamptz not null default now()
);

alter table activation_events enable row level security;

create policy "Users can manage own activation events"
  on activation_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function handle_updated_at();

create trigger assets_updated_at
  before update on assets
  for each row execute function handle_updated_at();
