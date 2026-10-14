import { View } from 'react-native';
import { T, Row, IconTile, Icon, shadow, useTheme } from '../../src/kit';
import { TipPage, BulletCard } from '../../src/screens/tips/parts';

const contacts = [['영사콜센터 (24시간)', '+82-2-3210-0404'], ['주영국 대한민국 대사관', '+44-XX-XXXX-XXXX (예시)']];

export default function Emergency() {
  const { t } = useTheme();
  const red = t.mode === 'dark' ? '#ff453a' : '#ff3b30';
  return (
    <TipPage title="긴급">
      <View style={{ backgroundColor: red, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 18, gap: 6 }}>
        <T size={13} w="b" color="rgba(255,255,255,0.9)">경찰 · 구급 · 소방</T>
        <Row>
          <T size={36} w="b" ls={-3} color="#fff" style={{ flex: 1 }}>999 / 112</T>
          {/* 시각 전용(실제 전화 연결 없음) */}
          <Row gap={6} style={{ backgroundColor: '#fff', height: 44, borderRadius: 22, paddingHorizontal: 18, justifyContent: 'center' }}>
            <Icon name="phone" size={18} color="#d62f26" />
            <T size={14} w="b" color="#d62f26">전화</T>
          </Row>
        </Row>
      </View>
      {contacts.map(([n, p]) => (
        <View key={n} style={[{ backgroundColor: t.card, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 14, paddingVertical: 14 }, shadow(t)]}>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={15} w="b">{n}</T>
            <T size={13} color={t.acc}>{p}</T>
          </View>
          <IconTile name="phone" size={40} icon={20} />
        </View>
      ))}
      <BulletCard icon="shield" danger title="여권을 잃어버렸어요" items={['가까운 경찰서에서 분실 신고서를 받으세요', '대사관·영사관에 연락해 임시 여권(여행증명서)을 신청하세요', '여권 사본과 사진을 클라우드에 미리 저장해 두세요']} />
      <BulletCard icon="shield" danger title="소매치기·도난" items={['카드는 즉시 카드사 앱에서 정지하세요', '경찰 신고서(Police report)는 여행자 보험 청구에 필요해요', '귀중품은 지퍼 있는 앞쪽 가방에 보관하세요']} />
      <BulletCard icon="info" title="아플 때" items={['응급이 아니면 NHS 111에 먼저 전화해 안내를 받을 수 있어요', '진료·약 영수증은 보험 청구를 위해 꼭 보관하세요']} />
    </TipPage>
  );
}
