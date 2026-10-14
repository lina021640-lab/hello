import { useMemo, useState } from 'react';
import { View, Pressable, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { T, Btn, Row, Icon, useTheme, shadow } from '../../src/kit';
import { MapLayer } from '../../src/screens/saved/parts';
import { SheetScreen, Label, Segmented, Swatches, Chip, SWATCHES } from '../../src/screens/saved2/parts';

type E = [string, string];
const DATA: Record<string, E[]> = {
  음식: [['🍴', '식당 포크'], ['🍕', '피자'], ['🍣', '초밥'], ['🍜', '라면 국수'], ['🍔', '버거'], ['🥐', '빵 크루아상'], ['🍷', '와인'],
    ['🍺', '맥주'], ['☕', '커피 카페'], ['🍰', '케이크'], ['🧋', '버블티'], ['🍩', '도넛'], ['🏛️', '박물관'], ['🗼', '타워'],
    ['🎡', '관람차'], ['📸', '사진'], ['🏰', '성'], ['⛪', '교회'], ['🛍️', '쇼핑'], ['👗', '옷'], ['🎁', '선물'],
    ['🌳', '나무'], ['🏖️', '해변'], ['⛰️', '산'], ['🌸', '꽃'], ['⭐', '별'], ['❤️', '하트'], ['🏨', '호텔']],
  카페: [['☕', '커피'], ['🧋', '버블티'], ['🍰', '케이크'], ['🍩', '도넛'], ['🥐', '빵'], ['🍵', '차']],
  관광: [['🏛️', '박물관'], ['🗼', '타워'], ['🎡', '관람차'], ['📸', '사진'], ['🏰', '성'], ['⛪', '교회']],
  쇼핑: [['🛍️', '쇼핑'], ['👗', '옷'], ['🎁', '선물'], ['👜', '가방']],
  자연: [['🌳', '나무'], ['🏖️', '해변'], ['⛰️', '산'], ['🌸', '꽃'], ['⭐', '별']],
  기타: [['❤️', '하트'], ['🏨', '호텔'], ['📍', '핀']],
};
const CATS = ['최근', '음식', '카페', '관광', '쇼핑', '자연', '기타'];

export default function Marker() {
  const r = useRouter(); const { t } = useTheme();
  const [cat, setCat] = useState(1);
  const [emoji, setEmoji] = useState('🥐');
  const [color, setColor] = useState(0);
  const [scope, setScope] = useState(0);
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>(['🥐']);
  const list = useMemo<E[]>(() => {
    if (q.trim()) {
      const all = Object.values(DATA).flat();
      const seen = new Set<string>();
      return all.filter(([e, k]) => k.includes(q.trim()) && !seen.has(e) && seen.add(e));
    }
    if (cat === 0) return recent.map((e) => [e, ''] as E);
    return DATA[CATS[cat]];
  }, [cat, q, recent]);
  const rows: (E | null)[][] = [];
  for (let i = 0; i < list.length; i += 7) { const row: (E | null)[] = list.slice(i, i + 7); while (row.length < 7) row.push(null); rows.push(row); }
  const done = () => (r.canGoBack() ? r.back() : r.replace('/saved'));
  const pick = (e: string) => { setEmoji(e); setRecent((p) => [e, ...p.filter((x) => x !== e)].slice(0, 14)); };
  const reset = () => { setEmoji('🥐'); setColor(0); setScope(0); setQ(''); setCat(1); };
  return (
    <SheetScreen top={100} title="마커 꾸미기"
      mapBg={<MapLayer />}
      footer={<Row gap={10}><Btn kind="ghost" label="초기화" onPress={reset} style={{ flex: 1 }} /><Btn label="적용" onPress={done} style={{ flex: 1 }} /></Row>}>
      <Row gap={14} style={{ backgroundColor: t.card2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12 }}>
        <View style={[{ width: 60, height: 60, borderRadius: 30, backgroundColor: t.card, borderWidth: 4, borderColor: SWATCHES[color], alignItems: 'center', justifyContent: 'center' }, shadow(t)]}>
          <T size={32} lh={40}>{emoji}</T>
        </View>
        <View style={{ flex: 1, gap: 1 }}><T size={16} w="b">버러 마켓</T><T size={12} sub>지도에 이렇게 보여요</T></View>
      </Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, height: 36 }} contentContainerStyle={{ gap: 8 }}>
        {CATS.map((c, i) => <Chip key={c} label={c} active={!q && cat === i} onPress={() => { setQ(''); setCat(i); }} />)}
      </ScrollView>
      <View style={{ gap: 8, minHeight: 192 }}>
        {rows.map((row, ri) => (
          <View key={ri} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {row.map((c, ci) => c ? (
              <Pressable key={ci} onPress={() => pick(c[0])} style={{ width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                backgroundColor: emoji === c[0] ? t.accS : t.card2, borderWidth: emoji === c[0] ? 2 : 0, borderColor: t.acc }}>
                <T size={22} lh={28}>{c[0]}</T>
              </Pressable>
            ) : <View key={ci} style={{ width: 42, height: 42 }} />)}
          </View>
        ))}
      </View>
      <Row gap={8} style={{ height: 44, borderRadius: 22, paddingHorizontal: 16, backgroundColor: t.card2 }}>
        <Icon name="search" size={18} color={t.sub} />
        <TextInput value={q} onChangeText={setQ} placeholder="이모지 검색 (예: 빵, 커피)" placeholderTextColor={t.sub}
          style={{ flex: 1, color: t.text, fontSize: 14, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
      </Row>
      <View style={{ gap: 8 }}><Label>테두리 색</Label><Swatches value={color} onChange={setColor} size={34} iconSize={16} /></View>
      <View style={{ gap: 6 }}><Label>적용 범위</Label><Segmented items={['이 장소만', '런던 폴더 기본값']} value={scope} onChange={setScope} /></View>
    </SheetScreen>
  );
}
