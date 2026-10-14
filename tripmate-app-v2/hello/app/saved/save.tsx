import { useState } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { T, Btn, Row, Icon, useGo, useTheme, shadow } from '../../src/kit';
import { SheetScreen, Label, PhotoBox } from '../../src/screens/saved2/parts';

const folders = [
  { name: '런던', n: '5곳', c: '#1e6fff' },
  { name: '파리', n: '4곳', c: '#ff9f0a' },
  { name: '피렌체', n: '3곳', c: '#34c759' },
];

export default function SavePlace() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme();
  const [sel, setSel] = useState(0);
  const [memo, setMemo] = useState('크로와상 꼭 먹기');
  return (
    <SheetScreen top={284} title="장소 저장"
      back={<View style={[{ backgroundColor: t.card, borderRadius: 24, padding: 16, gap: 6 }, shadow(t)]}><T size={18} w="b">버러 마켓</T><T size={13} sub>런던 · 시장 · ★4.6</T></View>}
      footer={<Btn label="저장하기" onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))} />}>
      <Row gap={12} style={{ backgroundColor: t.card2, borderRadius: 18, paddingLeft: 10, paddingRight: 12, paddingVertical: 10 }}>
        <PhotoBox size={44} radius={12} icon={18} />
        <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">버러 마켓</T><T size={12} sub>런던 · 시장</T></View>
      </Row>
      <Label>저장할 폴더</Label>
      <View style={{ backgroundColor: t.card2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 }}>
        {folders.map((f, i) => (
          <View key={f.name}>
            {i > 0 ? <View style={{ height: 1, backgroundColor: t.line }} /> : null}
            <Pressable onPress={() => setSel(i)}>
              <Row gap={12} style={{ paddingVertical: 12 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: f.c + '2E', alignItems: 'center', justifyContent: 'center' }}><Icon name="folder" size={16} color={f.c} /></View>
                <View style={{ flex: 1 }}><T size={15} w="b">{f.name}</T><T size={12} sub>{f.n}</T></View>
                {sel === i
                  ? <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={14} color="#fff" /></View>
                  : <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: t.line }} />}
              </Row>
            </Pressable>
          </View>
        ))}
      </View>
      <Pressable onPress={() => go('/saved/folder-new')} style={{ height: 44, borderRadius: 22, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(138,143,152,0.5)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Icon name="plus" size={16} color={t.sub} /><T size={13} sub>새 폴더 만들기</T>
      </Pressable>
      <View style={{ gap: 6 }}>
        <Label>메모 (선택)</Label>
        <View style={{ height: 48, borderRadius: 16, backgroundColor: t.card2, paddingHorizontal: 16, justifyContent: 'center' }}>
          <TextInput value={memo} onChangeText={setMemo} placeholder="메모" placeholderTextColor={t.sub}
            style={{ color: t.text, fontSize: 14, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </View>
      </View>
    </SheetScreen>
  );
}
