/** 지갑 인메모리 더미 스토어 (useSyncExternalStore). 화면 간 예산·지출·정산 상태 공유. */
import { useSyncExternalStore } from 'react';

export type CC = 'GB' | 'FR' | 'IT';
export const COUNTRIES: { code: CC; name: string; city: string; badge: string; sym: string; cur: string; rate: number }[] = [
  { code: 'GB', name: '영국', city: '런던', badge: 'UK', sym: '£', cur: 'GBP', rate: 1900 },
  { code: 'FR', name: '프랑스', city: '파리', badge: 'FR', sym: '€', cur: 'EUR', rate: 1610 },
  { code: 'IT', name: '이탈리아', city: '로마', badge: 'IT', sym: '€', cur: 'EUR', rate: 1610 },
];
export const country = (c: CC) => COUNTRIES.find((x) => x.code === c)!;
export const isCC = (c: any): c is CC => c === 'GB' || c === 'FR' || c === 'IT';

export const TODAY = '2026-11-21';
export const DEFAULT_ADD_DATE = '2026-11-20';
export const TRIP_DATES = ['2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28'];

export type SchedItem = { id: string; date: string; time: string; title: string; cat: string; country: CC };
export const SCHEDULE: SchedItem[] = [
  { id: 's1', date: '2026-11-20', time: 'AM 06:00', title: '짐 챙기고 출발 😝 (여권!)', cat: '기타', country: 'GB' },
  { id: 's2', date: '2026-11-20', time: 'AM 10:55', title: '인천공항 비행기 탑승', cat: '교통비', country: 'GB' },
  { id: 's3', date: '2026-11-20', time: 'PM 05:20', title: '히스로 공항 터미널 4로 도착', cat: '교통비', country: 'GB' },
  { id: 's4', date: '2026-11-20', time: 'PM 06:00', title: '프리미어 인 히드로 숙소 체크인', cat: '기타', country: 'GB' },
  { id: 's5', date: '2026-11-21', time: 'AM 09:30', title: '런던 아이 관람', cat: '입장료', country: 'GB' },
  { id: 's6', date: '2026-11-21', time: 'PM 01:00', title: '버러 마켓 점심', cat: '외식', country: 'GB' },
  { id: 's7', date: '2026-11-21', time: 'PM 04:00', title: '기념품 가게 구경', cat: '기념품', country: 'GB' },
  { id: 's8', date: '2026-11-24', time: 'AM 11:00', title: '에펠탑 전망대', cat: '입장료', country: 'FR' },
  { id: 's9', date: '2026-11-24', time: 'PM 07:00', title: '센강 근처 저녁 식사', cat: '외식', country: 'FR' },
  { id: 's10', date: '2026-11-27', time: 'AM 09:00', title: '콜로세움 입장', cat: '입장료', country: 'IT' },
  { id: 's11', date: '2026-11-27', time: 'PM 12:30', title: '트라토리아 점심', cat: '외식', country: 'IT' },
];

export type Expense = { id: string; country: CC; date: string; cat: string; title: string; amount: number; scheduleId?: string };
export type SettleItem = { id: string; who: string; note: string; amt: number; st: 'done' | 'asked' | 'todo'; when?: string };

export type WalletState = {
  budget: { total: number | null; byCountry: Record<CC, number> }; // KRW
  cats: Record<CC, string[]>;
  expenses: Expense[];
  settle: { items: SettleItem[]; settled: boolean; people: number };
};

const DEFAULT_CATS = ['외식', '기념품', '입장료', '교통비', '기타'];
let seq = 100;

let state: WalletState = {
  budget: { total: null, byCountry: { GB: 0, FR: 0, IT: 0 } },
  cats: { GB: [...DEFAULT_CATS], FR: [...DEFAULT_CATS], IT: [...DEFAULT_CATS] },
  expenses: [
    { id: 'e1', country: 'GB', date: '2026-11-20', cat: '외식', title: '히스로 도착 후 저녁', amount: 21 },
    { id: 'e2', country: 'GB', date: '2026-11-21', cat: '입장료', title: '런던 아이 관람', amount: 101, scheduleId: 's5' },
  ],
  settle: {
    people: 3, settled: false,
    items: [
      { id: 'p1', who: '지연 → 민수', note: '11/20 저녁 계산', amt: 52300, st: 'done' },
      { id: 'p2', who: '나 → 민수', note: '숙소 1박 결제분', amt: 118400, st: 'asked', when: '어제' },
      { id: 'p3', who: '나 → 지연', note: '택시비', amt: 31000, st: 'todo' },
    ],
  },
};
const subs = new Set<() => void>();
const set = (p: Partial<WalletState>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };
export function useWallet(): WalletState {
  return useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => state, () => state);
}

// ── 예산 ──
export const hasBudget = (s: WalletState) => s.budget.total != null && s.budget.total > 0;
export const saveBudget = (total: number, byCountry: Record<CC, number>) => set({ budget: { total, byCountry } });
export const resetBudget = () => set({ budget: { total: null, byCountry: { GB: 0, FR: 0, IT: 0 } } });

// ── 지출 ──
export const addExpense = (e: Omit<Expense, 'id'>) => { const id = 'e' + ++seq; set({ expenses: [...state.expenses, { ...e, id }] }); return id; };
export const updateExpense = (id: string, p: Partial<Expense>) => set({ expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...p } : e)) });
export const deleteExpense = (id: string) => set({ expenses: state.expenses.filter((e) => e.id !== id) });

// ── 카테고리 ──
export const addCat = (c: CC, name: string) => {
  const n = name.trim(); if (!n || state.cats[c].includes(n)) return;
  set({ cats: { ...state.cats, [c]: [...state.cats[c], n] } });
};
export const removeCat = (c: CC, name: string) => set({ cats: { ...state.cats, [c]: state.cats[c].filter((x) => x !== name) } });

// ── 정산 ──
const mapItems = (f: (x: SettleItem) => SettleItem) => set({ settle: { ...state.settle, items: state.settle.items.map(f) } });
export const settleAsk = (id: string) => mapItems((x) => (x.id === id ? { ...x, st: 'asked', when: '방금' } : x));
export const settleAskAll = () => mapItems((x) => (x.st === 'todo' ? { ...x, st: 'asked', when: '방금' } : x));
export const settlePaid = (id: string, paid: boolean) => mapItems((x) => (x.id === id ? { ...x, st: paid ? 'done' : 'asked', when: paid ? undefined : '방금' } : x));
export const settleComplete = () => set({ settle: { ...state.settle, settled: true, items: state.settle.items.map((x) => ({ ...x, st: 'done' as const })) } });
export const settleReopen = () => set({ settle: { ...state.settle, settled: false } });

// ── 계산/포맷 ──
export const toKRW = (amount: number, c: CC) => Math.round(amount * country(c).rate);
export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
export const spentLocal = (s: WalletState, c: CC, cat?: string) => sum(s.expenses.filter((e) => e.country === c && (!cat || e.cat === cat)).map((e) => e.amount));
export const spentKRW = (s: WalletState, c?: CC) => sum(s.expenses.filter((e) => !c || e.country === c).map((e) => toKRW(e.amount, e.country)));
export const comma = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const krw = (n: number) => `${comma(n)}원`;
export const num = (n: number) => String(Math.round(n * 100) / 100);
export const local = (n: number, c: CC) => `${num(n)} ${country(c).sym}`;
/** 150만원 식 축약 */
export function manwon(n: number) {
  if (n >= 10000) { const m = n / 10000; return `${Number.isInteger(m) ? comma(m) : num(m)}만원`; }
  return krw(n);
}
export const sortedExpenses = (s: WalletState) => [...s.expenses].sort((a, b) => (a.date === b.date ? Number(b.id.slice(1)) - Number(a.id.slice(1)) : a.date < b.date ? 1 : -1));
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
export const dateLabel = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return `${m}/${dd}(${DOW[new Date(y, m - 1, dd).getDay()]})`; };
export const dateLong = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return `${y}.${String(m).padStart(2, '0')}.${String(dd).padStart(2, '0')}(${DOW[new Date(y, m - 1, dd).getDay()]})`; };
export const CAT_COLORS = ['#1e6fff', '#34c759', '#ff9f0a', '#af52de'];
export const catColor = (i: number, sub: string) => (i < 4 ? CAT_COLORS[i] : i === 4 ? sub : CAT_COLORS[i % 4]);
