/** 사용자가 추가한 일정 인메모리 스토어 (useSyncExternalStore). 일정 추가 → 세부일정/지도 목록에 병합. */
import { useSyncExternalStore } from 'react';

export type UserSched = { id: string; day: number; time: string; title: string; place: string; category: string; memo: string };

let items: UserSched[] = [];
let addDay = 3; // 일정 추가 화면이 처음 선택할 일차 (세부일정에서 보던 날)
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

export function useUserSchedule(): UserSched[] { return useSyncExternalStore(sub, () => items, () => items); }
export const userItemsOf = (all: UserSched[], day: number) => all.filter((x) => x.day === day);
export function addScheduleItem(it: Omit<UserSched, 'id'>) { const id = 'u' + ++seq; items = [...items, { ...it, id }]; emit(); return id; }
export function updateScheduleItem(id: string, p: Partial<UserSched>) { items = items.map((x) => (x.id === id ? { ...x, ...p } : x)); emit(); }
export function deleteScheduleItem(id: string) { items = items.filter((x) => x.id !== id); emit(); }
export const setAddDay = (d: number) => { addDay = d; };
export const getAddDay = () => addDay;
/** "AM 10:00" / "PM 05:00" → 분 (정렬용, 해석 불가면 맨 뒤) */
export function timeKey(s: string) {
  const m = /(AM|PM)?\s*(\d{1,2}):?(\d{2})?/i.exec(s || ''); if (!m) return 9999;
  let h = Number(m[2]) % 12; if ((m[1] || '').toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[3] || 0);
}
