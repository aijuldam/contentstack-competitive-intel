-- NarrativeKit — complete schema v2
-- Safe to run on a fresh Supabase project.
-- All tables use Row Level Security. Policy functions are created first.

-- ─────────────────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────────────
create type workspace_role      as enum ('owner', 'admin', 'member');
create type project_status      as enum ('draft', 'active', 'archived');
create type normalization_status as enum ('pending', 'complete', 'error');
create type generation_status   as enum ('pending', 'running', 'complete', 'error');
create type asset_type          as enum ('pitch_deck', 'one_pager', 'sales_deck');
create type run_type            as enum ('normalize', 'narrative', 'asset');
create type export_format       as enum ('pdf', 'markdown', 'pptx');
create type export_status       as enum ('pending', 'processing', 'complete', 'error');
create type activation_event_type as enum (
  'project_created',
  'narrative_generated',
  'asset_opened'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- WORKSPACES
-- ─────────────────────────────────────────────────────────────────────────────
create table workspaces (
  id          uuid        primary key default uuid_generate_v4(),
  name        text        not null,
  slug        text        not null unique,
  owner_id    uuid        not null references auth.users(id) on delete restrict,
  plan        text        not null default 'free',
  metadata    jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table workspaces enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- WORKSPACE MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────
create table workspace_members (
  id            uuid            primary key default uuid_generate_v4(),
  workspace_id  uuid            not null references workspaces(id) on delete cascade,
  user_id       uuid            not null references auth.users(id) on delete cascade,
  role          workspace_role  not null default 'member',
  invited_by    uuid            references auth.users(id) on delete set null,
  joined_at     timestamptz     not null default now(),
  unique(workspace_id, user_id)
);

alter table workspace_members enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS HELPER FUNCTIONS
-- These are security-definer so they run as the DB owner, avoiding recursive
-- policy checks and keeping per-table policies readable.
-- ─────────────────────────────────────────────────────────────────────────────

-- Is the calling user a member of this workspace?
create or replace function is_workspace_member(p_workspace_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = p_workspace_id
      and user_id      = auth.uid()
  );
$$;

-- Is the calling user a member of the workspace that owns this project?
create or replace function is_project_member(p_project_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1
    from   projects p
    join   workspace_members wm on wm.workspace_id = p.workspace_id
    where  p.id        = p_project_id
      and  wm.user_id  = auth.uid()
  );
$$;

-- Is the calling user an owner or admin of this workspace?
create or replace function is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = p_workspace_id
      and user_id      = auth.uid()
      and role         in ('owner', 'admin')
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS POLICIES: WORKSPACES
-- ─────────────────────────────────────────────────────────────────────────────
create policy "members can read their workspaces"
  on workspaces for select
  using (is_workspace_member(id));

create policy "admins can update workspace"
  on workspaces for update
  using (is_workspace_admin(id))
  with check (is_workspace_admin(id));

-- Insert is handled by the createWorkspace server action using service_role
-- to avoid a chicken-and-egg RLS problem (member record doesn't exist yet).

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS POLICIES: WORKSPACE MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────
create policy "members can read workspace membership"
  on workspace_members for select
  using (is_workspace_member(workspace_id));

create policy "user can read their own membership"
  on workspace_members for select
  using (user_id = auth.uid());

create policy "admins can manage members"
  on workspace_members for all
  using (is_workspace_admin(workspace_id))
  with check (is_workspace_admin(workspace_id));

-- Allow self-join (owner record insert handled by createWorkspace action)

-- ─────────────────────────────────────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────────────────────────────────────
create table projects (
  id            uuid           primary key default uuid_generate_v4(),
  workspace_id  uuid           not null references workspaces(id) on delete cascade,
  created_by    uuid           references auth.users(id) on delete set null,
  name          text           not null,
  status        project_status not null default 'draft',
  created_at    timestamptz    not null default now(),
  updated_at    timestamptz    not null default now()
);

alter table projects enable row level security;

create policy "workspace members can read projects"
  on projects for select
  using (is_workspace_member(workspace_id));

create policy "workspace members can create projects"
  on projects for insert
  with check (
    is_workspace_member(workspace_id)
    and auth.uid() = created_by
  );

create policy "workspace members can update projects"
  on projects for update
  using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "workspace admins can delete projects"
  on projects for delete
  using (is_workspace_admin(workspace_id));

-- ─────────────────────────────────────────────────────────────────────────────
-- PROJECT SOURCES  (intake form data, one per normalization run)
-- ─────────────────────────────────────────────────────────────────────────────
create table project_sources (
  id                    uuid                  primary key default uuid_generate_v4(),
  project_id            uuid                  not null references projects(id) on delete cascade,
  raw_input             jsonb                 not null,
  normalized_json       jsonb,
  confidence_score      int                   check (confidence_score between 0 and 100),
  normalization_status  normalization_status  not null default 'pending',
  created_at            timestamptz           not null default now(),
  updated_at            timestamptz           not null default now()
);

alter table project_sources enable row level security;

create policy "project members can manage sources"
  on project_sources for all
  using (is_project_member(project_id))
  with check (is_project_member(project_id));

-- ─────────────────────────────────────────────────────────────────────────────
-- BRAND PROFILES  (workspace-level, optional)
-- ─────────────────────────────────────────────────────────────────────────────
create table brand_profiles (
  id            uuid        primary key default uuid_generate_v4(),
  workspace_id  uuid        not null references workspaces(id) on delete cascade,
  name          text        not null,
  description   text,
  voice_notes   text,
  metadata      jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table brand_profiles enable row level security;

create policy "workspace members can read brand profiles"
  on brand_profiles for select
  using (is_workspace_member(workspace_id));

create policy "workspace admins can manage brand profiles"
  on brand_profiles for all
  using (is_workspace_admin(workspace_id))
  with check (is_workspace_admin(workspace_id));

-- ─────────────────────────────────────────────────────────────────────────────
-- NARRATIVE VERSIONS
-- One project → many versions. Only one is_current = true per project at a time.
-- ─────────────────────────────────────────────────────────────────────────────
create table narrative_versions (
  id                  uuid               primary key default uuid_generate_v4(),
  project_id          uuid               not null references projects(id) on delete cascade,
  version_number      int                not null,
  meddic_blocks       jsonb,
  cotm_blocks         jsonb,
  generation_status   generation_status  not null default 'pending',
  is_current          boolean            not null default true,
  created_by          uuid               references auth.users(id) on delete set null,
  created_at          timestamptz        not null default now(),
  unique(project_id, version_number)
);

alter table narrative_versions enable row level security;

create policy "project members can manage narrative versions"
  on narrative_versions for all
  using (is_project_member(project_id))
  with check (is_project_member(project_id));

-- Ensure at most one current narrative per project
create unique index narrative_versions_one_current
  on narrative_versions(project_id)
  where is_current = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- ASSETS  (one per project per type; tracks generation lifecycle)
-- ─────────────────────────────────────────────────────────────────────────────
create table assets (
  id                  uuid               primary key default uuid_generate_v4(),
  project_id          uuid               not null references projects(id) on delete cascade,
  asset_type          asset_type         not null,
  generation_status   generation_status  not null default 'pending',
  first_opened_at     timestamptz,
  created_at          timestamptz        not null default now(),
  updated_at          timestamptz        not null default now(),
  unique(project_id, asset_type)
);

alter table assets enable row level security;

create policy "project members can manage assets"
  on assets for all
  using (is_project_member(project_id))
  with check (is_project_member(project_id));

-- ─────────────────────────────────────────────────────────────────────────────
-- ASSET VERSIONS
-- Each generation or manual edit creates a new version.
-- narrative_version_id pins which narrative was used.
-- ─────────────────────────────────────────────────────────────────────────────
create table asset_versions (
  id                    uuid               primary key default uuid_generate_v4(),
  asset_id              uuid               not null references assets(id) on delete cascade,
  narrative_version_id  uuid               references narrative_versions(id) on delete set null,
  version_number        int                not null,
  sections              jsonb,
  generation_status     generation_status  not null default 'pending',
  is_current            boolean            not null default true,
  created_by            uuid               references auth.users(id) on delete set null,
  created_at            timestamptz        not null default now(),
  unique(asset_id, version_number)
);

alter table asset_versions enable row level security;

-- Helper: asset belongs to a project the user is a member of
create or replace function is_asset_member(p_asset_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1
    from   assets a
    join   projects p on p.id = a.project_id
    join   workspace_members wm on wm.workspace_id = p.workspace_id
    where  a.id       = p_asset_id
      and  wm.user_id = auth.uid()
  );
$$;

create policy "project members can manage asset versions"
  on asset_versions for all
  using (is_asset_member(asset_id))
  with check (is_asset_member(asset_id));

-- Ensure at most one current version per asset
create unique index asset_versions_one_current
  on asset_versions(asset_id)
  where is_current = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- GENERATION RUNS  (audit log for all AI pipeline calls)
-- ─────────────────────────────────────────────────────────────────────────────
create table generation_runs (
  id             uuid        primary key default uuid_generate_v4(),
  project_id     uuid        not null references projects(id) on delete cascade,
  run_type       run_type    not null,
  status         generation_status not null default 'pending',
  input_hash     text,                 -- sha256 of input for dedup/caching
  output_ref     jsonb,                -- {table, id} pointing to the created record
  error_message  text,
  started_at     timestamptz,
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);

alter table generation_runs enable row level security;

create policy "project members can read generation runs"
  on generation_runs for select
  using (is_project_member(project_id));

create policy "project members can create generation runs"
  on generation_runs for insert
  with check (is_project_member(project_id));

-- Updates to runs are done by service_role (API routes), not the user
create policy "service role can update generation runs"
  on generation_runs for update
  using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- EXPORT JOBS  (Phase 2 — schema stub, not yet wired)
-- ─────────────────────────────────────────────────────────────────────────────
create table export_jobs (
  id                  uuid           primary key default uuid_generate_v4(),
  asset_version_id    uuid           not null references asset_versions(id) on delete cascade,
  format              export_format  not null,
  status              export_status  not null default 'pending',
  storage_path        text,
  error_message       text,
  created_at          timestamptz    not null default now(),
  completed_at        timestamptz
);

alter table export_jobs enable row level security;

create policy "project members can manage export jobs"
  on export_jobs for all
  using (
    exists (
      select 1
      from   asset_versions av
      join   assets a on a.id = av.asset_id
      where  av.id = export_jobs.asset_version_id
        and  is_project_member(a.project_id)
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- ACTIVATION EVENTS  (lightweight funnel tracking, pre-PostHog)
-- ─────────────────────────────────────────────────────────────────────────────
create table activation_events (
  id           uuid                    primary key default uuid_generate_v4(),
  user_id      uuid                    not null references auth.users(id) on delete cascade,
  workspace_id uuid                    not null references workspaces(id) on delete cascade,
  project_id   uuid                    references projects(id) on delete cascade,
  event_type   activation_event_type   not null,
  asset_type   text,
  metadata     jsonb                   not null default '{}'::jsonb,
  created_at   timestamptz             not null default now()
);

alter table activation_events enable row level security;

create policy "users can insert own activation events"
  on activation_events for insert
  with check (auth.uid() = user_id);

create policy "workspace admins can read activation events"
  on activation_events for select
  using (is_workspace_member(workspace_id));

-- ─────────────────────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger workspaces_updated_at
  before update on workspaces
  for each row execute function handle_updated_at();

create trigger projects_updated_at
  before update on projects
  for each row execute function handle_updated_at();

create trigger project_sources_updated_at
  before update on project_sources
  for each row execute function handle_updated_at();

create trigger brand_profiles_updated_at
  before update on brand_profiles
  for each row execute function handle_updated_at();

create trigger assets_updated_at
  before update on assets
  for each row execute function handle_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- USEFUL INDEXES
-- ─────────────────────────────────────────────────────────────────────────────
create index projects_workspace_id_idx       on projects(workspace_id);
create index projects_created_by_idx         on projects(created_by);
create index project_sources_project_id_idx  on project_sources(project_id);
create index narrative_versions_project_idx  on narrative_versions(project_id);
create index assets_project_id_idx           on assets(project_id);
create index asset_versions_asset_id_idx     on asset_versions(asset_id);
create index generation_runs_project_id_idx  on generation_runs(project_id);
create index activation_events_user_id_idx   on activation_events(user_id);
create index activation_events_workspace_idx on activation_events(workspace_id);
