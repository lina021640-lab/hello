import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, TabTitle, T, Row, Icon, shadow, useGo, useTheme, IconName } from '../../src/kit';
import { FlagCircle } from '../../src/screens/tips/parts';

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

// 더미 여행: 유럽 여행 (영국 → 프랑스 → 이탈리아)
const countries = [
  { code: 'GB', name: '영국', sub: '이번 여행 · 런던 외 2개 도시', tip: '런던 대중교통은 컨택리스 카드 하나면 끝', tipSub: '탭 한 번으로 지하철·버스 이용, 하루 요금 상한까지 자동 적용' },
  { code: 'FR', name: '프랑스', sub: '이번 여행 · 파리 외 2개 도시', tip: '파리 지하철은 나비고 패스로 편하게', tipSub: '주간 정액권으로 지하철·버스·RER을 무제한 이용' },
  { code: 'IT', name: '이탈리아', sub: '이번 여행 · 로마 외 2개 도시', tip: '기차 탑승 전 펀칭 기계에 티켓 찍기', tipSub: '레조날레 티켓은 개시 도장이 없으면 벌금이 부과돼요' },
];
const codeParam = (p?: string) => Math.max(0, countries.findIndex((c) => c.code === (p ?? '').toUpperCase()));

export default function Tips() {
  const go = useGo(); const { t } = useTheme();
  const { country } = useLocalSearchParams<{ country?: string }>();
  const [sel, setSel] = useState(codeParam(country));
  useEffect(() => { if (country) setSel(codeParam(country)); }, [country]);
  const cur = countries[sel];
  const rows = [cats.slice(0, 3), cats.slice(3, 6), cats.slice(6, 9)];
  return (
    <Page tab gap={12}>
      <View style={{ marginTop: 15, gap: 2 }}>
        <T size={30} w="b" ls={-4}>꿀팁</T>
        <T size={14} sub>여행지에서 바로 쓰는 나라별 정보</T>
      </View>
      <View style={{ height: 17 }} />
      <View style={[{ backgroundColor: t.card, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 12, paddingVertical: 12 }, shadow(t)]}>
        <View style={{ flex: 1, gap: 1 }}>
          <T size={17} w="b">{cur.name}</T>
          <T size={12} sub>{cur.sub}</T>
        </View>
        <Row gap={8}>
          {countries.map((c, i) => (
            <Pressable key={c.code} onPress={() => setSel(i)} accessibilityLabel={c.name} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: i === sel ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center', opacity: i === sel ? 1 : 0.85 }}>
              <FlagCircle code={c.code} size={36} />
            </Pressable>
          ))}
        </Row>
      </View>
      <View style={{ backgroundColor: t.acc, borderRadius: 26, paddingHorizontal: 18, paddingVertical: 16, gap: 4 }}>
        <T size={12} w="b" color="rgba(255,255,255,0.85)">오늘의 꿀팁</T>
        <T size={17} w="b" color="#fff">{cur.tip}</T>
        <T size={12} color="rgba(255,255,255,0.9)">{cur.tipSub}</T>
      </View>
      <T size={16} w="b">{cur.name} 카테고리</T>
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
    </Page>
  );
}
