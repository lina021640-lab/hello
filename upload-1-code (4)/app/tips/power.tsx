import { View } from 'react-native';
import { T, Row, Icon, shadow, useTheme } from '../../src/kit';
import { TipPage, BulletCard, Box } from '../../src/screens/tips/parts';

const opts = [
  { n: 'eSIM', rec: true, p: '£10–20 / 7일 (예시)', d: '설치가 간편하고 한국 번호 유지에 유리' },
  { n: '현지 유심', p: '£15–25 / 30일 (예시)', d: '데이터가 넉넉하지만 교체가 필요해요' },
  { n: '로밍', p: '일 1만~1.5만원대 (예시)', d: '가장 편하지만 비용이 높아요' },
];

export default function Power() {
  const { t } = useTheme();
  return (
    <TipPage title="전압·통신">
      <View style={[{ backgroundColor: t.card, borderRadius: 26, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16 }, shadow(t)]}>
        <View style={{ width: 84, height: 84, borderRadius: 20, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plug" size={44} color={t.acc} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T size={24} w="b" ls={-2}>230V · 50Hz</T>
          <T size={14} sub>플러그 G타입 (3핀)</T>
          <T size={12} sub lh={17}>한국 220V 기기는 대부분 어댑터만 있으면 돼요</T>
        </View>
      </View>
      <BulletCard icon="bolt" title="준비물" items={['멀티 어댑터(G타입 지원)를 꼭 챙기세요', '헤어드라이어·고데기는 전압 표기를 확인하세요', '숙소에 어댑터를 빌려주는 경우도 있어요']} />
      <T size={16} w="b">통신 선택지</T>
      {opts.map((o) => (
        <Box key={o.n} radius={20} gap={4}>
          <Row gap={8}>
            <T size={15} w="b" style={{ flex: 1 }}>{o.n}</T>
            {o.rec ? <View style={{ backgroundColor: t.acc, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}><T size={11} w="b" color="#fff">추천</T></View> : null}
          </Row>
          <T size={13} w="b" color={t.acc}>{o.p}</T>
          <T size={12} sub>{o.d}</T>
        </Box>
      ))}
      <BulletCard icon="wifi" title="와이파이 팁" items={['공용 와이파이에서는 결제·로그인을 피하세요', '카페·지하철역 와이파이는 VPN과 함께 쓰는 게 안전해요']} />
    </TipPage>
  );
}
