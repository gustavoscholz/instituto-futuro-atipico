create extension if not exists pgcrypto;

create table if not exists public.ifa_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.ifa_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  venue text not null default '',
  city text not null default '',
  state varchar(2) not null default '',
  external_url text not null default '',
  image_path text not null default '',
  image_alt text not null default '',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ifa_partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (
    category in ('medico', 'instituto', 'estabelecimento_desconto')
  ),
  specialty text not null default '',
  summary text not null default '',
  description text not null default '',
  city text not null default '',
  state varchar(2) not null default '',
  address text not null default '',
  external_url text not null default '',
  discount_details text not null default '',
  image_path text not null default '',
  image_alt text not null default '',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.ifa_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ifa_events_updated_at on public.ifa_events;
create trigger ifa_events_updated_at
before update on public.ifa_events
for each row execute function public.ifa_set_updated_at();

drop trigger if exists ifa_partners_updated_at on public.ifa_partners;
create trigger ifa_partners_updated_at
before update on public.ifa_partners
for each row execute function public.ifa_set_updated_at();

create or replace function public.ifa_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ifa_admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.ifa_is_admin() from public;
grant execute on function public.ifa_is_admin() to authenticated;

alter table public.ifa_admin_users enable row level security;
alter table public.ifa_events enable row level security;
alter table public.ifa_partners enable row level security;

drop policy if exists "ifa_admin_users_read_self" on public.ifa_admin_users;
create policy "ifa_admin_users_read_self"
on public.ifa_admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "ifa_events_public_read" on public.ifa_events;
create policy "ifa_events_public_read"
on public.ifa_events
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "ifa_events_admin_read" on public.ifa_events;
create policy "ifa_events_admin_read"
on public.ifa_events
for select
to authenticated
using (public.ifa_is_admin());

drop policy if exists "ifa_events_admin_insert" on public.ifa_events;
create policy "ifa_events_admin_insert"
on public.ifa_events
for insert
to authenticated
with check (public.ifa_is_admin());

drop policy if exists "ifa_events_admin_update" on public.ifa_events;
create policy "ifa_events_admin_update"
on public.ifa_events
for update
to authenticated
using (public.ifa_is_admin())
with check (public.ifa_is_admin());

drop policy if exists "ifa_events_admin_delete" on public.ifa_events;
create policy "ifa_events_admin_delete"
on public.ifa_events
for delete
to authenticated
using (public.ifa_is_admin());

drop policy if exists "ifa_partners_public_read" on public.ifa_partners;
create policy "ifa_partners_public_read"
on public.ifa_partners
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "ifa_partners_admin_read" on public.ifa_partners;
create policy "ifa_partners_admin_read"
on public.ifa_partners
for select
to authenticated
using (public.ifa_is_admin());

drop policy if exists "ifa_partners_admin_insert" on public.ifa_partners;
create policy "ifa_partners_admin_insert"
on public.ifa_partners
for insert
to authenticated
with check (public.ifa_is_admin());

drop policy if exists "ifa_partners_admin_update" on public.ifa_partners;
create policy "ifa_partners_admin_update"
on public.ifa_partners
for update
to authenticated
using (public.ifa_is_admin())
with check (public.ifa_is_admin());

drop policy if exists "ifa_partners_admin_delete" on public.ifa_partners;
create policy "ifa_partners_admin_delete"
on public.ifa_partners
for delete
to authenticated
using (public.ifa_is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ifa-content',
  'ifa-content',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ifa_content_public_read" on storage.objects;
create policy "ifa_content_public_read"
on storage.objects
for select
to public
using (bucket_id = 'ifa-content');

drop policy if exists "ifa_content_admin_insert" on storage.objects;
create policy "ifa_content_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'ifa-content' and public.ifa_is_admin());

drop policy if exists "ifa_content_admin_update" on storage.objects;
create policy "ifa_content_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'ifa-content' and public.ifa_is_admin())
with check (bucket_id = 'ifa-content' and public.ifa_is_admin());

drop policy if exists "ifa_content_admin_delete" on storage.objects;
create policy "ifa_content_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'ifa-content' and public.ifa_is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.ifa_events, public.ifa_partners to anon, authenticated;
grant insert, update, delete on public.ifa_events, public.ifa_partners to authenticated;
grant select on public.ifa_admin_users to authenticated;
