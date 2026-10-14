import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, Row, Icon, shadow, useGo, useTheme } from '../../src/kit';
import { MapBase } from '../../src/screens/schedule/shared';

const stops = [
  { n: 1, time: 'PM 03:00', name: '버러 마켓', sub: '도보 15분 · 대중교통 약 1분', x: 96, y: 360 },
  { n: 2, time: 'PM 05:00', name: '타워브리지', sub: '도보 40분 · 대중교통 약 15분', x: 232, y: 300 },
  { n: 3, time: 'PM 09:00', name: '호텔', x: 298, y: 214 },
];

export default function MapScreen() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const top = Math.max(ins.top, 37) + 11;
  const [day, setDay] = useState(1);
  const Btn44 = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
    <Pressable onPress={onPress} style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }, shadow(t)]}>{children}</Pressable>
  );
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={StyleSheet.absoluteFill}><MapBase vw={390} vh={844} /></View>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice">
        <Path d="M96 360 C 150 350 190 332 232 300 S 285 245 298 214" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
        <Path d="M96 360 C 150 350 190 332 232 300 S 285 245 298 214" stroke={t.acc} strokeWidth={4} fill="none" strokeLinecap="round" />
      </Svg>
      {/* 핀 */}
      {stops.map((s) => (
        <View key={s.n} style={[{ position: 'absolute', left: s.x - 17, top: s.y - 17, width: 34, height: 34, borderRadius: 17, backgroundColor: t.acc, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }, shadow(t)]}>
          <T size={14} w="b" color="#fff">{s.n}</T>
        </View>
      ))}
      <View style={[{ position: 'absolute', left: 64, top: 302, backgroundColor: t.card, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }, shadow(t)]}>
        <T size={12} w="b">버러 마켓</T>
      </View>
      {/* 상단 */}
      <View style={{ position: 'absolute', left: 20, top }}>
        <Btn44 onPress={() => (r.canGoBack() ? r.back() : r.replace('/schedule'))}><Icon name="back" size={22} color={t.text} /></Btn44>
      </View>
      <Row gap={8} style={[{ position: 'absolute', left: 76, right: 20, top, height: 44, borderRadius: 22, backgroundColor: t.card, paddingHorizontal: 16 }, shadow(t)]}>
        <Icon name="search" size={18} color={t.sub} />
        <T size={14} style={{ flex: 1 }}>런던 · 3일차 11/20</T>
        <Icon name="down" size={18} color={t.sub} />
      </Row>
      <Row gap={8} style={{ position: 'absolute', left: 20, top: top + 56 }}>
        {['2일차', '3일차', '4일차'].map((d, i) => (
          <Pressable key={d} onPress={() => setDay(i)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: i === day ? t.acc : t.card, borderWidth: i === day ? 0 : 1, borderColor: t.line }}>
            <T size={14} w={i === day ? 'b' : 'm'} color={i === day ? '#fff' : t.text}>{d}</T>
          </Pressable>
        ))}
      </Row>
      {/* 우측 버튼 */}
      <View style={{ position: 'absolute', right: 18, top: 380, gap: 10 }}>
        <Btn44><Icon name="layers" size={22} color={t.text} /></Btn44>
        <Btn44><Icon name="locate" size={22} color={t.text} /></Btn44>
      </View>
      {/* 바텀시트 */}
      <View style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 324, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 10, paddingHorizontal: 20, paddingBottom: Math.max(ins.bottom, 16), gap: 12 }, shadow(t)]}>
        <View style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} />
        <Row>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={20} w="b" ls={-2}>3일차 · 런던</T>
            <T size={13} sub>3곳 · 이동 약 1시간 5분</T>
          </View>
          <Pressable onPress={() => go('/schedule/detail')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: t.line, backgroundColor: t.card }}>
            <Icon name="list" size={16} color={t.text} /><T size={14}>목록</T>
          </Pressable>
        </Row>
        <View style={{ gap: 14 }}>
          {stops.map((s) => (
            <Row key={s.n} gap={12}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
                <T size={13} w="b" color="#fff">{s.n}</T>
              </View>
              <View style={{ flex: 1, gap: 1 }}>
                <T size={12} w="b" color={t.acc}>{s.time}</T>
                <T size={16} w="b">{s.name}</T>
                {s.sub ? <T size={12} sub>{s.sub}</T> : null}
              </View>
            </Row>
          ))}
        </View>
      </View>
    </View>
  );
}
