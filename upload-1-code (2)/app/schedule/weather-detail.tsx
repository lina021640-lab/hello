import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Svg, { Polyline, Rect } from 'react-native-svg';
import { Page, Header, T, Row, shadow, useTheme } from '../../src/kit';
import { Chip, WxIcon, Wx } from '../../src/screens/schedule/shared';

const days = ['11/22(일)', '11/23(월)', '11/24(화)', '11/25(수)', '11/26(목)', '11/27(금)'];
const temps = [12, 12, 12, 12, 12, 12, 12, 13, 15, 16, 17, 18, 18, 19, 19, 19, 18, 18, 17, 16, 15, 13, 12, 12];
const hours = temps.map((tp, h) => {
  const rain = h >= 13 && h <= 19;
  const k: Wx = rain ? 'rain' : h >= 8 && h <= 12 ? 'cloud' : 'moon';
  return { h, tp, k, desc: rain ? '비' : k === 'cloud' ? '구름 많음' : '맑음', pop: rain ? 70 : 0, rain };
});

function Chart() {
  const { t } = useTheme();
  const W = 316, H = 124;
  const y = (v: number) => 92 - ((v - 12) * 64) / 7;
  const x = (i: number) => (i * W) / 23;
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {hours.filter((a) => a.rain).map((a) => <Rect key={a.h} x={x(a.h) - 4} y={H - 4 - 44} width={8} height={44} rx={2} fill={t.acc} opacity={0.3} />)}
      <Polyline points={hours.map((a, i) => `${x(i)},${y(a.tp)}`).join(' ')} stroke={t.acc} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

export default function WeatherDetail() {
  const { t } = useTheme(); const [d, setD] = useState(0);
  return (
    <Page gap={12}>
      <Header title="시간별 예보 · 런던" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingTop: 4 }}>
        {days.map((x, i) => <Chip key={x} label={x} size={13} active={i === d} onPress={() => setD(i)} />)}
      </ScrollView>
      <View style={[{ backgroundColor: t.card, borderRadius: 26, paddingHorizontal: 18, paddingVertical: 16, gap: 10 }, shadow(t)]}>
        <Row gap={12}>
          <WxIcon k="rain" size={40} />
          <View style={{ flex: 1 }}>
            <T size={20} w="b" ls={-2}>오후 비</T>
            <T size={12} sub>모레 · {days[d]}</T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T size={20} w="b">19° / 12°</T>
            <T size={11} sub>최고 / 최저</T>
          </View>
        </Row>
        <Row gap={6} style={{ flexWrap: 'wrap' }}>
          {['강수확률 70%', '습도 72%', '바람 4m/s', '일출 07:20', '일몰 15:59'].map((s) => (
            <View key={s} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: t.line, backgroundColor: t.card }}>
              <T size={11}>{s}</T>
            </View>
          ))}
        </Row>
      </View>
      <View style={[{ backgroundColor: t.card, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 14, gap: 8 }, shadow(t)]}>
        <T size={14} w="b">기온 · 강수확률</T>
        <View style={{ alignItems: 'center' }}><Chart /></View>
        <Row style={{ justifyContent: 'space-between' }}>
          {['0시', '6시', '12시', '18시', '23시'].map((s) => <T key={s} size={11} sub>{s}</T>)}
        </Row>
      </View>
      <View style={[{ backgroundColor: t.card, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 4, overflow: 'hidden' }, shadow(t)]}>
        {hours.map((a, i) => (
          <Row key={a.h} gap={10} style={{ paddingVertical: 9, marginHorizontal: -16, paddingHorizontal: 16, backgroundColor: a.rain ? t.accS : 'transparent', borderBottomWidth: i < hours.length - 1 ? 1 : 0, borderBottomColor: t.line }}>
            <T size={13} sub style={{ width: 40 }}>{a.h}시</T>
            <WxIcon k={a.k} size={20} />
            <T size={15} w="b" style={{ width: 40 }}>{a.tp}°</T>
            <T size={13} sub style={{ flex: 1 }}>{a.desc}</T>
            <T size={12} w="b" color={a.pop >= 70 ? t.acc : t.sub}>{a.pop}%</T>
          </Row>
        ))}
      </View>
      <View style={{ height: 8 }} />
    </Page>
  );
}
