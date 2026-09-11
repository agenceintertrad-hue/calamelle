create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  source text not null default 'landing-page',
  created_at timestamptz not null default now(),
  constraint waitlist_email_length check (char_length(email) between 3 and 320),
  constraint waitlist_source_length check (char_length(source) between 1 and 50)
);

create unique index if not exists waitlist_email_unique
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

revoke all on table public.waitlist from anon, authenticated;
grant insert on table public.waitlist to anon;
grant usage, select on sequence public.waitlist_id_seq to anon;

drop policy if exists "Public can join waitlist" on public.waitlist;
create policy "Public can join waitlist"
  on public.waitlist
  for insert
  to anon
  with check (
    lower(email) = email
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    and source = 'landing-page'
  );
