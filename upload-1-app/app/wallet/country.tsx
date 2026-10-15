import { useState } from 'react';
import { View, Pressable, TextInput, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, Card, T, Row, Icon, useGo, useTheme } from '../../src/kit';
import { SubHeader } from '../../src/screens/wallet-report/parts';
import { NoTripPage } from '../../src/screens/empty/EmptyCard';
import { CountryChips, Donut, ExpenseRow } from '../../src/screens/wallet/parts';
import { CC, addCat, catColor, country, hasBudget, krw, local, manwon, removeCat, spentLocal, toKRW, useWallet } from '../../src/data/walletStore';

export default function Country() {
  const { t } = useTheme(); const go = useGo();
  const params = useLocalSearchParams<{ c?: string }>();
  const [cc0, setCc] = useState<CC | null>(typeof params.c === 'string' ? params.c : null);
  const [open, setOpen] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [newCat, setNewCat] = useState('');
  const w = useWallet();
  if (!w.trip) return <NoTripPage title="나라별 지갑" />;
  const cc = cc0 && w.countries.some((x) => x.code === cc0) ? cc0 : w.countries[0].code;
  const c = country(cc, w.countries.find((x) => x.code === cc)?.city);
  const budget = w.budget.byCountry[cc] ?? 0;
  const budgeted = hasBudget(w) && budget > 0;
  const cats = w.catsOf(cc);
  const mine = w.expenses.filter((e) => e.country === cc);
  const spentK = mine.reduce((a, e) => a + toKRW(e.amount, cc), 0);
  const spentL = spentLocal(w, cc);
  const remain = budget - spentK;
  const denom = budgeted ? Math.max(budget, spentK) : spentK;
  const segs = cats.map((n, i) => ({ frac: denom ? mine.filter((e) => e.cat === n).reduce((a, e) => a + toKRW(e.amount, cc), 0) / denom : 0, color: catColor(i, t.sub) }));
  const over = budgeted && remain < 0;

  return (
    <Page gap={12}>
      <SubHeader title={`${c.name} 지갑`} mb={3}
        right={<Pressable onPress={() => go('/wallet/budget')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icon name="pencil" size={14} color={t.acc} /><T size={13} w="b" color={t.acc}>예산 수정</T></Pressable>} />
      <CountryChips countries={w.countries} value={cc} onChange={(x) => { setCc(x); setOpen(null); setEdit(false); }} />
      <Card pad={18} radius={28} style={{ alignItems: 'center', gap: 6, paddingTop: 20 }}>
        <Pressable onPress={() => go('/wallet/budget')} style={{ alignItems: 'center' }}>
          <View style={{ backgroundColor: t.acc, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 }}>
            <T size={13} w="b" color="#fff">{budgeted ? `예산 ${manwon(budget)}` : '예산 설정하기'}</T>
          </View>
          <View style={{ width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: t.acc }} />
        </Pressable>
        <Donut size={200} stroke={26} segs={segs}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <T size={13} sub>{!budgeted ? '총 사용' : over ? '초과 금액' : '남은 금액'}</T>
            <T size={24} w="b" ls={-3} color={over ? t.bad : t.text}>{krw(budgeted ? Math.abs(remain) : spentK)}</T>
          </View>
        </Donut>
        <Row gap={20} style={{ paddingTop: 8 }}>
          <View style={{ alignItems: 'center', gap: 2 }}><T size={12} sub>사용 금액</T><T size={20} w="b" ls={-2}>{krw(spentK)}</T></View>
          <View style={{ width: 1, height: 28, backgroundColor: t.line }} />
          <View style={{ alignItems: 'center', gap: 2 }}><T size={12} sub>현지 화폐</T><T size={20} w="b" ls={-2}>{local(spentL, cc)}</T></View>
        </Row>
      </Card>
      <Card radius={28} style={{ gap: 4, paddingHorizontal: 18, paddingVertical: 16 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <T size={17} w="b">총 사용 내역</T>
          <T size={12} sub>항목을 눌러 상세 보기</T>
        </Row>
        {cats.map((n, i) => {
          const items = mine.filter((e) => e.cat === n).sort((a, b) => (a.date < b.date ? 1 : -1));
          const amt = items.reduce((a, e) => a + e.amount, 0);
          const isOpen = open === n && !edit;
          return (
            <View key={n}>
              <Pressable onPress={() => (edit ? (items.length === 0 ? removeCat(cc, n) : null) : setOpen(isOpen ? null : n))}>
                <Row gap={10} style={{ paddingVertical: 11 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: catColor(i, t.sub) }} />
                  <T size={14} style={{ flex: 1 }}>{n}</T>
                  <T size={14} w="b">{local(amt, cc)}</T>
                  {edit
                    ? <Icon name="x" size={16} color={items.length === 0 ? t.bad : t.line} />
                    : <View style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}><Icon name="chev" size={18} color={t.sub} /></View>}
                </Row>
              </Pressable>
              {isOpen ? (
                <View style={{ backgroundColor: t.bg, borderRadius: 18, padding: 14, gap: 14, marginBottom: 6 }}>
                  {items.length === 0 ? <T size={12} sub align="center">이 카테고리의 지출이 없어요</T> : null}
                  {items.map((e) => <ExpenseRow key={e.id} e={e} onPress={() => go(`/wallet/expense?id=${e.id}`)} />)}
                </View>
              ) : null}
            </View>
          );
        })}
        {edit ? (
          <Row gap={8} style={{ paddingTop: 6 }}>
            <View style={{ flex: 1, height: 44, borderRadius: 14, borderWidth: 1, borderColor: t.line, justifyContent: 'center', paddingHorizontal: 14 }}>
              <TextInput value={newCat} onChangeText={setNewCat} placeholder="새 카테고리 이름" placeholderTextColor={t.sub}
                style={{ color: t.text, fontSize: 14, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
            </View>
            <Pressable onPress={() => { addCat(cc, newCat); setNewCat(''); }} style={{ height: 44, borderRadius: 22, backgroundColor: t.acc, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' }}>
              <T size={14} w="b" color="#fff">추가</T>
            </Pressable>
          </Row>
        ) : null}
        <Row style={{ justifyContent: 'flex-end', paddingTop: 8 }}>
          <T size={13} w="b" color={t.acc} onPress={() => { setEdit(!edit); setOpen(null); }}>{edit ? '편집 완료' : '카테고리 편집'}</T>
        </Row>
        {edit ? <T size={11} sub align="right">지출이 없는 카테고리만 삭제할 수 있어요</T> : null}
      </Card>
      <Pressable onPress={() => go(`/wallet/add?c=${cc}`)} style={{ height: 56, borderRadius: 28, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.acc, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
        <Icon name="plus" size={18} color={t.acc} /><T size={15} w="b" color={t.acc}>사용 내역 추가</T>
      </Pressable>
    </Page>
  );
}
