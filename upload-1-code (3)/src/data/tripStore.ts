/** 여행 인메모리 스토어 (useSyncExternalStore). 홈 카드·지도·여행 만들기/수정이 공유. */
import { useSyncExternalStore } from 'react';
import { countryEn, countryKo } from './cities';

export type StoreCity = { city: string; country: string; cc: string; start: string; end: string };
export type Trip = { id: string; name: string; cities: StoreCity[]; start: string; end: string; members: string[] };

const seed: Trip[] = [
  { id: 'eu', name: '유럽 여행', start: '2026-11-20', end: '2026-12-29',
    cities: [
      { city: '런던', country: '영국', cc: 'GB', start: '2026-11-20', end: '2026-11-30' },
      { city: '파리', country: '프랑스', cc: 'FR', start: '2026-12-01', end: '2026-12-12' },
      { city: '베를린', country: '독일', cc: 'DE', start: '2026-12-13', end: '2026-12-22' },
      { city: '피렌체', country: '이탈리아', cc: 'IT', start: '2026-12-23', end: '2026-12-29' },
    ],
    members: ['#ff8a4c', '#5ac8fa', '#f5c16c', '#9be18f', '#c58bf2', '#ff6b8a', '#6ea8ff', '#ffd84d', '#4cd1a8'] },
  { id: 'tyo', name: '도쿄', start: '2026-11-10', end: '2026-12-11',
    cities: [{ city: '도쿄', country: '일본', cc: 'JP', start: '2026-11-10', end: '2026-12-11' }],
    members: ['#9be18f', '#ff8a4c'] },
];

type State = { trips: Trip[]; selectedId: string | null };
let state: State = { trips: seed, selectedId: seed[0].id };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };

export const useTripStore = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => state, () => state);
export const getTrips = () => state.trips;
export const getTrip = (id?: string | null): Trip | undefined => state.trips.find((x) => x.id === (id ?? state.selectedId)) ?? state.trips[0];

export const selectTrip = (id: string) => { if (state.selectedId !== id) set({ selectedId: id }); };
export function addTrip(v: Omit<Trip, 'id' | 'members'> & { members?: string[] }) {
  const id = 'trip' + Date.now().toString(36);
  set({ trips: [...state.trips, { members: ['#ff8a4c'], ...v, id }], selectedId: id });
  return id;
}
export const updateTrip = (id: string, v: Partial<Omit<Trip, 'id'>>) => set({ trips: state.trips.map((x) => (x.id === id ? { ...x, ...v } : x)) });
export function deleteTrip(id: string) {
  const trips = state.trips.filter((x) => x.id !== id);
  set({ trips, selectedId: state.selectedId === id ? trips[0]?.id ?? null : state.selectedId });
}

// ── 표시용 도우미 ──
const uniq = <T,>(a: T[]) => a.filter((x, i) => a.indexOf(x) === i);
/** 지도 하이라이트용 영어 국가명 */
export const tripCountriesEn = (t: Trip) => uniq(t.cities.map((c) => countryEn(c.cc)).filter(Boolean) as string[]);
/** 카드 부제: 나라 이름들 (공백 구분) */
export const tripCountriesKo = (t: Trip) => uniq(t.cities.map((c) => c.country || countryKo(c.cc)).filter(Boolean)).join(' ');
export const tripRange = (t: Trip) => (t.start ? `${t.start.replace(/-/g, '.')} -${t.end.replace(/-/g, '.')}` : '');
