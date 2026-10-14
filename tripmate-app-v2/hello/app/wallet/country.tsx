import { useState } from 'react';
import { View } from 'react-native';
import { Page, Card, T, Row, useTheme } from '../../src/kit';
import { SubHeader, Chip } from '../../src/screens/wallet-report/parts';

const countries = ['영국', '프랑스', '이탈리아'];
const cats = [
  { name: '식비', amt: '£202.60', pct: '42%', color: '#1e6fff', w: 134 },
  { name: '교통', amt: '£101.30', pct: '21%', color: '#34c759', w: 67 },
  { name: '쇼핑', amt: '£86.80', pct: '18%', color: '#ff9f0a', w: 57 },
  { name: '입장료', amt: '£91.60', pct: '19%', color: '#af52de', w: 60 },
];
const days = [['18', 30], ['19', 52], ['20', 80], ['21', 44], ['22', 62], ['23', 24], ['24', 38]] as const;

export default function Country() {
  const { t } = useTheme();
  const [sel, setSel] = useState(0);
  return (
    <Page gap={12}>
      <SubHeader title="나라별 지출" mb={3} />
      <Row gap={8} align="flex-start">
        {countries.map((c, i) => <Chip key={c} label={c} active={i === sel} onPress={() => setSel(i)} />)}
      </Row>
      <Card pad={18} style={{ gap: 8 }}>
        <Row gap={10}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
            <T size={12} w="b" color={t.acc}>UK</T>
          </View>
          <T size={16} w="b">영국 · 런던</T>
        </Row>
        <T size={36} w="b" ls={-3}>£ 482.30</T>
        <T size={13} sub>≈ 888,300원 · £1 = 1,842원</T>
        <View style={{ height: 12, borderRadius: 6, overflow: 'hidden', flexDirection: 'row' }}>
          {cats.map((c) => <View key={c.name} style={{ flex: c.w, backgroundColor: c.color }} />)}
        </View>
      </Card>
      <Card style={{ gap: 12, paddingHorizontal: 18, paddingVertical: 16 }}>
        {cats.map((c) => (
          <Row key={c.name} gap={10}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.color }} />
            <T size={14} style={{ flex: 1 }}>{c.name}</T>
            <T size={14} w="b">{c.amt}</T>
            <T size={12} sub align="right" style={{ width: 32 }}>{c.pct}</T>
          </Row>
        ))}
      </Card>
      <Card style={{ gap: 12, paddingHorizontal: 18, paddingVertical: 16 }}>
        <T size={14} w="b">일자별 지출</T>
        <Row align="flex-end" style={{ justifyContent: 'space-between' }}>
          {days.map(([d, h]) => (
            <View key={d} style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 24, height: h, borderRadius: 8, backgroundColor: d === '20' ? t.acc : t.accS }} />
              <T size={11} sub>{d}</T>
            </View>
          ))}
        </Row>
      </Card>
    </Page>
  );
}
