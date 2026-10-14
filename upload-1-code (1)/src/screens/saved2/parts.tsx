import React from 'react';
import { View, Pressable, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Icon, IconName, useTheme } from '../../kit';

/** 바텀시트 화면 골격: 뒤 배경(dimmed) + 딤 + 시트 + 하단 고정 버튼 */
export function SheetScreen({ back, top, title, children, footer, mapBg, footerBottom = 26 }: {
  back?: React.ReactNode; top: number; title: string; children: React.ReactNode; footer: React.ReactNode; mapBg?: React.ReactNode; footerBottom?: number;
}) {
  const { t } = useTheme();
  const ins = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {mapBg}
      {back ? <View style={{ position: 'absolute', left: 20, right: 20, top: 62 }}>{back}</View> : null}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20, gap: 12, paddingBottom: 110 + ins.bottom }}>
          <View style={{ alignItems: 'center' }}><View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} /></View>
          <T size={20} w="b" ls={-2}>{title}</T>
          {children}
        </ScrollView>
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(ins.bottom, footerBottom) }}>{footer}</View>
    </View>
  );
}

export function Label({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  return <T size={13} w="m" sub style={style as any}>{children}</T>;
}

/** 피그마 segmented: 높이 44, padding 4, 항목 radius 18 */
export function Segmented({ items, value, onChange }: { items: string[]; value: number; onChange: (i: number) => void }) {
  const { t } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 4, height: 44, padding: 4, borderRadius: 22, backgroundColor: t.track }}>
      {items.map((it, i) => (
        <Pressable key={it} onPress={() => onChange(i)} style={{ flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: i === value ? t.card : 'transparent' }}>
          <T size={14} w={i === value ? 'b' : 'm'} color={i === value ? t.text : t.sub}>{it}</T>
        </Pressable>
      ))}
    </View>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={() => onChange(!on)} style={{ width: 46, height: 28, borderRadius: 14, paddingHorizontal: 2, justifyContent: 'center', alignItems: on ? 'flex-end' : 'flex-start', backgroundColor: on ? t.acc : t.line }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' }} />
    </Pressable>
  );
}

/** 13px 칩 (활성 시 Bold 파랑 채움) */
export function Chip({ label, active, onPress, size = 13 }: { label: string; active?: boolean; onPress?: () => void; size?: number }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
      backgroundColor: active ? t.acc : t.card, borderWidth: active ? 0 : 1, borderColor: t.line }}>
      <T size={size} w={active ? 'b' : 'm'} color={active ? '#fff' : t.text}>{label}</T>
    </Pressable>
  );
}

export const SWATCHES = ['#1e6fff', '#ff9f0a', '#34c759', '#af52de', '#ff3b30', '#8a8f98'];

export function Swatches({ value, onChange, size, iconSize }: { value: number; onChange: (i: number) => void; size: number; iconSize: number }) {
  const { t } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {SWATCHES.map((c, i) => (
        <Pressable key={c} onPress={() => onChange(i)} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c, alignItems: 'center', justifyContent: 'center',
          borderWidth: i === value ? 2 : 0, borderColor: t.text }}>
          {i === value ? <Icon name="check" size={iconSize} color="#fff" /> : null}
        </Pressable>
      ))}
    </View>
  );
}

/** 회색 사진 자리 박스 */
export function PhotoBox({ size, radius, icon, style }: { size: number; radius: number; icon: number; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return (
    <View style={[{ width: size, height: size, borderRadius: radius, backgroundColor: t.ph, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Icon name="photo" size={icon} color={t.phIcon} />
    </View>
  );
}

export function IconBadge({ name, bg, color, size = 36, icon = 18 }: { name: IconName; bg: string; color: string; size?: number; icon?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Icon name={name} size={icon} color={color} /></View>;
}
