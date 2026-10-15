import { useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, Card, T, Row, Icon, useTheme } from '../../src/kit';
import { SubHeader, Chip, Big, useClose } from '../../src/screens/wallet-report/parts';
import { MoneyInput } from '../../src/screens/wallet/parts';
import { country, dateLong, deleteExpense, krw, num, toKRW, updateExpense, useWallet } from '../../src/data/walletStore';

export default function ExpenseDetail() {
  const { t } = useTheme(); const close = useClose();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const w = useWallet();
  const e = w.expenses.find((x) => x.id === id);
  const [memo, setMemo] = useState(e?.title ?? '');
  const [amt, setAmt] = useState(e ? num(e.amount) : '');
  const [cat, setCat] = useState(e?.cat ?? '기타');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  if (!e) return (
    <Page gap={12}><SubHeader title="지출 상세" /><Card style={{ alignItems: 'center', padding: 30 }}><T size={14} sub>삭제되었거나 없는 지출이에요</T></Card></Page>
  );
  const c = country(e.country);
  const n = parseFloat(amt) || 0; const valid = n > 0 && memo.trim().length > 0;
    const box = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, height: 48, paddingHorizontal: 16, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 };
  const base = w.catsOf(e.country); const cats = base.includes(cat) ? base : [...base, cat];
  const run = async (f: () => Promise<void>) => { if (busy) return; setBusy(true); setErr(''); try { await f(); close(); } catch (x) { setErr((x as Error).message); setBusy(false); } };
  return (
    <Page gap={14} footer={<Row gap={10}>
      <Big label="삭제" kind="ghost" onPress={() => run(() => deleteExpense(e.id))} style={{ width: 100 }} />
      <Big label="저장하기" onPress={() => { if (valid) run(() => updateExpense(e.id, { title: memo.trim(), amount: n, cat })); }} style={{ flex: 1, opacity: valid ? 1 : 0.4 }} />
    </Row>}>
      <SubHeader title="지출 상세" mb={2} />
      <Card pad={16} style={{ alignItems: 'center', gap: 4 }}>
        <T size={13} sub>{c.name} · {dateLong(e.date)}</T>
        <T size={36} w="b" ls={-3}>{num(n)} {c.sym}</T>
        <T size={13} sub>≈ {krw(toKRW(n, e.country))}</T>
      </Card>
      <T size={12} sub>결제한 사람 · {w.nameOf(e.paidBy)}</T>
      <View style={{ gap: 6 }}>
        <T size={13} sub>카테고리</T>
        <Row gap={8} align="flex-start" style={{ flexWrap: 'wrap' }}>{cats.map((x) => <Chip key={x} label={x} active={x === cat} onPress={() => setCat(x)} />)}</Row>
      </View>
      <View style={{ gap: 6 }}>
        <T size={13} sub>내용 / 메모</T>
        <View style={box}>
          <TextInput value={memo} onChangeText={setMemo} placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <T size={13} sub>결제 금액 ({c.sym})</T>
        <MoneyInput value={amt} onChange={setAmt} prefix={c.sym !== c.cur ? c.sym : undefined} suffix={c.cur} decimals />
      </View>
      {err ? <T size={13} w="m" color={t.bad}>{err}</T> : null}
    </Page>
  );
}
