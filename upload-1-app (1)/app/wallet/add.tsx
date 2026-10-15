import { useEffect, useState } from 'react';
import { View, Pressable, TextInput, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, T, Row, Icon, useTheme } from '../../src/kit';
import { SubHeader, Chip, Big, useClose } from '../../src/screens/wallet-report/parts';
import { CountryChips, MoneyInput } from '../../src/screens/wallet/parts';
import { NoTripPage } from '../../src/screens/empty/EmptyCard';
import { CC, DayItem, addExpense, country, dateLong, fetchDayItems, krw, todayYMD, toKRW, useWallet } from '../../src/data/walletStore';

export default function AddExpense() {
  const { t } = useTheme(); const close = useClose();
  const p = useLocalSearchParams<{ c?: string; date?: string }>();
  const w = useWallet();
  const dates = w.dates;
  const [cc, setCc] = useState<CC | null>(typeof p.c === 'string' ? p.c : null);
  const [date, setDate] = useState<string | null>(typeof p.date === 'string' ? p.date : null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<DayItem[]>([]);
  const [sched, setSched] = useState<string | null>(null);
  const [manual, setManual] = useState(false);
  const [cat, setCat] = useState('외식');
  const [memo, setMemo] = useState('');
  const [amt, setAmt] = useState('');
  const [split, setSplit] = useState<string[] | null>(null); // null = 전원
  const [saving, setSaving] = useState(false); const [err, setErr] = useState('');

  const curDate = date && dates.includes(date) ? date : dates.includes(todayYMD()) ? todayYMD() : dates[0] ?? todayYMD();
  const curCc = cc && w.countries.some((x) => x.code === cc) ? cc : w.countries[0]?.code ?? 'KR';
  const tripId = w.trip?.id;
  const di = dates.indexOf(curDate);
  useEffect(() => {
    let live = true; setItems([]);
    if (tripId && di >= 0) fetchDayItems(tripId, di + 1).then((r) => { if (live) setItems(r); });
    return () => { live = false; };
  }, [tripId, di]);

  if (!w.trip) return <NoTripPage title="사용 내역 추가" />;
  const c = country(curCc);
  const cats = w.catsOf(curCc);
  const cur = sched ? items.find((s) => s.id === sched) : null;
  const n = parseFloat(amt) || 0;
  const valid = n > 0 && memo.trim().length > 0 && !saving;
  const allIds = w.members.map((m) => m.userId);
  const sel = split ?? allIds;

  const moveDate = (d: number) => { const j = di + d; if (j >= 0 && j < dates.length) { setDate(dates[j]); setSched(null); setManual(false); setOpen(false); } };
  const pick = (id: string | null) => {
    setOpen(false);
    if (id == null) { setSched(null); setManual(true); setMemo(''); return; }
    const s = items.find((x) => x.id === id)!;
    setSched(id); setManual(false); setMemo(s.title);
    setCat(cats.includes(s.cat) ? s.cat : '기타');
  };
  const toggle = (id: string) => { const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]; if (next.length) setSplit(next); };
  const save = async () => {
    if (!valid) return;
    setSaving(true); setErr('');
    try {
      await addExpense({ country: curCc, date: curDate, cat: cats.includes(cat) ? cat : '기타', title: memo.trim(), amount: n, splitAmong: sel.length === allIds.length ? allIds : sel });
      close();
    } catch (e) { setErr((e as Error).message); setSaving(false); }
  };
  const label = (s: string) => <T size={13} sub>{s}</T>;
  const box = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, height: 48, paddingHorizontal: 16, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 };
  const arrow = (d: number, off: boolean) => (
    <Pressable hitSlop={8} onPress={() => moveDate(d)} style={{ opacity: off ? 0.3 : 1 }}><Icon name={d < 0 ? 'chevl' : 'chev'} size={20} color={t.sub} /></Pressable>
  );
  return (
    <Page gap={14} footer={<Big label={saving ? '저장 중…' : '저장하기'} onPress={save} style={{ opacity: valid ? 1 : 0.4 }} />}>
      <SubHeader title="사용 내역 추가" mb={2} />
      <CountryChips countries={w.countries} value={curCc} onChange={(x) => { setCc(x); setSched(null); if (!manual) setMemo(''); setCat('외식'); }} />
      <View style={{ gap: 6 }}>
        {label('날짜')}
        <View style={box}>
          <Icon name="cal" size={20} color={t.sub} />
          <T size={15} style={{ flex: 1 }}>{dateLong(curDate)}</T>
          {arrow(-1, di <= 0)}{arrow(1, di >= dates.length - 1)}
        </View>
      </View>
      <View style={{ gap: 6 }}>
        {label('이 날의 일정에서 가져오기')}
        <Pressable onPress={() => setOpen(!open)} style={[box, open ? { borderColor: t.acc } : null]}>
          <T size={15} w={cur || manual ? 'm' : 'r'} color={cur || manual ? t.text : t.sub} numberOfLines={1} style={{ flex: 1 }}>
            {cur ? `${cur.time ? cur.time + ' · ' : ''}${cur.title}` : manual ? '직접 입력할게요' : '일정을 선택하세요'}
          </T>
          <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}><Icon name="down" size={18} color={t.sub} /></View>
        </Pressable>
        {open ? (
          <View style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, overflow: 'hidden' }}>
            {items.map((s) => (
              <Pressable key={s.id} onPress={() => pick(s.id)} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: t.line, backgroundColor: s.id === sched ? t.accS : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <T size={14} w={s.id === sched ? 'b' : 'm'} color={s.id === sched ? t.acc : t.text} style={{ flex: 1 }}>{s.time ? `${s.time} · ` : ''}{s.title}</T>
                {s.id === sched ? <Icon name="check" size={16} color={t.acc} /> : null}
              </Pressable>
            ))}
            {items.length === 0 ? <View style={{ padding: 16 }}><T size={13} sub>이 날의 일정이 없어요</T></View> : null}
            <Pressable onPress={() => pick(null)} style={{ paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="pencil" size={16} color={t.acc} /><T size={14} w="b" color={t.acc}>직접 입력할게요</T>
            </Pressable>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 6 }}>
        {label('카테고리')}
        <Row gap={8} align="flex-start" style={{ flexWrap: 'wrap' }}>
          {cats.map((x) => <Chip key={x} label={x} active={x === cat} onPress={() => setCat(x)} />)}
        </Row>
      </View>
      <View style={{ gap: 6 }}>
        {label('내용 / 메모')}
        <View style={box}>
          <TextInput value={memo} onChangeText={setMemo} placeholder="무엇에 쓰셨나요?" placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </View>
        {cur ? <Row gap={4}><Icon name="link" size={12} color={t.acc} /><T size={12} color={t.acc}>일정에서 이름과 카테고리를 채웠어요</T></Row> : null}
      </View>
      <View style={{ gap: 6 }}>
        {label(`결제 금액 (${c.sym} 현지 화폐 기준)`)}
        <MoneyInput value={amt} onChange={setAmt} placeholder="예: 21" prefix={c.sym !== c.cur ? c.sym : undefined} suffix={c.cur} decimals />
        <T size={12} sub>{c.cur === 'KRW' ? '원화 그대로 기록돼요' : n > 0 ? `≈ ${krw(toKRW(n, curCc))} · ${c.sym}1 = ${c.rate.toLocaleString('en-US')}원 (참고 환율)` : `${c.sym}1 = ${c.rate.toLocaleString('en-US')}원 기준으로 환산돼요`}</T>
      </View>
      {w.members.length > 1 ? (
        <View style={{ gap: 6 }}>
          {label('함께 쓴 사람 (균등 분할)')}
          <Row gap={8} align="flex-start" style={{ flexWrap: 'wrap' }}>
            {w.members.map((m) => <Chip key={m.userId} label={m.userId === w.meId ? `${m.nickname} (나)` : m.nickname} active={sel.includes(m.userId)} onPress={() => toggle(m.userId)} />)}
          </Row>
        </View>
      ) : null}
      {err ? <T size={13} w="m" color={t.bad}>{err}</T> : null}
    </Page>
  );
}
