import React from 'react';
import { View, Pressable, ScrollView, StyleProp, ViewStyle, Dimensions, Platform } from 'react-native';
import { useRouter, Href } from 'expo-router';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { T, Icon, IconName, useTheme, shadow } from '../../kit';
import { MapBase } from '../schedule/shared';
import { useSheetY } from '../schedule/sheet';

/** 저장 / 공유 피드 / 친구 일정 세그먼트 (피그마: track 44, padding 4, 항목 radius 18) */
const ROUTES = ['/saved', '/saved/feed', '/saved/friends'];
export function SegTabs({ active, floating }: { active: 0 | 1 | 2; floating?: boolean }) {
  const { t } = useTheme();
  const r = useRouter();
  const dk = t.mode === 'dark';
  const go = (i: number) => {
    if (i === active) return;
    const href = ROUTES[i] as Href;
    if (active === 0) r.push(href); else r.replace(href);
  };
  const track = (
    <View style={{ flexDirection: 'row', gap: 4, height: 44, padding: 4, borderRadius: 22, backgroundColor: t.track }}>
      {['저장', '공유 피드', '친구 일정'].map((s, i) => (
        <Pressable key={s} onPress={() => go(i)} style={{ flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: i === active ? (dk ? '#3d3d42' : t.card) : 'transparent' }}>
          <T size={14} w={i === active ? 'b' : 'm'} color={i === active ? t.text : t.sub}>{s}</T>
        </Pressable>
      ))}
    </View>
  );
  if (!floating) return track;
  return (
    <View style={{ backgroundColor: t.card, borderRadius: 26, padding: 3, ...shadow(t), ...(dk ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' } : null) }}>{track}</View>
  );
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

/** 하단 액션 버튼 (피그마 radius=h/2). plain: 라이트=흰 바탕+테두리 / 다크=흰 바탕 어두운 글씨 */
export function ActionBtn({ label, onPress, kind = 'primary', h = 52, size = 15, icon, iconSize, style }: {
  label: string; onPress?: () => void; kind?: 'primary' | 'ghost' | 'lime' | 'dark' | 'plain'; h?: number; size?: number; icon?: IconName; iconSize?: number; style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const dk = t.mode === 'dark';
  const bg = kind === 'primary' ? t.acc : kind === 'lime' ? t.feed : kind === 'dark' ? t.text : kind === 'plain' ? (dk ? '#ffffff' : t.card) : t.card;
  const fg = kind === 'primary' ? '#fff' : kind === 'lime' ? t.feedT : kind === 'dark' ? t.bg : kind === 'plain' ? '#1a1d23' : t.text;
  const bordered = kind === 'ghost' || (kind === 'plain' && !dk);
  return (
    <Pressable onPress={onPress} style={[{ height: h, borderRadius: h / 2, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: kind === 'ghost' ? 8 : 4, paddingHorizontal: 18,
      borderWidth: bordered ? 1 : 0, borderColor: t.line }, style]}>
      {icon ? <Icon name={icon} size={iconSize ?? size + 3} color={fg} /> : null}
      <T size={size} w="b" color={fg}>{label}</T>
    </Pressable>
  );
}

/** 지도 위 이모지 마커 (피그마 marker: 38×38 / 선택 50×50, 테두리 색) */
export function EmojiMarker({ e, x, y, c, selected, onPress }: { e: string; x: number; y: number; c: string; selected?: boolean; onPress?: () => void }) {
  const { t } = useTheme();
  const sz = selected ? 50 : 38;
  return (
    <Pressable onPress={onPress} style={{ position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: sz / 2, borderWidth: selected ? 4 : 3, borderColor: c, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', ...shadow(t) }}>
      <T size={selected ? 26 : 20} color={t.text}>{e}</T>
    </Pressable>
  );
}

/** 지도 위에 얹는 바텀시트 (피그마 feed sheet: top 300, radius 30, 라이트 그림자 / 다크 테두리) */
export function MapSheet({ children, top = 300, gap = 12, padBottom = 24 }: { children: React.ReactNode; top?: number; gap?: number; padBottom?: number }) {
  const { t } = useTheme();
  const dk = t.mode === 'dark';
  const H = Dimensions.get('window').height;
  // 바(핸들)를 위/아래로 끌어 지도를 길게 보거나 기능을 길게 볼 수 있다
  const { y, handlers } = useSheetY(top, [100, top, H - 200]);
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: y, bottom: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: t.card,
      ...(dk ? { borderWidth: 1, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,0.09)' } : { shadowColor: '#1a264d', shadowOpacity: 0.07, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 3 }) }}>
      <View style={{ flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        <View {...handlers} style={{ height: 30, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? ({ cursor: 'grab', touchAction: 'none' } as any) : null) }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 0, paddingHorizontal: 20, gap, paddingBottom: padBottom }}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

/** 지도 자리표시: 일정 지도(MapBase)와 같은 SVG 지도를 화면 전체에 (390×844 기준) */
export function MapLayer() {
  return (
    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} pointerEvents="none">
      <MapBase vw={390} vh={844} />
    </View>
  );
}

/** 지도 말풍선(라임) + 꼬리 + 핀 그림자 */
export function Bubble({ label, left, top, onPress }: { label: string; left: number; top: number; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={{ position: 'absolute', left, top, alignItems: 'center' }}>
      <View style={{ backgroundColor: t.feed, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, ...shadow(t) }}>
        <T size={12} w="b" color={t.feedT}>{label}</T>
      </View>
      <Svg width={12} height={8} style={{ marginTop: -2 }}><Path d="M0 0L12 0L6 8Z" fill={t.feed} /></Svg>
      <Svg width={20} height={7} style={{ marginTop: 3 }}><Ellipse cx={10} cy={3.5} rx={10} ry={3.5} fill={t.mode === 'dark' ? '#000' : '#1a264d'} opacity={0.18} /></Svg>
    </Pressable>
  );
}
