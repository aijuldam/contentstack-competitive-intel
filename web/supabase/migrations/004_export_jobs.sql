-- 004_export_jobs.sql
-- Adds 'html' to export_format enum.
-- Adds project_id and asset_id to export_jobs for direct project-level queries.
-- Additive and idempotent.

alter type export_format add value if not exists 'html';

alter table export_jobs
  add column if not exists project_id uuid references projects(id) on delete cascade,
  add column if not exists asset_id   uuid references assets(id)   on delete cascade;
