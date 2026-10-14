/**
 * 피그마 디자인(390×844) 기준 공통 부품.
 * - 수치(크기·간격·반경)는 피그마 값을 그대로 사용 (px = RN dp)
 * - 색은 useTheme() 토큰 → 라이트/다크 자동 전환
 */
import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, StyleSheet, ViewStyle, TextStyle, StyleProp, Platform } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../theme';
import { Icon, IconName } from '../components/Icon';

export { Icon };
export type { IconName };

// ───────── 글꼴 ─────────
// Paperlogy: 3 Light / 4 Regular / 5 Medium / 6 SemiBold / 7 Bold
// (Paperlogy TTF 를 번들하면 FONT_FAMILY 에 이름을 넣으면 됨. 지금은 시스템 글꼴 + 굵기)
export const FONT_FAMILY: Partial<Record<'l' | 'r' | 'm' | 'sb' | 'b' | 'xb', string>> = {
  l: 'Paperlogy-3Light', r: 'Paperlogy-4Regular', m: 'Paperlogy-5Medium', sb: 'Paperlogy-6SemiBold', b: 'Paperlogy-7Bold', xb: 'Paperlogy-8ExtraBold',
};
const WEIGHT = { l: '300', r: '400', m: '500', sb: '600', b: '700', xb: '800' } as const;
export type W = keyof typeof WEIGHT;

export function T({ children, size = 14, w = 'm', color, sub, ls, lh, style, numberOfLines, align, onPress }: {
  children?: React.ReactNode; size?: number; w?: W; color?: string; sub?: boolean;
  /** 자간(%) — 피그마 letterSpacing -4% 처럼 */ ls?: number;
  lh?: number; style?: StyleProp<TextStyle>; numberOfLines?: number; align?: TextStyle['textAlign']; onPress?: () => void;
}) {
  const { t } = useTheme();
  const fam = FONT_FAMILY[w];
  return (
    <Text onPress={onPress} numberOfLines={numberOfLines}
      style={[{ fontSize: size, color: color ?? (sub ? t.sub : t.text), fontWeight: fam ? 'normal' : (WEIGHT[w] as TextStyle['fontWeight']),
        letterSpacing: ls ? (size * ls) / 100 : undefined, lineHeight: lh, textAlign: align, includeFontPadding: false },
        fam ? { fontFamily: fam } : null, style]}>
      {children}
    </Text>
  );
}

// ───────── 그림자 (피그마: 0 6 10 rgba(26,38,77,.07)) ─────────
export const shadow = (t: Theme): ViewStyle =>
  t.mode === 'light'
    ? { shadowColor: '#1a264d', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 2 }
    : {};

// ───────── 페이지 ─────────
/** tab: 하단 탭바(92) 만큼 여백 / scroll: 스크롤 / pad: 좌우 여백(기본 20) */
export function Page({ children, tab, scroll = true, pad = 20, gap = 0, bg, footer, top = true }: {
  children?: React.ReactNode; tab?: boolean; scroll?: boolean; pad?: number; gap?: number; bg?: string;
  footer?: React.ReactNode; top?: boolean;
}) {
  const { t } = useTheme();
  const ins = useSafeAreaInsets();
  const padTop = top ? Math.max(ins.top, 20) : 0;
  const body = { paddingHorizontal: pad, gap, paddingBottom: (tab ? 68 : 0) + 24 + (tab ? 0 : ins.bottom) } as ViewStyle;
  return (
    <View style={{ flex: 1, backgroundColor: bg ?? t.bg, paddingTop: padTop }}>
      {scroll
        ? <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={body}>{children}</ScrollView>
        : <View style={[{ flex: 1 }, body]}>{children}</View>}
      {footer ? <View style={{ paddingHorizontal: pad, paddingBottom: Math.max(ins.bottom, 16), paddingTop: 10, backgroundColor: bg ?? t.bg }}>{footer}</View> : null}
    </View>
  );
}

/** 탭 화면 제목: 30px Bold, 자간 -4%, top 52 / 우측에 액션 */
export function TabTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 35, marginTop: 15, marginBottom: 17 }}>
      <T size={30} w="b" ls={-4} style={{ flex: 1 }}>{title}</T>
      {right}
    </View>
  );
}

/** 하위 화면 헤더: ← + 제목 (18px) */
export function Header({ title, right, onBack }: { title: string; right?: React.ReactNode; onBack?: () => void }) {
  const { t } = useTheme();
  const r = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 44, marginTop: 8, marginBottom: 8, gap: 6 }}>
      <Pressable hitSlop={10} onPress={onBack ?? (() => (r.canGoBack() ? r.back() : r.replace('/home')))} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', marginLeft: -4 }}>
        <Icon name="back" size={22} color={t.text} />
      </Pressable>
      <T size={18} w="b" style={{ flex: 1 }} numberOfLines={1}>{title}</T>
      {right}
    </View>
  );
}

// ───────── 카드/버튼/칩 ─────────
export function Card({ children, style, onPress, pad = 16, radius = 24 }: {
  children?: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; pad?: number; radius?: number;
}) {
  const { t } = useTheme();
  const st: ViewStyle = { backgroundColor: t.card, borderRadius: radius, padding: pad, ...shadow(t) };
  return onPress ? <Pressable onPress={onPress} style={[st, style]}>{children}</Pressable> : <View style={[st, style]}>{children}</View>;
}

export function Btn({ label, onPress, kind = 'primary', style, disabled, icon, h = 52 }: {
  label: string; onPress?: () => void; kind?: 'primary' | 'ghost' | 'danger' | 'soft' | 'dark'; style?: StyleProp<ViewStyle>;
  disabled?: boolean; icon?: IconName; h?: number;
}) {
  const { t } = useTheme();
  const bg = kind === 'primary' ? t.acc : kind === 'danger' ? t.bad : kind === 'soft' ? t.accS : kind === 'dark' ? '#000' : t.card;
  const fg = kind === 'ghost' ? t.text : kind === 'soft' ? t.acc : '#fff';
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={[{ height: h, borderRadius: 999, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, opacity: disabled ? 0.4 : 1,
        borderWidth: kind === 'ghost' ? 1 : 0, borderColor: t.line }, style]}>
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <T size={16} w="b" color={fg}>{label}</T>
    </Pressable>
  );
}

/** 작은 알약(테두리/채움): 피그마 px14 py6 radius 999, 14px Medium */
export function Pill({ label, onPress, active, tone, icon, trail, style, size = 14, py = 6, px = 14 }: {
  label?: string; onPress?: () => void; active?: boolean; tone?: 'ok' | 'warn' | 'bad' | 'acc' | 'feed' | 'dark'; icon?: IconName; trail?: IconName;
  style?: StyleProp<ViewStyle>; size?: number; py?: number; px?: number;
}) {
  const { t } = useTheme();
  let bg = active ? t.acc : t.card; let fg = active ? '#fff' : t.text; let bw = active ? 0 : 1;
  if (tone === 'acc') { bg = t.accS; fg = t.acc; bw = 0; }
  if (tone === 'ok') { bg = t.ok + '26'; fg = t.ok; bw = 0; }
  if (tone === 'warn') { bg = t.warn + '26'; fg = t.warn; bw = 0; }
  if (tone === 'bad') { bg = t.badS; fg = t.bad; bw = 0; }
  if (tone === 'feed') { bg = t.feed; fg = t.feedT; bw = 0; }
  if (tone === 'dark') { bg = '#000'; fg = '#fff'; bw = 0; }
  return (
    <Pressable onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: px, paddingVertical: py, borderRadius: 999, backgroundColor: bg, borderWidth: bw, borderColor: t.line }, style]}>
      {icon ? <Icon name={icon} size={size} color={fg} /> : null}
      {label ? <T size={size} w="m" color={fg}>{label}</T> : null}
      {trail ? <Icon name={trail} size={size} color={t.sub} /> : null}
    </Pressable>
  );
}

export function Seg({ items, value, onChange }: { items: string[]; value: number; onChange: (i: number) => void }) {
  const { t } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: t.track, borderRadius: 999, padding: 4 }}>
      {items.map((it, i) => (
        <Pressable key={it} onPress={() => onChange(i)} style={{ flex: 1, height: 38, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: i === value ? t.card : 'transparent' }}>
          <T size={14} w="b" color={i === value ? t.text : t.sub}>{it}</T>
        </Pressable>
      ))}
    </View>
  );
}

export function Field({ label, value, onChangeText, placeholder, secure, multiline, style, left, right }: {
  label?: string; value?: string; onChangeText?: (s: string) => void; placeholder?: string; secure?: boolean; multiline?: boolean;
  style?: StyleProp<ViewStyle>; left?: React.ReactNode; right?: React.ReactNode;
}) {
  const { t } = useTheme();
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <T size={13} w="m" sub>{label}</T> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.card, borderRadius: 16, paddingHorizontal: 16, minHeight: multiline ? 96 : 52, paddingVertical: multiline ? 14 : 0, ...shadow(t) }}>
        {left}
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.sub} secureTextEntry={secure} multiline={multiline}
          style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, textAlignVertical: multiline ? 'top' : 'center', alignSelf: multiline ? 'stretch' : undefined,
            ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        {right}
      </View>
    </View>
  );
}

/** 사진 자리: #e9edf3(라이트) / #34363c(다크) + icon/photo placeholder */
export function PhotoPH({ w, h = 120, radius = 16, iconSize, style }: { w?: number | string; h?: number; radius?: number; iconSize?: number; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <View style={[{ width: w as any, height: h, borderRadius: radius, backgroundColor: t.ph, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Icon name="photo" size={iconSize ?? Math.min(40, Math.round(h * 0.4))} color={t.phIcon} />
    </View>
  );
}

/** 아이콘을 담는 둥근 타일(예: 44px accS 배경) */
export function IconTile({ name, size = 40, icon = 20, bg, color, radius }: { name: IconName; size?: number; icon?: number; bg?: string; color?: string; radius?: number }) {
  const { t } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: radius ?? size / 2, backgroundColor: bg ?? t.accS, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={icon} color={color ?? t.acc} />
    </View>
  );
}

export const Row = ({ children, style, gap = 0, align = 'center' }: { children?: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number; align?: ViewStyle['alignItems'] }) =>
  <View style={[{ flexDirection: 'row', alignItems: align, gap }, style]}>{children}</View>;

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: t.line }, style]} />;
}

/** "최근 지출 ········ 전체보기" 같은 섹션 제목 줄: 17px Bold + 13px 파랑 링크 */
export function SectionHead({ title, link, onLink }: { title: string; link?: string; onLink?: () => void }) {
  const { t } = useTheme();
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <T size={17} w="b">{title}</T>
      {link ? <T size={13} w="b" color={t.acc} onPress={onLink}>{link}</T> : null}
    </Row>
  );
}

export function useGo() {
  const r = useRouter();
  return (href: string) => r.push(href as Href);
}
export { useTheme };


// ───────── 글래스 (피그마 BACKGROUND_BLUR + GLASS + DROP_SHADOW) ─────────
/** fill: 반투명 채움색 / blur: 0~100 강도 / 그림자는 바깥, 블러는 둥근 모서리 안쪽에서 잘림 */
export function Glass({ children, style, radius = 24, fill = 'rgba(255,255,255,0.13)', blur = 18, shadowOn = true, tint }: {
  children?: React.ReactNode; style?: StyleProp<ViewStyle>; radius?: number; fill?: string; blur?: number; shadowOn?: boolean; tint?: 'light' | 'dark' | 'default';
}) {
  const { t } = useTheme();
  return (
    <View style={[{ borderRadius: radius },
      shadowOn ? { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 21, shadowOffset: { width: 0, height: 9 }, elevation: 6 } : null, style]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
        <BlurView intensity={blur} tint={tint ?? (t.mode === 'dark' ? 'dark' : 'light')} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
      </View>
      {children}
    </View>
  );
}

// ───────── 함께하는 친구 프로필 (겹쳐 쌓기) ─────────
/** 친구가 많아도 maxWidth 안에 들어오도록 겹침 간격을 자동으로 줄임 (기본 겹침 43%) */
export function AvatarStack({ colors, photos, size = 35, maxWidth, plus, plusBg, plusFg, border, onPress }: {
  colors: string[]; photos?: (string | undefined)[]; size?: number; maxWidth: number; plus?: boolean; plusBg?: string; plusFg?: string; border?: string; onPress?: () => void;
}) {
  const { t } = useTheme();
  const n = colors.length + (plus ? 1 : 0);
  const step = n > 1 ? Math.min(size * 0.57, (maxWidth - size) / (n - 1)) : 0;
  const bc = border ?? t.card;
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={{ width: size + step * (n - 1), height: size }}>
      {colors.map((c, i) => (
        <View key={i} style={{ position: 'absolute', left: i * step, top: 0, width: size, height: size, borderRadius: size / 2, backgroundColor: c, borderWidth: 1, borderColor: bc, alignItems: 'center', justifyContent: 'center' }}>
          {photos?.[i] ? <Image source={{ uri: photos[i] }} style={{ width: size, height: size, borderRadius: size / 2 }} /> : <Icon name="photo" size={size * 0.4} color="rgba(255,255,255,0.8)" />}
        </View>
      ))}
      {plus && (
        <View style={{ position: 'absolute', left: colors.length * step, top: 0, width: size, height: size, borderRadius: size / 2, backgroundColor: plusBg ?? '#000', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={size * 0.5} color={plusFg ?? '#fff'} />
        </View>
      )}
    </Pressable>
  );
}
