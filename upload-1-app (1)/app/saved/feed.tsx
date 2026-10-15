import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppTabBar, TAB_H } from '../../src/components/AppTabBar';
import { T, Row, Icon, PhotoPH, useGo, useTheme } from '../../src/kit';
import { SortToggle } from '../../src/screens/saved/SortToggle';
import { useFeed, sortFeed, toggleLike, relTime, markerSpot, reloadFeed, SORT_FEED } from '../../src/data/savedStore';
import { EmptyCard } from '../../src/screens/empty/EmptyCard';
import { SegTabs, Chip, ActionBtn, EmojiMarker, MapLayer, MapSheet } from '../../src/screens/saved/parts';

const BLUE = '#1e6fff', ORANGE = '#ff9f0a', GREEN = '#34c759';
const filters = ['전체', '맛집', '카페', '명소', '쇼핑'];
const catColor = (c: string) => (c === '맛집' || c === '카페' ? BLUE : c === '쇼핑' ? GREEN : ORANGE);

export default function Feed() {
  const goRaw = useGo(); const go = goRaw; const goPlace = (n: string) => goRaw(`/saved/place?name=${encodeURIComponent(n)}`); const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const tabH = TAB_H + Math.max(ins.bottom - 14, 0);
  const [f, setF] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [sort, setSort] = useState(0); // 0 인기순 / 1 최신순
  const feed = useFeed();
  const top = Math.max(ins.top, 37) + 15;
  const list = sortFeed(feed.items.filter((c) => f === 0 || c.cat === filters[f]), sort);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapLayer />
      {list.slice(0, 12).map((m) => {
        const on = m.id === sel; const sz = on ? 50 : 38; const sp = markerSpot(m.id);
        return <EmojiMarker key={m.id} e={m.e} c={catColor(m.cat)} x={sp.x - sz / 2} y={sp.y - sz / 2} selected={on} onPress={() => { setSel(m.id); goPlace(m.n); }} />;
      })}
      <View style={{ position: 'absolute', left: 35, width: 320, top }}><SegTabs active={1} floating /></View>
      <MapSheet gap={16} padBottom={tabH + 24}>
        <Row>
          <View style={{ flex: 1, gap: 5 }}>
            <T size={20} w="b" ls={-2}>공유 피드</T>
            <T size={12} sub>여행 동료들이 공유한 장소</T>
          </View>
          <SortToggle options={SORT_FEED} value={sort} onChange={setSort} />
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {filters.map((x, i) => <Chip key={x} label={x} active={i === f} onPress={() => setF(i)} />)}
        </ScrollView>
        {feed.error ? <T size={12} color={t.bad} align="center" onPress={reloadFeed}>{feed.error} · 눌러서 다시 시도</T> : null}
        {!feed.hasTrip ? (
          <EmptyCard emoji="🧳" title="여행을 먼저 추가해 주세요" body="여행을 만들거나 합류하면 동료들이 공유한 장소를 볼 수 있어요." cta="여행 추가" onCta={() => go('/trip/new')} />
        ) : list.length === 0 && !feed.loading ? (
          <EmptyCard emoji="📍" title={feed.items.length === 0 ? '아직 공유된 장소가 없어요' : '이 분류에 공유된 장소가 없어요'} body={feed.items.length === 0 ? '저장한 장소를 공유 피드에 올려 동료와 나눠 보세요.' : undefined}
            cta={feed.items.length === 0 ? '장소 공유하기' : undefined} onCta={() => go('/saved/share')} />
        ) : null}
        {list.map((c) => (
          <View key={c.id} style={{ backgroundColor: t.card2, borderRadius: 22, padding: 16, gap: 14 }}>
            <Pressable onPress={() => { setSel(c.id); goPlace(c.n); }} accessibilityRole="button" accessibilityLabel={`${c.n} 상세`}>
              <Row gap={14} align="flex-start">
                <PhotoPH w={72} h={72} radius={16} iconSize={29} />
                <View style={{ flex: 1, gap: 7 }}>
                  <Row gap={6}><T size={18} lh={24}>{c.e}</T><T size={16} w="b" lh={24} style={{ flex: 1 }}>{c.n}</T></Row>
                  <T size={12} lh={18} sub>{c.cat}</T>
                  {c.q ? <T size={13} lh={20}>“{c.q}”</T> : null}
                  {c.tags.length ? <T size={12} lh={18} color={t.acc}>{c.tags.join(' ')}</T> : null}
                  <T size={11} lh={17} sub>{c.by} · {relTime(c.at)}</T>
                </View>
              </Row>
            </Pressable>
            <Row gap={12}>
              <Pressable onPress={() => toggleLike(c.id)} accessibilityRole="button" accessibilityLabel="좋아요"
                style={{ minWidth: 44, height: 44, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="heart" size={29} color={c.liked ? t.bad : t.sub} />
                <T size={13} w="b" sub>{c.likes}</T>
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
