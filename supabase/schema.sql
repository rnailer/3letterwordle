-- 3 Letter Wordle schema
-- Run this once in the Supabase SQL editor (or via psql) to create the tables
-- on a fresh database. For existing databases, apply the migrations under
-- supabase/migrations/ in lexical order instead.

create table if not exists daily_words (
  date date primary key,
  word text not null check (length(word) = 3)
);

create table if not exists plays (
  id uuid primary key default gen_random_uuid(),
  player_id text not null,
  date date not null references daily_words(date),
  guesses int not null,
  solved boolean not null,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  unique (player_id, date)
);

create index if not exists plays_player_idx on plays (player_id);
create index if not exists plays_user_id_idx on plays (user_id);

-- Row-level security: authenticated clients only ever read their own plays.
-- Server-side API routes use the service-role key and bypass RLS, so anon
-- rows (user_id null) and claimed rows are both readable from there.
alter table plays enable row level security;

drop policy if exists "authenticated users read own plays" on plays;
create policy "authenticated users read own plays"
  on plays for select
  to authenticated
  using (user_id = auth.uid());
