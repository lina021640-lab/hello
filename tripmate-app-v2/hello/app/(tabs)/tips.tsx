import { View, Pressable } from 'react-native';
import { Page, TabTitle, T, Row, Icon, Pill, shadow, useGo, useTheme, IconName } from '../../src/kit';

const cats: { icon: IconName; label: string; to: string; red?: boolean }[] = [
  { icon: 'info', label: '기본정보', to: '/tips/info' },
  { icon: 'bus', label: '교통', to: '/tips/transport' },
  { icon: 'food', label: '음식', to: '/tips/food' },
  { icon: 'chat', label: '언어', to: '/tips/lang' },
  { icon: 'coin', label: '통화', to: '/tips/currency' },
  { icon: 'shield', label: '긴급', to: '/tips/emergency', red: true },
  { icon: 'globe', label: '문화', to: '/tips/culture' },
  { icon: 'bolt', label: '전압·통신', to: '/tips/power' },
  { icon: 'users', label: '매너·팁', to: '/tips/manner' },
];

export default function Tips() {
  const go = useGo(); const { t } = useTheme();
  const rows = [cats.slice(0, 3), cats.slice(3, 6), cats.slice(6, 9)];
  return (
    <Page tab gap={12}>
      <View style={{ marginTop: 15, gap: 2 }}>
        <T size={30} w="b" ls={-4}>꿀팁</T>
        <T size={14} sub>여행지에서 바로 쓰는 나라별 정보</T>
      </View>
      <View style={{ height: 17 }} />
      <View style={[{ backgroundColor: t.card, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 12, paddingRight: 16, paddingVertical: 12 }, shadow(t)]}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
          <T size={13} w="b" color={t.acc}>UK</T>
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <T size={17} w="b">영국</T>
          <T size={12} sub>이번 여행 · 런던 외 2개 도시</T>
        </View>
        <Pill label="나라 변경" trail="down" size={12} py={5} px={14} />
      </View>
      <Row gap={8} style={{ height: 44, backgroundColor: t.card, borderRadius: 22, borderWidth: 1, borderColor: t.line, paddingHorizontal: 16 }}>
        <Icon name="search" size={18} color={t.sub} />
        <T size={14} sub style={{ flex: 1 }}>다른 나라·도시 검색</T>
      </Row>
      <T size={16} w="b">카테고리</T>
      <View style={{ gap: 10 }}>
        {rows.map((r, i) => (
          <Row key={i} gap={10} align="flex-start">
            {r.map((c) => (
              <Pressable key={c.label} onPress={() => go(c.to)} style={[{ flex: 1, backgroundColor: t.card, borderRadius: 20, alignItems: 'center', gap: 8, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 4 }, shadow(t)]}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.red ? t.badS : t.accS, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={c.icon} size={22} color={c.red ? t.bad : t.acc} />
                </View>
                <T size={13} w="b">{c.label}</T>
              </Pressable>
            ))}
          </Row>
        ))}
      </View>
      <View style={{ backgroundColor: t.acc, borderRadius: 26, paddingHorizontal: 18, paddingVertical: 16, gap: 4 }}>
        <T size={12} w="b" color="rgba(255,255,255,0.85)">오늘의 꿀팁</T>
        <T size={17} w="b" color="#fff">런던 대중교통은 컨택리스 카드 하나면 끝</T>
        <T size={12} color="rgba(255,255,255,0.9)">탭 한 번으로 지하철·버스 이용, 하루 요금 상한까지 자동 적용</T>
      </View>
    </Page>
  );
}
