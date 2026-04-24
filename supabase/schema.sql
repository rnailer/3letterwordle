-- 3 Letter Wordle schema
-- Run this once in the Supabase SQL editor (or via psql) to create the tables.

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
  unique (player_id, date)
);

create index if not exists plays_player_idx on plays (player_id);
