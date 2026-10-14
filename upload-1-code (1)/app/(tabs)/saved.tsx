import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, PhotoPH, useGo, useTheme } from '../../src/kit';
import { TAB_H } from '../../src/components/AppTabBar';
import { SegTabs, Chip, ActionBtn, Bubble, MapLayer, MapSheet } from '../../src/screens/saved/parts';
import { SortToggle } from '../../src/screens/saved/SortToggle';
import { useSaved, sortSaved, fmtDist, clearToast, SORT_SAVED } from '../../src/data/savedStore';

const filters = ['전체', '맛집', '카페', '명소', '쇼핑'];

/** C-01 저장: 지도 + 내가 저장한 장소 시트 (공유 피드와 같은 지도 레이아웃) */
export default function Saved() {
  const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [f, setF] = useState(0);
  const [sort, setSort] = useState(1); // 0 거리순 / 1 저장한 순
  const { items, toast } = useSaved();
  useEffect(() => { if (!toast) return; const id = setTimeout(clearToast, 2600); return () => clearTimeout(id); }, [toast]);
  const top = Math.max(ins.top, 37) + 15;
  const tabH = TAB_H + Math.max(ins.bottom - 14, 0);
  const list = sortSaved(items.filter((c) => f === 0 || c.cat === filters[f]), sort);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapLayer />
      <View style={{ position: 'absolute', left: 35, width: 320, top }}><SegTabs active={0} floating /></View>
      <Bubble label="버러 마켓" left={34} top={140} onPress={() => go('/saved/marker')} />
      <Bubble label="에펠탑 전망대" left={214} top={112} onPress={() => go('/saved/marker')} />
      <Bubble label="두오모 쿠폴라" left={150} top={226} onPress={() => go('/saved/marker')} />
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
        {list.map((c) => (
          <View key={c.id} style={{ backgroundColor: t.card2, borderRadius: 22, padding: 14, gap: 10 }}>
            <Row gap={12} align="flex-start">
              <PhotoPH w={72} h={72} radius={16} iconSize={29} />
              <View style={{ flex: 1, gap: 2 }}>
                <T size={16} w="b" onPress={() => go('/saved/place')}>{c.n}</T>
                <T size={12} sub>{c.m} · {fmtDist(c.dist)}</T>
                {c.q ? <T size={13}>{c.q}</T> : null}
                <T size={11} sub>{c.by}</T>
              </View>
            </Row>
            <Row gap={12} style={{ justifyContent: 'center' }}>
              <ActionBtn h={36} size={12} iconSize={14} label="구글맵 보기" icon="pin" onPress={() => go('/saved/openmap')} style={{ paddingHorizontal: 12 }} />
              <ActionBtn kind="plain" h={36} size={12} label="공유피드 추가" onPress={() => go('/saved/share')} style={{ paddingHorizontal: 12 }} />
              <ActionBtn kind="lime" h={36} size={12} iconSize={14} label="장소 추가" icon="plus" onPress={() => go('/saved/add-to-schedule')} style={{ paddingHorizontal: 14 }} />
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
