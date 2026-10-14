import { View } from 'react-native';
import { T, Row, Icon, PhotoPH, shadow, useTheme } from '../../src/kit';
import { TipPage, Chips, BulletCard, Box } from '../../src/screens/tips/parts';

const dishes = [
  { n: '피시 앤 칩스', d: '튀긴 흰살생선과 감자튀김. 펍과 전문점 어디서나 만날 수 있어요', p: '£12–16' },
  { n: '선데이 로스트', d: '일요일에 먹는 구운 고기 정식. 예약이 필요한 곳이 많아요', p: '£18–25' },
  { n: '풀 잉글리시 브렉퍼스트', d: '계란·베이컨·소시지·빈스가 나오는 든든한 아침', p: '£9–14' },
];

export default function Food() {
  const { t } = useTheme();
  return (
    <TipPage title="음식">
      <Chips items={['대표 음식', '길거리', '카페', '디저트']} />
      {dishes.map((d) => (
        <View key={d.n} style={[{ backgroundColor: t.card, borderRadius: 22, flexDirection: 'row', gap: 12, paddingLeft: 12, paddingRight: 14, paddingVertical: 12, alignItems: 'flex-start' }, shadow(t)]}>
          <PhotoPH w={84} h={84} radius={16} iconSize={34} />
          <View style={{ flex: 1, gap: 3 }}>
            <T size={16} w="b">{d.n}</T>
            <T size={12} sub lh={17}>{d.d}</T>
            <Row gap={8}><T size={13} w="b" color={t.acc}>{d.p}</T><T size={11} sub>1인 예상</T></Row>
          </View>
        </View>
      ))}
      <BulletCard icon="food" title="식당 이용 팁" items={['영수증에 “service charge”가 있으면 팁이 이미 포함된 거예요', '물은 “tap water, please”라고 하면 무료로 받을 수 있어요', '인기 식당은 최소 며칠 전에 예약하세요']} />
      <Box>
        <T size={15} w="b">알레르기 안내 문구</T>
        <Row gap={10} style={{ backgroundColor: t.bg, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={15} w="b">I have a peanut allergy.</T>
            <T size={12} sub>저는 땅콩 알레르기가 있어요.</T>
          </View>
          <Icon name="speaker" size={22} color={t.acc} />
        </Row>
      </Box>
    </TipPage>
  );
}
