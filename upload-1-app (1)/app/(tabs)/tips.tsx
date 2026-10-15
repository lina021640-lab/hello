import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, TabTitle, T, Row, Icon, shadow, useGo, useTheme, IconName } from '../../src/kit';
import { FlagCircle, lastCountry, setLastCountry } from '../../src/screens/tips/parts';
import { EmptyCard } from '../../src/screens/empty/EmptyCard';
import { useAuth } from '../../src/data/authStore';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { countryKo, flag } from '../../src/data/cities';

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

// 상세 팁이 준비된 나라 (그 외 나라는 '준비 중' 카드)
const TIPS: Record<string, { tip: string; tipSub: string }> = {
  GB: { tip: '런던 대중교통은 컨택리스 카드 하나면 끝', tipSub: '탭 한 번으로 지하철·버스 이용, 하루 요금 상한까지 자동 적용' },
  FR: { tip: '파리 지하철은 나비고 패스로 편하게', tipSub: '주간 정액권으로 지하철·버스·RER을 무제한 이용' },
  IT: { tip: '기차 탑승 전 펀칭 기계에 티켓 찍기', tipSub: '레조날레 티켓은 개시 도장이 없으면 벌금이 부과돼요' },
};

export default function Tips() {
  const go = useGo(); const { t } = useTheme();
  useAuth();
  const view = useCurrentTrip();
  const { country } = useLocalSearchParams<{ country?: string }>();
  const countries = (() => {
    const out: { code: string; name: string; sub: string }[] = [];
    (view?.trip.cities ?? []).forEach((c) => {
      if (!c.cc || out.some((x) => x.code === c.cc)) return;
      const ofCountry = view!.trip.cities.filter((d) => d.cc === c.cc);
      out.push({ code: c.cc, name: c.country || countryKo(c.cc) || c.cc, sub: `이번 여행 · ${c.city}${ofCountry.length > 1 ? ` 외 ${ofCountry.length - 1}개 도시` : ''}` });
    });
    return out;
  })();
  const idx = (p?: string) => Math.max(0, countries.findIndex((c) => c.code === (p ?? '').toUpperCase()));
  const [sel, setSel] = useState(0);
  useEffect(() => { setSel(idx(country ?? lastCountry())); }, [country, countries.map((c) => c.code).join()]);
  const cur = countries[Math.min(sel, countries.length - 1)];
  useEffect(() => { if (cur) setLastCountry(cur.code); }, [cur?.code]);
  if (!view || !cur) {
    return (
      <Page tab gap={12}>
        <View style={{ marginTop: 35, gap: 2 }}>
          <T size={30} w="b" ls={-4}>꿀팁</T>
          <T size={14} sub>여행지에서 바로 쓰는 나라별 정보</T>
        </View>
        <View style={{ height: 5 }} />
        <EmptyCard emoji="💡" title={view ? '여행에 도시를 추가해 주세요' : '여행을 먼저 추가해 주세요'}
          body={view ? '도시를 추가하면 그 나라의 꿀팁을 보여드려요.' : '여행지가 정해지면 그 나라의 꿀팁을 보여드려요.'}
          cta={view ? '여행 수정' : '여행 추가'} onCta={() => go(view ? '/trip/edit' : '/trip/new')} />
      </Page>
    );
  }
  const info = TIPS[cur.code];
  const rows = [cats.slice(0, 3), cats.slice(3, 6), cats.slice(6, 9)];
  return (
    <Page tab gap={12}>
      <View style={{ marginTop: 35, gap: 2 }}>
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
          {countries.slice(0, 5).map((c, i) => (
            <Pressable key={c.code} onPress={() => setSel(i)} accessibilityLabel={c.name} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: i === sel ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center', opacity: i === sel ? 1 : 0.85 }}>
              <FlagCircle code={c.code} size={36} />
            </Pressable>
          ))}
        </Row>
      </View>
      {info ? (
        <>
          <View style={{ backgroundColor: t.acc, borderRadius: 26, paddingHorizontal: 18, paddingVertical: 16, gap: 4 }}>
            <T size={12} w="b" color="rgba(255,255,255,0.85)">오늘의 꿀팁</T>
            <T size={17} w="b" color="#fff">{info.tip}</T>
            <T size={12} color="rgba(255,255,255,0.9)">{info.tipSub}</T>
          </View>
          <T size={16} w="b">{cur.name} 카테고리</T>
          <View style={{ gap: 10 }}>
            {rows.map((r, i) => (
              <Row key={i} gap={10} align="flex-start">
                {r.map((c) => (
                  <Pressable key={c.label} onPress={() => go(`${c.to}?c=${cur.code}`)} style={[{ flex: 1, backgroundColor: t.card, borderRadius: 20, alignItems: 'center', gap: 8, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 4 }, shadow(t)]}>
                    <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.red ? t.badS : t.accS, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={c.icon} size={22} color={c.red ? t.bad : t.acc} />
                    </View>
                    <T size={13} w="b">{c.label}</T>
                  </Pressable>
                ))}
              </Row>
            ))}
          </View>
        </>
      ) : (
        <EmptyCard emoji={flag(cur.code)} title={`${cur.name} 꿀팁은 준비 중이에요`} body="교통·음식·통화 같은 나라별 정보를 곧 채워 드릴게요." />
      )}
    </Page>
  );
}
