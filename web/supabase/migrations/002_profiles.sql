-- 002_profiles.sql
-- Extended user profile data stored separately from auth.users.
-- Inserted by the service-role client at signup — no anon insert policy needed.

create table public.profiles (
  id          uuid        primary key references auth.users on delete cascade,
  first_name  text        not null,
  last_name   text        not null,
  company     text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
