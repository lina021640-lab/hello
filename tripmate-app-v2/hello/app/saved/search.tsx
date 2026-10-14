import { useState } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, T, Row, Icon, useGo, useTheme, shadow } from '../../src/kit';
import { Chip, PhotoBox } from '../../src/screens/saved2/parts';

const filters = ['전체', '내 폴더', 'Google 장소'];
const results = [
  { name: 'Monmouth Coffee', sub: '런던 폴더 · 카페 · ★4.6' },
  { name: 'Dishoom', sub: '런던 폴더 · 맛집 · ★4.7' },
  { name: 'Café de Flore', sub: '파리 폴더 · 카페 · ★4.3' },
];

export default function SavedSearch() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme();
  const [q, setQ] = useState('카페');
  const [f, setF] = useState(0);
  const [recent, setRecent] = useState(['Dishoom', '런던 맛집', '코벤트 가든']);
  return (
    <Page>
      <Row gap={10} style={{ marginTop: 18 }}>
        <Pressable hitSlop={10} onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))}><Icon name="back" size={22} color={t.text} /></Pressable>
        <Row gap={8} style={{ flex: 1, height: 46, borderRadius: 23, paddingHorizontal: 14, backgroundColor: t.card, borderWidth: 1.5, borderColor: t.acc }}>
          <Icon name="search" size={18} color={t.acc} />
          <TextInput value={q} onChangeText={setQ} placeholder="검색" placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          {q ? <Pressable hitSlop={8} onPress={() => setQ('')}><Icon name="x" size={16} color={t.sub} /></Pressable> : null}
        </Row>
      </Row>
      <Row gap={8} style={{ marginTop: 14 }}>{filters.map((x, i) => <Chip key={x} label={x} active={f === i} onPress={() => setF(i)} />)}</Row>
      <View style={{ gap: 12, marginTop: 14 }}>
        <Row><T size={15} w="b" style={{ flex: 1 }}>최근 검색</T><T size={12} sub onPress={() => setRecent([])}>전체 삭제</T></Row>
        {recent.map((x) => (
          <Row key={x} gap={10}>
            <Icon name="clock" size={18} color={t.sub} />
            <T size={14} style={{ flex: 1 }} onPress={() => setQ(x)}>{x}</T>
            <Pressable hitSlop={8} onPress={() => setRecent(recent.filter((y) => y !== x))}><Icon name="x" size={14} color={t.sub} /></Pressable>
          </Row>
        ))}
        <T size={15} w="b">내 저장 장소 3곳</T>
        {results.map((x) => (
          <Pressable key={x.name} onPress={() => go('/saved/place')}
            style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 10, paddingRight: 12, paddingVertical: 10, borderRadius: 18, backgroundColor: t.card }, shadow(t)]}>
            <PhotoBox size={52} radius={12} icon={21} />
            <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">{x.name}</T><T size={12} sub>{x.sub}</T></View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }}><T size={11}>저장됨</T></View>
          </Pressable>
        ))}
        <Pressable onPress={() => go('/saved/openmap')}
          style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: t.card }, shadow(t)]}>
          <Icon name="pin" size={20} color={t.acc} />
          <View style={{ flex: 1, gap: 1 }}><T size={14} w="b">Google 장소에서 더 찾기</T><T size={12} sub>“{q || '카페'}” 검색 결과 보기</T></View>
          <Icon name="chev" size={18} color={t.sub} />
        </Pressable>
      </View>
    </Page>
  );
}
