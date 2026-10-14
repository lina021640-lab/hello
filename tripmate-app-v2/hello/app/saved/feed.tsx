import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Icon, PhotoPH, Pill, useGo, useTheme, shadow } from '../../src/kit';
import { SegTabs, Chip, ActionBtn, MapBg, Bubble } from '../../src/screens/saved/parts';

const filters = ['전체', '맛집', '카페', '명소', '쇼핑'];
const cards = [
  { n: '버러 마켓', m: '런던 · 시장 · ★4.6', q: '“평일 오전이 한가해요”', by: '민수 · 3일 전', h: 128, b: 56 },
  { n: '에펠탑 전망대', m: '파리 · 명소 · ★4.7', q: '“일몰 30분 전에 올라가세요”', by: '지연 · 1주 전', h: 94, b: 41 },
];

export default function Feed() {
  const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [f, setF] = useState(0);
  const top = Math.max(ins.top, 37) + 15;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapBg />
      <View style={{ position: 'absolute', left: 35, width: 320, top }}><SegTabs active={1} floating /></View>
      <Bubble label="버러 마켓" left={34} top={140} />
      <Bubble label="에펠탑 전망대" left={214} top={112} />
      <Bubble label="두오모 쿠폴라" left={150} top={226} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 300, bottom: 0, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden', ...shadow(t) }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20, gap: 12, paddingBottom: 24 + ins.bottom }}>
          <View style={{ alignItems: 'center' }}><View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} /></View>
          <Row>
            <View style={{ flex: 1 }}>
              <T size={20} w="b" ls={-2}>공유 피드</T>
              <T size={12} sub>친구들이 가고 싶어 한 장소</T>
            </View>
            <Pill label="인기순" trail="down" size={13} />
          </Row>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
            {filters.map((x, i) => <Chip key={x} label={x} active={i === f} onPress={() => setF(i)} />)}
          </ScrollView>
          {cards.map((c) => (
            <View key={c.n} style={{ backgroundColor: t.card2, borderRadius: 22, padding: 14, gap: 10 }}>
              <Row gap={12} align="flex-start">
                <PhotoPH w={72} h={72} radius={16} iconSize={29} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T size={16} w="b" onPress={() => go('/saved/place')}>{c.n}</T>
                  <T size={12} sub>{c.m}</T>
                  <T size={13}>{c.q}</T>
                  <T size={11} sub>{c.by}</T>
                </View>
              </Row>
              <Row gap={12}>
                <Row gap={4}><Icon name="heart" size={16} color={t.sub} /><T size={12} sub>{c.h}</T></Row>
                <Row gap={4}><Icon name="bookmark" size={16} color={t.sub} /><T size={12} sub>{c.b}</T></Row>
                <View style={{ flex: 1 }} />
                <ActionBtn kind="ghost" h={36} size={12} label="구글맵 보기" icon="pin" onPress={() => go('/saved/openmap')} style={{ paddingHorizontal: 12, gap: 4 }} />
                <ActionBtn kind="lime" h={36} size={12} label="장소 추가" icon="plus" onPress={() => go('/saved/add-to-schedule')} style={{ paddingHorizontal: 14 }} />
              </Row>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
