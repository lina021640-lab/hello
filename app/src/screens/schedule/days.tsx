/** 여행 메인 "N DAYS" 카드: 요약 정보(스크롤 목록) ↔ 달력 전환 */
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { T, Icon, useTheme, shadow } from '../../kit';

// ── 더미 여행(홈 카드와 동일: 2026.11.20 – 2026.12.29, 40일) ──
export const TRIP = {
  start: new Date(2026, 10, 20),
  days: 40,
  today: 3, // 3일차(D+3 표시와 맞춤)
  cities: [
    { n: '런던', from: 1, to: 11, band: 'rgba(255,59,48,0.2)' },
    { n: '파리', from: 12, to: 33, band: 'rgba(255,204,0,0.24)' },
    { n: '피렌체', from: 34, to: 40, band: 'rgba(52,199,89,0.22)' },
  ],
};
const PLANS: Record<number, string> = {
  1: '히드로 공항 도착 → 호텔 체크인 → 빅벤 & 런던아이 야경 → 호텔',
  2: '호텔 → 옥스퍼드 → 코츠월드 → 런던 복귀 → 호텔',
  3: '호텔 → 세인트 폴 대성당 → 버러 마켓 → 타워브리지 → 호텔',
  4: '호텔 → 웨스트민스터 사원 → 버킹엄 궁전 (근위병 교대식) → 트라팔가 광장 → 내셔널 갤러리 → 코벤트 가든 (저녁) → 호텔',
  5: '호텔 → 대영박물관 → 리젠트 스트리트 & 소호 거리 → 피카딜리 서커스 → 뮤지컬 관람 (웨스트엔드) → 호텔',
  6: '호텔 → 대영박물관 → 리젠트 스트리트 & 소호 거리 → 피카딜리 서커스 → 뮤지컬 관람 (웨스트엔드) → 호텔',
};
export const dateOf = (n: number) => new Date(TRIP.start.getFullYear(), TRIP.start.getMonth(), TRIP.start.getDate() + n - 1);
const cityOf = (n: number) => TRIP.cities.find((c) => n >= c.from && n <= c.to);

function CalendarView() {
  const { t } = useTheme();
  const lead = dateOf(1).getDay();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: TRIP.days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const rows = cells.length / 7;
  const W = 215, pad = 14, cw = (W - pad * 2) / 7;
  const pitch = rows > 6 ? 23.5 : 28, dot = 22;
  const months = Array.from(new Set(Array.from({ length: TRIP.days }, (_, i) => dateOf(i + 1).getMonth() + 1)));
  const wk = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 44 }}>
      <T size={16} w="sb" color={t.acc} align="center" ls={-1}>{`${months.join('·')}월 | ${TRIP.start.getFullYear()}`}</T>
      <View style={{ flexDirection: 'row', marginTop: 12, paddingHorizontal: pad }}>
        {wk.map((w, i) => <T key={i} size={12} w="m" color={i % 6 === 0 ? t.sub : t.text} align="center" style={{ width: cw }}>{w}</T>)}
      </View>
      <View style={{ marginTop: 6, marginHorizontal: pad, height: rows * pitch }}>
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
    </View>
  );
}

function SummaryList() {
  const { t } = useTheme();
  const ref = useRef<ScrollView>(null);
  const ys = useRef<Record<number, number>>({});
  const toToday = () => { const y = ys.current[TRIP.today]; if (y !== undefined) ref.current?.scrollTo({ y: y + 13, animated: false }); };
  useEffect(() => { const id = setTimeout(toToday, 60); return () => clearTimeout(id); }, []);
  return (
    <ScrollView ref={ref} nestedScrollEnabled showsVerticalScrollIndicator
      style={{ position: 'absolute', left: 0, right: 0, top: 48, height: 282 }} contentContainerStyle={{ paddingHorizontal: 16.5, paddingBottom: 120 }}>
      {Array.from({ length: TRIP.days }, (_, i) => i + 1).map((n) => {
        const on = n === TRIP.today, plan = PLANS[n];
        return (
          <View key={n} onLayout={(e) => { ys.current[n] = e.nativeEvent.layout.y; if (n === TRIP.today) toToday(); }}>
            {n > 1 ? <View style={{ height: 1, backgroundColor: t.line, marginTop: 6, marginBottom: 6, marginHorizontal: -3 }} /> : null}
            <T size={14} w="sb" ls={-1} color={on ? t.acc : t.text} lh={21}>{`${n}일차`}</T>
            <T size={13} w={on ? 'm' : 'r'} color={plan ? (on ? t.text : '#6b7280') : t.sub} lh={16}>{plan ?? '저장된 일정이 없어요'}</T>
          </View>
        );
      })}
    </ScrollView>
  );
}

export function DaysCard({ onDetail }: { onDetail?: () => void }) {
  const { t } = useTheme();
  const [cal, setCal] = useState(false);
  return (
    <View style={[{ position: 'absolute', left: 0, top: 134, width: 215, height: 330, borderRadius: 30, backgroundColor: t.card, overflow: 'hidden' }, shadow(t)]}>
      {cal ? <CalendarView /> : <SummaryList />}
      <T size={20} w="xb" ls={-1} align="center" style={{ position: 'absolute', left: 0, right: 0, top: 13 }} lh={24}>{`${TRIP.days} DAYS`}</T>
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
