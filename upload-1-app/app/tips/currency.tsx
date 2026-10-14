import { View, ScrollView, Pressable } from 'react-native';
import { T, Row, Icon, shadow, useGo, useTheme } from '../../src/kit';
import { TipPage, Box, BulletCard, H16 } from '../../src/screens/tips/parts';

const notes: { n: string; c: [string, string] }[] = [
  { n: '£5', c: ['#9fd8c8', '#2b8a78'] }, { n: '£10', c: ['#ffc58f', '#e8742c'] },
  { n: '£20', c: ['#b9a7f0', '#6a49d6'] }, { n: '£50', c: ['#f3a8b8', '#d6456b'] },
];
const coins = ['1p', '2p', '5p', '10p', '20p', '50p', '£1', '£2'];

export default function Currency() {
  const { t } = useTheme(); const go = useGo();
  return (
    <TipPage title="통화">
      <View style={{ backgroundColor: t.acc, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 18, gap: 4, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 230, top: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.14)' }} />
        <T size={13} w="b" color="rgba(255,255,255,0.85)">영국 파운드 (GBP · £)</T>
        <T size={32} w="b" ls={-3} color="#fff">£1 ≈ 1,842원</T>
        <T size={12} color="rgba(255,255,255,0.9)">최근 30일 평균 1,830원 · 09:00 기준</T>
      </View>
      <H16 title="지폐" right="가로로 스크롤" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 96, flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
        {notes.map((n) => (
          <View key={n.n} style={{ width: 166, height: 92, borderRadius: 14, overflow: 'hidden', backgroundColor: n.c[1], alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 10, paddingRight: 14 }}>
            <View style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 46, backgroundColor: n.c[0], opacity: 0.55 }} />
            <T size={30} w="b" color="#fff">{n.n}</T>
          </View>
        ))}
      </ScrollView>
      <T size={11} sub>※ 일러스트는 실제 지폐 디자인이 아닌 예시입니다</T>
      <Box gap={10}>
        <T size={15} w="b">단위</T>
        <T size={13}>1파운드(£) = 100펜스(p)</T>
        <Row gap={6} style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {coins.map((c) => (
            <View key={c} style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }}>
              <T size={12}>{c}</T>
            </View>
          ))}
        </Row>
      </Box>
      <BulletCard icon="coin" title="ATM·환전 팁" items={['ATM에서 “현지 통화로 결제”를 선택하면 수수료가 덜 붙어요', '공항 환전소는 환율이 불리한 편이에요', '내 카드의 해외 결제 수수료를 미리 확인하세요']} />
      <Pressable onPress={() => go('/wallet/rate')} style={{ height: 52, borderRadius: 26, backgroundColor: t.acc, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18 }}>
        <Icon name="swap" size={18} color="#fff" />
        <T size={16} w="b" color="#fff">환율 계산하기</T>
      </Pressable>
    </TipPage>
  );
}
