import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Page, Card, T, Row, useGo, useTheme } from '../../src/kit';
import { SubHeader, Chip } from '../../src/screens/wallet-report/parts';
import { NoTripPage } from '../../src/screens/empty/EmptyCard';
import { ExpenseRow } from '../../src/screens/wallet/parts';
import { CC, dateLabel, krw, sortedExpenses, sum, toKRW, useWallet } from '../../src/data/walletStore';

export default function Recent() {
  const { t } = useTheme(); const go = useGo();
  const w = useWallet();
  const [cc, setCc] = useState<CC | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  if (!w.trip) return <NoTripPage title="전체 지출" />;
  const COUNTRIES = w.countries;
  const catNames = Array.from(new Set(COUNTRIES.filter((c) => !cc || c.code === cc).flatMap((c) => w.catsOf(c.code))));
  const list = sortedExpenses(w).filter((e) => (!cc || e.country === cc) && (!cat || e.cat === cat));
  const groups: { date: string; items: typeof list }[] = [];
  list.forEach((e) => { const g = groups.find((x) => x.date === e.date); if (g) g.items.push(e); else groups.push({ date: e.date, items: [e] }); });
  const total = sum(list.map((e) => toKRW(e.amount, e.country)));
  const chips = (children: React.ReactNode) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>{children}</ScrollView>
  );
  return (
    <Page gap={12}>
      <SubHeader title="전체 지출" mb={3} />
      {chips(<>
        <Chip label="전체 나라" active={!cc} onPress={() => { setCc(null); setCat(null); }} />
        {COUNTRIES.map((c) => <Chip key={c.code} label={`${c.flag} ${c.name}`.trim()} active={cc === c.code} onPress={() => { setCc(c.code); setCat(null); }} />)}
      </>)}
      {chips(<>
        <Chip label="전체 카테고리" size={13} py={6} active={!cat} onPress={() => setCat(null)} />
        {catNames.map((n) => <Chip key={n} label={n} size={13} py={6} active={cat === n} onPress={() => setCat(cat === n ? null : n)} />)}
      </>)}
      <Row style={{ justifyContent: 'space-between' }}>
        <T size={13} sub>{list.length}건</T>
        <T size={13} w="b">합계 {krw(total)}</T>
      </Row>
      {groups.length === 0 ? <Card style={{ alignItems: 'center', paddingVertical: 30 }}><T size={14} sub>{w.expenses.length === 0 ? '아직 지출이 없어요' : '조건에 맞는 지출이 없어요'}</T></Card> : null}
      {groups.map((g) => (
        <View key={g.date} style={{ gap: 8 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T size={15} w="b">{dateLabel(g.date)}</T>
            <T size={12} sub>{krw(sum(g.items.map((e) => toKRW(e.amount, e.country))))}</T>
          </Row>
          <Card style={{ gap: 14 }}>
            {g.items.map((e) => <ExpenseRow key={e.id} e={e} showCountry onPress={() => go(`/wallet/expense?id=${e.id}`)} />)}
          </Card>
        </View>
      ))}
    </Page>
  );
}
