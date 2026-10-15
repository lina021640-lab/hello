import { View, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, Header, T, Card, Row, useGo, useTheme } from '../../src/kit';
import { Grad } from '../../src/screens/schedule/shared';
import { tipCategories } from '../../src/data/dummy';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { countryKo } from '../../src/data/cities';

const md = (s: string) => { const [, m, d] = s.split('-'); return m && d ? `${Number(m)}.${Number(d)}` : ''; };

/** 도시 정보: 현재 여행의 도시(?city=이름) */
export default function City() {
  const go = useGo(); const { t } = useTheme();
  const { city } = useLocalSearchParams<{ city?: string }>();
  const view = useCurrentTrip();
  const c = view?.trip.cities.find((x) => x.city === city) ?? view?.trip.cities[0];
  if (!c) return <Page gap={14}><Header title="도시 정보" /><T size={14} sub align="center" style={{ marginTop: 40 }}>방문할 도시가 아직 없어요</T></Page>;
  const country = c.country || countryKo(c.cc);
  const range = c.start ? `${md(c.start)}${c.end && c.end !== c.start ? ` - ${md(c.end)}` : ''}` : '';
  return (
    <Page gap={14}>
      <Header title={`${c.city} · 도시 정보`} />
      <Grad id="cityHero" from="#7d9cc9" to="#27395c" style={{ height: 150, borderRadius: 30, justifyContent: 'flex-end', padding: 18 }}>
        <T size={24} color="#fff">{c.city}</T>
        <T size={13} color="rgba(255,255,255,0.9)">{[country, range].filter(Boolean).join(' · ')}</T>
      </Grad>
      <T size={16} w="b" style={{ marginTop: 2 }}>여행 전에 알아두면 좋은 정보</T>
      <Card pad={16} radius={26}>
        <Row gap={10} style={{ flexWrap: 'wrap' }} align="flex-start">
          {tipCategories.slice(0, 8).map((x) => (
            <Pressable key={x.id} onPress={() => go('/tips/' + x.id)} style={{ width: '22.5%', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
                <T size={24}>{x.emoji}</T>
              </View>
              <T size={12} w="m" numberOfLines={1} align="center">{x.name}</T>
            </Pressable>
          ))}
        </Row>
      </Card>
    </Page>
  );
}
