/** 현재 선택된 여행에서 파생되는 값들 — 일정/날씨/지갑/꿀팁 등 모든 화면이 이걸 기준으로 그린다. (더미 TRIP 대신 사용) */
import { useTripStore, Trip } from './tripStore';

const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, (m ?? 1) - 1, d ?? 1); };
const DAY = 86400000;
const startOfToday = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const BANDS = ['rgba(255,59,48,0.2)', 'rgba(255,204,0,0.24)', 'rgba(52,199,89,0.22)', 'rgba(0,122,255,0.2)', 'rgba(175,82,222,0.2)', 'rgba(255,149,0,0.22)'];

export type TripView = {
  trip: Trip; start: Date; end: Date; days: number;
  /** 오늘이 몇 일차인지(여행 전이면 0, 여행 후면 days+1) */ today: number;
  /** 'D-5' | 'D+3' | 'D-Day' | '종료' */ dday: string;
  cities: { n: string; cc: string; from: number; to: number; band: string }[];
  dateOf: (day: number) => Date;
  /** 해당 일차에 머무는 도시 이름 (없으면 '') */ cityOf: (day: number) => string;
};

export function buildTripView(trip: Trip | undefined): TripView | null {
  if (!trip || !trip.start || !trip.end) return null;
  const start = parse(trip.start), end = parse(trip.end);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY) + 1);
  const diff = Math.round((startOfToday().getTime() - start.getTime()) / DAY); // 0 = 첫날
  const today = diff < 0 ? 0 : diff + 1 > days ? days + 1 : diff + 1;
  const dday = today === 0 ? `D-${-diff}` : today === days + 1 ? '종료' : diff === 0 ? 'D-Day' : `D+${diff}`;
  const cities = trip.cities.map((c, i) => ({
    n: c.city, cc: c.cc,
    from: Math.max(1, Math.round((parse(c.start).getTime() - start.getTime()) / DAY) + 1),
    to: Math.min(days, Math.round((parse(c.end).getTime() - start.getTime()) / DAY) + 1),
    band: BANDS[i % BANDS.length],
  }));
  const dateOf = (day: number) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + day - 1);
  const cityOf = (day: number) => cities.find((c) => day >= c.from && day <= c.to)?.n ?? '';
  return { trip, start, end, days, today, dday, cities, dateOf, cityOf };
}

/** 선택된 여행이 없으면 null (→ 화면은 '여행을 추가하세요' 빈 상태를 보여준다) */
export function useCurrentTrip(): TripView | null {
  const s = useTripStore();
  const trip = s.trips.find((t) => t.id === s.selectedId) ?? s.trips[0];
  return buildTripView(trip);
}
