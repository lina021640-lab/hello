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

function CalendarView({ view }: { view: TripView }) {
  const { t } = useTheme();
  const TRIP = { days: view.days, cities: view.cities, start: view.start }; const dateOf = view.dateOf;
  const lead = dateOf(1).getDay();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: TRIP.days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const rows = cells.length / 7;
  const W = 215, pad = 14, cw = (W - pad * 2) / 7;
  const pitch = rows > 6 ? 23.5 : 28, dot = 22, gridH = Math.min(rows * pitch, 168);
  const months = Array.from(new Set(Array.from({ length: TRIP.days }, (_, i) => dateOf(i + 1).getMonth() + 1)));
  const wk = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 44 }}>
      <T size={16} w="sb" color={t.acc} align="center" ls={-1}>{`${months.join('·')}월 | ${TRIP.start.getFullYear()}`}</T>
      <View style={{ flexDirection: 'row', marginTop: 12, paddingHorizontal: pad }}>
        {wk.map((w, i) => <T key={i} size={12} w="m" color={i % 6 === 0 ? t.sub : t.text} align="center" style={{ width: cw }}>{w}</T>)}
      </View>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ marginTop: 6, marginHorizontal: pad, height: gridH }}>
      <View style={{ height: rows * pitch }}>
        {/* 도시별 색 띠 (여러 도시일 때) */}
        {TRIP.cities.length > 1 && Array.from({ length: rows }).flatMap((_, r) =>
          TRIP.cities.map((c) => {
            const cols = [0, 1, 2, 3, 4, 5, 6].filter((k) => { const n = cells[r * 7 + k]; return n && n >= c.from && n <= c.to; });
            if (!cols.length) return null;
            return <View key={`${r}-${c.n}`} pointerEvents="none" style={{ position: 'absolute', left: cols[0] * cw + 1, width: cols.length * cw - 2, top: r * pitch + (pitch - dot) / 2, height: dot, borderRadius: dot / 2, backgroundColor: c.band }} />;
          }))}
        {cells.map((n, i) => {
          if (!n) return null;
          const edge = n === 1 || n === TRIP.days, col = i % 7, r = Math.floor(i / 7);
          return (
            <View key={i} style={{ position: 'absolute', left: col * cw, top: r * pitch, width: cw, height: pitch, alignItems: 'center', justifyContent: 'center' }}>
              {edge ? <View style={{ position: 'absolute', width: dot, height: dot, borderRadius: dot / 2, backgroundColor: t.acc }} /> : null}
              <T size={13} w="m" color={edge ? '#fff' : col % 6 === 0 ? t.sub : t.text} align="center">{dateOf(n).getDate()}</T>
            </View>
          );
        })}
      </View>
      </ScrollView>
    </View>
  );
}

function SummaryList({ view, items, onAdd }: { view: TripView; items: UserSched[]; onAdd?: (day: number) => void }) {
  const { t } = useTheme();
  const ref = useRef<ScrollView>(null);
  const ys = useRef<Record<number, number>>({});
  const focus = Math.min(Math.max(view.today, 1), view.days);
  const toToday = () => { const y = ys.current[focus]; if (y !== undefined) ref.current?.scrollTo({ y: y + 13, animated: false }); };
  useEffect(() => { const id = setTimeout(toToday, 60); return () => clearTimeout(id); }, []);
  return (
    <ScrollView ref={ref} nestedScrollEnabled showsVerticalScrollIndicator
      style={{ position: 'absolute', left: 0, right: 0, top: 48, height: 282 }} contentContainerStyle={{ paddingHorizontal: 16.5, paddingBottom: 120 }}>
      {Array.from({ length: view.days }, (_, i) => i + 1).map((n) => {
        const on = n === view.today, plan = planOf(items, n);
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
  return (
    <View style={[{ position: 'absolute', left: 0, top: 134, width: 215, height: 330, borderRadius: 30, backgroundColor: t.card, overflow: 'hidden' }, shadow(t)]}>
      {cal ? <CalendarView view={view} /> : <SummaryList view={view} items={items} onAdd={onAdd} />}
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
