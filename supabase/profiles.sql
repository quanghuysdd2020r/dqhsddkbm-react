create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nickname text not null,
  nickname_normalized text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_nickname_format check (
    nickname_normalized ~ '^[a-z0-9._]{3,30}$'
    and nickname_normalized !~ '(^\\.|\\.$|\\.\\.)'
  ),
  constraint profiles_nickname_reserved check (
    nickname_normalized not in (
      'admin',
      'about',
      'api',
      'blogs',
      'dqhsddkbm',
      'focus',
      'help',
      'profile',
      'shop',
      'sign-in',
      'study',
      'support'
    )
  )
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are readable" on public.profiles;
create policy "profiles are readable"
  on public.profiles
  for select
  using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.normalize_nickname(value text)
returns text
language sql
immutable
as $$
  select lower(regexp_replace(trim(value), '^@+', ''));
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_nickname text;
  normalized text;
begin
  raw_nickname := coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1));
  normalized := public.normalize_nickname(raw_nickname);

  insert into public.profiles (id, email, nickname, nickname_normalized)
  values (new.id, new.email, normalized, normalized);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();
