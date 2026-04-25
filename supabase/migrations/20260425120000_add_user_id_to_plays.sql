-- Migration: add user_id to plays + RLS
--
-- Adds an optional user_id column linking a play to an authenticated
-- Supabase user, plus row-level security so authenticated clients only
-- ever read their own plays.
--
-- Existing anonymous rows (user_id null) are preserved untouched. The
-- API routes use the service-role key (SUPABASE_SECRET_KEY) which
-- bypasses RLS, so all server-side reads and writes continue to work
-- against both anonymous and claimed rows. The RLS policy below is a
-- safety net for any future direct client access via the anon key.
--
-- Idempotent: safe to re-run.

alter table plays
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists plays_user_id_idx on plays (user_id);

alter table plays enable row level security;

drop policy if exists "authenticated users read own plays" on plays;
create policy "authenticated users read own plays"
  on plays for select
  to authenticated
  using (user_id = auth.uid());
