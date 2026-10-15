import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Page, Header, T, Row, Pill, Icon, IconName, IconTile, shadow, useTheme, useGo } from '../../kit';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../data/authStore';
import { useCurrentTrip } from '../../data/currentTrip';
import { countryKo, flag } from '../../data/cities';
import { EmptyCard, NoTripPage } from '../empty/EmptyCard';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

/** 탭에서 마지막으로 고른 나라 (하위 화면이 ?c= 없이 열릴 때 기본값) */
let _last: string | undefined;
export const lastCountry = () => _last;
export const setLastCountry = (c: string) => { _last = c; };

/** 하위 화면 공통 틀: ← 제목 + 우측 나라 알약. 상세 가이드는 영국(GB)만 있어서 다른 나라는 '준비 중' 카드 */
export function TipPage({ title, children }: { title: string; children?: React.ReactNode }) {
  const { t } = useTheme();
  const go = useGo();
  useAuth();
  const view = useCurrentTrip();
  const p = useLocalSearchParams<{ c?: string }>();
  if (!view) return <NoTripPage title={title} />;
  const first = view.trip.cities.find((c) => c.cc)?.cc;
  const cc = (typeof p.c === 'string' && p.c ? p.c : lastCountry() ?? first ?? '').toUpperCase();
  const name = view.trip.cities.find((c) => c.cc === cc)?.country || countryKo(cc) || '';
  const ready = cc === 'GB';
  return (
    <Page gap={12}>
      <Header title={title} right={cc ? <Pill label={`${flag(cc)} ${name}`} trail="down" size={12} py={5} px={14} onPress={() => go('/tips')} /> : undefined} />
      {ready ? (
        <>
          <Row gap={6} style={{ paddingBottom: 2 }}>
            <Icon name="info" size={14} color={t.sub} />
            <T size={12} sub>예시 데이터 · 서비스에서는 최신 정보로 교체돼요</T>
          </Row>
          {children}
        </>
      ) : (
        <EmptyCard emoji={cc ? flag(cc) : '💡'} title={`${name || '이 나라'} ${title} 정보는 준비 중이에요`} body="나라별 정보를 곧 채워 드릴게요." />
      )}
    </Page>
  );
}

/** 상단 칩 탭 (선택 상태는 로컬, 내용은 정적) */
export function Chips({ items, size = 13, py = 7, px = 14 }: { items: string[]; size?: number; py?: number; px?: number }) {
  const { t } = useTheme();
  const [on, setOn] = useState(0);
  return (
    <Row gap={8} style={{ flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <Pressable key={it} onPress={() => setOn(i)} style={{ paddingHorizontal: px, paddingVertical: py, borderRadius: 999, backgroundColor: i === on ? t.acc : t.card, borderWidth: i === on ? 0 : 1, borderColor: t.line }}>
          <T size={size} w={i === on ? 'b' : 'm'} color={i === on ? '#fff' : t.text}>{it}</T>
        </Pressable>
      ))}
    </Row>
  );
}

/** 흰 카드(radius 22, px16 py14) */
export function Box({ children, radius = 22, gap = 8, style, onPress }: { children?: React.ReactNode; radius?: number; gap?: number; style?: any; onPress?: () => void }) {
  const { t } = useTheme();
  const st = [{ backgroundColor: t.card, borderRadius: radius, paddingHorizontal: 16, paddingVertical: 14, gap, ...shadow(t) }, style];
  return onPress ? <Pressable onPress={onPress} style={st}>{children}</Pressable> : <View style={st}>{children}</View>;
}

export function Bullet({ text }: { text: string }) {
  const { t } = useTheme();
  return (
    <Row gap={8} align="flex-start">
      <T size={13} w="b" color={t.acc}>•</T>
      <T size={13} lh={19} style={{ flex: 1 }}>{text}</T>
    </Row>
  );
}

/** 아이콘 타일 + 제목 + 불릿 목록 */
export function BulletCard({ icon, title, items, danger }: { icon: IconName; title: string; items: string[]; danger?: boolean }) {
  const { t } = useTheme();
  return (
    <Box>
      <Row gap={10}>
        <IconTile name={icon} size={34} icon={18} radius={17} bg={danger ? t.badS : t.accS} color={danger ? t.bad : t.acc} />
        <T size={15} w="b" style={{ flex: 1 }}>{title}</T>
      </Row>
      {items.map((s) => <Bullet key={s} text={s} />)}
    </Box>
  );
}

/** 파란 요약 배너 */
export function Banner({ label, title, desc, titleSize = 18 }: { label: string; title: string; desc: string; titleSize?: number }) {
  const { t } = useTheme();
  return (
    <View style={{ backgroundColor: t.acc, borderRadius: 26, paddingHorizontal: 18, paddingVertical: 16, gap: 4 }}>
      <T size={12} w="b" color="rgba(255,255,255,0.85)">{label}</T>
      <T size={titleSize} w="b" color="#fff">{title}</T>
      <T size={12} color="rgba(255,255,255,0.9)">{desc}</T>
    </View>
  );
}

export function H16({ title, right }: { title: string; right?: string }) {
  return (
    <Row>
      <T size={16} w="b" style={{ flex: 1 }}>{title}</T>
      {right ? <T size={12} sub>{right}</T> : null}
    </Row>
  );
}

export { ScrollView };

/** 원형 국기 아이콘 (GB / FR / IT, 그 외는 중립 회색 원) */
export function FlagCircle({ code, size = 36 }: { code: string; size?: number }) {
  const { t } = useTheme();
  if (code !== 'GB' && code !== 'FR' && code !== 'IT' && code.length === 2) {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
        <T size={Math.round(size * 0.55)}>{flag(code)}</T>
      </View>
    );
  }
  const id = `fc-${code}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Defs><ClipPath id={id}><Circle cx={18} cy={18} r={18} /></ClipPath></Defs>
      <G clipPath={`url(#${id})`}>
        {code === 'GB' ? (
          <>
            <Rect width={36} height={36} fill="#012169" />
            <Path d="M0 0L36 36M36 0L0 36" stroke="#fff" strokeWidth={6} />
            <Path d="M0 0L36 36M36 0L0 36" stroke="#C8102E" strokeWidth={2.4} />
            <Path d="M18 0V36M0 18H36" stroke="#fff" strokeWidth={10} />
            <Path d="M18 0V36M0 18H36" stroke="#C8102E" strokeWidth={6} />
          </>
        ) : code === 'FR' ? (
          <>
            <Rect width={12} height={36} fill="#002395" />
            <Rect x={12} width={12} height={36} fill="#fff" />
            <Rect x={24} width={12} height={36} fill="#ED2939" />
          </>
        ) : code === 'IT' ? (
          <>
            <Rect width={12} height={36} fill="#009246" />
            <Rect x={12} width={12} height={36} fill="#fff" />
            <Rect x={24} width={12} height={36} fill="#CE2B37" />
          </>
        ) : (
          <Rect width={36} height={36} fill="#c5c9d1" />
        )}
      </G>
      <Circle cx={18} cy={18} r={17.5} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
    </Svg>
  );
}
