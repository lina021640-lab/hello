/** 일정 화면 묶음에서 공유하는 로컬 부품 (kit 에 없는 것들) */
import React, { useState } from 'react';
import { View, Pressable, ScrollView, TextInput, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Rect, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Linking } from 'react-native';
import { T, Icon, IconName, useTheme, shadow, Row, AvatarStack } from '../../kit';
import { DaysCard } from './days';
import { useProfile } from '../../data/profile';
import { useAuth } from '../../data/authStore';
import { getTrip } from '../../data/tripStore';
import type { TripView } from '../../data/currentTrip';
import { UserSched, userItemsOf, flightsOf, pickNow, fmtTime, normTime } from '../../data/scheduleStore';

// ───────── 스위치 ─────────
export function Toggle({ on, onPress }: { on: boolean; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ width: 46, height: 28, borderRadius: 14, paddingHorizontal: 2, justifyContent: 'center', alignItems: on ? 'flex-end' : 'flex-start', backgroundColor: on ? t.acc : t.track }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' }} />
    </Pressable>
  );
}

// ───────── 테두리 입력칸 (피그마: 흰 배경 + 1px #e8eaee, r16, h48) ─────────
export function OutField({ label, value, onChangeText, left, right, h = 48, style, placeholder }: {
  label?: string; value?: string; onChangeText?: (s: string) => void; left?: React.ReactNode; right?: React.ReactNode;
  h?: number; style?: StyleProp<ViewStyle>; placeholder?: string;
}) {
  const { t } = useTheme();
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <T size={13} sub>{label}</T> : null}
      <View style={{ height: h, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {left ? <View style={{ flexShrink: 0 }}>{left}</View> : null}
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.sub + '80'}
          style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        {right ? <View style={{ flexShrink: 0 }}>{right}</View> : null}
      </View>
    </View>
  );
}

/** 알약 탭(활성: 파랑 채움 + Bold) */
export function Chip({ label, active, onPress, size = 14, py = 8, px = 14 }: { label: string; active?: boolean; onPress?: () => void; size?: number; py?: number; px?: number }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: px, paddingVertical: py, borderRadius: 999, backgroundColor: active ? t.acc : t.card, borderWidth: active ? 0 : 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
      <T size={size} w={active ? 'b' : 'm'} color={active ? '#fff' : t.text}>{label}</T>
    </Pressable>
  );
}

// ───────── 그라디언트 ─────────
export function Grad({ id, from, to, style, children, angle = 'v' }: { id: string; from: string; to: string; style?: StyleProp<ViewStyle>; children?: React.ReactNode; angle?: 'v' | 'h' }) {
  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2={angle === 'v' ? '0' : '1'} y2={angle === 'v' ? '1' : '0'}>
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="10" height="10" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

/** 아래로 갈수록 카드색으로 덮이는 페이드 */
export function Fade({ id, color, height, style }: { id: string; color: string; height: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, height }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0" />
            <Stop offset="0.6" stopColor={color} stopOpacity="0.72" />
            <Stop offset="1" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="10" height="10" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

// ───────── 지도 플레이스홀더 (원본은 래스터 지도 → SVG 도형으로 대체) ─────────
export function mapColors(mode: 'light' | 'dark') {
  return mode === 'dark'
    ? { bg: '#34363c', road: '#4b4e56', green: '#33493a', water: '#2d4766' }
    : { bg: '#e9ecf2', road: '#ffffff', green: '#d3e6c8', water: '#b6d3f3' };
}
export function MapBase({ vw, vh, scale = 1 }: { vw: number; vh: number; scale?: number }) {
  const { t } = useTheme(); const c = mapColors(t.mode);
  const X = (n: number) => n * vw, Y = (n: number) => n * vh;
  const rw = 7 * scale;
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid slice">
      <Rect x={0} y={0} width={vw} height={vh} fill={c.bg} />
      <Path d={`M0 ${Y(0.09)} L${X(0.27)} ${Y(0.1)} L${X(0.25)} ${Y(0.2)} L0 ${Y(0.24)} Z`} fill={c.green} />
      <Path d={`M${X(0.62)} ${Y(0.455)} Q${X(0.8)} ${Y(0.44)} ${vw} ${Y(0.46)} L${vw} ${Y(0.62)} L${X(0.64)} ${Y(0.62)} Q${X(0.6)} ${Y(0.54)} ${X(0.62)} ${Y(0.455)} Z`} fill={c.green} />
      <Path d={`M0 ${Y(0.32)} C${X(0.31)} ${Y(0.3)} ${X(0.56)} ${Y(0.41)} ${vw} ${Y(0.375)}`} stroke={c.water} strokeWidth={62 * scale} fill="none" />
      {[0.145, 0.44].map((y) => <Line key={y} x1={0} y1={Y(y)} x2={vw} y2={Y(y)} stroke={c.road} strokeWidth={rw} />)}
      {[0.19, 0.44, 0.87].map((x) => <Line key={x} x1={X(x)} y1={0} x2={X(x)} y2={vh} stroke={c.road} strokeWidth={rw} />)}
      <Line x1={X(0.5)} y1={vh} x2={vw} y2={Y(0.62)} stroke={c.road} strokeWidth={rw * 0.7} />
      <Line x1={0} y1={Y(0.7)} x2={vw} y2={Y(0.66)} stroke={c.road} strokeWidth={rw * 0.7} />
    </Svg>
  );
}

/** 메인 화면의 작은 지도 카드(126×124). 일정이 있으면 핀만 표시(더미 동선 없음) */
export function MapThumb({ w = 126, h = 124, pins = 0 }: { w?: number; h?: number; pins?: number }) {
  return (
    <View style={{ width: w, height: h, overflow: 'hidden' }}>
      <MapBase vw={126} vh={124} scale={0.7} />
      {pins > 0 ? (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 126 124">
          <Path d="M63 38 C57 38 53 42 53 47 C53 54 63 62 63 62 C63 62 73 54 73 47 C73 42 69 38 63 38 Z" fill="#000" />
          <Circle cx={63} cy={47} r={3.5} fill="#fff" />
        </Svg>
      ) : null}
    </View>
  );
}

// ───────── 아바타 묶음 ─────────
/** 실제 여행 멤버 수만큼 (색은 tripStore 의 colorAt). 내 사진은 내가 방장일 때(첫 번째 멤버)만 표시 */
export function Avatars({ colors, size = 35, onPress, plusBg, maxWidth = 66 }: { colors: string[]; size?: number; onPress?: () => void; plusBg?: string; maxWidth?: number }) {
  const { t } = useTheme(); const pf = useProfile(); const { user } = useAuth(); const trip = getTrip();
  const dark = t.mode === 'dark';
  const photos = colors.map((_, i) => (i === 0 && trip && user && trip.ownerId === user.id ? pf.me : undefined));
  return <AvatarStack colors={colors} photos={photos} size={size} maxWidth={maxWidth} plus plusBg={plusBg ?? (dark ? '#fff' : '#000')} plusFg={dark ? '#000' : '#fff'} border="#fff" onPress={onPress} />;
}

// ───────── 대시보드(NOW / 지도 / N DAYS / 항공권 카드) ─────────
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const openMaps = (q: string) => { if (q.trim()) Linking.openURL(mapsUrl(q)).catch(() => {}); };

/** 오늘(몇 일차인지 view.today) 일정에서 NOW 카드에 보여 줄 항목 — 선택 규칙은 scheduleStore.pickNow */
export function nowItem(items: UserSched[], day: number, now = new Date()): { item: UserSched; live: boolean; kind: 'now' | 'next' | 'today' } | null {
  const p = pickNow(items, day, now);
  return p ? { item: p.item, live: p.kind === 'now', kind: p.kind } : null;
}

function NowCard({ view, items }: { view: TripView; items: UserSched[] }) {
  const { t } = useTheme();
  const n = nowItem(items, view.today);
  const base = [{ position: 'absolute' as const, left: 0, top: 0, width: 215, height: 124, borderRadius: 30, backgroundColor: t.acc, overflow: 'hidden' as const }, shadow(t)];
  if (!n) {
    return (
      <View style={base}>
        <T size={20} w="xb" ls={-1} color="#fff" align="center" lh={22} style={{ position: 'absolute', left: 0, right: 0, top: 9 }}>NOW</T>
        <T size={15} w="m" color="#fff" align="center" lh={22} style={{ position: 'absolute', left: 14, right: 14, top: 58 }}>
          {view.today >= 1 && view.today <= view.days ? '오늘 예정된 일정이 없어요' : view.today === 0 ? `여행 시작까지 ${view.dday}` : '여행이 끝났어요'}
        </T>
      </View>
    );
  }
  const { item, kind } = n; const name = item.title || item.place; const where = item.place || item.title;
  return (
    <View style={base}>
      <T size={20} w="xb" ls={-1} color="#fff" align="center" lh={22} style={{ position: 'absolute', left: 0, right: 0, top: 9 }}>{kind === 'now' ? 'NOW' : kind === 'next' ? 'NEXT' : 'TODAY'}</T>
      <T size={13} w="l" color="#fff" lh={16} style={{ position: 'absolute', left: 14, top: 31 }}>{fmtTime(item.time) || '시간 미정'}</T>
      {item.end ? <T size={13} w="l" color="#fff" lh={16} style={{ position: 'absolute', right: 12, top: 31 }}>{fmtTime(item.end)}</T> : null}
      <T size={17} w="m" color="#fff" lh={20} numberOfLines={1} style={{ position: 'absolute', left: 14, right: 12, top: 50 }}>{name}</T>
      <Pressable onPress={() => openMaps(where)} style={{ position: 'absolute', left: 14, right: 14, top: 78, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.6)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Icon name="map" size={18} color={t.acc} />
        <T size={15} w="m" color={t.acc}>Google map</T>
      </Pressable>
    </View>
  );
}

/** 항공 항목 → 티켓 표시값. 장소: "ICN · 인천국제공항 → LHR · 런던 히드로", 제목: "대한항공 KE344" */
export const airCode = (s: string) => { const m = /^\s*([A-Za-z]{3})\b/.exec(s); return m ? m[1].toUpperCase() : s.trim().slice(0, 3); };
type TicketInfo = { leg: string; from: string; to: string; t1: string; t2: string; date: string; air: string; no: string };
function flightInfo(f: UserSched, view: TripView, leg: string): TicketInfo {
  const [a = '', b = ''] = f.place.split('→');
  const parts = f.title.trim().split(/\s+/); const no = parts.length > 1 ? parts[parts.length - 1] : ''; const air = parts.length > 1 ? parts.slice(0, -1).join(' ') : f.title;
  const d = view.dateOf(f.day);
  return { leg, from: airCode(a), to: airCode(b), t1: normTime(f.time) || f.time, t2: normTime(f.end) || f.end, date: `${d.getMonth() + 1}/${d.getDate()}`, air, no };
}

/** 출국/귀국 티켓 카드(피그마 126×134, 노치 + 점선). info 가 없으면 빈 자리표시 + '항공권 추가' 버튼 */
function Ticket({ leg, info, top, onPress }: { leg: string; info?: TicketInfo; top: number; onPress?: () => void }) {
  const { t } = useTheme();
  // 피그마(126×134): 시간 y19 / 공항코드 y39 / 날짜 y63 / 점선 y89 / 항공사 y94
  const NOTCH = 14, DY = 89;
  const filled = !!info;
  const ph = t.sub;
  return (
    <View style={[{ position: 'absolute', right: 0, top, width: 126, height: 134, backgroundColor: t.card, borderRadius: 30 }, shadow(t)]}>
      <Pressable onPress={onPress} accessibilityLabel={filled ? `${leg} 항공권` : `${leg} 항공권 자리`} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: DY }}>
        <T size={12} ls={-1} lh={17} color={filled ? t.text : ph} style={{ position: 'absolute', left: 12, top: 19 }}>{filled ? info.t1 || '--:--' : '--:--'}</T>
        <T size={12} ls={-1} lh={17} color={filled ? t.text : ph} style={{ position: 'absolute', right: 12, top: 19 }}>{filled ? info.t2 || '--:--' : '--:--'}</T>
        {filled ? (
          <>
            <T size={16} w="b" ls={-1} lh={22} style={{ position: 'absolute', left: 10, top: 37 }}>{info.from}</T>
            <T size={16} w="b" ls={-1} lh={22} style={{ position: 'absolute', right: 10, top: 37 }}>{info.to}</T>
          </>
        ) : (
          <>
            <T size={11} w="m" lh={22} color={ph} style={{ position: 'absolute', left: 10, top: 37 }}>출발 공항</T>
            <T size={11} w="m" lh={22} color={ph} style={{ position: 'absolute', right: 10, top: 37 }}>도착 공항</T>
          </>
        )}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 41, alignItems: 'center' }}><View style={{ transform: [{ rotate: '90deg' }] }}><Icon name="flight" size={filled ? 21 : 17} color={filled ? t.text : ph} /></View></View>
        <T size={11} w="m" ls={-1} lh={17} color={filled ? t.text : t.acc} style={{ position: 'absolute', left: 12, top: 62 }}>{filled ? `${leg} ${info.date}` : `${leg} 항공권`}</T>
      </Pressable>
      <View pointerEvents="none" style={{ position: 'absolute', left: NOTCH / 2 + 6, right: NOTCH / 2 + 6, top: DY, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#c9ced6' }} />
      <View pointerEvents="none" style={{ position: 'absolute', left: -NOTCH / 2, top: DY - NOTCH / 2, width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: t.bg }} />
      <View pointerEvents="none" style={{ position: 'absolute', right: -NOTCH / 2, top: DY - NOTCH / 2, width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: t.bg }} />
      {filled ? (
        <Pressable onPress={onPress} style={{ position: 'absolute', left: 0, right: 0, top: DY, height: 45 }}>
          <T size={12} w="l" ls={-1} lh={17} align="center" numberOfLines={1} style={{ position: 'absolute', left: 8, right: 8, top: 5 }}>{info.air}</T>
          <T size={12} w="l" ls={-1} lh={17} align="center" numberOfLines={1} style={{ position: 'absolute', left: 8, right: 8, top: 22 }}>{info.no}</T>
        </Pressable>
      ) : (
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${leg} 항공권 추가`}
          style={{ position: 'absolute', left: 14, right: 14, top: DY + 9, height: 28, borderRadius: 14, backgroundColor: t.accS, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Icon name="plus" size={13} color={t.acc} />
          <T size={12} w="b" color={t.acc}>항공권 추가</T>
        </Pressable>
      )}
    </View>
  );
}

export type FlightLeg = 'out' | 'back';

export function Dashboard({ view, items, onMap, onDetail, onFlight, onAddDay }: { view: TripView; items: UserSched[]; onMap?: () => void; onDetail?: () => void; onFlight?: (leg: FlightLeg) => void; onAddDay?: (day: number) => void }) {
  const { t } = useTheme();
  const flights = flightsOf(items);
  // 출국 = 여행 앞쪽 항공편, 귀국 = 뒤쪽 항공편. 하나뿐이면 여행 기간의 앞/뒤 절반으로 구분
  let out: UserSched | undefined, back: UserSched | undefined;
  if (flights.length > 1) { out = flights[0]; back = flights[flights.length - 1]; }
  else if (flights.length === 1) { if (flights[0].day * 2 <= view.days + 1) out = flights[0]; else back = flights[0]; }
  const today = view.today >= 1 && view.today <= view.days ? view.today : 0;
  const pins = today ? userItemsOf(items, today).length : 0;
  return (
    <View style={{ height: 464 }}>
      <NowCard view={view} items={items} />
      {/* 지도 */}
      <Pressable onPress={onMap} style={[{ position: 'absolute', right: 0, top: 0, width: 126, height: 124, borderRadius: 30, overflow: 'hidden' }, shadow(t)]}>
        <MapThumb pins={pins} />
      </Pressable>
      {/* N DAYS */}
      <DaysCard view={view} items={items} onAdd={onAddDay} />
      {/* 세부일정 */}
      <Pressable onPress={onDetail} style={{ position: 'absolute', right: 0, top: 134, width: 126, height: 44, borderRadius: 22, backgroundColor: t.acc, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: t.mode === 'light' ? 0.5 : 0, borderColor: '#fff' }}>
        <T size={16} w="m" color="#fff">세부일정</T>
        <Icon name="arrow" size={14} color="#fff" />
      </Pressable>
      {/* 항공권: 출국/귀국 두 장이 항상 보인다. 추가 전에는 빈 자리 + '항공권 추가' 버튼 */}
      <Ticket leg="출국" info={out ? flightInfo(out, view, '출국') : undefined} top={187} onPress={() => onFlight?.('out')} />
      <Ticket leg="귀국" info={back ? flightInfo(back, view, '귀국') : undefined} top={330} onPress={() => onFlight?.('back')} />
    </View>
  );
}

// ───────── 메모 카드 ─────────
// 여행별 메모(앱을 켜 둔 동안만 유지, 서버 저장은 후속). 처음엔 비어 있다.
const memoByTrip: Record<string, { s: string; done: boolean }[]> = {};
export function MemoCard({ tripId }: { tripId: string }) {
  const { t } = useTheme();
  const main = true;
  const [items, setItemsRaw] = useState(() => memoByTrip[tripId] ?? []);
  const setItems = (f: (a: { s: string; done: boolean }[]) => { s: string; done: boolean }[]) => setItemsRaw((a) => { const n = f(a); memoByTrip[tripId] = n; return n; });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const commit = () => {
    const v = draft.trim();
    if (v) setItems((a) => [...a, { s: v, done: false }]);
    setDraft(''); setAdding(false);
  };
  return (
    <View style={[{ backgroundColor: t.card, borderRadius: main ? 30 : 26, padding: main ? 0 : 16, paddingHorizontal: 16, paddingTop: main ? 14 : 12, paddingBottom: main ? 16 : 16, gap: main ? 12 : 12 }, shadow(t)]}>
      <Row>
        <T size={main ? 16 : 15} w={main ? 'sb' : 'b'} color={main ? '#007aff' : t.acc} style={{ flex: 1 }}>메모</T>
        <Pressable hitSlop={10} onPress={() => setAdding(true)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.card2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={main ? 20 : 18} color={t.text} />
        </Pressable>
      </Row>
      {items.length === 0 && !adding ? <T size={13} sub>+ 버튼으로 챙길 것이나 해야 할 일을 적어 두세요</T> : null}
      {items.map((it, i) => (
        <Row key={i} gap={10}>
          <Pressable onPress={() => setItems((a) => a.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}>
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: main ? 2 : 1.5, borderColor: it.done ? t.acc : '#747474', backgroundColor: it.done ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {it.done ? <Icon name="check" size={14} color="#fff" /> : null}
            </View>
          </Pressable>
          <T size={main ? 13 : 14} style={{ flex: 1, textDecorationLine: it.done ? 'line-through' : 'none' }} color={it.done ? t.sub : t.text}>{it.s}</T>
          <Pressable hitSlop={8} onPress={() => setItems((a) => a.filter((_, j) => j !== i))}><Icon name="minus" size={main ? 22 : 18} color={t.sub} /></Pressable>
        </Row>
      ))}
      {adding ? (
        <Row gap={10}>
          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#747474' }} />
          <TextInput autoFocus value={draft} onChangeText={setDraft} onSubmitEditing={commit} onBlur={commit} placeholder="메모를 입력하세요" placeholderTextColor={t.sub} returnKeyType="done"
            style={{ flex: 1, color: t.text, fontSize: 13, paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </Row>
      ) : null}
    </View>
  );
}

// ───────── 날씨 아이콘 ─────────
export type Wx = 'sun' | 'moon' | 'cloud' | 'rain';
export function WxIcon({ k, size, onBlue }: { k: Wx; size: number; onBlue?: boolean }) {
  const { t } = useTheme();
  const col = onBlue ? '#fff' : k === 'sun' ? '#ff9f0a' : k === 'rain' ? t.acc : k === 'moon' ? t.sub : t.text;
  return <Icon name={k as IconName} size={size} color={col} />;
}
