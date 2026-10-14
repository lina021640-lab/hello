import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Page, Header, T, Row, Icon, shadow, useGo, useTheme } from '../../src/kit';
import { Chip, WxIcon, Wx } from '../../src/screens/schedule/shared';

type H = { h: string; k: Wx; t: number };
const mk = (labels: string[], temps: number[], icons: Wx[]): H[] => labels.map((h, i) => ({ h, k: icons[i], t: temps[i] }));
const L = ['6시', '7시', '8시', '9시', '10시', '11시', '12시', '13시', '지금', '15시', '16시', '17시', '18시', '19시', '20시', '21시', '22시', '23시', '내일 0시', '1시', '2시', '3시', '4시', '5시'];
const today = mk(L, [16, 18, 20, 22, 24, 25, 26, 27, 27, 27, 26, 25, 24, 22, 20, 18, 16, 16, 16, 16, 16, 16, 16, 16],
  ['moon', ...Array(13).fill('sun'), ...Array(10).fill('moon')] as Wx[]);
const tomorrow = mk(L.map((x) => (x === '지금' ? '14시' : x)), [14, 16, 17, 18, 20, 21, 21, 22, 22, 22, 21, 21, 20, 18, 17, 16, 14, 14, 14, 14, 14, 14, 14, 14],
  ['moon', 'sun', 'sun', ...Array(8).fill('cloud'), 'sun', 'sun', 'sun', ...Array(10).fill('moon')].slice(0, 24) as Wx[]);
const daily: { d: string; k: Wx; pop: number; lo: number; hi: number; pl: number; w: number }[] = [
  { d: '모레 11/22(일)', k: 'rain', pop: 70, lo: 12, hi: 19, pl: 12, w: 21 },
  { d: '11/23(월)', k: 'sun', pop: 10, lo: 13, hi: 23, pl: 15, w: 30 },
  { d: '11/24(화)', k: 'cloud', pop: 10, lo: 11, hi: 18, pl: 9, w: 21 },
  { d: '11/25(수)', k: 'rain', pop: 70, lo: 10, hi: 16, pl: 6, w: 18 },
  { d: '11/26(목)', k: 'cloud', pop: 10, lo: 9, hi: 15, pl: 3, w: 18 },
];

function Strip({ data }: { data: H[] }) {
  const { t } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 2 }}>
      {data.map((x, i) => {
        const now = x.h === '지금';
        return (
          <View key={i} style={{ width: 50, height: 96, borderRadius: 16, alignItems: 'center', paddingVertical: 8, gap: 5, backgroundColor: now ? t.accS : 'transparent' }}>
            <T size={12} w={now ? 'b' : 'm'} color={now ? t.acc : t.sub}>{x.h}</T>
            <WxIcon k={x.k} size={22} />
            <T size={15} w="b">{x.t}°</T>
            <T size={11} sub>0%</T>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function Weather() {
  const go = useGo(); const { t } = useTheme();
  const [city, setCity] = useState(0);
  return (
    <Page gap={12}>
      <Header title="날씨" />
      <Row gap={8} style={{ marginTop: 4 }}>
        {['런던', '파리', '피렌체'].map((c, i) => <Chip key={c} label={c} size={13} py={7} active={i === city} onPress={() => setCity(i)} />)}
      </Row>
      <View style={{ backgroundColor: t.acc, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14, gap: 2, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 220, top: -60, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <T size={13} color="rgba(255,255,255,0.85)">{['런던', '파리', '피렌체'][city]} · 지금</T>
        <Row>
          <T size={52} w="b" ls={-4} color="#fff" style={{ flex: 1 }}>25°</T>
          <View style={{ marginRight: 14 }}><WxIcon k="sun" size={48} onBlue /></View>
        </Row>
        <T size={13} color="#fff">맑음 · 체감 24° · 습도 48% · 바람 3m/s</T>
      </View>
      <Row gap={8}>
        <T size={16} w="b" style={{ flex: 1 }}>오늘 · 11/20(금)</T>
        <WxIcon k="sun" size={18} /><T size={12} sub>맑음 · 27° / 16°</T>
      </Row>
      <Strip data={today} />
      <Row gap={8}>
        <T size={16} w="b" style={{ flex: 1 }}>내일 · 11/21(토)</T>
        <WxIcon k="cloud" size={18} /><T size={12} sub>구름 많음 · 22° / 14°</T>
      </Row>
      <Strip data={tomorrow} />
      <View style={{ paddingTop: 8, gap: 2 }}>
        <T size={16} w="b">요일별 예보</T>
        <T size={12} sub>날짜를 누르면 시간별 예보를 볼 수 있어요</T>
      </View>
      <View style={[{ backgroundColor: t.card, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 4 }, shadow(t)]}>
        {daily.map((d) => (
          <Pressable key={d.d} onPress={() => go('/schedule/weather-detail')}>
            <Row gap={8} style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: t.line }}>
              <T size={14} style={{ width: 100 }}>{d.d}</T>
              <WxIcon k={d.k} size={20} />
              <T size={11} color={d.pop >= 70 ? t.acc : t.sub} style={{ width: 30 }}>{d.pop}%</T>
              <T size={13} sub align="right" style={{ width: 26 }}>{d.lo}°</T>
              <View style={{ width: 52, height: 5, borderRadius: 3, backgroundColor: t.track }}>
                <View style={{ marginLeft: d.pl, width: d.w, height: 5, borderRadius: 3, backgroundColor: t.acc }} />
              </View>
              <T size={13} w="b" style={{ flex: 1 }}>{d.hi}°</T>
              <Icon name="chev" size={16} color={t.sub} />
            </Row>
          </Pressable>
        ))}
        <Pressable onPress={() => go('/schedule/weather-detail')}>
          <Row gap={4} style={{ justifyContent: 'center', paddingVertical: 13 }}>
            <T size={13} w="b" color={t.acc}>더보기 (10일 예보)</T>
            <Icon name="down" size={16} color={t.acc} />
          </Row>
        </Pressable>
      </View>
      <View style={{ height: 8 }} />
    </Page>
  );
}
