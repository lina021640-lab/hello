import { View } from 'react-native';
import { T, Row, Divider } from '../../src/kit';
import { TipPage, Banner, BulletCard, Box } from '../../src/screens/tips/parts';
import { useTheme } from '../../src/kit';

const guide = [['식당', '서비스 요금 미포함 시 10~12.5%'], ['택시', '잔돈 반올림 또는 10%'], ['호텔 짐 운반', '£1~2'], ['펍 (바 주문)', '보통 필요 없어요']];

export default function Manner() {
  const { t } = useTheme();
  return (
    <TipPage title="매너·팁">
      <Banner label="한눈에 보기" title="팁은 필수가 아니에요" desc="서비스 요금이 포함됐는지 영수증을 먼저 확인하세요" titleSize={20} />
      <Box gap={12}>
        <T size={15} w="b">상황별 팁 가이드</T>
        {guide.map(([k, v], i) => (
          <View key={k} style={{ gap: 12 }}>
            {i > 0 ? <Divider /> : null}
            <Row gap={8}>
              <T size={14} w="b" style={{ width: 96 }}>{k}</T>
              <T size={13} color={t.acc} style={{ flex: 1 }}>{v}</T>
            </Row>
          </View>
        ))}
      </Box>
      <BulletCard icon="users" title="기본 매너" items={['“Please”, “Thank you”를 습관처럼 말하세요', '부딪히면 먼저 “Sorry”라고 하는 게 자연스러워요', '에스컬레이터는 오른쪽에 서고 왼쪽은 비워 두세요']} />
      <BulletCard icon="food" title="식당·펍 매너" items={['펍은 바에서 주문하고 바로 결제해요', '식사 중 큰 소리로 통화하는 건 피하세요', '계산서는 “Could I have the bill?”로 요청해요']} />
    </TipPage>
  );
}
