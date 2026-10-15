/** 저장 탭 / 공유 피드 스토어 (useSyncExternalStore) — Supabase 연동.
 *  - 내가 저장한 장소: saved_places (본인만, 여행 없이도 동작)
 *  - 공유 피드: shared_places + place_likes (현재 선택한 여행의 멤버끼리)
 *  거리(m) 정보는 위치 권한 연동 전이라 없다. 장소 검색 결과(FOUND)는 예시 데이터. */
import { useEffect, useSyncExternalStore } from 'react';
import { supabase, koError } from '../lib/supabase';
import { getAuth, useAuth } from './authStore';
import { useTripStore } from './tripStore';

export type SavedPlace = { id: string; n: string; cat: string; addr: string; note: string; lat: number | null; lng: number | null; savedAt: number };
export type FeedPlace = {
  id: string; n: string; e: string; cat: string; q: string; tags: string[]; by: string; userId: string; at: number;
  likes: number; liked: boolean; lat: number | null; lng: number | null;
};
export type FoundPlace = { id: string; n: string; addr: string; city: string; cat: string; rating: string };

export const SORT_SAVED = ['최근순', '이름순'] as const;
export const SORT_FEED = ['인기순', '최신순'] as const;

/** 방금 / N분 전 / N시간 전 / N일 전 */
export function relTime(at: number, now = Date.now()) {
  const m = Math.max(0, Math.floor((now - at) / 60000));
  if (m < 1) return '방금';
  if (m < 60) return `${m}분 전`;
  if (m < 60 * 24) return `${Math.floor(m / 60)}시간 전`;
  if (m < 60 * 24 * 30) return `${Math.floor(m / 60 / 24)}일 전`;
  return `${Math.floor(m / 60 / 24 / 30)}달 전`;
}
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); });

type State = {
  uid: string | null; saved: SavedPlace[]; savedLoading: boolean; savedError: string | null;
  tripId: string | null; feed: FeedPlace[]; feedLoading: boolean; feedError: string | null;
  toast: string | null;
};
let state: State = { uid: null, saved: [], savedLoading: false, savedError: null, tripId: null, feed: [], feedLoading: false, feedError: null, toast: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
const snap = () => state;
const toast = (s: string) => set({ toast: s });
export const clearToast = () => { if (state.toast) set({ toast: null }); };

// ───────── 내가 저장한 장소 ─────────
type SavedRow = { id: string; name: string; category: string | null; address: string | null; lat: number | null; lng: number | null; note: string | null; created_at: string };
const fromSaved = (r: SavedRow): SavedPlace => ({ id: r.id, n: r.name, cat: r.category ?? '명소', addr: r.address ?? '', note: r.note ?? '', lat: r.lat, lng: r.lng, savedAt: new Date(r.created_at).getTime() });

async function loadSaved(uid: string) {
  set({ savedLoading: true, savedError: null });
  try {
    const { data, error } = await supabase.from('saved_places').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (error) throw error;
    if (state.uid === uid) set({ saved: (data as SavedRow[]).map(fromSaved), savedLoading: false });
  } catch (e) { if (state.uid === uid) set({ savedLoading: false, savedError: koError(e, '저장한 장소를 불러오지 못했어요') }); }
}
function ensureUser(uid: string | null) {
  if (state.uid === uid) return;
  set({ uid, saved: [], savedLoading: false, savedError: null });
  if (uid) loadSaved(uid);
}
export const reloadSaved = () => { if (state.uid) loadSaved(state.uid); };

export function useSaved() {
  const s = useSyncExternalStore(sub, snap, snap);
  const { user } = useAuth();
  const uid = user?.id ?? null;
  useEffect(() => { ensureUser(uid); }, [uid]);
  return { items: s.uid === uid ? s.saved : [], loading: s.savedLoading, error: s.savedError, toast: s.toast };
}

export const isSavedName = (s: { items: SavedPlace[] }, name: string) => s.items.some((x) => x.n === name);

export function sortSaved(items: SavedPlace[], mode: number): SavedPlace[] {
  return [...items].sort((a, b) => (mode === 1 ? a.n.localeCompare(b.n, 'ko') : b.savedAt - a.savedAt));
}

export type SaveInput = { n: string; cat: string; addr?: string; note?: string; lat?: number | null; lng?: number | null };
/** 저장 (이미 같은 이름이 있으면 메모만 갱신). 실패하면 throw */
export async function savePlace(p: SaveInput): Promise<void> {
  const uid = getAuth().session?.user.id;
  if (!uid) throw new Error('로그인이 필요해요');
  const ex = state.saved.find((x) => x.n === p.n);
  if (ex) {
    const prev = ex; const note = p.note ?? ex.note;
    set({ saved: state.saved.map((x) => (x.id === ex.id ? { ...x, note } : x)) });
    const { error } = await supabase.from('saved_places').update({ note: note || null }).eq('id', ex.id);
    if (error) { set({ saved: state.saved.map((x) => (x.id === ex.id ? prev : x)) }); throw new Error(koError(error, '저장하지 못했어요')); }
    return;
  }
  const id = uuid();
  const item: SavedPlace = { id, n: p.n, cat: p.cat, addr: p.addr ?? '', note: p.note ?? '', lat: p.lat ?? null, lng: p.lng ?? null, savedAt: Date.now() };
  set({ saved: [item, ...state.saved], toast: `‘${p.n}’을(를) 저장했어요` });
  const { error } = await supabase.from('saved_places').insert({ id, name: p.n, category: p.cat, address: p.addr || null, note: p.note || null, lat: p.lat ?? null, lng: p.lng ?? null });
  if (error) { set({ saved: state.saved.filter((x) => x.id !== id), toast: null }); throw new Error(koError(error, '저장하지 못했어요')); }
}
export async function unsavePlace(name: string): Promise<void> {
  const ex = state.saved.find((x) => x.n === name); if (!ex) return;
  set({ saved: state.saved.filter((x) => x.id !== ex.id), toast: `‘${name}’ 저장을 취소했어요` });
  const { error } = await supabase.from('saved_places').delete().eq('id', ex.id);
  if (error) { set({ saved: [ex, ...state.saved], toast: null }); throw new Error(koError(error, '저장을 취소하지 못했어요')); }
}
/** 검색 결과(예시) 저장 */
export const addSavedPlace = (p: FoundPlace) => savePlace({ n: p.n, cat: p.cat, addr: p.addr }).catch((e) => toast((e as Error).message));
/** 장소 상세의 저장/저장됨 토글 (실패는 토스트로) */
export function toggleSavedName(name: string, meta: { cat: string; addr?: string; lat?: number | null; lng?: number | null }) {
  const run = state.saved.some((x) => x.n === name) ? unsavePlace(name) : savePlace({ n: name, cat: meta.cat, addr: meta.addr, lat: meta.lat, lng: meta.lng });
  run.catch((e) => toast((e as Error).message));
}

// ───────── 공유 피드 (현재 여행) ─────────
type FeedRow = { id: string; user_id: string; name: string; emoji: string | null; category: string | null; comment: string | null; tags: string[] | null; lat: number | null; lng: number | null; created_at: string; place_likes: { user_id: string }[] | null };

async function loadFeed(tripId: string) {
  set({ feedLoading: true, feedError: null });
  try {
    const { data, error } = await supabase.from('shared_places').select('*, place_likes(user_id)').eq('trip_id', tripId).order('created_at', { ascending: false });
    if (error) throw error;
    const rows = data as FeedRow[];
    const ids = Array.from(new Set(rows.map((r) => r.user_id)));
    const { data: ps } = ids.length ? await supabase.from('profiles').select('id, nickname').in('id', ids) : { data: [] as { id: string; nickname: string }[] };
    const nick = new Map((ps ?? []).map((p) => [p.id as string, p.nickname as string]));
    const me = getAuth().session?.user.id;
    if (state.tripId !== tripId) return;
    set({
      feedLoading: false,
      feed: rows.map((r): FeedPlace => ({
        id: r.id, n: r.name, e: r.emoji ?? '📍', cat: r.category ?? '명소', q: r.comment ?? '', tags: r.tags ?? [],
        by: r.user_id === me ? '나' : nick.get(r.user_id) ?? '여행자', userId: r.user_id, at: new Date(r.created_at).getTime(),
        likes: r.place_likes?.length ?? 0, liked: !!r.place_likes?.some((l) => l.user_id === me), lat: r.lat, lng: r.lng,
      })),
    });
  } catch (e) { if (state.tripId === tripId) set({ feedLoading: false, feedError: koError(e, '공유 피드를 불러오지 못했어요') }); }
}
function ensureTrip(id: string | null) {
  if (state.tripId === id) return;
  set({ tripId: id, feed: [], feedLoading: false, feedError: null });
  if (id) loadFeed(id);
}
export const reloadFeed = () => { if (state.tripId) loadFeed(state.tripId); };

/** 현재 선택된 여행의 공유 장소 (여행이 없으면 빈 목록 + hasTrip=false) */
export function useFeed() {
  const s = useSyncExternalStore(sub, snap, snap);
  useAuth(); // 세션 복원 시작(딥링크로 바로 들어와도 여행이 로드되도록)
  const ts = useTripStore();
  const tid = (ts.trips.find((t) => t.id === ts.selectedId) ?? ts.trips[0])?.id ?? null;
  useEffect(() => { ensureTrip(tid); }, [tid]);
  const live = s.tripId === tid;
  return { items: live ? s.feed : [], hasTrip: !!tid, loading: s.feedLoading || (!!tid && !live), error: live ? s.feedError : null };
}

export const sortFeed = (items: FeedPlace[], mode: number) =>
  [...items].sort((a, b) => (mode === 0 ? b.likes - a.likes || b.at - a.at : b.at - a.at));

export type ShareInput = { n: string; e: string; cat: string; q: string; tags: string[]; lat?: number | null; lng?: number | null };
export async function sharePlace(p: ShareInput): Promise<void> {
  const uid = getAuth().session?.user.id; const tripId = state.tripId;
  if (!uid || !tripId) throw new Error('여행을 먼저 추가해 주세요');
  const id = uuid();
  const item: FeedPlace = { id, n: p.n, e: p.e, cat: p.cat, q: p.q, tags: p.tags, by: '나', userId: uid, at: Date.now(), likes: 0, liked: false, lat: p.lat ?? null, lng: p.lng ?? null };
  set({ feed: [item, ...state.feed] });
  const { error } = await supabase.from('shared_places').insert({ id, trip_id: tripId, name: p.n, emoji: p.e || null, category: p.cat, comment: p.q || null, tags: p.tags, lat: p.lat ?? null, lng: p.lng ?? null });
  if (error) { if (state.tripId === tripId) set({ feed: state.feed.filter((x) => x.id !== id) }); throw new Error(koError(error, '공유하지 못했어요')); }
}

export async function toggleLike(id: string): Promise<void> {
  const uid = getAuth().session?.user.id; const cur = state.feed.find((x) => x.id === id);
  if (!uid || !cur) return;
  const patch = (liked: boolean) => set({ feed: state.feed.map((x) => (x.id === id ? { ...x, liked, likes: Math.max(0, x.likes + (liked ? 1 : -1)) } : x)) });
  patch(!cur.liked);
  const { error } = cur.liked
    ? await supabase.from('place_likes').delete().eq('shared_place_id', id).eq('user_id', uid)
    : await supabase.from('place_likes').insert({ shared_place_id: id });
  if (error) { patch(cur.liked); toast(koError(error, '좋아요를 저장하지 못했어요')); }
}

// ───────── 장소 검색 예시 결과 (Google 장소 연동 전 목업) ─────────
export const FOUND: FoundPlace[] = [
  { id: 'g1', n: 'Monmouth Coffee Company', addr: '2 Park St, London SE1 9AB', city: '런던', cat: '카페', rating: '★4.6' },
  { id: 'g2', n: 'Dishoom Covent Garden', addr: '12 Upper St Martin\'s Ln, London WC2H 9FB', city: '런던', cat: '맛집', rating: '★4.7' },
  { id: 'g3', n: 'Café de Flore', addr: '172 Bd Saint-Germain, 75006 Paris', city: '파리', cat: '카페', rating: '★4.3' },
  { id: 'g4', n: 'Sky Garden', addr: '1 Sky Garden Walk, London EC3M 8AF', city: '런던', cat: '명소', rating: '★4.5' },
  { id: 'g5', n: 'Camden Market', addr: 'Camden Lock Pl, London NW1 8AF', city: '런던', cat: '쇼핑', rating: '★4.4' },
];

/** 지도 위 마커 자리 (실제 지도/좌표 투영 연동 전 임시: id 해시로 보이는 영역에 고르게 배치) */
export function markerSpot(id: string, w = 390): { x: number; y: number } {
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return { x: 50 + (h % (w - 110)), y: 110 + ((h >>> 8) % 150) };
}
