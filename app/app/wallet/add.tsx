import { useState } from 'react';
import { View, Pressable, TextInput, Platform } from 'react-native';
import { Page, Card, T, Row, Icon, useTheme } from '../../src/kit';
import { SubHeader, Chip, Big, useClose } from '../../src/screens/wallet-report/parts';

const cats = ['식비', '교통', '쇼핑', '입장료', '숙소', '기타'];
const people = [['나', '나'], ['민', '민수'], ['지', '지연']];

export default function AddExpense() {
  const { t } = useTheme(); const close = useClose();
  const [cat, setCat] = useState(0); const [pay, setPay] = useState(0);
  const [memo, setMemo] = useState('버러 마켓 점심');
  const [who, setWho] = useState([true, true, true]);
  const label = (s: string) => <T size={13} sub>{s}</T>;
  const box = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, height: 48, paddingHorizontal: 16, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 };
  return (
    <Page gap={12} footer={<Big label="지출 저장" onPress={close} />}>
      <SubHeader title="지출 추가" mb={2} />
      <Card pad={16} style={{ alignItems: 'center', gap: 6 }}>
        <Row gap={6} style={{ backgroundColor: t.acc, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 }}>
          <T size={13} w="b" color="#fff">GBP · £</T>
          <Icon name="down" size={14} color="#fff" />
        </Row>
        <T size={48} w="b" ls={-3}>24.50</T>
        <T size={13} sub>≈ 45,130원 · £1 = 1,842원</T>
      </Card>
      <View style={{ gap: 6 }}>
        {label('카테고리')}
        <Row gap={8} align="flex-start" style={{ flexWrap: 'wrap' }}>
          {cats.map((c, i) => <Chip key={c} label={c} active={i === cat} onPress={() => setCat(i)} />)}
        </Row>
      </View>
      <View style={{ gap: 6 }}>
        {label('결제수단')}
        <Row gap={4} style={{ backgroundColor: t.track, borderRadius: 22, height: 44, padding: 4 }}>
          {['카드', '현금'].map((p, i) => (
            <Pressable key={p} onPress={() => setPay(i)} style={{ flex: 1, height: '100%', borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: i === pay ? t.card : 'transparent' }}>
              <T size={14} w={i === pay ? 'b' : 'm'} color={i === pay ? t.text : t.sub}>{p}</T>
            </Pressable>
          ))}
        </Row>
      </View>
      <View style={{ gap: 6 }}>
        {label('내용')}
        <View style={box}>
          <TextInput value={memo} onChangeText={setMemo} placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </View>
      </View>
      <View style={{ gap: 6 }}>
        {label('날짜')}
        <View style={box}>
          <Icon name="cal" size={20} color={t.sub} />
          <T size={15} style={{ flex: 1 }}>2026.11.20(금) PM 1:20</T>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        {label('함께 한 사람')}
        <Row gap={8} align="flex-start">
          {people.map(([ch, name], i) => {
            const on = who[i];
            return (
              <Pressable key={name} onPress={() => setWho((w) => w.map((x, j) => (j === i ? !x : x)))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 5, paddingRight: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1,
                  backgroundColor: on ? t.accS : t.card, borderColor: on ? t.acc : t.line }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: on ? t.acc : t.line, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={12} w="b" color={on ? '#fff' : t.sub}>{ch}</T>
                </View>
                <T size={14} w={on ? 'b' : 'm'} color={on ? t.acc : t.text}>{name}</T>
              </Pressable>
            );
          })}
        </Row>
      </View>
    </Page>
  );
}
