import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppTabBar, TAB_H } from '../../src/components/AppTabBar';
import { T, Row, Icon, PhotoPH, useGo, useTheme } from '../../src/kit';
import { SortToggle } from '../../src/screens/saved/SortToggle';
import { FEED, sortFeed, fmtDist, SORT_FEED } from '../../src/data/savedStore';
import { SegTabs, Chip, ActionBtn, EmojiMarker, MapLayer, MapSheet } from '../../src/screens/saved/parts';

const BLUE = '#1e6fff', ORANGE = '#ff9f0a', GREEN = '#34c759';
const filters = ['전체', '맛집', '카페', '명소', '쇼핑'];
/** 지도 마커 중심 좌표 (피그마 Light: 38px 마커 좌상단 + 19, 선택 🥐 50px 좌상단 + 25) */
const markers = [
  { e: '☕', n: 'Café de Flore', x: 124, y: 297, c: BLUE }, { e: '🗼', n: '에펠탑 전망대', x: 260, y: 237, c: BLUE }, { e: '🏛️', n: '두오모 쿠폴라', x: 326, y: 151, c: ORANGE },
  { e: '🌳', n: '하이드 파크', x: 178, y: 137, c: GREEN }, { e: '🛍️', n: 'Camden Market', x: 358, y: 357, c: ORANGE }, { e: '🍺', n: 'Dishoom', x: 98, y: 387, c: BLUE },
  { e: '🥐', n: '버러 마켓', x: 208, y: 377, c: BLUE },
];

/** C-02 공유 피드: 친구들이 공유한(추천한) 장소가 지도 마커로 표시되고, 카드/마커를 누르면 해당 장소가 선택된다 */
export default function Feed() {
  const goRaw = useGo(); const go = goRaw; const goPlace = (n: string) => goRaw(`/saved/place?name=${encodeURIComponent(n)}`); const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const tabH = TAB_H + Math.max(ins.bottom - 14, 0);
  const [f, setF] = useState(0);
  const [sel, setSel] = useState('🥐');
  const [sort, setSort] = useState(0); // 0 인기순 / 1 거리순
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const likes = Object.fromEntries(FEED.map((c) => [c.id, c.likes + (liked[c.id] ? 1 : 0)]));
  const top = Math.max(ins.top, 37) + 15;
  const list = sortFeed(FEED.filter((c) => f === 0 || c.cat === filters[f]), likes, sort);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapLayer />
      {markers.map((m) => {
        const on = m.e === sel; const sz = on ? 50 : 38;
        return <EmojiMarker key={m.e} e={m.e} c={m.c} x={m.x - sz / 2} y={m.y - sz / 2} selected={on} onPress={() => { setSel(m.e); goPlace(m.n); }} />;
      })}
      <View style={{ position: 'absolute', left: 35, width: 320, top }}><SegTabs active={1} floating /></View>
      <MapSheet gap={16} padBottom={tabH + 24}>
        <Row>
          <View style={{ flex: 1, gap: 5 }}>
            <T size={20} w="b" ls={-2}>공유 피드</T>
            <T size={12} sub>친구들이 가고 싶어 한 장소</T>
          </View>
          <SortToggle options={SORT_FEED} value={sort} onChange={setSort} />
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {filters.map((x, i) => <Chip key={x} label={x} active={i === f} onPress={() => setF(i)} />)}
        </ScrollView>
        {list.map((c) => (
          <View key={c.id} style={{ backgroundColor: t.card2, borderRadius: 22, padding: 16, gap: 14 }}>
            <Pressable onPress={() => { setSel(c.e); goPlace(c.n); }} accessibilityRole="button" accessibilityLabel={`${c.n} 상세`}>
              <Row gap={14} align="flex-start">
                <PhotoPH w={72} h={72} radius={16} iconSize={29} />
                <View style={{ flex: 1, gap: 7 }}>
                  <Row gap={6}><T size={18} lh={24}>{c.e}</T><T size={16} w="b" lh={24} style={{ flex: 1 }}>{c.n}</T></Row>
                  <T size={12} lh={18} sub>{c.m} · {fmtDist(c.dist)}</T>
                  <T size={13} lh={20}>{c.q}</T>
                  <T size={11} lh={17} sub>{c.by}</T>
                </View>
              </Row>
            </Pressable>
            <Row gap={12}>
              <Pressable onPress={() => setLiked((p) => ({ ...p, [c.id]: !p[c.id] }))} accessibilityRole="button" accessibilityLabel="좋아요"
                style={{ minWidth: 44, height: 44, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="heart" size={29} color={liked[c.id] ? t.bad : t.sub} />
                <T size={13} w="b" sub>{likes[c.id]}</T>
              </Pressable>
              <View style={{ flex: 1 }} />
              <ActionBtn kind="ghost" h={36} size={12} iconSize={14} label="구글맵 보기" icon="pin" onPress={() => go(`/saved/openmap?name=${encodeURIComponent(c.n)}`)} style={{ paddingHorizontal: 12, gap: 4 }} />
              <ActionBtn kind="lime" h={36} size={12} iconSize={14} label="장소 추가" icon="plus" onPress={() => go(`/saved/add-to-schedule?name=${encodeURIComponent(c.n)}`)} style={{ paddingHorizontal: 14 }} />
            </Row>
          </View>
        ))}
      </MapSheet>
      <AppTabBar active="saved" onPress={(n) => r.navigate(`/${n}` as any)} />
    </View>
  );
}
