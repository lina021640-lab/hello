/** 일정 화면 묶음에서 공유하는 로컬 부품 (kit 에 없는 것들) */
import React, { useState } from 'react';
import { View, Pressable, ScrollView, TextInput, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Rect, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Linking } from 'react-native';
import { T, Icon, IconName, useTheme, shadow, Row, AvatarStack } from '../../kit';
import { DaysCard } from './days';
import { useProfile } from '../../data/profile';

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
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.sub}
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

/** 메인 화면의 작은 지도 카드(126×124) */
export function MapThumb({ w = 126, h = 124 }: { w?: number; h?: number }) {
  const { t } = useTheme();
  return (
    <View style={{ width: w, height: h, overflow: 'hidden' }}>
      <MapBase vw={126} vh={124} scale={0.7} />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 126 124">
        <Path d="M27 108 C 40 100 52 96 58 80 S 70 58 72 40" stroke={t.acc} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Circle cx={27} cy={108} r={7} fill={t.card} stroke={t.acc} strokeWidth={3} />
        <Path d="M72 22 C66 22 62 26 62 31 C62 38 72 46 72 46 C72 46 82 38 82 31 C82 26 78 22 72 22 Z" fill="#000" />
        <Circle cx={72} cy={31} r={3.5} fill="#fff" />
      </Svg>
    </View>
  );
}

// ───────── 아바타 묶음 ─────────
export const AVATAR_COLORS = ['#ff8a4c', '#9be18f', '#6ea8ff'];
export function Avatars({ size = 35, onPress, plusBg, maxWidth = 66 }: { size?: number; onPress?: () => void; plusBg?: string; maxWidth?: number }) {
  const { t } = useTheme(); const pf = useProfile();
  const dark = t.mode === 'dark';
  const ids = ['me', 'f1', 'f2'];
  const photos = ids.map((id) => (id === 'me' ? pf.me : pf.friends[id]));
  return <AvatarStack colors={AVATAR_COLORS} photos={photos} size={size} maxWidth={maxWidth} plus plusBg={plusBg ?? (dark ? '#fff' : '#000')} plusFg={dark ? '#000' : '#fff'} border="#fff" onPress={onPress} />;
}

// ───────── 대시보드(NOW / 지도 / N DAYS / 항공권 카드) ─────────
export type Variant = 'main' | 'popup';
type DayItem = { d: string; s: string; on?: boolean };
const DAYS_MAIN: DayItem[] = [
  { d: '3일차', s: '호텔 → 세인트 폴 대성당 → 버러 마켓 → 타워브리지 → 호텔', on: true },
  { d: '4일차', s: '호텔 → 웨스트민스터 사원 → 버킹엄 궁전 (근위병 교대식) → 트라팔가 광장 → 내셔널 갤러리 → 코벤트 가든 (저녁) → 호텔' },
  { d: '5일차', s: '호텔 → 대영박물관 → 리젠트 스트리트 & 소호 거리 → 피카딜리 서커스 → 뮤지컬 관람 (웨스트엔드) → 호텔' },
  { d: '6일차', s: '호텔 → 대영박물관 → 리젠트 스트리트 & 소호 거리 → 피카딜리 서커스 → 뮤지컬 관람 (웨스트엔드) → 호텔' },
];
const DAYS_POPUP: DayItem[] = [
  { d: '1일차', s: '간사이공항 → 호텔 체크인 → 도톤보리 → 호텔' },
  { d: '2일차', s: '호텔 → 웨스트민스터 사원 → 버킹엄 궁전 → 호텔' },
  { d: '3일차', s: '호텔 → 세인트 폴 대성당 → 버러 마켓 → 타워브리지' },
  { d: '4일차', s: '호텔 → 대영박물관 → 소호 거리 → 호텔' },
];

function Ticket({ v, from, to, t1, t2, dur, plus, no, top, date, onPress }: { v: Variant; from: string; to: string; t1: string; t2: string; dur: string; plus?: boolean; no: string; top: number; date?: string; onPress?: () => void }) {
  const { t } = useTheme();
  const main = v === 'main';
  if (main) {
    // 피그마(126×134): 시간 y19 / 공항코드 y39 / 날짜·소요 y63 / 점선 y89 / 항공사 y94
    const NOTCH = 14, DY = 89;
    return (
      <Pressable onPress={onPress} style={[{ position: 'absolute', right: 0, top, width: 126, height: 134, backgroundColor: t.card, borderRadius: 30 }, shadow(t)]}>
        <T size={12} ls={-1} lh={17} style={{ position: 'absolute', left: 12, top: 19 }}>{t1}</T>
        <T size={12} ls={-1} lh={17} style={{ position: 'absolute', right: 12, top: 19 }}>{t2}</T>
        {plus ? (
          <View style={{ position: 'absolute', right: 12, top: 8, backgroundColor: '#e0f0ff', borderRadius: 22, paddingHorizontal: 5, height: 11, justifyContent: 'center' }}>
            <T size={8} w="r" color="#1e6fff" lh={11}>+1일</T>
          </View>
        ) : null}
        <T size={16} w="b" ls={-1} lh={22} style={{ position: 'absolute', left: 10, top: 37 }}>{from}</T>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 41, alignItems: 'center' }}><View style={{ transform: [{ rotate: '90deg' }] }}><Icon name="flight" size={21} color={t.text} /></View></View>
        <T size={16} w="b" ls={-1} lh={22} style={{ position: 'absolute', right: 10, top: 37 }}>{to}</T>
        <T size={11} w="r" ls={-1} lh={17} style={{ position: 'absolute', left: 12, top: 62 }}>{date}</T>
        <T size={10.5} w="m" ls={-1} lh={17} color={t.acc} style={{ position: 'absolute', right: 12, top: 62 }}>{dur}</T>
        <View style={{ position: 'absolute', left: NOTCH / 2 + 6, right: NOTCH / 2 + 6, top: DY, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#c9ced6' }} />
        <View style={{ position: 'absolute', left: -NOTCH / 2, top: DY - NOTCH / 2, width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: t.bg }} />
        <View style={{ position: 'absolute', right: -NOTCH / 2, top: DY - NOTCH / 2, width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: t.bg }} />
        <T size={12} w="l" ls={-1} lh={17} align="center" style={{ position: 'absolute', left: 0, right: 0, top: 94 }}>Korean Air</T>
        <T size={12} w="l" ls={-1} lh={17} align="center" style={{ position: 'absolute', left: 0, right: 0, top: 111 }}>{no}</T>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={[{ position: 'absolute', right: 0, top, width: 126, height: 134, backgroundColor: t.card, borderRadius: main ? 30 : 24, alignItems: 'center', paddingTop: main ? 19 : 12, paddingBottom: 10, paddingHorizontal: 10, gap: main ? 2 : 3 }, shadow(t)]}>
      <Row style={{ justifyContent: 'space-between', alignSelf: 'stretch' }}>
        <T size={main ? 12 : 11} color={main ? t.text : t.sub}>{t1}</T>
        <T size={main ? 12 : 11} color={main ? t.text : t.sub}>{t2}</T>
      </Row>
      <Row style={{ justifyContent: 'space-between', alignSelf: 'stretch' }}>
        <T size={main ? 16 : 15} w="b">{from}</T>
        <View style={{ transform: [{ rotate: '90deg' }] }}><Icon name="flight" size={main ? 21 : 16} color={t.text} /></View>
        <T size={main ? 16 : 15} w="b">{to}</T>
      </Row>
      <T size={main ? 10 : 11} w={main ? 'm' : 'b'} color={t.acc}>{dur}</T>
      <View style={{ alignSelf: 'stretch', marginTop: main ? 8 : 2, borderTopWidth: 1, borderStyle: main ? 'dashed' : 'solid', borderColor: t.line }} />
      <T size={main ? 12 : 11} w={main ? 'l' : 'm'} color={main ? t.text : t.sub} style={{ marginTop: main ? 6 : 0 }}>Korean Air</T>
      <T size={main ? 12 : 11} w={main ? 'l' : 'm'} color={main ? t.text : t.sub}>{no}</T>
      {plus ? (
        <View style={{ position: 'absolute', top: 9, right: 18, backgroundColor: '#e0f0ff', borderRadius: 22, paddingHorizontal: 4, height: 10, justifyContent: 'center' }}>
          <T size={8} w="r" color="#1e6fff" style={{ lineHeight: 10 }}>+1일</T>
        </View>
      ) : null}
    </Pressable>
  );
}

/** 구글맵 앱/웹에서 장소 검색(1곳) 또는 길찾기(2곳) 열기 */
function openMaps(a: string, b?: string) {
  const q = encodeURIComponent;
  const url = b ? `https://www.google.com/maps/dir/?api=1&origin=${q(a)}&destination=${q(b)}` : `https://www.google.com/maps/search/?api=1&query=${q(a)}`;
  Linking.openURL(url).catch(() => {});
}

export function Dashboard({ variant, onMap, onDetail, onFlight }: { variant: Variant; onMap?: () => void; onDetail?: () => void; onFlight?: () => void }) {
  const { t } = useTheme();
  const main = variant === 'main';
  const days = main ? DAYS_MAIN : DAYS_POPUP;
  const dTop = main ? 134 : 136, dH = main ? 330 : 332;
  const white = 'rgba(255,255,255,0.85)';
  return (
    <View style={{ height: main ? 464 : 470 }}>
      {/* NOW */}
      {main ? (
        <View style={[{ position: 'absolute', left: 0, top: 0, width: 215, height: 124, borderRadius: 30, backgroundColor: t.acc, overflow: 'hidden' }, shadow(t)]}>
          <T size={20} w="xb" ls={-1} color="#fff" align="center" lh={22} style={{ position: 'absolute', left: 0, right: 0, top: 9 }}>NOW</T>
          <T size={13} w="l" color="#fff" lh={16} style={{ position: 'absolute', left: 14, top: 31 }}>6:00</T>
          <T size={13} w="l" color="#fff" lh={16} style={{ position: 'absolute', right: 12, top: 31 }}>7:30</T>
          <T size={15} w="m" color="#fff" lh={16} style={{ position: 'absolute', left: 14, top: 48 }}>버러 마켓</T>
          <View style={{ position: 'absolute', left: 95, top: 49 }}>
            <Svg width={18} height={14} viewBox="0 0 18 14"><Path d="M1 7H16M11 2L16 7L11 12" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
          </View>
          <T size={15} w="m" color="#fff" lh={16} align="right" style={{ position: 'absolute', right: 12, top: 48 }}>타워 브릿지</T>
          <Pressable onPress={() => openMaps('버러 마켓')} style={{ position: 'absolute', left: 14, top: 74, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="map" size={18} color={t.acc} />
          </Pressable>
          <T size={15} w="m" color="#fff" lh={16} align="center" onPress={() => openMaps('버러 마켓', '타워 브릿지')} style={{ position: 'absolute', left: 54, right: 54, top: 85 }}>Google map</T>
          <Pressable onPress={() => openMaps('타워 브릿지')} style={{ position: 'absolute', left: 167, top: 74, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="map" size={18} color={t.acc} />
          </Pressable>
        </View>
      ) : (
      <View style={[{ position: 'absolute', left: 0, top: 0, width: 215, height: 124, borderRadius: 30, backgroundColor: t.acc, paddingHorizontal: 14, paddingTop: main ? 9 : 10, overflow: 'hidden' }, shadow(t)]}>
        <T size={main ? 20 : 22} w="b" color="#fff" align="center" style={{ lineHeight: main ? 22 : 26 }}>NOW</T>
        <Row style={{ justifyContent: 'space-between', marginTop: main ? 8 : 2 }}>
          <T size={main ? 13 : 11} w={main ? 'l' : 'm'} color={main ? '#fff' : 'rgba(255,255,255,0.8)'}>{main ? '6:00' : 'PM 06:00'}</T>
          <T size={main ? 13 : 11} w={main ? 'l' : 'm'} color={main ? '#fff' : 'rgba(255,255,255,0.8)'}>{main ? '7:30' : 'PM 07:30'}</T>
        </Row>
        <Row style={{ justifyContent: 'space-between', marginTop: main ? 1 : 2 }}>
          <T size={main ? 15 : 14} w={main ? 'm' : 'b'} color="#fff">버러 마켓</T>
          <T size={main ? 15 : 14} color="#fff">→</T>
          <T size={main ? 15 : 14} w={main ? 'm' : 'b'} color="#fff">{main ? '타워 브릿지' : '타워브리지'}</T>
        </Row>
        <View>
          <Row gap={8} style={{ marginTop: main ? 9 : 8 }}>
            <Pressable onPress={() => openMaps('버러 마켓')} style={{ width: main ? 36 : 30, height: main ? 36 : 30, borderRadius: 18, backgroundColor: main ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="map" size={16} color={main ? t.acc : '#fff'} />
            </Pressable>
            <T size={main ? 15 : 13} w={main ? 'm' : 'b'} color="#fff" align="center" style={{ flex: 1 }} onPress={() => openMaps('버러 마켓', '타워 브릿지')}>Google map</T>
            <Pressable onPress={() => openMaps('타워 브릿지')} style={{ width: main ? 36 : 30, height: main ? 36 : 30, borderRadius: 18, backgroundColor: main ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="map" size={16} color={main ? t.acc : '#fff'} />
            </Pressable>
          </Row>
        </View>
      </View>
      )}
      {/* 지도 */}
      <Pressable onPress={onMap} style={[{ position: 'absolute', right: 0, top: 0, width: 126, height: 124, borderRadius: main ? 30 : 28, overflow: 'hidden' }, shadow(t)]}>
        <MapThumb />
      </Pressable>
      {/* N DAYS */}
      {main ? <DaysCard onDetail={onDetail} /> : (
      <View style={[{ position: 'absolute', left: 0, top: dTop, width: 215, height: dH, borderRadius: 30, backgroundColor: t.card, overflow: 'hidden', padding: main ? 0 : 16, paddingHorizontal: 16 }, shadow(t)]}>
        <T size={20} w="b" align="center" style={{ marginTop: main ? 13 : 0, lineHeight: main ? 24 : 24 }}>{main ? '38 DAYS' : '58 DAYS'}</T>
        <View style={{ marginTop: main ? 10 : 8, gap: main ? 0 : 8 }}>
          {days.map((x, i) => (
            <View key={x.d}>
              {i > 0 && main ? <View style={{ height: 1, backgroundColor: t.line, marginTop: 5, marginBottom: 3 }} /> : null}
              {i > 0 && !main ? <View style={{ height: 1, backgroundColor: t.line, marginBottom: 8 }} /> : null}
              <T size={main ? 14 : 13} w={main ? 'sb' : 'b'} color={main ? (x.on ? t.acc : t.text) : t.acc} style={{ lineHeight: main ? 21 : 16 }}>{x.d}</T>
              <T size={main ? 13 : 11} w={main ? (x.on ? 'm' : 'r') : 'm'} color={main ? (x.on ? t.text : t.sub) : t.sub} lh={main ? 16 : 15} style={{ marginTop: main ? 0 : 2 }}>{x.s}</T>
            </View>
          ))}
        </View>
        {main ? <Fade id="fadeDays" color={t.card} height={109} style={{ bottom: 0 }} /> : null}
        {main ? <View style={{ position: 'absolute', right: 13, top: 48, width: 3, height: 35, borderRadius: 2, backgroundColor: t.line }} /> : null}
        <Pressable onPress={onDetail} style={{ position: 'absolute', left: main ? 25 : 24, top: main ? 266 : 274, width: 167, height: main ? 44 : 43, borderRadius: 22, backgroundColor: main ? '#000' : t.text, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <T size={main ? 16 : 14} w={main ? 'm' : 'b'} color={main ? '#fff' : t.bg}>달력</T>
          <Icon name="arrow" size={14} color={main ? '#fff' : t.bg} />
        </Pressable>
      </View>
      )}
      {/* 세부일정 */}
      <Pressable onPress={onDetail} style={{ position: 'absolute', right: 0, top: dTop, width: 126, height: main ? 44 : 40, borderRadius: main ? 22 : 20, backgroundColor: t.acc, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: main && t.mode === 'light' ? 0.5 : 0, borderColor: '#fff' }}>
        <T size={main ? 16 : 14} w={main ? 'm' : 'b'} color="#fff">세부일정</T>
        <Icon name="arrow" size={14} color="#fff" />
      </Pressable>
      {/* 항공권 */}
      <Ticket v={variant} top={main ? 187 : 188} from="ICN" to="LHR" t1="10:55" t2="17:20" dur="11시간 25분" date="11/20" no="KE344" onPress={onFlight} />
      <Ticket v={variant} top={main ? 330 : 334} from={main ? 'FCO' : 'FCO'} to="ICN" t1="22:00" t2="17:20" dur={main ? '11시간 25분' : '11시간 25분 (+1일)'} plus={main} date="12/29" no="KE964" onPress={onFlight} />
    </View>
  );
}

// ───────── 메모 카드 ─────────
export function MemoCard({ variant }: { variant: Variant }) {
  const { t } = useTheme();
  const main = variant === 'main';
  const [items, setItems] = useState([{ s: '크로와상 먹기', done: false }, { s: '키링 사러 가기', done: false }]);
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

// ───────── 일행/관리 팝업 뒤에 깔리는 여행 메인(정적) ─────────
export function Backdrop() {
  const { t } = useTheme();
  const cities = [['런던', '#7d9cc9', '#27395c'], ['파리', '#d6a97c', '#5d3f27'], ['피렌체', '#8cc2b0', '#2a5f52']];
  return (
    <View pointerEvents="none" style={{ flex: 1 }}>
      <ScrollView scrollEnabled={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        <Row style={{ height: 44, marginTop: 8, marginBottom: 0, justifyContent: 'space-between' }}>
          <Icon name="back" size={22} color={t.text} />
          <Row gap={16}>
            <Icon name="link" size={22} color={t.text} /><Icon name="folder" size={22} color={t.text} /><Icon name="menu" size={22} color={t.text} />
          </Row>
        </Row>
        <View style={{ gap: 12 }}>
          <View>
            <T size={14} sub>영국 · 프랑스 · 이탈리아</T>
            <T size={40} w="b" ls={-4}>유럽여행</T>
          </View>
          <Row gap={8}>
            <View style={{ backgroundColor: t.text, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 3 }}><T size={14} w="b" color={t.bg}>D-10</T></View>
            <T size={14} style={{ flex: 1 }}>2026.11.20 – 2027.01.16</T>
            <Avatars size={32} plusBg={t.text} />
          </Row>
          <Dashboard variant="popup" />
          <MemoCard variant="popup" />
          <T size={16} w="b">방문하는 도시에 대해 알아보기</T>
          <Row gap={10} align="stretch">
            {cities.map(([n, a, b], i) => (
              <Grad key={n} id={`bd${i}`} from={a} to={b} style={{ flex: 1, height: 140, borderRadius: 26, justifyContent: 'flex-end', padding: 12, paddingTop: 0 }}>
                <T size={19} w="b" color="#fff">{n}</T>
                <T size={11} color="rgba(255,255,255,0.9)">더 알아보기</T>
              </Grad>
            ))}
          </Row>
        </View>
      </ScrollView>
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
