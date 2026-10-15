import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, PhotoPH, useGo, useTheme } from '../../src/kit';
import { TAB_H } from '../../src/components/AppTabBar';
import { SegTabs, Chip, ActionBtn, Bubble, MapLayer, MapSheet } from '../../src/screens/saved/parts';
import { SortToggle } from '../../src/screens/saved/SortToggle';
import { useSaved, sortSaved, clearToast, markerSpot, reloadSaved, relTime, SORT_SAVED } from '../../src/data/savedStore';
import { EmptyCard } from '../../src/screens/empty/EmptyCard';

const filters = ['전체', '맛집', '카페', '명소', '쇼핑'];

/** C-01 저장: 지도 + 내가 저장한 장소 시트 (공유 피드와 같은 지도 레이아웃) */
export default function Saved() {
  const go = useGo(); const goPlace = (n: string) => go(`/saved/place?name=${encodeURIComponent(n)}`); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [f, setF] = useState(0);
  const [sort, setSort] = useState(0); // 0 최근순 / 1 이름순
  const { items, toast, loading, error } = useSaved();
  useEffect(() => { if (!toast) return; const id = setTimeout(clearToast, 2600); return () => clearTimeout(id); }, [toast]);
  const top = Math.max(ins.top, 37) + 15;
  const tabH = TAB_H + Math.max(ins.bottom - 14, 0);
  const list = sortSaved(items.filter((c) => f === 0 || c.cat === filters[f]), sort);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapLayer />
      <View style={{ position: 'absolute', left: 35, width: 320, top }}><SegTabs active={0} floating /></View>
      {list.slice(0, 4).map((c) => { const sp = markerSpot(c.id, 260); return <Bubble key={c.id} label={c.n} left={sp.x} top={sp.y - 20} onPress={() => goPlace(c.n)} />; })}
      <MapSheet gap={14} padBottom={tabH + 24}>
        <Row>
          <View style={{ flex: 1 }}>
            <T size={20} w="b" ls={-2}>내가 저장한 장소</T>
          </View>
          <SortToggle options={SORT_SAVED} value={sort} onChange={setSort} />
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {filters.map((x, i) => <Chip key={x} label={x} active={i === f} onPress={() => setF(i)} />)}
        </ScrollView>
        {error ? <T size={12} color={t.bad} align="center" onPress={reloadSaved}>{error} · 눌러서 다시 시도</T> : null}
        {list.length === 0 && !loading ? (
          <EmptyCard emoji="🔖" title={items.length === 0 ? '아직 저장한 장소가 없어요' : '이 분류에 저장한 장소가 없어요'} body={items.length === 0 ? '가고 싶은 장소를 저장해 두면 일정에 바로 넣을 수 있어요.' : undefined} />
        ) : null}
        {list.map((c) => (
          <View key={c.id} style={{ backgroundColor: t.card2, borderRadius: 22, padding: 14, gap: 10 }}>
            <Row gap={12} align="flex-start">
              <Pressable onPress={() => goPlace(c.n)}><PhotoPH w={72} h={72} radius={16} iconSize={29} /></Pressable>
              <View style={{ flex: 1, gap: 2 }}>
                <T size={16} w="b" onPress={() => goPlace(c.n)}>{c.n}</T>
                <T size={12} sub numberOfLines={1}>{c.cat}{c.addr ? ` · ${c.addr}` : ''}</T>
                {c.note ? <T size={13}>“{c.note}”</T> : null}
                <T size={11} sub>{relTime(c.savedAt)} 저장</T>
              </View>
            </Row>
            <Row gap={12} style={{ justifyContent: 'center' }}>
              <ActionBtn h={36} size={12} iconSize={14} label="구글맵 보기" icon="pin" onPress={() => go(`/saved/openmap?name=${encodeURIComponent(c.n)}`)} style={{ paddingHorizontal: 12 }} />
              <ActionBtn kind="plain" h={36} size={12} label="공유피드 추가" onPress={() => go(`/saved/share?name=${encodeURIComponent(c.n)}&cat=${encodeURIComponent(c.cat)}`)} style={{ paddingHorizontal: 12 }} />
              <ActionBtn kind="lime" h={36} size={12} iconSize={14} label="장소 추가" icon="plus" onPress={() => go(`/saved/add-to-schedule?name=${encodeURIComponent(c.n)}`)} style={{ paddingHorizontal: 14 }} />
            </Row>
          </View>
        ))}
        <Pressable onPress={() => go('/saved/search')} style={{ backgroundColor: t.acc, borderRadius: 22, padding: 14, alignItems: 'center', justifyContent: 'center' }}>
          <T size={16} w="b" color="#fff">장소 추가하기</T>
        </Pressable>
      </MapSheet>
      {toast ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 20, right: 20, bottom: tabH + 12, alignItems: 'center' }}>
          <View style={{ backgroundColor: t.text, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12 }}>
            <T size={14} w="b" color={t.bg}>{toast}</T>
          </View>
        </View>
      ) : null}
    </View>
  );
}
