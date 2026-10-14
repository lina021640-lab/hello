import { useRef, useState } from 'react';
import { View, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Icon, shadow, useTheme } from '../src/kit';
import { SubHeader, Chip, Box } from '../src/screens/wallet-report/parts';

type Msg = { me: boolean; m: string };
const places = [
  { name: '대영박물관', sub: '박물관', c: ['#8cc0ff', '#1e6fff'] },
  { name: '내셔널 갤러리', sub: '미술관', c: ['#c7b3ff', '#7a5af8'] },
  { name: '코벤트 가든', sub: '쇼핑·카페', c: ['#ffc58f', '#ff7a45'] },
];
const quick = ['일정에 추가', '근처 맛집', '예산 알려줘'];

function Grad({ id, c }: { id: string; c: string[] }) {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={c[0]} /><Stop offset="0.71" stopColor={c[1]} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

export default function Chatbot() {
  const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [msgs, setMsgs] = useState<Msg[]>([
    { me: false, m: '안녕하세요! 유럽여행 일정 도와드릴게요.\n무엇이 궁금하세요?' },
    { me: true, m: '런던에서 비 오는 날 갈 만한 곳 추천해줘' },
    { me: false, m: '비 오는 날엔 실내 코스가 좋아요.\n3일차에 넣기 좋은 곳이에요.' },
  ]);
  const [extra, setExtra] = useState<Msg[]>([]);
  const [v, setV] = useState('');
  const sc = useRef<ScrollView>(null);
  const send = (text: string) => {
    if (!text.trim()) return;
    setExtra((p) => [...p, { me: true, m: text }, { me: false, m: '(예시 응답) 실제 앱에서는 AI 답변이 표시돼요.' }]);
    setV('');
    setTimeout(() => sc.current?.scrollToEnd({ animated: true }), 50);
  };
  const bot = (m: string, k: string | number) => (
    <Row key={k} align="flex-start" gap={8}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="spark" size={18} color="#fff" />
      </View>
      <Box style={{ width: 270, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12 }}>
        <T size={14} lh={21}>{m}</T>
      </Box>
    </Row>
  );
  const user = (m: string, k: string | number) => (
    <View key={k} style={{ alignItems: 'flex-end' }}>
      <View style={{ maxWidth: 250, backgroundColor: t.acc, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12 }}>
        <T size={14} lh={21} color="#fff">{m}</T>
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: Math.max(ins.top, 20) }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SubHeader title="트립메이트 AI" mb={4} right={
          <Row gap={6}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.ok }} /><T size={12} sub>온라인</T></Row>
        } />
      </View>
      <ScrollView ref={sc} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, gap: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}><T size={12}>오늘</T></View>
        </View>
        {msgs.map((x, i) => (x.me ? user(x.m, i) : bot(x.m, i)))}
        <Row align="flex-start" gap={8} style={{ paddingLeft: 40 }}>
          {places.map((p, i) => (
            <Box key={p.name} style={{ width: 96, borderRadius: 16, paddingTop: 6, paddingBottom: 8, paddingHorizontal: 6, gap: 6 }}>
              <View style={{ height: 62, borderRadius: 12, overflow: 'hidden' }}><Grad id={`g${i}`} c={p.c} /></View>
              <View style={{ paddingHorizontal: 2 }}><T size={12} w="b">{p.name}</T><T size={11} sub>{p.sub}</T></View>
            </Box>
          ))}
        </Row>
        <Row align="flex-start" gap={8} style={{ paddingLeft: 40 }}>
          {quick.map((q, i) => <Chip key={q} label={q} active={i === 0} size={13} py={7} onPress={() => send(q)} />)}
        </Row>
        {extra.map((x, i) => (x.me ? user(x.m, `e${i}`) : bot(x.m, `e${i}`)))}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: Math.max(ins.bottom, 28) }}>
        <View style={[{ height: 56, borderRadius: 28, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 18, paddingRight: 8 }, shadow(t)]}>
          <Icon name="plus" size={20} color={t.sub} />
          <TextInput value={v} onChangeText={setV} onSubmitEditing={() => send(v)} placeholder="메시지를 입력하세요" placeholderTextColor={t.sub} returnKeyType="send"
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          <Pressable onPress={() => send(v)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
