import { View, Pressable } from 'react-native';
import { Page, TabTitle, Pill, Card, T, Row, Icon, IconTile, SectionHead, useGo, useTheme, IconName } from '../../src/kit';
import { COUNTRIES, TODAY, comma, hasBudget, krw, sortedExpenses, spentKRW, sum, toKRW, useWallet } from '../../src/data/walletStore';
import { ExpenseRow } from '../../src/screens/wallet/parts';

export default function Wallet() {
  const go = useGo(); const { t } = useTheme();
  const w = useWallet();
  const budgeted = hasBudget(w);
  const total = w.budget.total ?? 0;
  const spent = spentKRW(w);
  const pct = budgeted ? Math.min(100, Math.round((spent / total) * 100)) : 0;
  const today = sum(w.expenses.filter((e) => e.date === TODAY).map((e) => toKRW(e.amount, e.country)));
  const recent = sortedExpenses(w).slice(0, 3);
  const actions: { icon: IconName; label: string; to: string }[] = [
    { icon: 'plus', label: '지출 추가', to: '/wallet/add' },
    { icon: 'swap', label: '환율 계산', to: '/wallet/rate' },
    { icon: 'users', label: '정산하기', to: '/wallet/settle' },
  ];
  const onBlue = 'rgba(255,255,255,0.85)';
  return (
    <Page tab gap={12}>
      <TabTitle title="지갑" right={<Pill label="유럽여행" trail="down" onPress={() => go('/trip/edit')} />} />
      {/* budget hero */}
      <View style={{ backgroundColor: t.acc, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 18, gap: 7, minHeight: 191 }}>
        <Row>
          <T size={14} color={onBlue} style={{ flex: 1 }}>총 지출</T>
          {budgeted ? (
            <Pressable onPress={() => go('/wallet/budget')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
              <Icon name="pencil" size={13} color="#fff" /><T size={12} w="b" color="#fff">예산 수정</T>
            </Pressable>
          ) : null}
        </Row>
        <T size={36} w="b" ls={-3} color="#fff">{krw(spent)}</T>
        {budgeted ? (
          <>
            <T size={13} color="rgba(255,255,255,0.9)">예산 {krw(total)} 중 {pct}%</T>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.28)' }}>
              <View style={{ height: 8, width: `${pct}%`, borderRadius: 4, backgroundColor: '#fff' }} />
            </View>
            <Row gap={24} style={{ paddingTop: 10 }}>
              <View style={{ gap: 2 }}><T size={12} color="rgba(255,255,255,0.8)">오늘</T><T size={15} w="b" color="#fff">{krw(today)}</T></View>
              <View style={{ gap: 2 }}><T size={12} color="rgba(255,255,255,0.8)">{total - spent < 0 ? '초과 금액' : '남은 예산'}</T><T size={15} w="b" color="#fff">{krw(Math.abs(total - spent))}</T></View>
            </Row>
          </>
        ) : (
          <>
            <T size={13} lh={19} color="rgba(255,255,255,0.9)">아직 여행 예산이 없어요. 총 예산과 나라별 예산을 정하면 남은 금액을 바로 확인할 수 있어요.</T>
            <Pressable onPress={() => go('/wallet/budget')} style={{ marginTop: 6, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <Icon name="plus" size={16} color={t.acc} /><T size={15} w="b" color={t.acc}>예산 설정하기</T>
            </Pressable>
          </>
        )}
      </View>
      {/* quick actions */}
      <Row gap={10} align="stretch">
        {actions.map((a) => (
          <Card key={a.label} onPress={() => go(a.to)} radius={22} pad={0} style={{ flex: 1, alignItems: 'center', gap: 8, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 8 }}>
            <IconTile name={a.icon} size={44} icon={22} />
            <T size={13}>{a.label}</T>
          </Card>
        ))}
      </Row>
      {/* exchange */}
      <Card radius={20} pad={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T size={12} sub>오늘의 환율</T>
          <T size={15} w="b">£1 = {comma(COUNTRIES[0].rate)}원 · €1 = {comma(COUNTRIES[1].rate)}원</T>
        </View>
        <Pill label="09:00 기준" size={12} py={5} px={10} />
      </Card>
      {/* per-country wallets */}
      <SectionHead title="나라별 지갑" />
      <Card style={{ gap: 14 }}>
        {COUNTRIES.map((c) => {
          const s = spentKRW(w, c.code); const b = w.budget.byCountry[c.code];
          const p = b > 0 ? Math.min(100, (s / b) * 100) : 0;
          return (
            <Pressable key={c.code} onPress={() => go(`/wallet/country?c=${c.code}`)}>
              <Row gap={12}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={12} w="b" color={t.acc}>{c.badge}</T>
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  <Row><T size={15} w="b" style={{ flex: 1 }}>{c.name}</T><T size={15} w="b">{krw(s)}</T></Row>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: t.track }}><View style={{ height: 6, width: `${p}%`, borderRadius: 3, backgroundColor: t.acc }} /></View>
                  <T size={12} sub>{b > 0 ? `예산 ${krw(b)}` : '예산 미설정'}</T>
                </View>
                <Icon name="chev" size={18} color={t.sub} />
              </Row>
            </Pressable>
          );
        })}
      </Card>
      <SectionHead title="최근 지출" link="전체보기" onLink={() => go('/wallet/recent')} />
      <Card style={{ gap: 14 }}>
        {recent.length === 0 ? <T size={13} sub align="center">아직 지출이 없어요</T> : null}
        {recent.map((r) => <ExpenseRow key={r.id} e={r} onPress={() => go(`/wallet/expense?id=${r.id}`)} />)}
      </Card>
    </Page>
  );
}
