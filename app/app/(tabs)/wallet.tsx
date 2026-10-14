import { View } from 'react-native';
import { Page, TabTitle, Pill, Card, T, Row, Icon, IconTile, SectionHead, useGo, useTheme, IconName } from '../../src/kit';

const recent: { icon: IconName; title: string; sub: string; amt: string; krw: string }[] = [
  { icon: 'food', title: '버러 마켓 점심', sub: '카드 · 11/20', amt: '£18.50', krw: '≈ 34,077원' },
  { icon: 'bus', title: '지하철 (Oyster)', sub: '카드 · 11/20', amt: '£8.40', krw: '≈ 15,473원' },
  { icon: 'bag', title: '기념품 키링', sub: '현금 · 11/20', amt: '£12.00', krw: '≈ 22,104원' },
];

export default function Wallet() {
  const go = useGo(); const { t } = useTheme();
  const actions: { icon: IconName; label: string; to: string }[] = [
    { icon: 'plus', label: '지출 추가', to: '/wallet/add' },
    { icon: 'swap', label: '환율 계산', to: '/wallet/rate' },
    { icon: 'users', label: '정산하기', to: '/wallet/settle' },
  ];
  return (
    <Page tab gap={12}>
      <TabTitle title="지갑" right={<Pill label="유럽여행" trail="down" onPress={() => go('/trip/edit')} />} />
      {/* budget hero */}
      <View style={{ backgroundColor: t.acc, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 18, gap: 7, minHeight: 191 }}>
        <T size={14} color="rgba(255,255,255,0.85)">총 지출</T>
        <T size={36} w="b" ls={-3} color="#fff">1,284,500원</T>
        <T size={13} color="rgba(255,255,255,0.9)">예산 3,000,000원 중 43%</T>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.28)' }}>
          <View style={{ height: 8, width: '43%', borderRadius: 4, backgroundColor: '#fff' }} />
        </View>
        <Row gap={24} style={{ paddingTop: 10 }}>
          <View style={{ gap: 2 }}><T size={12} color="rgba(255,255,255,0.8)">오늘</T><T size={15} w="b" color="#fff">86,400원</T></View>
          <View style={{ gap: 2 }}><T size={12} color="rgba(255,255,255,0.8)">남은 예산</T><T size={15} w="b" color="#fff">1,715,500원</T></View>
        </Row>
      </View>
      {/* quick actions */}
      <Row gap={10} align="stretch">
        {actions.map((a) => (
          <Card key={a.label} onPress={() => go(a.to)} radius={22} pad={0} style={{ flex: 1, alignItems: 'center', gap: 8, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 8 }}>
            <IconTile name={a.icon} size={44} icon={22} />
            <T size={13}>{a.label}</T>
          </Card>
        ))}
      </Row>
      {/* exchange */}
      <Card radius={20} pad={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T size={12} sub>오늘의 환율</T>
          <T size={15} w="b">£1 = 1,842원 · €1 = 1,610원</T>
        </View>
        <Pill label="09:00 기준" size={12} py={5} px={10} />
      </Card>
      <SectionHead title="최근 지출" link="전체보기" onLink={() => go('/wallet/country')} />
      <Card style={{ gap: 14 }}>
        {recent.map((r) => (
          <Row key={r.title} gap={12}>
            <IconTile name={r.icon} size={40} icon={20} radius={20} />
            <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">{r.title}</T><T size={12} sub>{r.sub}</T></View>
            <View style={{ alignItems: 'flex-end', gap: 1 }}><T size={15} w="b">{r.amt}</T><T size={12} sub>{r.krw}</T></View>
          </Row>
        ))}
      </Card>
    </Page>
  );
}
