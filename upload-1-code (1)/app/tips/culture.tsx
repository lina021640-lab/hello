import { View } from 'react-native';
import { T, Row, Icon, useTheme } from '../../src/kit';
import { TipPage, Chips, BulletCard } from '../../src/screens/tips/parts';

export default function Culture() {
  const { t } = useTheme();
  const dark = t.mode === 'dark';
  const okBg = dark ? t.ok + '26' : '#e3f6e8';
  return (
    <TipPage title="문화">
      <Chips items={['생활', '예절', '날씨', '엔터']} />
      <BulletCard icon="users" title="줄 서기(Queueing)" items={['어디서든 줄을 서는 문화예요. 새치기는 큰 실례예요', '줄이 보이지 않아도 앞사람 뒤에 서세요']} />
      <BulletCard icon="food" title="펍 문화" items={['테이블 서비스 없이 바에서 직접 주문하고 결제하는 곳이 많아요', '일행끼리 돌아가며 한 번씩 사는 “라운드” 문화가 있어요']} />
      <BulletCard icon="globe" title="일상 대화" items={['날씨 이야기는 가장 무난한 대화 주제예요', '“Sorry”, “Thank you”를 자주 쓰면 좋은 인상을 줘요']} />
      <Row gap={10} align="flex-start">
        <View style={{ flex: 1, backgroundColor: okBg, borderRadius: 22, padding: 14, gap: 6 }}>
          <Row gap={6}><Icon name="check" size={16} color={t.ok} /><T size={14} w="b" color={t.ok}>이렇게 하세요</T></Row>
          <T size={13}>차례 지키기</T>
          <T size={13}>조용히 대화하기</T>
        </View>
        <View style={{ flex: 1, backgroundColor: t.badS, borderRadius: 22, padding: 14, gap: 6 }}>
          <Row gap={6}><Icon name="x" size={16} color={t.bad} /><T size={14} w="b" color={t.bad}>피하세요</T></Row>
          <T size={13}>큰 소리 통화</T>
          <T size={13}>새치기</T>
        </View>
      </Row>
      <BulletCard icon="info" title="상점·영업시간" items={['일요일에는 단축 영업하는 상점이 많아요', '공휴일 전후에는 영업시간을 미리 확인하세요']} />
    </TipPage>
  );
}
