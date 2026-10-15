/** 지갑 스토어 (useSyncExternalStore) — 선택된 여행(useCurrentTrip)의 지출을 Supabase `expenses` 에서 불러온다.
 *  나라/통화는 여행 도시(trip_cities)에서 파생. 정산은 실제 멤버 + 실제 지출로 계산한다.
 *  예산·카테고리 편집·정산 진행 상태는 아직 기기 로컬(예산은 AsyncStorage). */
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, koError } from '../lib/supabase';
import { getAuth, useAuth } from './authStore';
import { CITIES, countryKo, flag as ccFlag, ccLabel } from './cities';
import { Trip, Member, fetchMembers } from './tripStore';
import { TripView, useCurrentTrip } from './currentTrip';

export type CC = string;
export type Ctry = { code: CC; name: string; city: string; badge: string; sym: string; cur: string; rate: number; flag: string };

// ── 통화 (참고용 대략 환율: KRW per 1 단위. 실시간 환율 API 연동 전 임시값) ──
const RATES: Record<string, number> = {
  KRW: 1, USD: 1400, EUR: 1610, GBP: 1900, JPY: 9.4, CNY: 195, TWD: 45, HKD: 180, MOP: 175, THB: 43, VND: 0.055, SGD: 1080, MYR: 330,
  IDR: 0.086, PHP: 24, KHR: 0.35, LAK: 0.065, INR: 16.5, NPR: 10.5, LKR: 4.6, MVR: 91, MNT: 0.4, UZS: 0.11, AED: 380, QAR: 385, TRY: 34,
  ILS: 410, JOD: 1975, EGP: 28, MAD: 150, ZAR: 78, KES: 10.8, CHF: 1700, CZK: 66, HUF: 4.1, PLN: 380, DKK: 215, SEK: 145, NOK: 138,
  ISK: 10.2, RUB: 17, CAD: 1010, MXN: 74, BRL: 255, ARS: 1.2, PEN: 385, CLP: 1.5, COP: 0.34, AUD: 920, NZD: 850, FJD: 625,
};
const SYMS: Record<string, string> = { KRW: '₩', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', CHF: 'CHF', INR: '₹', TRY: '₺', VND: '₫', THB: '฿', PHP: '₱', ILS: '₪' };
const CUR_KO: Record<string, string> = { KRW: '대한민국 원', USD: '미국 달러', EUR: '유로', GBP: '영국 파운드', JPY: '일본 엔', CNY: '중국 위안', THB: '태국 바트', VND: '베트남 동', CHF: '스위스 프랑', AUD: '호주 달러', CAD: '캐나다 달러', SGD: '싱가포르 달러', HKD: '홍콩 달러', TWD: '대만 달러' };
export const currencyInfo = (cur: string) => ({ cur, sym: SYMS[cur] ?? cur, rate: RATES[cur] ?? 1, name: CUR_KO[cur] ?? cur });

/** 국가 코드 → 표시 정보 (여행과 무관하게 조회 가능) */
export function country(cc: CC, city = ''): Ctry {
  const cur = CITIES.find((c) => c.cc === cc)?.cur ?? 'KRW';
  const ci = currencyInfo(cur);
  return { code: cc, name: countryKo(cc) || cc, city, badge: ccLabel(cc), sym: ci.sym, cur, rate: ci.rate, flag: cc.length === 2 ? ccFlag(cc) : '' };
}
export const FALLBACK_COUNTRY: Ctry = { code: 'KR', name: '대한민국', city: '', badge: 'KR', sym: '₩', cur: 'KRW', rate: 1, flag: '🇰🇷' };
/** 여행 도시들에서 나라 목록(순서 유지, 중복 제거). 도시에 나라가 없으면 원화 하나. */
export function tripCountries(trip?: Trip): Ctry[] {
  const out: Ctry[] = [];
  (trip?.cities ?? []).forEach((c) => { if (c.cc && !out.some((x) => x.code === c.cc)) out.push(country(c.cc, c.city)); });
  return out.length ? out : trip ? [FALLBACK_COUNTRY] : [];
}

// ── 날짜 ──
const p2 = (n: number) => String(n).padStart(2, '0');
export const ymd = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const todayYMD = () => ymd(new Date());
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
export const dateLabel = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return `${m}/${dd}(${DOW[new Date(y, m - 1, dd).getDay()]})`; };
export const dateLong = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return `${y}.${p2(m)}.${p2(dd)}(${DOW[new Date(y, m - 1, dd).getDay()]})`; };
const tripDates = (v: TripView | null) => (v ? Array.from({ length: v.days }, (_, i) => ymd(v.dateOf(i + 1))) : []);

export type Expense = {
  id: string; country: CC; date: string; at: number; cat: string; title: string; amount: number; currency: string; paidBy: string; splitAmong: string[];
};
export type Budget = { total: number | null; byCountry: Record<CC, number> };
export type SettleMemo = Record<string, { st: 'asked' | 'done'; when?: string }>;

type Store = {
  tripId: string | null; expenses: Expense[]; members: Member[]; loading: boolean; error: string | null;
  budget: Budget; cats: Record<string, string[]>; memo: SettleMemo; settled: boolean;
};
const EMPTY_BUDGET: Budget = { total: null, byCountry: {} };
const DEFAULT_CATS = ['외식', '기념품', '입장료', '교통비', '기타'];
let store: Store = { tripId: null, expenses: [], members: [], loading: false, error: null, budget: EMPTY_BUDGET, cats: {}, memo: {}, settled: false };
const subs = new Set<() => void>();
const set = (p: Partial<Store>) => { store = { ...store, ...p }; subs.forEach((f) => f()); };
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

type Row = { id: string; paid_by: string; title: string; amount: number | string; currency: string | null; category: string | null; country_code: string | null; split_among: string[] | null; spent_at: string };
const fromRow = (r: Row): Expense => {
  const at = new Date(r.spent_at).getTime();
  return { id: r.id, country: r.country_code ?? 'KR', date: ymd(new Date(at)), at, cat: r.category ?? '기타', title: r.title, amount: Number(r.amount), currency: r.currency ?? 'KRW', paidBy: r.paid_by, splitAmong: r.split_among ?? [] };
};
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); });

const BKEY = (id: string) => `wallet-budget:${id}`;
async function loadBudget(id: string) {
  try {
    const s = await AsyncStorage.getItem(BKEY(id));
    if (s && store.tripId === id) set({ budget: JSON.parse(s) as Budget });
  } catch { /* 예산은 없어도 동작 */ }
}

async function loadAll(id: string) {
  set({ loading: true, error: null });
  try {
    const [{ data, error }, members] = await Promise.all([
      supabase.from('expenses').select('*').eq('trip_id', id).order('spent_at', { ascending: false }),
      fetchMembers(id).catch(() => [] as Member[]),
    ]);
    if (error) throw error;
    if (store.tripId !== id) return;
    set({ expenses: (data as Row[]).map(fromRow), members, loading: false });
  } catch (e) {
    if (store.tripId === id) set({ loading: false, error: koError(e, '지출을 불러오지 못했어요') });
  }
}
function ensureTrip(id: string | null) {
  if (store.tripId === id) return;
  set({ tripId: id, expenses: [], members: [], loading: false, error: null, budget: EMPTY_BUDGET, cats: {}, memo: {}, settled: false });
  if (id) { loadAll(id); loadBudget(id); }
}
export const reloadWallet = () => { if (store.tripId) loadAll(store.tripId); };

export type WalletState = {
  trip?: Trip; view: TripView | null; countries: Ctry[]; dates: string[]; meId: string | null;
  expenses: Expense[]; members: Member[]; loading: boolean; error: string | null;
  budget: Budget; catsOf: (cc: CC) => string[]; settle: { settled: boolean; memo: SettleMemo };
  nameOf: (uid: string) => string;
};
export function useWallet(): WalletState {
  const raw = useSyncExternalStore(sub, () => store, () => store);
  const view = useCurrentTrip();
  const { user } = useAuth();
  const trip = view?.trip;
  const tid = trip?.id ?? null;
  useEffect(() => { ensureTrip(tid); }, [tid]);
  const live = raw.tripId === tid; // 여행이 바뀐 직후 한 프레임은 이전 데이터를 숨긴다
  return useMemo<WalletState>(() => {
    const meId = user?.id ?? null;
    return {
      trip, view, countries: tripCountries(trip), dates: tripDates(view), meId,
      expenses: live ? raw.expenses : [], members: live ? raw.members : [], loading: raw.loading || !live, error: live ? raw.error : null,
      budget: live ? raw.budget : EMPTY_BUDGET,
      catsOf: (cc) => raw.cats[`${tid}|${cc}`] ?? DEFAULT_CATS,
      settle: { settled: raw.settled, memo: raw.memo },
      nameOf: (uid) => (uid === meId ? '나' : raw.members.find((m) => m.userId === uid)?.nickname ?? '여행자'),
    };
  }, [raw, view, user?.id, live, trip, tid]);
}

// ── 예산 ──
export const hasBudget = (s: WalletState) => s.budget.total != null && s.budget.total > 0;
const persistBudget = (b: Budget) => { const id = store.tripId; set({ budget: b }); if (id) AsyncStorage.setItem(BKEY(id), JSON.stringify(b)).catch(() => {}); };
export const saveBudget = (total: number, byCountry: Record<CC, number>) => persistBudget({ total, byCountry });
export const resetBudget = () => { const id = store.tripId; set({ budget: EMPTY_BUDGET }); if (id) AsyncStorage.removeItem(BKEY(id)).catch(() => {}); };

// ── 지출 (Supabase, 낙관적 갱신) ──
export type NewExpense = { country: CC; date: string; cat: string; title: string; amount: number; splitAmong: string[] };
const spentAt = (date: string) => {
  if (date === todayYMD()) return new Date();
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, (Date.now() % 3600) * 1000);
};
export async function addExpense(e: NewExpense): Promise<void> {
  const tripId = store.tripId; const uid = getAuth().session?.user.id;
  if (!tripId || !uid) throw new Error('여행을 먼저 추가해 주세요');
  const id = uuid(); const at = spentAt(e.date); const cur = country(e.country).cur;
  const opt: Expense = { id, country: e.country, date: e.date, at: at.getTime(), cat: e.cat, title: e.title, amount: e.amount, currency: cur, paidBy: uid, splitAmong: e.splitAmong };
  set({ expenses: [opt, ...store.expenses] });
  const { error } = await supabase.from('expenses').insert({ id, trip_id: tripId, title: e.title, amount: e.amount, currency: cur, category: e.cat, country_code: e.country, split_among: e.splitAmong, spent_at: at.toISOString() });
  if (error) { if (store.tripId === tripId) set({ expenses: store.expenses.filter((x) => x.id !== id) }); throw new Error(koError(error, '지출을 저장하지 못했어요')); }
}
export async function updateExpense(id: string, p: Partial<Pick<Expense, 'title' | 'amount' | 'cat'>>): Promise<void> {
  const prev = store.expenses.find((x) => x.id === id); if (!prev) return;
  set({ expenses: store.expenses.map((x) => (x.id === id ? { ...x, ...p } : x)) });
  const patch: Record<string, unknown> = {};
  if (p.title !== undefined) patch.title = p.title; if (p.amount !== undefined) patch.amount = p.amount; if (p.cat !== undefined) patch.category = p.cat;
  const { error } = await supabase.from('expenses').update(patch).eq('id', id);
  if (error) { set({ expenses: store.expenses.map((x) => (x.id === id ? prev : x)) }); throw new Error(koError(error, '지출을 저장하지 못했어요')); }
}
export async function deleteExpense(id: string): Promise<void> {
  const prev = store.expenses.find((x) => x.id === id); if (!prev) return;
  set({ expenses: store.expenses.filter((x) => x.id !== id) });
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) { set({ expenses: [prev, ...store.expenses] }); throw new Error(koError(error, '지출을 삭제하지 못했어요')); }
}

/** 이 날(일차)의 일정 항목 — 지출 추가 화면의 '일정에서 가져오기'. 읽기 전용 */
export type DayItem = { id: string; time: string; title: string; cat: string };
export async function fetchDayItems(tripId: string, day: number): Promise<DayItem[]> {
  const { data, error } = await supabase.from('schedule_items').select('id, start_time, title, place, category').eq('trip_id', tripId).eq('day', day).order('start_time', { ascending: true });
  if (error) return [];
  return (data ?? []).map((r) => ({ id: r.id as string, time: (r.start_time as string | null) ?? '', title: (r.title as string | null) || (r.place as string | null) || '일정', cat: (r.category as string | null) ?? '기타' }));
}

// ── 카테고리 (기기 로컬) ──
export const addCat = (c: CC, name: string) => {
  const n = name.trim(); const k = `${store.tripId}|${c}`; const cur = store.cats[k] ?? DEFAULT_CATS;
  if (!n || cur.includes(n)) return;
  set({ cats: { ...store.cats, [k]: [...cur, n] } });
};
export const removeCat = (c: CC, name: string) => { const k = `${store.tripId}|${c}`; set({ cats: { ...store.cats, [k]: (store.cats[k] ?? DEFAULT_CATS).filter((x) => x !== name) } }); };

// ── 정산: 실제 멤버·지출로 계산 (송금은 하지 않음) ──
export type Transfer = { key: string; from: string; to: string; amt: number; st: 'done' | 'asked' | 'todo'; when?: string };
export function computeTransfers(s: WalletState): { total: number; perPerson: number; people: number; items: Transfer[] } {
  const ids = s.members.map((m) => m.userId); const set0 = new Set(ids);
  const bal: Record<string, number> = {}; ids.forEach((i) => { bal[i] = 0; });
  let total = 0;
  s.expenses.forEach((e) => {
    const k = toKRW(e.amount, e.country); total += k;
    const part = (e.splitAmong.length ? e.splitAmong : ids).filter((u) => set0.has(u));
    if (!part.length || !set0.has(e.paidBy)) return;
    bal[e.paidBy] += k; part.forEach((u) => { bal[u] -= k / part.length; });
  });
  const cr = ids.filter((i) => bal[i] > 0.5).map((i) => ({ id: i, v: bal[i] })).sort((a, b) => b.v - a.v);
  const db = ids.filter((i) => bal[i] < -0.5).map((i) => ({ id: i, v: -bal[i] })).sort((a, b) => b.v - a.v);
  const items: Transfer[] = [];
  let i = 0, j = 0;
  while (i < db.length && j < cr.length) {
    const x = Math.min(db[i].v, cr[j].v);
    const key = `${db[i].id}>${cr[j].id}`; const m = s.settle.memo[key];
    items.push({ key, from: db[i].id, to: cr[j].id, amt: Math.round(x), st: s.settle.settled ? 'done' : m?.st ?? 'todo', when: m?.when });
    db[i].v -= x; cr[j].v -= x;
    if (db[i].v < 0.5) i++; if (cr[j].v < 0.5) j++;
  }
  const people = Math.max(1, ids.length);
  return { total, perPerson: Math.round(total / people), people, items };
}
export const settleAsk = (key: string) => set({ memo: { ...store.memo, [key]: { st: 'asked', when: '방금' } } });
export const settleAskAll = (keys: string[]) => { const m = { ...store.memo }; keys.forEach((k) => { if (!m[k]) m[k] = { st: 'asked', when: '방금' }; }); set({ memo: m }); };
export const settlePaid = (key: string, paid: boolean) => set({ memo: { ...store.memo, [key]: paid ? { st: 'done' } : { st: 'asked', when: '방금' } } });
export const settleComplete = () => set({ settled: true });
export const settleReopen = () => set({ settled: false });

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
export const sortedExpenses = (s: WalletState) => [...s.expenses].sort((a, b) => b.at - a.at);
export const CAT_COLORS = ['#1e6fff', '#34c759', '#ff9f0a', '#af52de'];
export const catColor = (i: number, sub: string) => (i < 4 ? CAT_COLORS[i] : i === 4 ? sub : CAT_COLORS[i % 4]);
