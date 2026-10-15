import { View, ScrollView } from 'react-native';
import { T, Row, Icon, IconName, shadow, useTheme } from '../../src/kit';
import { TipPage, Box, H16 } from '../../src/screens/tips/parts';

const facts: { icon: IconName; k: string; v: string }[][] = [
  [{ icon: 'globe', k: '언어', v: '영어' }, { icon: 'clock', k: '시차', v: '한국 −9시간 (서머타임 −8)' }],
  [{ icon: 'coin', k: '통화', v: 'GBP (£)' }, { icon: 'bolt', k: '전압', v: '230V · G타입' }],
  [{ icon: 'cal', k: '공휴일', v: '연 8일 내외' }, { icon: 'pin', k: '위치', v: '유럽 북서부' }],
];
const sights: { n: string; c: [string, string] }[] = [
  { n: '빅벤', c: ['#8cc0ff', '#1e6fff'] }, { n: '타워브리지', c: ['#8fe0cf', '#22a199'] },
  { n: '대영박물관', c: ['#c7b3ff', '#7a5af8'] }, { n: '런던 아이', c: ['#ffc58f', '#ff7a45'] },
];
const holidays = [['12/25', '크리스마스'], ['12/26', '박싱데이'], ['1/1', '새해 첫날']];

export default function Info() {
  const { t } = useTheme();
  return (
    <TipPage title="기본정보">
      <View style={[{ backgroundColor: t.card, borderRadius: 26, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }, shadow(t)]}>
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
          <T size={16} w="b" color={t.acc}>UK</T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T size={22} w="b" ls={-2}>영국</T>
          <T size={13} sub>United Kingdom</T>
          <T size={13}>수도 런던 · 인구 약 6,800만</T>
        </View>
      </View>
      <View style={{ gap: 10 }}>
        {facts.map((r, i) => (
          <Row key={i} gap={10} align="flex-start">
            {r.map((f) => (
              <View key={f.k} style={[{ flex: 1, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12, gap: 4 }, shadow(t)]}>
                <Row gap={6}><Icon name={f.icon} size={16} color={t.acc} /><T size={12} sub>{f.k}</T></Row>
                <T size={14} w="b">{f.v}</T>
              </View>
            ))}
          </Row>
        ))}
      </View>
      <H16 title="주요 도시" />
      <Row gap={8}>
        {['런던', '맨체스터', '에든버러', '리버풀'].map((c, i) => (
          <View key={c} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: i === 0 ? t.acc : t.card, borderWidth: i === 0 ? 0 : 1, borderColor: t.line }}>
            <T size={13} w={i === 0 ? 'b' : 'm'} color={i === 0 ? '#fff' : t.text}>{c}</T>
          </View>
        ))}
      </Row>
      <H16 title="주요 관광지" right="가로로 스크롤" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 150, marginHorizontal: -20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
        {sights.map((s) => (
          <View key={s.n} style={{ width: 132, height: 150, borderRadius: 22, overflow: 'hidden', justifyContent: 'flex-end', paddingBottom: 12, paddingHorizontal: 12, backgroundColor: s.c[1] }}>
            {/* 그라데이션 라이브러리 없이: 위쪽 밝은 면 겹침으로 근사 */}
            <View style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 75, backgroundColor: s.c[0], opacity: 0.55 }} />
            <T size={15} w="b" color="#fff">{s.n}</T>
          </View>
        ))}
      </ScrollView>
      <H16 title="공휴일" right="2026–27" />
      <Box gap={10} radius={20}>
        {holidays.map(([d, n]) => (
          <Row key={d} gap={12}><T size={14} w="b" color={t.acc} style={{ width: 48 }}>{d}</T><T size={14} style={{ flex: 1 }}>{n}</T></Row>
        ))}
      </Box>
    </TipPage>
  );
}
