import { useState } from 'react';
import { View } from 'react-native';
import { Page, Card, T, Row, useTheme } from '../../src/kit';
import { SubHeader, Big, Notice, useClose } from '../../src/screens/wallet-report/parts';
import { MoneyInput } from '../../src/screens/wallet/parts';
import { COUNTRIES, CC, comma, hasBudget, krw, resetBudget, saveBudget, sum, useWallet } from '../../src/data/walletStore';

export default function Budget() {
  const { t } = useTheme(); const close = useClose();
  const w = useWallet();
  const editing = hasBudget(w);
  const [total, setTotal] = useState(editing ? String(w.budget.total) : '');
  const [by, setBy] = useState<Record<CC, string>>({ GB: editing ? String(w.budget.byCountry.GB) : '', FR: editing ? String(w.budget.byCountry.FR) : '', IT: editing ? String(w.budget.byCountry.IT) : '' });
  const T0 = parseInt(total || '0', 10); const alloc = sum(COUNTRIES.map((c) => parseInt(by[c.code] || '0', 10)));
  const left = T0 - alloc; const over = left < 0;
  const valid = T0 > 0 && !over;
  const save = () => { if (!valid) return; saveBudget(T0, { GB: +by.GB || 0, FR: +by.FR || 0, IT: +by.IT || 0 }); close(); };
  const splitEven = () => { const each = Math.floor(T0 / 3 / 1000) * 1000; setBy({ GB: String(each), FR: String(each), IT: String(each) }); };
  return (
    <Page gap={12} footer={<Big label={editing ? '예산 저장' : '예산 설정 완료'} onPress={save} style={{ opacity: valid ? 1 : 0.4 }} />}>
      <SubHeader title={editing ? '예산 수정' : '예산 설정'} mb={3} />
      <Card radius={28} pad={18} style={{ gap: 10 }}>
        <T size={14} w="b">유럽 여행 총 예산</T>
        <MoneyInput value={total} onChange={setTotal} placeholder="예: 3,000,000" suffix="원" size={24} />
        <Row gap={8}>
          <T size={12} sub style={{ flex: 1 }}>나라별 배분 {krw(alloc)}</T>
          <T size={12} w="b" color={over ? t.bad : t.acc}>{over ? `${krw(-left)} 초과` : `미배분 ${krw(Math.max(left, 0))}`}</T>
        </Row>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: t.track, overflow: 'hidden' }}>
          <View style={{ height: 8, width: `${T0 > 0 ? Math.min(100, (alloc / T0) * 100) : 0}%`, backgroundColor: over ? t.bad : t.acc }} />
        </View>
      </Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <T size={17} w="b">나라별 예산</T>
        <T size={13} w="b" color={t.acc} onPress={splitEven}>균등 배분</T>
      </Row>
      {COUNTRIES.map((c) => {
        const v = parseInt(by[c.code] || '0', 10);
        return (
          <Card key={c.code} radius={24} pad={16} style={{ gap: 10 }}>
            <Row gap={10}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><T size={12} w="b" color={t.acc}>{c.badge}</T></View>
              <T size={16} w="b" style={{ flex: 1 }}>{c.name} · {c.city}</T>
              <View style={{ backgroundColor: t.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}><T size={12}>{c.sym} {c.cur}</T></View>
            </Row>
            <MoneyInput value={by[c.code]} onChange={(s) => setBy({ ...by, [c.code]: s })} placeholder="0" suffix="원" />
            <T size={12} sub>≈ {c.sym} {comma(v / c.rate)} · {c.sym}1 = {comma(c.rate)}원</T>
          </Card>
        );
      })}
      <Notice text="나라별 예산 합계는 총 예산을 넘을 수 없어요. 예산은 언제든 다시 수정할 수 있어요." />
      {editing ? <T size={13} w="b" color={t.bad} align="center" onPress={() => { resetBudget(); close(); }}>예산 초기화</T> : null}
    </Page>
  );
}
