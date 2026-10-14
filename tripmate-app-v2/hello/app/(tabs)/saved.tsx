import { View, Pressable } from 'react-native';
import { Page, TabTitle, T, Row, Icon, PhotoPH, useGo, useTheme, shadow } from '../../src/kit';
import { SegTabs } from '../../src/screens/saved/parts';

const folders = [{ n: '런던', c: '5곳' }, { n: '파리', c: '4곳' }, { n: '피렌체', c: '3곳' }];
const recent = [
  { n: '버러 마켓', s: '런던 · 시장', c: '#1e6fff' },
  { n: '타워브리지', s: '런던 · 명소', c: '#16a394' },
  { n: '에펠탑', s: '파리 · 명소', c: '#ff7a45' },
  { n: '두오모 대성당', s: '피렌체 · 명소', c: '#7c4dff' },
];

export default function Saved() {
  const go = useGo(); const { t } = useTheme();
  return (
    <Page tab>
      <TabTitle title="저장·공유" />
      <SegTabs active={0} />
      <Pressable onPress={() => go('/saved/search')} style={{ marginTop: 12, height: 44, borderRadius: 22, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
        <Icon name="search" size={18} color={t.sub} />
        <T size={14} sub style={{ flex: 1 }}>저장한 장소 검색</T>
        <Icon name="filter" size={18} color={t.sub} />
      </Pressable>
      <Row style={{ marginTop: 14 }}>
        <T size={16} w="b" style={{ flex: 1 }}>내 폴더</T>
        <T size={13} w="b" color={t.acc} onPress={() => go('/saved/folder-new')}>새 폴더</T>
      </Row>
      <Row gap={10} align="stretch" style={{ marginTop: 12 }}>
        {folders.map((f) => (
          <Pressable key={f.n} onPress={() => go('/saved/folder')} style={{ flex: 1, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 12, gap: 6, ...shadow(t) }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="folder" size={16} color={t.acc} />
            </View>
            <T size={14} w="b">{f.n}</T>
            <T size={11} sub>{f.c}</T>
          </Pressable>
        ))}
        <Pressable onPress={() => go('/saved/folder-new')} style={{ flex: 1, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(138,143,152,0.5)', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Icon name="plus" size={18} color={t.sub} />
          <T size={11} sub>새 폴더</T>
        </Pressable>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <T size={16} w="b" style={{ flex: 1 }}>최근 저장한 장소</T>
        <T size={13} w="b" color={t.acc} onPress={() => go('/saved/folder')}>전체보기</T>
      </Row>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        {recent.map((p) => (
          <Pressable key={p.n} onPress={() => go('/saved/place')} style={{ width: '48%', flexGrow: 1, flexBasis: '45%', backgroundColor: t.card, borderRadius: 22, paddingTop: 8, paddingBottom: 10, paddingHorizontal: 8, gap: 8, ...shadow(t) }}>
            <View>
              <PhotoPH h={92} radius={16} iconSize={37} style={{ width: '100%' }} />
              <View style={{ position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bookmark" size={14} color={p.c} />
              </View>
            </View>
            <View style={{ paddingHorizontal: 4, gap: 1 }}>
              <T size={14} w="b" numberOfLines={1}>{p.n}</T>
              <T size={12} sub>{p.s}</T>
            </View>
          </Pressable>
        ))}
      </View>
    </Page>
  );
}
