import { useState } from 'react';
import { View, TextInput, Pressable, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, T, Row, Icon, useGo, useTheme, shadow } from '../../src/kit';
import { Chip, PhotoBox } from '../../src/screens/saved2/parts';
import { FOUND, FoundPlace, addSavedPlace, isSavedName, useSaved } from '../../src/data/savedStore';

const filters = ['전체', '내 저장', 'Google 장소'];

export default function SavedSearch() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme();
  const [q, setQ] = useState('');
  const [f, setF] = useState(0);
  const [sel, setSel] = useState<FoundPlace | null>(null);
  const saved = useSaved();
  const found = q.trim() && f !== 1 ? FOUND.filter((p) => (p.n + p.addr + p.cat + p.city).toLowerCase().includes(q.trim().toLowerCase())) : [];
  const save = (p: FoundPlace) => { addSavedPlace(p); go('/saved'); };
  const [recent, setRecent] = useState<string[]>([]);
  const mine = saved.items.filter((x) => f !== 2 && (!q.trim() || (x.n + x.addr + x.cat).toLowerCase().includes(q.trim().toLowerCase())));
  const remember = () => { const v = q.trim(); if (v) setRecent((p) => [v, ...p.filter((x) => x !== v)].slice(0, 6)); };
  return (
    <Page>
      <Row gap={10} style={{ marginTop: 13 }}>
        <Pressable hitSlop={10} onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))}><Icon name="back" size={22} color={t.text} /></Pressable>
        <Row gap={8} style={{ flex: 1, height: 46, borderRadius: 23, paddingHorizontal: 14, backgroundColor: t.card, borderWidth: 1.5, borderColor: t.acc }}>
          <Icon name="search" size={18} color={t.acc} />
          <TextInput value={q} onChangeText={setQ} onSubmitEditing={remember} returnKeyType="search" placeholder="장소 검색" placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          {q ? <Pressable hitSlop={8} onPress={() => setQ('')}><Icon name="x" size={16} color={t.sub} /></Pressable> : null}
        </Row>
      </Row>
      <Row gap={8} style={{ marginTop: 14 }}>{filters.map((x, i) => <Chip key={x} label={x} active={f === i} onPress={() => setF(i)} />)}</Row>
      <View style={{ gap: 12, marginTop: 17 }}>
        {recent.length ? <Row><T size={15} w="b" style={{ flex: 1 }}>최근 검색</T><T size={12} sub onPress={() => setRecent([])}>전체 삭제</T></Row> : null}
        {recent.map((x) => (
          <Row key={x} gap={10}>
            <Icon name="clock" size={18} color={t.sub} />
            <T size={14} style={{ flex: 1 }} onPress={() => setQ(x)}>{x}</T>
            <Pressable hitSlop={8} onPress={() => setRecent(recent.filter((y) => y !== x))}><Icon name="x" size={14} color={t.sub} /></Pressable>
          </Row>
        ))}
        {q.trim() ? (
          <View style={{ gap: 10 }}>
            <T size={15} w="b">검색 결과 {found.length}곳 · 예시</T>
            <T size={12} sub>Google 장소 검색 연동 전이라 예시 결과만 보여요</T>
            {found.length === 0 ? <T size={13} sub>일치하는 장소가 없어요</T> : null}
            {found.map((p) => {
              const on = sel?.id === p.id; const done = isSavedName(saved, p.n);
              return (
                <View key={p.id} style={[{ borderRadius: 18, backgroundColor: t.card, borderWidth: on ? 1.5 : 0, borderColor: t.acc, padding: 10, gap: 10 }, shadow(t)]}>
                  <Pressable onPress={() => setSel(on ? null : p)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <PhotoBox size={52} radius={12} icon={21} />
                    <View style={{ flex: 1, gap: 1 }}>
                      <T size={15} w="b" numberOfLines={1}>{p.n}</T>
                      <T size={12} sub numberOfLines={1}>{p.city} · {p.cat} · {p.rating}</T>
                    </View>
                    {done ? (
                      <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: t.line }}><T size={11}>저장됨</T></View>
                    ) : (
                      <Pressable onPress={() => save(p)} accessibilityRole="button" accessibilityLabel={`${p.n} 저장`}
                        style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="plus" size={22} color="#fff" />
                      </Pressable>
                    )}
                  </Pressable>
                  {on ? (
                    <View style={{ gap: 10 }}>
                      <Row gap={8} align="flex-start"><Icon name="pin" size={16} color={t.sub} /><T size={13} style={{ flex: 1 }}>{p.addr}</T></Row>
                      {done ? (
                        <View style={{ height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: t.accS }}><T size={15} w="b" color={t.acc}>이미 저장한 장소예요</T></View>
                      ) : (
                        <Pressable onPress={() => save(p)} accessibilityRole="button"
                          style={{ height: 52, borderRadius: 26, backgroundColor: t.acc, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Icon name="plus" size={18} color="#fff" /><T size={15} w="b" color="#fff">이 장소 저장하기</T>
                        </Pressable>
                      )}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}
        {f !== 2 ? <T size={15} w="b">내 저장 장소 {mine.length}곳</T> : null}
        {f !== 2 && mine.length === 0 ? <T size={13} sub>{saved.items.length === 0 ? '아직 저장한 장소가 없어요' : '일치하는 저장 장소가 없어요'}</T> : null}
        {mine.map((x) => (
          <Pressable key={x.id} onPress={() => go(`/saved/place?name=${encodeURIComponent(x.n)}`)}
            style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 10, paddingRight: 12, paddingVertical: 10, borderRadius: 18, backgroundColor: t.card }, shadow(t)]}>
            <PhotoBox size={52} radius={12} icon={21} />
            <View style={{ flex: 1, gap: 1 }}><T size={15} w="b" numberOfLines={1}>{x.n}</T><T size={12} sub numberOfLines={1}>{x.cat}{x.addr ? ` · ${x.addr}` : ''}</T></View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }}><T size={11}>저장됨</T></View>
          </Pressable>
        ))}
        {f !== 1 && q.trim() ? (
          <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q.trim())}`)}
            style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: t.card }, shadow(t)]}>
            <Icon name="pin" size={20} color={t.acc} />
            <View style={{ flex: 1, gap: 1 }}><T size={14} w="b">Google 지도에서 더 찾기</T><T size={12} sub>“{q.trim()}” 검색 결과 보기</T></View>
            <Icon name="chev" size={18} color={t.sub} />
          </Pressable>
        ) : null}
      </View>
    </Page>
  );
}
