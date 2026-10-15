import { useState } from 'react';
import { View, TextInput, Pressable, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, T, Btn, Row, Icon, useTheme } from '../../src/kit';
import { Label, Chip } from '../../src/screens/saved2/parts';
import { NoTripPage } from '../../src/screens/empty/EmptyCard';
import { sharePlace, useFeed, useSaved } from '../../src/data/savedStore';
import { EMOJI_GROUPS, ALL_EMOJIS, PRESET_EMOJIS } from '../../src/data/emojiData';

const cats = ['맛집', '카페', '명소', '쇼핑'];
const lastGrapheme = (str: string) => {
  const Seg = (Intl as any).Segmenter;
  const arr: string[] = Seg ? Array.from(new Seg(undefined, { granularity: 'grapheme' }).segment(str), (x: any) => x.segment) : Array.from(str);
  const v = arr.filter((c) => c.trim());
  return v.length ? v[v.length - 1] : '';
};

export default function Share() {
  const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const p = useLocalSearchParams<{ name?: string; cat?: string }>();
  const feed = useFeed(); const sv = useSaved();
  const [name, setName] = useState(typeof p.name === 'string' ? p.name : '');
  const [cat, setCat] = useState(Math.max(0, cats.indexOf(typeof p.cat === 'string' ? p.cat : '')));
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  const [tagText, setTagText] = useState('');
  const [more, setMore] = useState(false);
  const [eq, setEq] = useState('');
  const [grp, setGrp] = useState(0);
  const addTag = () => {
    const v = tagText.replace(/[#\s]+/g, ' ').trim().replace(/\s+/g, '');
    if (v) { const tg = '#' + v; setTags((p) => (p.includes(tg) ? p : [...p, tg])); }
    setTagText(''); if (!v) setTagOpen(false);
  };
  const pool = eq.trim() ? ALL_EMOJIS.filter(([e, k]) => k.includes(eq.trim()) || e === eq.trim()) : EMOJI_GROUPS[grp].items;
  const [emoji, setEmoji] = useState('📍');
  const done = () => (r.canGoBack() ? r.back() : r.replace('/saved'));
  const valid = name.trim().length > 0 && !busy;
  const post = async () => {
    if (!valid) return;
    setBusy(true); setErr('');
    const mine = sv.items.find((x) => x.n === name.trim());
    try {
      await sharePlace({ n: name.trim(), e: emoji, cat: cats[cat], q: text.trim(), tags, lat: mine?.lat, lng: mine?.lng });
      r.replace('/saved/feed');
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  if (!feed.hasTrip) return <NoTripPage title="장소 공유하기" body="공유는 여행 동료끼리 이뤄져요. 여행을 만들거나 초대 코드로 합류해 주세요." />;
  const box = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line } as const;
  return (
    <Page gap={12} top={false} footer={<Btn label={busy ? '공유 중…' : '공유하기'} onPress={post} disabled={!valid} />}>
      {/* 피그마 Header: 상태바 아래 46px, ← 22 + 제목 18 Medium, 우측 '게시' 16 Bold */}
      <View style={{ height: Math.max(ins.top, 37) + 46, paddingTop: Math.max(ins.top, 37), marginHorizontal: -20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable hitSlop={10} onPress={done}><Icon name="back" size={22} color={t.text} /></Pressable>
        <T size={18} w="m" style={{ flex: 1 }}>장소 공유하기</T>
        <T size={16} w="b" color={valid ? t.acc : t.sub} onPress={post}>게시</T>
      </View>
      <Row gap={10} style={[{ height: 52, borderRadius: 16, paddingHorizontal: 16, marginTop: 3 }, box]}>
        <Icon name="pin" size={20} color={t.acc} />
        <TextInput value={name} onChangeText={setName} placeholder="공유할 장소 이름" placeholderTextColor={t.sub} maxLength={60}
          style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '700', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
      </Row>
      <View style={{ gap: 6 }}>
        <Label>카테고리</Label>
        <Row gap={8}>{cats.map((c, i) => <Chip key={c} label={c} active={cat === i} onPress={() => setCat(i)} />)}</Row>
      </View>
      <View style={{ gap: 8 }}>
        <Label>공유 피드 마커 이모지</Label>
        <Row gap={10} style={{ alignItems: 'center' }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: t.acc }}>
            {emoji ? <T size={26} lh={32}>{emoji}</T> : <Icon name="pin" size={22} color={t.acc} />}
          </View>
          <TextInput value={emoji} onChangeText={(v) => setEmoji(lastGrapheme(v))} placeholder="이모지 직접 입력 · 붙여넣기" placeholderTextColor={t.sub} autoCorrect={false}
            style={{ flex: 1, height: 44, borderRadius: 14, paddingHorizontal: 14, color: t.text, fontSize: 14, ...box, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          {emoji ? <Pressable onPress={() => setEmoji('')} hitSlop={8} accessibilityLabel="이모지 지우기" style={{ height: 44, paddingHorizontal: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.card2 }}><T size={13} w="b" sub>지우기</T></Pressable> : null}
        </Row>
        <T size={11} sub>키보드의 이모지 키보드로 아무 이모지나 입력할 수 있어요. 비워 두면 기본 핀으로 보여요.</T>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {PRESET_EMOJIS.map((e) => (
            <Pressable key={e} onPress={() => setEmoji(e)} style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: emoji === e ? t.accS : t.card2, borderWidth: emoji === e ? 2 : 0, borderColor: t.acc }}>
              <T size={22} lh={28}>{e}</T>
            </Pressable>
          ))}
        </Row>
        <Pressable onPress={() => setMore(!more)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4 }}>
          <T size={13} w="b" color={t.acc}>{more ? '이모지 목록 닫기' : `이모지 더 보기 (${ALL_EMOJIS.length}개)`}</T>
        </Pressable>
        {more ? (
          <View style={[{ borderRadius: 16, padding: 12, gap: 10 }, box]}>
            <Row gap={8} style={{ height: 40, borderRadius: 20, paddingHorizontal: 14, backgroundColor: t.card2 }}>
              <Icon name="search" size={16} color={t.sub} />
              <TextInput value={eq} onChangeText={setEq} placeholder="이모지 검색 (예: 빵, 커피, 해변)" placeholderTextColor={t.sub}
                style={{ flex: 1, color: t.text, fontSize: 13, paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
            </Row>
            {!eq.trim() ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 6 }}>
                {EMOJI_GROUPS.map((g, i) => <Chip key={g.name} label={g.name} active={grp === i} onPress={() => setGrp(i)} />)}
              </ScrollView>
            ) : null}
            <ScrollView nestedScrollEnabled style={{ height: 236 }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {pool.map(([e]) => (
                <Pressable key={e} onPress={() => setEmoji(e)} style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: emoji === e ? t.accS : t.card2, borderWidth: emoji === e ? 2 : 0, borderColor: t.acc }}>
                  <T size={22} lh={28}>{e}</T>
                </Pressable>
              ))}
              {pool.length === 0 ? <T size={13} sub>검색 결과가 없어요. 위 입력칸에 직접 붙여넣어도 돼요.</T> : null}
            </ScrollView>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 6 }}>
        <Label>한 줄 소개</Label>
        <View style={[{ borderRadius: 16, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 16, gap: 8 }, box]}>
          <TextInput value={text} onChangeText={(s) => setText(s.slice(0, 200))} multiline placeholder="한 줄 소개" placeholderTextColor={t.sub}
            style={{ color: t.text, fontSize: 14, fontWeight: '500', lineHeight: 21, minHeight: 21, padding: 0, textAlignVertical: 'top', ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          <T size={11} sub align="right">{text.length}/200</T>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Label>태그</Label>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {tags.map((c) => (
            <Pressable key={c} onPress={() => setTags(tags.filter((x) => x !== c))} accessibilityLabel={`${c} 삭제`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 14, paddingRight: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: t.accS }}>
              <T size={13} w="b" color={t.acc}>{c}</T><Icon name="x" size={12} color={t.acc} />
            </Pressable>
          ))}
          {!tagOpen ? <Chip label="+ 태그" onPress={() => setTagOpen(true)} /> : null}
        </Row>
        {tagOpen ? (
          <Row gap={8}>
            <View style={[{ flex: 1, height: 44, borderRadius: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 2 }, box]}>
              <T size={14} w="b" color={t.acc}>#</T>
              <TextInput autoFocus value={tagText} onChangeText={(v) => setTagText(v.replace(/^#+/, ''))} onSubmitEditing={addTag} returnKeyType="done" blurOnSubmit={false}
                placeholder="태그 입력" placeholderTextColor={t.sub} maxLength={20}
                style={{ flex: 1, color: t.text, fontSize: 14, paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
            </View>
            <Pressable onPress={addTag} style={{ height: 44, paddingHorizontal: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: t.acc }}><T size={14} w="b" color="#fff">완료</T></Pressable>
          </Row>
        ) : null}
      </View>
      <Row gap={10} align="flex-start" style={[{ borderRadius: 18, paddingHorizontal: 14, paddingVertical: 14 }, box]}>
        <Icon name="users" size={20} color={t.acc} />
        <View style={{ flex: 1, gap: 3 }}>
          <T size={14} w="b" lh={21}>같이 가는 여행 동료에게만 공유돼요</T>
          <T size={12} lh={18} sub>트립메이트는 함께 여행하는 동료끼리만 연결돼요. 공개 게시는 지원하지 않아요.</T>
        </View>
      </Row>
      {err ? <T size={13} w="m" color={t.bad}>{err}</T> : null}
    </Page>
  );
}
