/** 여행 스토어 (useSyncExternalStore) — Supabase(trips + trip_cities + trip_members)에서 불러온다.
 *  홈 카드·지도·여행 만들기/수정·일행 팝업이 공유. 로그인 상태가 바뀌면 자동으로 다시 불러오거나 비운다. */
import { useSyncExternalStore } from 'react';
import { countryEn, countryKo } from './cities';
import { supabase, koError } from '../lib/supabase';
import { getAuth, subscribeAuth } from './authStore';

export type StoreCity = { city: string; country: string; cc: string; start: string; end: string };
export type Trip = {
  id: string; name: string; cities: StoreCity[]; start: string; end: string;
  /** 아바타 색(멤버 수만큼) */ members: string[];
  inviteCode: string; ownerId: string; memberCount: number;
};
export type TripInput = { name: string; cities: StoreCity[]; start: string; end: string };
export type Member = { userId: string; nickname: string; role: 'owner' | 'member'; color: string };

const COLORS = ['#ff8a4c', '#5ac8fa', '#f5c16c', '#9be18f', '#c58bf2', '#ff6b8a', '#6ea8ff', '#ffd84d', '#4cd1a8'];
export const colorAt = (i: number) => COLORS[i % COLORS.length];

type State = { trips: Trip[]; selectedId: string | null; loading: boolean; error: string | null };
let state: State = { trips: [], selectedId: null, loading: false, error: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };

export const useTripStore = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => state, () => state);
export const getTrips = () => state.trips;
export const getTrip = (id?: string | null): Trip | undefined => state.trips.find((x) => x.id === (id ?? state.selectedId)) ?? state.trips[0];
export const selectTrip = (id: string) => { if (state.selectedId !== id) set({ selectedId: id }); };

// ── Supabase 행 ↔ Trip ──
type CityRow = { city: string; country_code: string | null; country_ko: string | null; start_date: string; end_date: string; sort: number };
type TripRow = { id: string; owner_id: string; name: string; start_date: string | null; end_date: string | null; invite_code: string; trip_cities: CityRow[] | null; trip_members: { user_id: string }[] | null };
const toTrip = (r: TripRow): Trip => {
  const cities = [...(r.trip_cities ?? [])].sort((a, b) => a.sort - b.sort).map((c): StoreCity => ({
    city: c.city, cc: c.country_code ?? '', country: c.country_ko ?? (c.country_code ? countryKo(c.country_code) ?? '' : ''), start: c.start_date, end: c.end_date,
  }));
  const n = Math.max(1, r.trip_members?.length ?? 1);
  return { id: r.id, name: r.name, cities, start: r.start_date ?? '', end: r.end_date ?? '', members: Array.from({ length: n }, (_, i) => colorAt(i)), inviteCode: r.invite_code, ownerId: r.owner_id, memberCount: n };
};
const cityRows = (tripId: string, cs: StoreCity[]) => cs.map((c, i) => ({ trip_id: tripId, city: c.city, country_code: c.cc || null, country_ko: c.country || null, start_date: c.start, end_date: c.end, sort: i }));

export async function loadTrips(): Promise<void> {
  if (!getAuth().session) { set({ trips: [], selectedId: null, loading: false, error: null }); return; }
  set({ loading: true, error: null });
  try {
    const { data, error } = await supabase.from('trips').select('*, trip_cities(*), trip_members(user_id)').order('created_at', { ascending: true });
    if (error) throw error;
    const trips = (data as TripRow[]).map(toTrip);
    set({ trips, loading: false, selectedId: trips.some((x) => x.id === state.selectedId) ? state.selectedId : trips[0]?.id ?? null });
  } catch (e) {
    set({ loading: false, error: koError(e, '여행을 불러오지 못했어요') });
  }
}

// 로그인 사용자가 바뀌면 다시 불러오기 / 로그아웃이면 비우기
let lastUid: string | null | undefined;
const syncAuth = () => {
  const uid = getAuth().session?.user.id ?? null;
  if (uid === lastUid) return;
  lastUid = uid;
  if (uid) loadTrips(); else set({ trips: [], selectedId: null, loading: false, error: null });
};
subscribeAuth(syncAuth);
syncAuth();

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); });
const nul = (s: string) => (s ? s : null);

/** 여행 + 도시 저장. 실패하면 throw(한국어 메시지). */
export async function createTrip(form: TripInput): Promise<Trip> {
  const uid = getAuth().session?.user.id;
  if (!uid) throw new Error('로그인이 필요해요');
  // id 를 클라이언트에서 정한다: insert 직후엔 멤버 트리거 전이라 RETURNING(select RLS)이 막힐 수 있음
  const id = uuid();
  try {
    const { error } = await supabase.from('trips').insert({ id, name: form.name, start_date: nul(form.start), end_date: nul(form.end) });
    if (error) throw error;
    if (form.cities.length) {
      const { error: e2 } = await supabase.from('trip_cities').insert(cityRows(id, form.cities));
      if (e2) throw e2;
    }
    await loadTrips();
    set({ selectedId: id });
    const trip = getTrip(id);
    if (!trip) throw new Error('여행을 불러오지 못했어요');
    return trip;
  } catch (e) { throw new Error(koError(e, '여행을 만들지 못했어요')); }
}

export async function updateTrip(id: string, v: Partial<TripInput>): Promise<void> {
  try {
    const patch: Record<string, unknown> = {};
    if (v.name !== undefined) patch.name = v.name;
    if (v.start !== undefined) patch.start_date = nul(v.start);
    if (v.end !== undefined) patch.end_date = nul(v.end);
    if (Object.keys(patch).length) { const { error } = await supabase.from('trips').update(patch).eq('id', id); if (error) throw error; }
    if (v.cities) {
      const { error } = await supabase.from('trip_cities').delete().eq('trip_id', id); if (error) throw error;
      if (v.cities.length) { const { error: e2 } = await supabase.from('trip_cities').insert(cityRows(id, v.cities)); if (e2) throw e2; }
    }
    await loadTrips();
  } catch (e) { throw new Error(koError(e, '여행을 저장하지 못했어요')); }
}

/** 소유자만 삭제 가능(RLS). 다른 사람의 여행이면 0행 → 오류 */
export async function deleteTrip(id: string): Promise<void> {
  try {
    const { data, error } = await supabase.from('trips').delete().eq('id', id).select('id');
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('여행을 만든 사람만 삭제할 수 있어요');
    await loadTrips();
  } catch (e) {
    const m = (e as Error).message;
    throw new Error(m.includes('만든 사람') ? m : koError(e, '여행을 삭제하지 못했어요'));
  }
}

/** 초대 코드로 합류 → 합류한 여행 id */
export async function joinByCode(code: string): Promise<string> {
  const c = code.trim();
  if (!c) throw new Error('초대 코드를 입력해 주세요');
  try {
    const { data, error } = await supabase.rpc('join_trip', { code: c });
    if (error) throw error;
    await loadTrips();
    const tid = data as string;
    if (tid) set({ selectedId: tid });
    return tid;
  } catch (e) { throw new Error(koError(e, '합류하지 못했어요')); }
}

/** 여행 멤버(닉네임 포함). profiles 는 같은 여행 동료만 읽힌다 */
export async function fetchMembers(tripId: string): Promise<Member[]> {
  const { data: ms, error } = await supabase.from('trip_members').select('user_id, role, joined_at').eq('trip_id', tripId).order('joined_at', { ascending: true });
  if (error) throw new Error(koError(error, '멤버를 불러오지 못했어요'));
  const ids = (ms ?? []).map((m) => m.user_id as string);
  const { data: ps } = ids.length ? await supabase.from('profiles').select('id, nickname').in('id', ids) : { data: [] as { id: string; nickname: string }[] };
  const nick = new Map((ps ?? []).map((p) => [p.id as string, p.nickname as string]));
  return (ms ?? []).map((m, i) => ({ userId: m.user_id as string, role: m.role as 'owner' | 'member', nickname: nick.get(m.user_id as string) ?? '여행자', color: colorAt(i) }));
}

/** 소유자의 강퇴 / 본인 탈퇴 */
export async function removeMember(tripId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase.from('trip_members').delete().eq('trip_id', tripId).eq('user_id', userId);
    if (error) throw error;
    await loadTrips();
  } catch (e) { throw new Error(koError(e, '멤버를 내보내지 못했어요')); }
}

// ── 표시용 도우미 ──
const uniq = <T,>(a: T[]) => a.filter((x, i) => a.indexOf(x) === i);
/** 지도 하이라이트용 영어 국가명 */
export const tripCountriesEn = (t: Trip) => uniq(t.cities.map((c) => countryEn(c.cc)).filter(Boolean) as string[]);
/** 카드 부제: 나라 이름들 (공백 구분) */
export const tripCountriesKo = (t: Trip) => uniq(t.cities.map((c) => c.country || countryKo(c.cc)).filter(Boolean)).join(' ');
export const tripRange = (t: Trip) => (t.start ? `${t.start.replace(/-/g, '.')} -${t.end.replace(/-/g, '.')}` : '');
