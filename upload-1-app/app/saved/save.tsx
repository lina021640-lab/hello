import { useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { T, Btn, Row, useTheme, shadow } from '../../src/kit';
import { SheetScreen, Label, PhotoBox } from '../../src/screens/saved2/parts';
import { usePlace } from '../../src/data/placeData';
import { savePlace } from '../../src/data/savedStore';

/** 장소 저장 / 메모 수정 — saved_places 에 저장 */
export default function SavePlace() {
  const r = useRouter(); const { t } = useTheme();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const pl = usePlace(name);
  const [memo, setMemo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const value = memo ?? pl.note;
  const sub = [pl.city, pl.cat, pl.rating].filter(Boolean).join(' · ');
  const save = async () => {
    if (busy) return;
    setBusy(true); setErr('');
    try { await savePlace({ n: pl.n, cat: pl.cat, addr: pl.addr, note: value.trim(), lat: pl.lat, lng: pl.lng }); r.canGoBack() ? r.back() : r.replace('/saved'); }
    catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  return (
    <SheetScreen top={284} title={pl.saved ? '메모 수정' : '장소 저장'} footerBottom={30}
      back={<View style={[{ backgroundColor: t.card, borderRadius: 24, padding: 16, gap: 6 }, shadow(t)]}><T size={18} w="b">{pl.n}</T>{sub ? <T size={13} sub>{sub}</T> : null}</View>}
      footer={<Btn label={busy ? '저장 중…' : pl.saved ? '메모 저장' : '저장하기'} onPress={save} />}>
      <Row gap={12} style={{ backgroundColor: t.card2, borderRadius: 18, paddingLeft: 10, paddingRight: 12, paddingVertical: 10 }}>
        <PhotoBox size={44} radius={12} icon={18} />
        <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">{pl.n}</T>{sub ? <T size={12} sub>{sub}</T> : null}</View>
      </Row>
      <View style={{ gap: 6 }}>
        <Label>메모 (선택)</Label>
        <View style={{ height: 48, borderRadius: 16, backgroundColor: t.card2, paddingHorizontal: 16, justifyContent: 'center' }}>
          <TextInput value={value} onChangeText={setMemo} placeholder="메모" placeholderTextColor={t.sub}
            style={{ color: t.text, fontSize: 14, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </View>
      </View>
      {err ? <T size={13} color={t.bad}>{err}</T> : null}
    </SheetScreen>
  );
}
