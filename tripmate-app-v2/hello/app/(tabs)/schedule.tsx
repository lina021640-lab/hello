import { View, Pressable, ScrollView } from 'react-native';
import { Page, T, Row, Icon, useGo, useTheme } from '../../src/kit';
import { Dashboard, MemoCard, Avatars, Grad } from '../../src/screens/schedule/shared';

const cities = [
  { n: '런던', a: '#7d9cc9', b: '#27395c' },
  { n: '파리', a: '#d6a97c', b: '#5d3f27' },
  { n: '피렌체', a: '#8cc2b0', b: '#2a5f52' },
];

export default function Schedule() {
  const go = useGo(); const { t } = useTheme();
  return (
    <Page tab>
      {/* 상단: ← 와 우측 아이콘 */}
      <Row style={{ height: 44, marginTop: 8, justifyContent: 'space-between' }}>
        <Pressable hitSlop={10} onPress={() => go('/home')}><Icon name="back" size={24} color={t.text} /></Pressable>
        <Row gap={16}>
          <Pressable hitSlop={8} onPress={() => go('/schedule/members')}><Icon name="link" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/saved')}><Icon name="folder" size={23} color={t.text} /></Pressable>
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
          <View style={{ height: 25, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
            <T size={16} w="r" color="#fff">D + 3</T>
          </View>
          <T size={15} ls={-1} style={{ marginLeft: 2 }}>2026.11.20 -2027.01.16</T>
        </Row>
        <Avatars size={35} onPress={() => go('/schedule/members')} />
      </Row>
      <View style={{ marginTop: 8 }}>
        <Dashboard variant="main" onMap={() => go('/schedule/map')} onDetail={() => go('/schedule/detail')} onFlight={() => go('/schedule/flight')} />
      </View>
      <View style={{ marginTop: 11 }}><MemoCard variant="main" /></View>
      <T size={16} ls={-1} style={{ marginTop: 16, marginBottom: 6 }}>방문하는 도시에 대해 알아보기</T>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingTop: 6 }}>
        {cities.map((c, i) => (
          <Pressable key={c.n} onPress={() => go('/schedule/city')}>
            <Grad id={`ct${i}`} from={c.a} to={c.b} style={{ width: 132, height: 140, borderRadius: 30, justifyContent: 'flex-end', paddingLeft: 16, paddingBottom: 12 }}>
              <T size={24} color="#fff">{c.n}</T>
              <T size={15} color="#fff">더 알아보기</T>
            </Grad>
          </Pressable>
        ))}
      </ScrollView>
    </Page>
  );
}
