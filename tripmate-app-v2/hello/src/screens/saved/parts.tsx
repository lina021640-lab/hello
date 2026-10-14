import React from 'react';
import { View, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useRouter, Href } from 'expo-router';
import Svg, { Path, Rect, Ellipse } from 'react-native-svg';
import { T, Icon, IconName, useTheme, shadow } from '../../kit';

/** 저장 / 공유 피드 / 친구 일정 세그먼트 (피그마: track 44, padding 4, 항목 radius 18) */
const ROUTES = ['/saved', '/saved/feed', '/saved/friends'];
export function SegTabs({ active, floating }: { active: 0 | 1 | 2; floating?: boolean }) {
  const { t } = useTheme();
  const r = useRouter();
  const go = (i: number) => {
    if (i === active) return;
    const href = ROUTES[i] as Href;
    if (active === 0) r.push(href); else r.replace(href);
  };
  const track = (
    <View style={{ flexDirection: 'row', gap: 4, height: 44, padding: 4, borderRadius: 22, backgroundColor: t.track }}>
      {['저장', '공유 피드', '친구 일정'].map((s, i) => (
        <Pressable key={s} onPress={() => go(i)} style={{ flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: i === active ? t.card : 'transparent' }}>
          <T size={14} w={i === active ? 'b' : 'm'} color={i === active ? t.text : t.sub}>{s}</T>
        </Pressable>
      ))}
    </View>
  );
  if (!floating) return track;
  return <View style={{ backgroundColor: t.card, borderRadius: 26, padding: 3, ...shadow(t) }}>{track}</View>;
}

/** 알약 칩: active 이면 파랑 채움 + Bold */
export function Chip({ label, active, onPress, size = 13, py = 6, px = 14, icon, trail, dot, style }: {
  label: string; active?: boolean; onPress?: () => void; size?: number; py?: number; px?: number; icon?: IconName; trail?: IconName; dot?: string; style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const fg = active ? '#fff' : t.text;
  return (
    <Pressable onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: px, paddingVertical: py, borderRadius: 999,
      backgroundColor: active ? t.acc : t.card, borderWidth: active ? 0 : 1, borderColor: t.line }, style]}>
      {dot ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} /> : null}
      {icon ? <Icon name={icon} size={size + 3} color={fg} /> : null}
      <T size={size} w={active ? 'b' : 'm'} color={fg}>{label}</T>
      {trail ? <Icon name={trail} size={14} color={t.sub} /> : null}
    </Pressable>
  );
}

/** 하단 액션 버튼 (피그마 radius=h/2) */
export function ActionBtn({ label, onPress, kind = 'primary', h = 52, size = 15, icon, style }: {
  label: string; onPress?: () => void; kind?: 'primary' | 'ghost' | 'lime' | 'dark'; h?: number; size?: number; icon?: IconName; style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const bg = kind === 'primary' ? t.acc : kind === 'lime' ? t.feed : kind === 'dark' ? t.text : t.card;
  const fg = kind === 'primary' ? '#fff' : kind === 'lime' ? t.feedT : kind === 'dark' ? t.bg : t.text;
  return (
    <Pressable onPress={onPress} style={[{ height: h, borderRadius: h / 2, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: kind === 'ghost' ? 8 : 4, paddingHorizontal: 18,
      borderWidth: kind === 'ghost' ? 1 : 0, borderColor: t.line }, style]}>
      {icon ? <Icon name={icon} size={size + 3} color={fg} /> : null}
      <T size={size} w="b" color={fg}>{label}</T>
    </Pressable>
  );
}

/** 둥근 아이콘 버튼 */
export function RoundBtn({ icon, size = 44, iconSize = 22, onPress, bg, style }: { icon: IconName; size?: number; iconSize?: number; onPress?: () => void; bg?: string; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg ?? t.card, alignItems: 'center', justifyContent: 'center', ...shadow(t) }, style]}>
      <Icon name={icon} size={iconSize} color={t.text} />
    </Pressable>
  );
}

/** 지도 자리표시(원본 PNG 대신): 하늘색 강 + 녹지 + 흰 도로 */
export function MapBg() {
  const { t } = useTheme();
  const d = t.mode === 'dark';
  const base = d ? '#1c1d21' : '#e4e8ee', park = d ? '#1f2e23' : '#d8e8cb', river = d ? '#1c2a44' : '#c6d9f3', road = d ? '#2f3036' : '#ffffff';
  const roads = ['M0 78L390 118', 'M0 150L390 132', 'M0 362L390 380', 'M0 420L390 470', 'M0 520L390 520', 'M0 590L390 560',
    'M62 0L88 844', 'M170 0L186 844', 'M276 0L262 844', 'M356 0L378 844'];
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none">
        <Rect x={0} y={0} width={390} height={844} fill={base} />
        <Path d="M0 84C40 70 120 80 190 120L200 232L0 190Z" fill={park} />
        <Path d="M240 400C300 392 360 410 390 420L390 540L250 520Z" fill={park} />
        <Path d="M0 232C80 250 140 290 230 280C300 270 340 300 390 330L390 372C330 350 300 330 230 330C140 336 70 300 0 282Z" fill={river} />
        {roads.map((p, i) => <Path key={i} d={p} stroke={road} strokeWidth={i < 6 ? 5 : 4} strokeLinecap="round" fill="none" />)}
      </Svg>
    </View>
  );
}

/** 지도 말풍선(라임) + 꼬리 + 핀 그림자 */
export function Bubble({ label, left, top }: { label: string; left: number; top: number }) {
  const { t } = useTheme();
  return (
    <View style={{ position: 'absolute', left, top, alignItems: 'center' }}>
      <View style={{ backgroundColor: t.feed, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, ...shadow(t) }}>
        <T size={12} w="b" color={t.feedT}>{label}</T>
      </View>
      <Svg width={12} height={8} style={{ marginTop: -2 }}><Path d="M0 0L12 0L6 8Z" fill={t.feed} /></Svg>
      <Svg width={20} height={7} style={{ marginTop: 3 }}><Ellipse cx={10} cy={3.5} rx={10} ry={3.5} fill={t.mode === 'dark' ? '#000' : '#1a264d'} opacity={0.18} /></Svg>
    </View>
  );
}
