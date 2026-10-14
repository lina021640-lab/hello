import { useState } from 'react';
import { View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, T, Row, Icon, useTheme } from '../../src/kit';
import { WorldDots } from '../../src/components/WorldDots';

const W = Dimensions.get('window').width;
const CARD_W = 321, GAP = 26;
// 원본 더미: 유럽 여행 / 도쿄
const homeTrips = [
  { id: 'eu', name: '유럽 여행', range: '2026.11.20 -2026.12.29', sub: '영국 프랑스 독일 이탈리아', avatars: ['#ff8a4c', '#5ac8fa', '#f5c16c'] },
  { id: 'tyo', name: '도쿄', range: '2026.11.10 -2026.12.11', sub: '일본', avatars: ['#9be18f', '#ff8a4c'] },
];

export default function Home() {
  const { t } = useTheme(); const r = useRouter();
  const [idx, setIdx] = useState(0);
  const dark = t.mode === 'dark';
  return (
    <Page tab scroll={false} pad={0} bg={dark ? t.bg : '#f8f9fe'}>
      {/* 연한 하늘색 글로우 배경 */}
      <View pointerEvents="none" style={{ position: 'absolute', left: -60, top: -40, width: W + 120, height: 520 }}>
        <View style={{ position: 'absolute', right: -40, top: -20, width: 320, height: 320, borderRadius: 160, backgroundColor: '#00b7ff', opacity: dark ? 0.04 : 0.07 }} />
        <View style={{ position: 'absolute', left: 10, top: 200, width: 280, height: 280, borderRadius: 140, backgroundColor: '#2c1bff', opacity: dark ? 0.04 : 0.035 }} />
        <View style={{ position: 'absolute', left: 130, top: 330, width: 300, height: 200, borderRadius: 100, backgroundColor: '#d4e3ff', opacity: dark ? 0.05 : 0.3 }} />
      </View>
      <View style={{ paddingHorizontal: 21 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 10 }}>
          <T size={22} ls={-1} style={{ marginLeft: 2, marginTop: 7 }}>{'oo님! '}</T>
          <Pressable onPress={() => r.push('/my')} style={{ width: 48, height: 47, borderRadius: 24, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginRight: 0, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 9, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
            <Icon name="user" size={26} color="#fff" />
          </Pressable>
        </Row>
        <T size={39} ls={-1} lh={50} style={{ marginTop: 4 }}>{'이번 여행은\n어디로 가나요?'}</T>
        <Pressable onPress={() => r.push('/trip/new')} style={{ alignSelf: 'flex-start', marginTop: 18, height: 40, paddingHorizontal: 15, borderRadius: 31, backgroundColor: '#000', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 9, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
          <T size={16} w="r" color="#fff">+ 여행 추가</T>
        </Pressable>
      </View>
      {/* 지도: 원본은 래스터 일러스트 → 도트맵으로 대체 */}
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <WorldDots highlight={idx} width={W - 24} />
      </View>
      <ScrollView horizontal snapToInterval={CARD_W + GAP} decelerationRate="fast" showsHorizontalScrollIndicator={false} scrollEventThrottle={16}
        onScroll={(e) => setIdx(Math.max(0, Math.min(homeTrips.length - 1, Math.round(e.nativeEvent.contentOffset.x / (CARD_W + GAP)))))}
        contentContainerStyle={{ paddingHorizontal: 21, gap: GAP, paddingBottom: 106 - 92 + 20, paddingTop: 10 }} style={{ flexGrow: 0, marginTop: 'auto' }}>
        {homeTrips.map((tr, i) => {
          const on = i === idx;
          return (
            <View key={tr.id} style={{ width: CARD_W, height: 265, borderRadius: 40, backgroundColor: t.card, padding: 15, opacity: on ? 1 : 0.8, shadowColor: '#1a264d', shadowOpacity: dark ? 0 : 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Row>
                  {tr.avatars.map((c, k) => (
                    <View key={k} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c, borderWidth: 0.5, borderColor: '#fff', marginLeft: k ? -14 : 0, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="photo" size={20} color="rgba(255,255,255,0.8)" />
                    </View>
                  ))}
                </Row>
                <Pressable onPress={() => r.push('/schedule')} style={{ height: 43, width: 121, borderRadius: 31, backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <T size={16} color="#fff" ls={-1}>바로가기</T>
                  <View style={{ transform: [{ rotate: '45deg' }] }}><Icon name="arrow" size={18} color="#fff" /></View>
                </Pressable>
              </Row>
              <T size={15} color={on ? 'rgba(60,60,60,0.65)' : '#d9d9d9'} ls={-1} style={{ marginTop: 20 }}>{tr.range}</T>
              <T size={35} ls={-1} color={on ? t.text : '#d9d9d9'} style={{ marginTop: 6 }}>{tr.name}</T>
              <T size={15} w="l" color={on ? t.text : '#d9d9d9'} style={{ marginTop: 2 }}>{tr.sub}</T>
              <Pressable onPress={() => r.push('/trip/edit')} style={{ position: 'absolute', left: 15, bottom: 22, height: 43, width: 128, borderRadius: 54, backgroundColor: '#737373', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="pencil" size={15} color="#fff" />
                <T size={15} color="#fff" ls={-1}>여행 수정하기</T>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </Page>
  );
}
