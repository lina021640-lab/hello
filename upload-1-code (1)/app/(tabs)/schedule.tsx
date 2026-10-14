import { View, Pressable, ScrollView } from 'react-native';
import { Page, T, Row, Icon, useGo, useTheme } from '../../src/kit';
import { Dashboard, MemoCard, Avatars } from '../../src/screens/schedule/shared';

const cities = [{ n: '런던', c: 'GB' }, { n: '파리', c: 'FR' }, { n: '피렌체', c: 'IT' }];

export default function Schedule() {
  const go = useGo(); const { t } = useTheme();
  return (
    <Page tab>
      {/* 상단: ← 와 우측 아이콘 */}
      <Row style={{ height: 44, marginTop: 8, justifyContent: 'space-between' }}>
        <Pressable hitSlop={10} onPress={() => go('/home')}><Icon name="back" size={24} color={t.text} /></Pressable>
        <Row gap={16}>
          <Pressable hitSlop={8} onPress={() => go('/schedule/links')}><Icon name="link" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/files')}><Icon name="folder" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/manage')}><Icon name="menu" size={23} color={t.text} /></Pressable>
        </Row>
      </Row>
      {/* 제목 */}
      <View style={{ marginTop: 2 }}>
        <T size={15} ls={-1} lh={22}>영국 · 프랑스 · 이탈리아</T>
        <T size={39} ls={-1} lh={49} style={{ marginTop: -3 }}>유럽여행</T>
      </View>
      <Row style={{ marginTop: 8, height: 35, justifyContent: 'space-between' }}>
        <Row gap={6}>
          <View style={{ height: 25, paddingHorizontal: 12, borderRadius: 999, backgroundColor: t.mode === 'dark' ? '#fff' : '#000', alignItems: 'center', justifyContent: 'center' }}>
            <T size={16} w="r" color={t.mode === 'dark' ? '#000' : '#fff'}>D + 3</T>
          </View>
          <T size={15} ls={-1} style={{ marginLeft: 2 }}>2026.11.20 -2026.12.29</T>
        </Row>
        <Avatars size={35} maxWidth={66} onPress={() => go('/schedule/members')} />
      </Row>
      <View style={{ marginTop: 8 }}>
        <Dashboard variant="main" onMap={() => go('/schedule/map')} onDetail={() => go('/schedule/detail')} onFlight={() => go('/schedule/flight')} />
      </View>
      <View style={{ marginTop: 11 }}><MemoCard variant="main" /></View>
      <T size={16} ls={-1} style={{ marginTop: 16, marginBottom: 6 }}>방문하는 도시에 대해 알아보기</T>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 21, gap: 10, paddingVertical: 8 }}>
        {cities.map((c) => (
          <Pressable key={c.n} onPress={() => go(`/tips?country=${c.c}` as any)} style={{ width: 132, height: 140, borderRadius: 30, overflow: 'hidden', backgroundColor: '#5b6270', justifyContent: 'flex-end', paddingLeft: 16, paddingBottom: 12 }}>
            <View style={{ position: 'absolute', top: 14, right: 14 }}><Icon name="photo" size={22} color="rgba(255,255,255,0.35)" /></View>
            <T size={24} ls={-1} color="#fff">{c.n}</T>
            <T size={15} ls={-1} color="#fff">더 알아보기</T>
          </Pressable>
        ))}
      </ScrollView>
    </Page>
  );
}
