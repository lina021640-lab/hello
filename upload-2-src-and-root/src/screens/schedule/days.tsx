/** 여행 메인 "N DAYS" 카드: 요약 정보(스크롤 목록) ↔ 달력 전환 */
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { T, Icon, useTheme, shadow } from '../../kit';

import type { TripView } from '../../data/currentTrip';
import { UserSched, userItemsOf, timeKey } from '../../data/scheduleStore';

/** 일차별 한 줄 요약: 시간순 항목 제목을 → 로 이은 문장 (없으면 '') */
export const planOf = (items: UserSched[], day: number) =>
  [...userItemsOf(items, day)].sort((a, b) => timeKey(a.time) - timeKey(b.time)).map((x) => x.title || x.place).filter(Boolean).join(' → ');

const DAY_MS = 86400000;

/** 한 달 전체 달력: 여행 밖 날짜는 흐리게, 여행 일자는 도시 색 띠, 일정이 있는 날은 점. 날짜를 누르면 그 일차로 이동. */
function CalendarView({ view, items, onPick }: { view: TripView; items: UserSched[]; onPick: (day: number) => void }) {
  const { t } = useTheme();
  const first = view.dateOf(1);
  const anchor = view.today >= 1 && view.today <= view.days ? view.dateOf(view.today) : first;
  const [ym, setYm] = useState({ y: anchor.getFullYear(), m: anchor.getMonth() });
  const move = (d: number) => setYm((c) => { const n = new Date(c.y, c.m + d, 1); return { y: n.getFullYear(), m: n.getMonth() }; });
  const lead = new Date(ym.y, ym.m, 1).getDay();
  const dim = new Date(ym.y, ym.m + 1, 0).getDate();
  const rows = Math.ceil((lead + dim) / 7);
  const cells = Array.from({ length: rows * 7 }, (_, i) => {
    const date = new Date(ym.y, ym.m, 1 - lead + i);
    const day = Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - first.getTime()) / DAY_MS) + 1;
    return { date, inMonth: date.getMonth() === ym.m, day: day >= 1 && day <= view.days ? day : 0 };
  });
  const hasItems = new Set(items.map((x) => x.day));
  const bandOf = (day: number) => view.cities.find((c) => day >= c.from && day <= c.to)?.band ?? t.accS;
  const W = 215, pad = 12, cw = (W - pad * 2) / 7, pitch = 26, dot = 22;
  const wk = ['일', '월', '화', '수', '목', '금', '토'];
  const todayDay = view.today;
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 42 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, height: 28 }}>
        <Pressable hitSlop={8} onPress={() => move(-1)} accessibilityLabel="이전 달" style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size={18} color={t.text} /></Pressable>
        <T size={16} w="sb" color={t.acc} align="center" ls={-1}>{`${ym.m + 1}월 | ${ym.y}`}</T>
        <Pressable hitSlop={8} onPress={() => move(1)} accessibilityLabel="다음 달" style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}><View style={{ transform: [{ rotate: '180deg' }] }}><Icon name="back" size={18} color={t.text} /></View></Pressable>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8, paddingHorizontal: pad }}>
        {wk.map((w, i) => <T key={i} size={11} w="m" color={t.sub} align="center" style={{ width: cw }}>{w}</T>)}
      </View>
      <View style={{ marginTop: 4, marginHorizontal: pad, height: rows * pitch }}>
        {/* 도시별 색 띠: 같은 줄에서 같은 색으로 이어지는 여행 일자를 한 덩어리로 */}
        {Array.from({ length: rows }).flatMap((_, r) => {
          const segs: { from: number; to: number; color: string }[] = [];
          for (let k = 0; k < 7; k++) {
            const c = cells[r * 7 + k]; if (!c.day) continue;
            const color = bandOf(c.day), last = segs[segs.length - 1];
            if (last && last.to === k - 1 && last.color === color) last.to = k; else segs.push({ from: k, to: k, color });
          }
          return segs.map((g) => <View key={`${r}-${g.from}`} pointerEvents="none" style={{ position: 'absolute', left: g.from * cw + 1, width: (g.to - g.from + 1) * cw - 2, top: r * pitch + (pitch - dot) / 2, height: dot, borderRadius: dot / 2, backgroundColor: g.color }} />);
        })}
        {cells.map((c, i) => {
          const col = i % 7, r = Math.floor(i / 7);
          const edge = c.day === 1 || c.day === view.days, isToday = c.day > 0 && c.day === todayDay;
          const fg = edge ? '#fff' : c.day ? t.text : t.sub;
          const op = c.day ? 1 : c.inMonth ? 0.55 : 0.3;
          return (
            <Pressable key={i} disabled={!c.day} onPress={() => onPick(c.day)} accessibilityLabel={c.day ? `${c.day}일차 ${c.date.getMonth() + 1}월 ${c.date.getDate()}일` : undefined}
              style={{ position: 'absolute', left: col * cw, top: r * pitch, width: cw, height: pitch, alignItems: 'center', justifyContent: 'center' }}>
              {edge ? <View style={{ position: 'absolute', width: dot, height: dot, borderRadius: dot / 2, backgroundColor: t.acc }} /> : null}
              {isToday && !edge ? <View style={{ position: 'absolute', width: dot, height: dot, borderRadius: dot / 2, borderWidth: 1.5, borderColor: t.acc }} /> : null}
              <T size={12} w={c.day ? 'm' : 'r'} color={fg} align="center" style={{ opacity: op }}>{c.date.getDate()}</T>
              {c.day && hasItems.has(c.day) ? <View style={{ position: 'absolute', bottom: 1, width: 4, height: 4, borderRadius: 2, backgroundColor: edge ? '#fff' : t.acc }} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SummaryList({ view, items, onAdd, jump }: { view: TripView; items: UserSched[]; onAdd?: (day: number) => void; jump?: number | null }) {
  const { t } = useTheme();
  const ref = useRef<ScrollView>(null);
  const ys = useRef<Record<number, number>>({});
  const focus = jump ?? Math.min(Math.max(view.today, 1), view.days);
  const toToday = () => { const y = ys.current[focus]; if (y !== undefined) ref.current?.scrollTo({ y: y + 13, animated: false }); };
  useEffect(() => { const id = setTimeout(toToday, 60); return () => clearTimeout(id); }, []);
  return (
    <ScrollView ref={ref} nestedScrollEnabled showsVerticalScrollIndicator
      style={{ position: 'absolute', left: 0, right: 0, top: 48, height: 282 }} contentContainerStyle={{ paddingHorizontal: 16.5, paddingBottom: 120 }}>
      {Array.from({ length: view.days }, (_, i) => i + 1).map((n) => {
        const on = n === (jump ?? view.today), plan = planOf(items, n);
        return (
          <View key={n} onLayout={(e) => { ys.current[n] = e.nativeEvent.layout.y; if (n === focus) toToday(); }}>
            {n > 1 ? <View style={{ height: 1, backgroundColor: t.line, marginTop: 6, marginBottom: 6, marginHorizontal: -3 }} /> : null}
            <T size={14} w="sb" ls={-1} color={on ? t.acc : t.text} lh={21}>{`${n}일차`}</T>
            {plan
              ? <T size={13} w={on ? 'm' : 'r'} color={on ? t.text : '#6b7280'} lh={16}>{plan}</T>
              : <Pressable onPress={() => onAdd?.(n)}><T size={13} w="r" color={t.sub} lh={16}>아직 일정이 없어요 · <T size={13} w="m" color={t.acc}>일정 추가</T></T></Pressable>}
          </View>
        );
      })}
    </ScrollView>
  );
}

export function DaysCard({ view, items, onAdd }: { view: TripView; items: UserSched[]; onAdd?: (day: number) => void }) {
  const { t } = useTheme();
  const [cal, setCal] = useState(false);
  const [jump, setJump] = useState<number | null>(null);
  return (
    <View style={[{ position: 'absolute', left: 0, top: 134, width: 215, height: 330, borderRadius: 30, backgroundColor: t.card, overflow: 'hidden' }, shadow(t)]}>
      {cal ? <CalendarView view={view} items={items} onPick={(d) => { setJump(d); setCal(false); }} /> : <SummaryList view={view} items={items} onAdd={onAdd} jump={jump} />}
      <T size={20} w="xb" ls={-1} align="center" style={{ position: 'absolute', left: 0, right: 0, top: 13 }} lh={24}>{`${view.days} DAYS`}</T>
      {!cal ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 229, height: 101 }}>
          <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none">
            <Defs><LinearGradient id="dfade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.2" stopColor={t.card} stopOpacity="0" /><Stop offset="0.63" stopColor={t.card} stopOpacity="0.72" /><Stop offset="1" stopColor={t.card} stopOpacity="1" />
            </LinearGradient></Defs>
            <Rect x="0" y="0" width="10" height="10" fill="url(#dfade)" />
          </Svg>
        </View>
      ) : null}
      <Pressable onPress={() => setCal((c) => !c)} style={{ position: 'absolute', left: 25, top: 266, width: 167, height: 44, borderRadius: 31, backgroundColor: t.mode === 'dark' ? '#fff' : '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <T size={16} w="m" ls={-1} color={t.mode === 'dark' ? '#000' : '#fff'}>{cal ? '요약 정보' : '달력'}</T>
        <View style={{ transform: [{ rotate: '0deg' }] }}><Icon name="arrow" size={16} color={t.mode === 'dark' ? '#000' : '#fff'} /></View>
      </Pressable>
    </View>
  );
}
