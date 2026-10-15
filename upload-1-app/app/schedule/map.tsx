import { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, Row, Icon, Page, Header, shadow, useGo, useTheme } from '../../src/kit';
import { ZoomMap } from '../../src/components/ZoomMap';
import { useUserSchedule, userItemsOf, timeKey, timeLabel } from '../../src/data/scheduleStore';
import { useCurrentTrip, TripView } from '../../src/data/currentTrip';
import { MapBase } from '../../src/screens/schedule/shared';

export default function MapScreen() {
  const view = useCurrentTrip();
  if (!view) return <Page gap={14}><Header title="지도" /><T size={14} sub align="center" style={{ marginTop: 40 }}>예정된 여행이 없어요. 여행을 추가하면 일정 지도를 볼 수 있어요.</T></Page>;
  return <MapInner view={view} />;
}

function MapInner({ view }: { view: TripView }) {
  const r = useRouter(); const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const top = Math.max(ins.top, 37) + 11;
  const TRIP = { days: view.days };
  const [day, setDay] = useState(Math.min(Math.max(view.today, 1), view.days));
  const extra = userItemsOf(useUserSchedule(), day).sort((a, b) => timeKey(a.time) - timeKey(b.time));
  const all = extra.map((u, i) => ({ time: timeLabel(u.time), name: u.title || u.place, sub: undefined as string | undefined, x: 80 + ((i * 61) % 240), y: 300 + ((i * 47) % 200), n: i + 1 }));
  const Btn44 = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
    <Pressable onPress={onPress} style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }, shadow(t)]}>{children}</Pressable>
  );
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZoomMap><MapBase vw={390} vh={844} /></ZoomMap>
      {all.length > 1 ? (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" pointerEvents="none">
          <Path d={`M${all.map((s) => `${s.x} ${s.y}`).join(' L')}`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d={`M${all.map((s) => `${s.x} ${s.y}`).join(' L')}`} stroke={t.acc} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
      {/* 핀 */}
      {all.map((s) => (
        <View key={s.n} style={[{ position: 'absolute', left: s.x - 17, top: s.y - 17, width: 34, height: 34, borderRadius: 17, backgroundColor: t.acc, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }, shadow(t)]}>
          <T size={14} w="b" color="#fff">{s.n}</T>
        </View>
      ))}
      {/* 상단 */}
      <View style={{ position: 'absolute', left: 20, top }}>
        <Btn44 onPress={() => (r.canGoBack() ? r.back() : r.replace('/schedule'))}><Icon name="back" size={22} color={t.text} /></Btn44>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ position: 'absolute', left: 76, right: 0, top, height: 44 }}
        contentContainerStyle={{ gap: 8, paddingRight: 20, alignItems: 'center' }}>
        {Array.from({ length: TRIP.days }, (_, i) => i + 1).map((n) => {
          const on = n === day;
          return (
            <Pressable key={n} onPress={() => setDay(n)} style={[{ height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: on ? t.acc : t.card, alignItems: 'center', justifyContent: 'center' }, shadow(t)]}>
              <T size={14} w={on ? 'b' : 'm'} color={on ? '#fff' : t.text}>{`${n}일차 ${view.dateOf(n).getMonth() + 1}/${view.dateOf(n).getDate()}`}</T>
            </Pressable>
          );
        })}
      </ScrollView>
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
            <T size={20} w="b" ls={-2}>{`${day}일차${view.cityOf(day) ? ` · ${view.cityOf(day)}` : ''}`}</T>
            <T size={13} sub>{all.length ? `${all.length}곳` : '아직 일정이 없어요'}</T>
          </View>
          <Pressable onPress={() => go('/schedule/detail')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: t.line, backgroundColor: t.card }}>
            <Icon name="list" size={16} color={t.text} /><T size={14}>목록</T>
          </Pressable>
        </Row>
        <View style={{ gap: 14 }}>
          {all.map((s) => (
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
