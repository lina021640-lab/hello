/** 일정 항목 스토어 (useSyncExternalStore) — Supabase `schedule_items` 에서 현재 여행의 항목을 불러오고 추가/수정/삭제한다.
 *  - 여행(선택)이나 로그인 사용자가 바뀌면 다시 불러온다. 훅을 쓰는 화면이 있는 동안 realtime(postgres_changes)으로 동기화.
 *  - 추가/수정/삭제는 낙관적으로 화면에 먼저 반영하고, 실패하면 되돌린 뒤 한국어 메시지로 throw 한다. */
import { useEffect, useSyncExternalStore } from 'react';
import { supabase, koError } from '../lib/supabase';
import { getAuth, subscribeAuth } from './authStore';
import { getTrip, useTripStore } from './tripStore';

/** time = 시작 시각 (저장 형식 "HH:mm" 24시간, 예전 "AM 10:00"도 읽음), end = 종료 시각 */
export type UserSched = { id: string; tripId: string; day: number; time: string; end: string; title: string; place: string; category: string; memo: string };
export type SchedInput = Omit<UserSched, 'id' | 'tripId' | 'end'> & { end?: string };

type Row = { id: string; trip_id: string; day: number; start_time: string | null; end_time: string | null; title: string | null; place: string | null; category: string | null; memo: string | null };
const fromRow = (r: Row): UserSched => ({ id: r.id, tripId: r.trip_id, day: r.day, time: r.start_time ?? '', end: r.end_time ?? '', title: r.title ?? '', place: r.place ?? '', category: r.category ?? '', memo: r.memo ?? '' });
const nul = (s: string | undefined) => (s && s.trim() ? s.trim() : null);

type State = { byTrip: Record<string, UserSched[]>; loading: boolean; error: string | null };
let state: State = { byTrip: {}, loading: false, error: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
const setTripItems = (tripId: string, items: UserSched[]) => set({ byTrip: { ...state.byTrip, [tripId]: items } });

const EMPTY: UserSched[] = [];
const curId = () => getTrip()?.id ?? null;

// 로그인 사용자가 바뀌면 캐시를 비운다
let lastUid: string | null | undefined;
subscribeAuth(() => {
  const uid = getAuth().session?.user.id ?? null;
  if (uid === lastUid) return;
  lastUid = uid;
  set({ byTrip: {}, loading: false, error: null });
});
lastUid = getAuth().session?.user.id ?? null;

let seqLoad = 0;
export async function loadScheduleItems(tripId: string): Promise<void> {
  if (!getAuth().session) return;
  const my = ++seqLoad;
  set({ loading: true });
  try {
    const { data, error } = await supabase.from('schedule_items').select('*').eq('trip_id', tripId).order('day', { ascending: true }).order('created_at', { ascending: true });
    if (error) throw error;
    if (my === seqLoad) { setTripItems(tripId, (data as Row[]).map(fromRow)); set({ loading: false, error: null }); }
  } catch (e) {
    if (my === seqLoad) set({ loading: false, error: koError(e, '일정을 불러오지 못했어요') });
  }
}

// realtime: 구독자 수를 세어 마지막 화면이 사라지면 채널을 닫는다
const channels = new Map<string, { n: number; ch: ReturnType<typeof supabase.channel> }>();
function watch(tripId: string): () => void {
  let c = channels.get(tripId);
  if (!c) {
    const ch = supabase.channel(`schedule_items:${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule_items', filter: `trip_id=eq.${tripId}` }, () => { loadScheduleItems(tripId); })
      .subscribe();
    c = { n: 0, ch }; channels.set(tripId, c);
  }
  c.n++;
  return () => {
    const x = channels.get(tripId); if (!x) return;
    if (--x.n <= 0) { channels.delete(tripId); supabase.removeChannel(x.ch).catch(() => {}); }
  };
}

/** 현재 선택된 여행의 일정 항목(없으면 빈 배열). 사용하는 동안 서버와 동기화된다. */
export function useUserSchedule(): UserSched[] {
  const ts = useTripStore();
  const tripId = (ts.trips.find((t) => t.id === ts.selectedId) ?? ts.trips[0])?.id ?? null;
  const uid = getAuth().session?.user.id ?? null;
  useEffect(() => {
    if (!tripId || !uid) return;
    loadScheduleItems(tripId);
    return watch(tripId);
  }, [tripId, uid]);
  const s = useSyncExternalStore(sub, () => state, () => state);
  return (tripId && s.byTrip[tripId]) || EMPTY;
}
export const useScheduleStatus = () => { const s = useSyncExternalStore(sub, () => state, () => state); return { loading: s.loading, error: s.error }; };

export const userItemsOf = (all: UserSched[], day: number) => all.filter((x) => x.day === day);
export const flightsOf = (all: UserSched[]) => all.filter((x) => x.category === '항공').sort((a, b) => a.day - b.day || timeKey(a.time) - timeKey(b.time));

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); });

/** 현재 여행에 항목 추가(낙관적). 실패하면 되돌리고 throw(한국어). */
export async function addScheduleItem(it: SchedInput): Promise<string> {
  const tripId = curId();
  if (!tripId) throw new Error('먼저 여행을 만들어 주세요');
  const id = uuid();
  const item: UserSched = { id, tripId, day: it.day, time: it.time, end: it.end ?? '', title: it.title, place: it.place, category: it.category, memo: it.memo };
  setTripItems(tripId, [...(state.byTrip[tripId] ?? []), item]);
  try {
    const { error } = await supabase.from('schedule_items').insert({ id, trip_id: tripId, day: it.day, start_time: nul(it.time), end_time: nul(it.end), title: nul(it.title), place: nul(it.place), category: nul(it.category), memo: nul(it.memo) });
    if (error) throw error;
    return id;
  } catch (e) {
    setTripItems(tripId, (state.byTrip[tripId] ?? []).filter((x) => x.id !== id));
    throw new Error(koError(e, '일정을 저장하지 못했어요'));
  }
}

const findItem = (id: string) => { for (const [tripId, list] of Object.entries(state.byTrip)) { const x = list.find((y) => y.id === id); if (x) return { tripId, item: x }; } return null; };
export const getScheduleItem = (id?: string | null) => (id ? findItem(id)?.item : undefined);

export async function updateScheduleItem(id: string, p: Partial<Omit<UserSched, 'id' | 'tripId'>>): Promise<void> {
  const f = findItem(id); if (!f) throw new Error('일정을 찾을 수 없어요');
  const prev = state.byTrip[f.tripId];
  setTripItems(f.tripId, prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  try {
    const patch: Record<string, unknown> = {};
    if (p.day !== undefined) patch.day = p.day;
    if (p.time !== undefined) patch.start_time = nul(p.time);
    if (p.end !== undefined) patch.end_time = nul(p.end);
    if (p.title !== undefined) patch.title = nul(p.title);
    if (p.place !== undefined) patch.place = nul(p.place);
    if (p.category !== undefined) patch.category = nul(p.category);
    if (p.memo !== undefined) patch.memo = nul(p.memo);
    const { error } = await supabase.from('schedule_items').update(patch).eq('id', id);
    if (error) throw error;
  } catch (e) {
    setTripItems(f.tripId, prev);
    throw new Error(koError(e, '일정을 수정하지 못했어요'));
  }
}

export async function deleteScheduleItem(id: string): Promise<void> {
  const f = findItem(id); if (!f) return;
  const prev = state.byTrip[f.tripId];
  setTripItems(f.tripId, prev.filter((x) => x.id !== id));
  try {
    const { error } = await supabase.from('schedule_items').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    setTripItems(f.tripId, prev);
    throw new Error(koError(e, '일정을 삭제하지 못했어요'));
  }
}

// 일정 추가 화면이 처음 선택할 일차 (세부일정에서 보던 날)
let addDay = 1;
export const setAddDay = (d: number) => { addDay = d; };
export const getAddDay = () => addDay;

// ───────── 시각 도우미 (저장 형식은 24시간 'HH:mm', 예전 데이터의 "AM 10:00"/"오후 5:00"도 읽는다) ─────────
/** 시각 문자열 → 0시부터의 분. 비었거나 해석할 수 없으면 null */
export function parseMin(s?: string | null): number | null {
  const str = (s || '').trim(); if (!str) return null;
  const mk = /(AM|PM|오전|오후)/i.exec(str)?.[1]?.toUpperCase();
  const m = /(\d{1,2})\s*(?::|시)?\s*(\d{1,2})?/.exec(str.replace(/(AM|PM|오전|오후)/gi, ' '));
  if (!m) return null;
  let h = Number(m[1]); const mm = Number(m[2] || 0);
  if (mm > 59) return null;
  if (mk) { if (h < 1 || h > 12) return null; h %= 12; if (mk === 'PM' || mk === '오후') h += 12; }
  else if (h > 23) return null;
  return h * 60 + mm;
}
/** 정렬용 키(해석 불가·빈 값은 맨 뒤) */
export const timeKey = (s: string) => parseMin(s) ?? 9999;
const p2 = (n: number) => String(n).padStart(2, '0');
/** 분 → 'HH:mm' */
export const toHHmm = (min: number) => `${p2(Math.floor(min / 60) % 24)}:${p2(min % 60)}`;
/** 저장값 → 'HH:mm' (해석 불가면 빈 문자열) */
export const normTime = (s?: string | null) => { const m = parseMin(s); return m == null ? '' : toHHmm(m); };
/** 저장값 → '오전 10:00' / '오후 5:30' (비었으면 '', 해석 불가면 원문) */
export function fmtTime(s?: string | null): string {
  const m = parseMin(s); if (m == null) return (s || '').trim();
  const h = Math.floor(m / 60);
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${p2(m % 60)}`;
}
/** 화면 표시용: 시각이 비었으면 '시간 미정' */
export const timeLabel = (s: string) => fmtTime(s) || '시간 미정';

/** 오늘(day 일차) 일정 중 NOW 카드에 보여 줄 항목.
 *  1) 지금 진행 중인 항목(시작 ≤ 지금 < 종료, 종료가 없으면 1시간)  2) 아직 안 지난 가장 가까운 항목
 *  3) 시간이 없는 항목  4) 그 밖에는 오늘의 첫 항목. 오늘 항목이 하나도 없으면 null. */
export type NowPick = { item: UserSched; kind: 'now' | 'next' | 'today' };
export function pickNow(items: UserSched[], day: number, now = new Date()): NowPick | null {
  if (day < 1) return null;
  const list = userItemsOf(items, day).map((x, i) => ({ x, i, k: parseMin(x.time) }))
    .sort((a, b) => (a.k ?? 99999) - (b.k ?? 99999) || a.i - b.i).map((e) => e.x);
  if (!list.length) return null;
  const m = now.getHours() * 60 + now.getMinutes();
  const timed = list.filter((x) => parseMin(x.time) != null);
  const live = timed.find((x) => { const s = parseMin(x.time)!, e = parseMin(x.end); return s <= m && m < (e != null && e > s ? e : s + 60); });
  if (live) return { item: live, kind: 'now' };
  const next = timed.find((x) => parseMin(x.time)! > m);
  if (next) return { item: next, kind: 'next' };
  const untimed = list.find((x) => parseMin(x.time) == null);
  return { item: untimed ?? list[0], kind: 'today' };
}
