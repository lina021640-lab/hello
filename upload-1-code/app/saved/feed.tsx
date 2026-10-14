import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppTabBar } from '../../src/components/AppTabBar';
import { T, Row, Icon, PhotoPH, useGo, useTheme } from '../../src/kit';
import { SegTabs, Chip, ActionBtn, EmojiMarker, MapLayer, MapSheet } from '../../src/screens/saved/parts';

const BLUE = '#1e6fff', ORANGE = '#ff9f0a', GREEN = '#34c759';
const filters = ['전체', '맛집', '카페', '명소', '쇼핑'];
/** 지도 마커 중심 좌표 (피그마 Light: 38px 마커 좌상단 + 19, 선택 🥐 50px 좌상단 + 25) */
const markers = [
  { e: '☕', x: 124, y: 297, c: BLUE }, { e: '🗼', x: 260, y: 237, c: BLUE }, { e: '🏛️', x: 326, y: 151, c: ORANGE },
  { e: '🌳', x: 178, y: 137, c: GREEN }, { e: '🛍️', x: 358, y: 357, c: ORANGE }, { e: '🍺', x: 98, y: 387, c: BLUE },
  { e: '🥐', x: 208, y: 377, c: BLUE },
];
const cards = [
  { n: '버러 마켓', e: '🥐', m: '런던 · 시장 · ★4.6', q: '“평일 오전이 한가해요”', by: '민수 · 3일 전', h: 128, b: 56, cat: '맛집' },
  { n: '에펠탑 전망대', e: '🗼', m: '파리 · 명소 · ★4.7', q: '“일몰 30분 전에 올라가세요”', by: '지연 · 1주 전', h: 94, b: 41, cat: '명소' },
];

/** C-02 공유 피드: 친구들이 공유한(추천한) 장소가 지도 마커로 표시되고, 카드/마커를 누르면 해당 장소가 선택된다 */
export default function Feed() {
  const go = useGo(); const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const tabH = 78 + Math.max(ins.bottom, 14);
  const [f, setF] = useState(0);
  const [sel, setSel] = useState('🥐');
  const top = Math.max(ins.top, 37) + 15;
  const list = cards.filter((c) => f === 0 || c.cat === filters[f]);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapLayer />
      {markers.map((m) => {
        const on = m.e === sel; const sz = on ? 50 : 38;
        return <EmojiMarker key={m.e} e={m.e} c={m.c} x={m.x - sz / 2} y={m.y - sz / 2} selected={on} onPress={() => (on ? go('/saved/place') : setSel(m.e))} />;
      })}
      <View style={{ position: 'absolute', left: 35, width: 320, top }}><SegTabs active={1} floating /></View>
      <MapSheet gap={12} padBottom={tabH + 24}>
        <Row>
          <View style={{ flex: 1, gap: 5 }}>
            <T size={20} w="b" ls={-2}>공유 피드</T>
            <T size={12} sub>친구들이 가고 싶어 한 장소</T>
          </View>
          <Chip label="인기순" trail="down" />
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {filters.map((x, i) => <Chip key={x} label={x} active={i === f} onPress={() => setF(i)} />)}
        </ScrollView>
        {list.map((c) => (
          <Pressable key={c.n} onPress={() => setSel(c.e)} style={{ backgroundColor: t.card2, borderRadius: 22, padding: 14, gap: 10 }}>
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
              <ActionBtn kind="ghost" h={36} size={12} iconSize={14} label="구글맵 보기" icon="pin" onPress={() => go('/saved/openmap')} style={{ paddingHorizontal: 12, gap: 4 }} />
              <ActionBtn kind="lime" h={36} size={12} iconSize={14} label="장소 추가" icon="plus" onPress={() => go('/saved/add-to-schedule')} style={{ paddingHorizontal: 14 }} />
            </Row>
          </Pressable>
        ))}
      </MapSheet>
      <AppTabBar active="saved" onPress={(n) => r.navigate(`/${n}` as any)} />
    </View>
  );
}
