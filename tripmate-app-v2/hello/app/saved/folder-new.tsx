import { useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { T, Btn, Row, Card, useTheme, shadow } from '../../src/kit';
import { SheetScreen, Label, Segmented, Toggle, Swatches } from '../../src/screens/saved2/parts';

export default function FolderNew() {
  const r = useRouter(); const { t } = useTheme();
  const [name, setName] = useState('런던 맛집');
  const [color, setColor] = useState(0);
  const [scope, setScope] = useState(1);
  const [allow, setAllow] = useState(true);
  const done = () => (r.canGoBack() ? r.back() : r.replace('/saved'));
  return (
    <SheetScreen top={184} title="새 폴더 만들기"
      back={<View style={[{ backgroundColor: t.card, borderRadius: 24, padding: 16, gap: 6 }, shadow(t)]}><T size={18} w="b">내 폴더</T><T size={13} sub>런던 · 파리 · 피렌체</T></View>}
      footer={<Row gap={10}><Btn kind="ghost" label="취소" onPress={done} style={{ flex: 1 }} /><Btn label="만들기" onPress={done} style={{ flex: 1 }} /></Row>}>
      <View style={{ gap: 6 }}>
        <Label>폴더 이름</Label>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingHorizontal: 16, borderRadius: 16, backgroundColor: t.card2, borderWidth: 1.5, borderColor: t.acc }}>
          <TextInput value={name} onChangeText={(s) => setName(s.slice(0, 20))} placeholder="폴더 이름" placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          <T size={12} sub>{name.length}/20</T>
        </View>
      </View>
      <View style={{ gap: 8 }}><Label>폴더 색상</Label><Swatches value={color} onChange={setColor} size={36} iconSize={18} /></View>
      <View style={{ gap: 6 }}><Label>공개 범위</Label><Segmented items={['나만 보기', '친구 공유', '전체 공개']} value={scope} onChange={setScope} /></View>
      <Row style={{ backgroundColor: t.card2, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 }}>
        <View style={{ flex: 1, gap: 1 }}><T size={14} w="b">친구가 장소 추가 가능</T><T size={12} sub>함께하는 친구가 이 폴더에 장소를 저장할 수 있어요</T></View>
        <Toggle on={allow} onChange={setAllow} />
      </Row>
    </SheetScreen>
  );
}
