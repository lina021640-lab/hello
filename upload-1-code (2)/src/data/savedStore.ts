/** 저장 탭/공유 피드 인메모리 더미 스토어 (useSyncExternalStore). */
import { useSyncExternalStore } from 'react';

export type SavedPlace = { id: string; n: string; m: string; q?: string; by: string; cat: string; dist: number; savedAt: number };
export type FeedPlace = { id: string; n: string; e: string; m: string; q: string; by: string; cat: string; likes: number; dist: number };
export type FoundPlace = { id: string; n: string; addr: string; city: string; cat: string; rating: string; dist: number };

const NOW = Date.UTC(2026, 9, 15, 9, 0, 0);
const H = 3600 * 1000;

export const SORT_SAVED = ['거리순', '저장한 순'] as const;
export const SORT_FEED = ['인기순', '거리순'] as const;

/** 거리(m) → "450m" / "1.2km" */
export const fmtDist = (m: number) => (m < 1000 ? `${Math.round(m)}m` : `${(Math.round(m / 100) / 10).toFixed(1)}km`);

type State = { items: SavedPlace[]; toast: string | null };
let state: State = {
  items: [
    { id: 'v1', n: '버러 마켓', m: '런던 · 시장 · ★4.6', q: '“평일 오전이 한가해요”', by: '민수 · 3일 전', cat: '맛집', dist: 1200, savedAt: NOW - 72 * H },
    { id: 'v2', n: '에펠탑 전망대', m: '파리 · 명소 · ★4.7', q: '“일몰 30분 전에 올라가세요”', by: '지연 · 1주 전', cat: '명소', dist: 340000, savedAt: NOW - 168 * H },
    { id: 'v3', n: '두오모 쿠폴라', m: '피렌체 · 명소 · ★4.8', q: '“아침 일찍 예약하세요”', by: '민수 · 5일 전', cat: '명소', dist: 860, savedAt: NOW - 120 * H },
    { id: 'v4', n: 'Monmouth Coffee', m: '런던 · 카페 · ★4.6', by: '나 · 2일 전', cat: '카페', dist: 450, savedAt: NOW - 48 * H },
  ],
  toast: null,
};
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
export function useSaved(): State {
  return useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => state, () => state);
}

export const isSaved = (s: State, id: string) => s.items.some((x) => x.id === id || x.id === 'f-' + id);

export function sortSaved(items: SavedPlace[], mode: number): SavedPlace[] {
  return [...items].sort((a, b) => (mode === 0 ? a.dist - b.dist : b.savedAt - a.savedAt));
}

/** 검색 결과를 저장 목록 맨 위에 추가 (이미 있으면 맨 위로 올림) */
export function addSavedPlace(p: FoundPlace) {
  const id = 'f-' + p.id;
  const item: SavedPlace = { id, n: p.n, m: `${p.city} · ${p.cat} · ${p.rating}`, by: '나 · 방금 저장', cat: p.cat, dist: p.dist, savedAt: Date.now() };
  set({ items: [item, ...state.items.filter((x) => x.id !== id)], toast: `‘${p.n}’을(를) 저장했어요` });
}
export const clearToast = () => { if (state.toast) set({ toast: null }); };

export const FEED: FeedPlace[] = [
  { id: 'f1', n: '버러 마켓', e: '🥐', m: '런던 · 시장 · ★4.6', q: '“평일 오전이 한가해요”', by: '민수 · 3일 전', cat: '맛집', likes: 128, dist: 1200 },
  { id: 'f2', n: '에펠탑 전망대', e: '🗼', m: '파리 · 명소 · ★4.7', q: '“일몰 30분 전에 올라가세요”', by: '지연 · 1주 전', cat: '명소', likes: 94, dist: 340000 },
  { id: 'f3', n: 'Dishoom', e: '🍺', m: '런던 · 맛집 · ★4.7', q: '“저녁엔 웨이팅이 길어요”', by: '민수 · 2일 전', cat: '맛집', likes: 156, dist: 700 },
  { id: 'f4', n: 'Café de Flore', e: '☕', m: '파리 · 카페 · ★4.3', q: '“테라스 자리가 좋아요”', by: '지연 · 4일 전', cat: '카페', likes: 61, dist: 342000 },
];
export const sortFeed = (items: FeedPlace[], likes: Record<string, number>, mode: number) =>
  [...items].sort((a, b) => (mode === 0 ? (likes[b.id] ?? b.likes) - (likes[a.id] ?? a.likes) : a.dist - b.dist));

/** 장소 검색 더미 결과 (Google 장소) */
export const FOUND: FoundPlace[] = [
  { id: 'g1', n: 'Monmouth Coffee Company', addr: '2 Park St, London SE1 9AB', city: '런던', cat: '카페', rating: '★4.6', dist: 450 },
  { id: 'g2', n: 'Dishoom Covent Garden', addr: '12 Upper St Martin\'s Ln, London WC2H 9FB', city: '런던', cat: '맛집', rating: '★4.7', dist: 2100 },
  { id: 'g3', n: 'Café de Flore', addr: '172 Bd Saint-Germain, 75006 Paris', city: '파리', cat: '카페', rating: '★4.3', dist: 342000 },
  { id: 'g4', n: 'Sky Garden', addr: '1 Sky Garden Walk, London EC3M 8AF', city: '런던', cat: '명소', rating: '★4.5', dist: 3400 },
  { id: 'g5', n: 'Camden Market', addr: 'Camden Lock Pl, London NW1 8AF', city: '런던', cat: '쇼핑', rating: '★4.4', dist: 5800 },
];

/** 장소 이름으로 저장 여부 확인 / 토글 (장소 상세의 저장·저장됨 버튼) */
export const isSavedName = (s: State, name: string) => s.items.some((x) => x.n === name);
export function toggleSavedName(name: string, meta: { city: string; cat: string; rating: string }) {
  if (state.items.some((x) => x.n === name)) {
    set({ items: state.items.filter((x) => x.n !== name), toast: `‘${name}’ 저장을 취소했어요` });
    return;
  }
  const item: SavedPlace = { id: 'p-' + name, n: name, m: `${meta.city} · ${meta.cat} · ${meta.rating.replace('★ ', '★')}`, by: '나 · 방금 저장', cat: meta.cat, dist: 1000, savedAt: Date.now() };
  set({ items: [item, ...state.items], toast: `‘${name}’을(를) 저장했어요` });
}
