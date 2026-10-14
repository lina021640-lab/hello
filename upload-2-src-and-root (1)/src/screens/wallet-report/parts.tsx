import React from 'react';
import { View, Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { T, Row, Icon, IconName, shadow, useTheme } from '../../kit';

export function useClose() {
  const r = useRouter();
  return () => (r.canGoBack() ? r.back() : r.replace('/home'));
}

/** 피그마 하위 헤더: "←"(22) + 제목(18 Medium), 높이 46 */
export function SubHeader({ title, right, mb = 13 }: { title: string; right?: React.ReactNode; mb?: number }) {
  const close = useClose();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 46, marginBottom: mb, gap: 14 }}>
      <Pressable hitSlop={10} onPress={close}><T size={22} w="m">←</T></Pressable>
      <T size={18} w="m" style={{ flex: 1 }} numberOfLines={1}>{title}</T>
      {right}
    </View>
  );
}

/** 알약 칩: 활성=파랑+Bold 흰 글씨, 비활성=흰 배경+테두리 */
export function Chip({ label, active, onPress, size = 14, py = 8, px = 14, style }: {
  label: string; active?: boolean; onPress?: () => void; size?: number; py?: number; px?: number; style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={[{ paddingHorizontal: px, paddingVertical: py, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
      backgroundColor: active ? t.acc : t.card, borderWidth: active ? 0 : 1, borderColor: t.line }, style]}>
      <T size={size} w={active ? 'b' : 'm'} color={active ? '#fff' : t.text}>{label}</T>
    </Pressable>
  );
}

/** 상태 알약(12px) */
export function Status({ label, bg, fg, border, px = 12, py = 5, w = 'm' }: { label: string; bg: string; fg: string; border?: boolean; px?: number; py?: number; w?: 'm' | 'b' }) {
  const { t } = useTheme();
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: px, paddingVertical: py, borderRadius: 999, borderWidth: border ? 1 : 0, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
      <T size={12} w={w} color={fg}>{label}</T>
    </View>
  );
}

/** 안내 배너: 아이콘 16 + 12px 텍스트 */
export function Notice({ text, bg, color }: { text: string; bg?: string; color?: string }) {
  const { t } = useTheme();
  return (
    <Row align="flex-start" gap={8} style={{ backgroundColor: bg ?? t.accS, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16 }}>
      <Icon name="info" size={16} color={color ?? t.acc} />
      <T size={12} lh={17} style={{ flex: 1 }}>{text}</T>
    </Row>
  );
}

export function Sep({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return <View style={[{ height: 1, backgroundColor: t.line }, style]} />;
}

/** 흰 카드(그림자) */
export function Box({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme();
  return <View style={[{ backgroundColor: t.card, ...shadow(t) }, style]}>{children}</View>;
}

export function Avatar({ ch, size, bg, fg, fs }: { ch: string; size: number; bg: string; fg: string; fs: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <T size={fs} w="b" color={fg}>{ch}</T>
    </View>
  );
}

/** 작은 버튼(요청 알림/해제): 높이 32, radius 16 */
export function MiniBtn({ label, icon, onPress }: { label: string; icon?: IconName; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ height: 32, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: icon ? 12 : 14 }}>
      {icon ? <Icon name={icon} size={14} color={t.text} /> : null}
      <T size={icon ? 12 : 13} w="b">{label}</T>
    </Pressable>
  );
}

/** 큰 알약 버튼(높이 52, radius 26) */
export function Big({ label, onPress, kind = 'primary', icon, size = 16, style }: {
  label: string; onPress?: () => void; kind?: 'primary' | 'ghost' | 'danger'; icon?: IconName; size?: number; style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTheme();
  const bg = kind === 'primary' ? t.acc : kind === 'danger' ? t.bad : t.card;
  const fg = kind === 'ghost' ? t.text : '#fff';
  return (
    <Pressable onPress={onPress} style={[{ height: 52, borderRadius: 26, backgroundColor: bg, borderWidth: kind === 'ghost' ? 1 : 0, borderColor: t.line,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18 }, style]}>
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <T size={size} w="b" color={fg}>{label}</T>
    </Pressable>
  );
}

// ───── 신고·차단 공통(딤 처리된 피드 글 + 오버레이) ─────
export const DIM = 'rgba(0,0,0,0.42)';

export function FeedPostDim({ mine }: { mine?: boolean }) {
  const { t } = useTheme();
  return (
    <Box style={{ position: 'absolute', left: 20, right: 20, top: 62, padding: 14, borderRadius: 22, gap: 10 }}>
      {mine ? (
        <>
          <T size={16} w="b">버러 마켓</T>
          <T size={12} sub>내가 공유한 장소 · 3일 전</T>
        </>
      ) : (
        <>
          <Row gap={10}>
            <Avatar ch="민" size={36} bg={t.acc} fg="#fff" fs={14} />
            <View style={{ flex: 1 }}><T size={14} w="b">민수</T><T size={12} sub>3일 전 · 런던</T></View>
          </Row>
          <T size={16} w="b">버러 마켓</T>
          <T size={13}>“평일 오전이 한가해요”</T>
        </>
      )}
    </Box>
  );
}

export function Dim({ onPress }: { onPress?: () => void }) {
  return <Pressable onPress={onPress} style={[StyleSheet.absoluteFill, { backgroundColor: DIM }]} />;
}

export function Grabber() {
  const { t } = useTheme();
  return <View style={{ alignItems: 'center' }}><View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} /></View>;
}

/** 가운데 확인 다이얼로그 (R-03, R-04) */
export function ConfirmDialog({ icon, title, bullets, confirm, onCancel, onConfirm }: {
  icon: IconName; title: string; bullets: string[]; confirm: string; onCancel: () => void; onConfirm: () => void;
}) {
  const { t } = useTheme();
  return (
    <Box style={{ position: 'absolute', left: 40, right: 40, top: 290, borderRadius: 28, paddingTop: 22, paddingBottom: 18, paddingHorizontal: 20, alignItems: 'center', gap: 14 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.badS, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={28} color={t.bad} />
      </View>
      <T size={19} w="b" ls={-2} align="center" style={{ alignSelf: 'stretch' }}>{title}</T>
      <View style={{ gap: 8, alignSelf: 'stretch' }}>
        {bullets.map((b) => (
          <Row key={b} align="flex-start" gap={8}>
            <T size={13} w="b" color={t.acc}>•</T>
            <T size={13} lh={19} sub style={{ flex: 1 }}>{b}</T>
          </Row>
        ))}
      </View>
      <Row gap={10} style={{ alignSelf: 'stretch', paddingTop: 6 }}>
        <Big label="취소" kind="ghost" size={15} onPress={onCancel} style={{ flex: 1, height: 48, borderRadius: 24 }} />
        <Big label={confirm} kind="danger" size={15} onPress={onConfirm} style={{ flex: 1, height: 48, borderRadius: 24 }} />
      </Row>
    </Box>
  );
}
