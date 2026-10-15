-- ready 앱 DB 스키마. Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run.
-- 원칙: 여행 멤버(trip_members)만 그 여행의 데이터를 읽고 쓴다.

create extension if not exists pgcrypto;

-- 프로필 (가입하면 자동 생성)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '여행자',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  invite_code text not null unique default upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)),
  created_at timestamptz not null default now()
);

create table public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table public.trip_cities (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  city text not null,
  country_code text,
  country_ko text,
  start_date date not null,
  end_date date not null,
  sort int not null default 0
);

create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day int not null,
  start_time text,
  end_time text,
  title text,
  place text,
  category text,
  memo text,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 내가 저장한 장소 (나만 보임)
create table public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  category text,
  address text,
  lat double precision,
  lng double precision,
  note text,
  created_at timestamptz not null default now()
);

-- 여행 동료에게 공유한 장소 (공유 피드)
create table public.shared_places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  emoji text,
  category text,
  comment text,
  tags text[] not null default '{}',
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create table public.place_likes (
  shared_place_id uuid not null references public.shared_places(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  primary key (shared_place_id, user_id)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  paid_by uuid not null default auth.uid() references auth.users(id),
  title text not null,
  amount numeric not null,
  currency text not null default 'KRW',
  category text,
  country_code text,
  split_among uuid[] not null default '{}',
  spent_at timestamptz not null default now()
);

-- 멤버 확인 함수 (RLS 에서 사용)
create or replace function public.is_trip_member(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.trip_members m where m.trip_id = t and m.user_id = auth.uid());
$$;

-- 여행을 만들면 만든 사람을 owner 멤버로 자동 추가
create or replace function public.add_owner_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.trip_members (trip_id, user_id, role) values (new.id, new.owner_id, 'owner');
  return new;
end $$;
create trigger trg_add_owner after insert on public.trips for each row execute function public.add_owner_member();

-- 가입하면 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1), '여행자'));
  return new;
end $$;
create trigger trg_new_user after insert on auth.users for each row execute function public.handle_new_user();

-- 초대 코드로 합류 (코드를 아는 사람만 멤버가 됨)
create or replace function public.join_trip(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare tid uuid;
begin
  if auth.uid() is null then raise exception '로그인이 필요해요'; end if;
  select id into tid from public.trips where invite_code = upper(trim(code));
  if tid is null then raise exception '초대 코드를 찾을 수 없어요'; end if;
  insert into public.trip_members (trip_id, user_id) values (tid, auth.uid()) on conflict do nothing;
  return tid;
end $$;

-- RLS
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_cities enable row level security;
alter table public.schedule_items enable row level security;
alter table public.saved_places enable row level security;
alter table public.shared_places enable row level security;
alter table public.place_likes enable row level security;
alter table public.expenses enable row level security;

-- profiles: 본인 수정, 같은 여행 동료 조회
create policy profiles_select on public.profiles for select to authenticated using (
  id = auth.uid() or exists (
    select 1 from public.trip_members a join public.trip_members b on a.trip_id = b.trip_id
    where a.user_id = auth.uid() and b.user_id = profiles.id)
);
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- trips
create policy trips_select on public.trips for select to authenticated using (public.is_trip_member(id));
create policy trips_insert on public.trips for insert to authenticated with check (owner_id = auth.uid());
create policy trips_update on public.trips for update to authenticated using (public.is_trip_member(id));
create policy trips_delete on public.trips for delete to authenticated using (owner_id = auth.uid());

-- trip_members: 같은 여행 멤버 조회, 본인 탈퇴, owner 가 강퇴
create policy members_select on public.trip_members for select to authenticated using (public.is_trip_member(trip_id));
create policy members_delete on public.trip_members for delete to authenticated using (
  user_id = auth.uid() or exists (select 1 from public.trips t where t.id = trip_id and t.owner_id = auth.uid()));

-- 여행 하위 데이터: 멤버만 전부 가능
create policy cities_all on public.trip_cities for all to authenticated using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy items_all on public.schedule_items for all to authenticated using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy shared_select on public.shared_places for select to authenticated using (public.is_trip_member(trip_id));
create policy shared_insert on public.shared_places for insert to authenticated with check (public.is_trip_member(trip_id) and user_id = auth.uid());
create policy shared_modify on public.shared_places for update to authenticated using (user_id = auth.uid());
create policy shared_delete on public.shared_places for delete to authenticated using (user_id = auth.uid());
create policy expenses_all on public.expenses for all to authenticated using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy likes_select on public.place_likes for select to authenticated using (
  exists (select 1 from public.shared_places s where s.id = shared_place_id and public.is_trip_member(s.trip_id)));
create policy likes_insert on public.place_likes for insert to authenticated with check (
  user_id = auth.uid() and exists (select 1 from public.shared_places s where s.id = shared_place_id and public.is_trip_member(s.trip_id)));
create policy likes_delete on public.place_likes for delete to authenticated using (user_id = auth.uid());

-- 내 저장 장소: 본인만
create policy saved_all on public.saved_places for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 권한 (자동 노출을 껐으므로 직접 부여. 로그인한 사용자(authenticated)에게만)
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.trips, public.trip_members, public.trip_cities, public.schedule_items,
  public.saved_places, public.shared_places, public.place_likes, public.expenses to authenticated;
grant execute on function public.join_trip(text) to authenticated;
grant execute on function public.is_trip_member(uuid) to authenticated;

-- 일정 실시간 동기화(postgres_changes). 이미 추가돼 있으면 오류가 나지만 무시해도 된다.
alter publication supabase_realtime add table public.schedule_items;
