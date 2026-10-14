import { useState } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, T, Btn, Row, Icon, useTheme } from '../../src/kit';
import { Label, Segmented, Toggle, Chip, PhotoBox } from '../../src/screens/saved2/parts';

const cats = ['맛집', '카페', '명소', '쇼핑'];
const tags = ['#런던맛집', '#시장', '+ 태그'];

export default function Share() {
  const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [photos, setPhotos] = useState([1, 2]);
  const [cat, setCat] = useState(0);
  const [text, setText] = useState('평일 오전엔 한적해서 사진 찍기 좋아요. 크로와상 추천!');
  const [tagSel, setTagSel] = useState<number[]>([]);
  const [scope, setScope] = useState(1);
  const [link, setLink] = useState(true);
  const [nid, setNid] = useState(3);
  const done = () => (r.canGoBack() ? r.back() : r.replace('/saved'));
  const box = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line } as const;
  return (
    <Page gap={12} top={false} footer={<Btn label="공유하기" onPress={done} />}>
      {/* 피그마 Header: 상태바 아래 46px, ← 22 + 제목 18 Medium, 우측 '게시' 16 Bold */}
      <View style={{ height: Math.max(ins.top, 37) + 46, paddingTop: Math.max(ins.top, 37), marginHorizontal: -20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable hitSlop={10} onPress={done}><Icon name="back" size={22} color={t.text} /></Pressable>
        <T size={18} w="m" style={{ flex: 1 }}>장소 공유하기</T>
        <T size={16} w="b" color={t.acc} onPress={done}>게시</T>
      </View>
      <Row gap={10} style={{ marginTop: 3 }}>
        {photos.map((id) => (
          <View key={id}>
            <PhotoBox size={92} radius={18} icon={37} />
            <Pressable onPress={() => setPhotos(photos.filter((p) => p !== id))} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={12} color="#fff" />
            </Pressable>
          </View>
        ))}
        {photos.length < 5 ? (
          <Pressable onPress={() => { setPhotos([...photos, nid]); setNid(nid + 1); }} style={{ width: 92, height: 92, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(138,143,152,0.5)', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Icon name="camera" size={22} color={t.sub} /><T size={11} sub>{photos.length}/5</T>
          </Pressable>
        ) : null}
      </Row>
      <Row gap={10} style={[{ height: 52, borderRadius: 16, paddingHorizontal: 16 }, box]}>
        <Icon name="pin" size={20} color={t.acc} />
        <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">버러 마켓</T><T size={11} sub>런던 · 시장</T></View>
        <T size={13} w="b" color={t.acc}>변경</T>
      </Row>
      <View style={{ gap: 6 }}>
        <Label>카테고리</Label>
        <Row gap={8}>{cats.map((c, i) => <Chip key={c} label={c} active={cat === i} onPress={() => setCat(i)} />)}</Row>
      </View>
      <View style={{ gap: 6 }}>
        <Label>한 줄 소개</Label>
        <View style={[{ borderRadius: 16, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 16, gap: 8 }, box]}>
          <TextInput value={text} onChangeText={(s) => setText(s.slice(0, 200))} multiline placeholder="한 줄 소개" placeholderTextColor={t.sub}
            style={{ color: t.text, fontSize: 14, fontWeight: '500', lineHeight: 21, minHeight: 21, padding: 0, textAlignVertical: 'top', ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          <T size={11} sub align="right">{text.length}/200</T>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Label>태그</Label>
        <Row gap={8}>{tags.map((c, i) => <Chip key={c} label={c} active={tagSel.includes(i) && i < 2} onPress={() => setTagSel(tagSel.includes(i) ? tagSel.filter((x) => x !== i) : [...tagSel, i])} />)}</Row>
      </View>
      <View style={{ gap: 6 }}>
        <Label>공개 범위</Label>
        <Segmented items={['친구에게', '전체 공개']} value={scope} onChange={setScope} />
      </View>
      <Row style={[{ borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 }, box]}>
        <T size={14} style={{ flex: 1 }}>구글맵 링크 함께 공유</T>
        <Toggle on={link} onChange={setLink} />
      </Row>
    </Page>
  );
}
