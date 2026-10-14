import { View } from 'react-native';
import { T, Row, Divider, useTheme } from '../../src/kit';
import { TipPage, Chips, Banner, BulletCard, Box } from '../../src/screens/tips/parts';

const cmp = [
  ['일 요금 상한', '£8.90 (예시)', '£8.90 (예시)'],
  ['준비물', '해외결제 카드', '카드 구매·충전'],
  ['추천', '대부분의 여행자', '장기 체류·잔액 관리'],
];

export default function Transport() {
  const { t } = useTheme();
  return (
    <TipPage title="교통">
      <Chips items={['지하철', '버스', '기차', '택시']} />
      <Banner label="한눈에 보기" title="패스 없이 컨택리스 결제가 기본" desc="사용한 만큼 자동 청구되고, 하루·주간 요금 상한이 적용돼요" />
      <BulletCard icon="wallet" title="결제 방법" items={['컨택리스 카드·모바일 결제로 바로 탑승', '오이스터 카드는 선택 사항(여행자용 보증금 있음)', '입·출구에서 같은 카드로 태그해야 요금이 정상 계산돼요']} />
      <Box gap={10}>
        <T size={15} w="b">컨택리스 vs 오이스터</T>
        <Row gap={8} align="flex-start">
          <View style={{ width: 70 }} />
          <T size={12} w="b" color={t.acc} style={{ flex: 1 }}>컨택리스</T>
          <T size={12} w="b" color={t.acc} style={{ flex: 1 }}>오이스터</T>
        </Row>
        {cmp.map(([k, a, b]) => (
          <View key={k} style={{ gap: 10 }}>
            <Divider />
            <Row gap={8} align="flex-start">
              <T size={12} sub style={{ width: 70 }}>{k}</T>
              <T size={13} style={{ flex: 1 }}>{a}</T>
              <T size={13} style={{ flex: 1 }}>{b}</T>
            </Row>
          </View>
        ))}
      </Box>
      <BulletCard icon="clock" title="이동 시간 예시" items={['히스로공항 → 시내: 엘리자베스 라인 약 30분', '시내 지하철 한 구간: 보통 3~10분', '심야 운행은 노선·요일마다 달라요']} />
      <BulletCard icon="info" title="이용 팁" items={['에스컬레이터에서는 오른쪽에 서세요', '막차·운행 중단 안내는 앱에서 미리 확인', '지연이 잦은 노선은 대체 경로를 함께 저장']} />
    </TipPage>
  );
}
