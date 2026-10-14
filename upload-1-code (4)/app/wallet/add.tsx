import { useState } from 'react';
import { View, Pressable, TextInput, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page, Card, T, Row, Icon, useTheme } from '../../src/kit';
import { SubHeader, Chip, Big, useClose } from '../../src/screens/wallet-report/parts';
import { CountryChips, MoneyInput } from '../../src/screens/wallet/parts';
import { CC, DEFAULT_ADD_DATE, SCHEDULE, TRIP_DATES, addExpense, country, dateLong, isCC, krw, toKRW, useWallet } from '../../src/data/walletStore';

export default function AddExpense() {
  const { t } = useTheme(); const close = useClose();
  const p = useLocalSearchParams<{ c?: string; date?: string }>();
  const w = useWallet();
  const [cc, setCc] = useState<CC>(isCC(p.c) ? p.c : 'GB');
  const [date, setDate] = useState(p.date && TRIP_DATES.includes(p.date) ? p.date : DEFAULT_ADD_DATE);
  const [open, setOpen] = useState(false);
  const [sched, setSched] = useState<string | null>(null); // schedule id
  const [manual, setManual] = useState(false);
  const [cat, setCat] = useState('외식');
  const [memo, setMemo] = useState('');
  const [amt, setAmt] = useState('');
  const c = country(cc);
  const items = SCHEDULE.filter((s) => s.date === date);
  const cats = w.cats[cc];
  const cur = sched ? items.find((s) => s.id === sched) : null;
  const n = parseFloat(amt) || 0;
  const valid = n > 0 && memo.trim().length > 0;

  const di = TRIP_DATES.indexOf(date);
  const moveDate = (d: number) => { const j = di + d; if (j >= 0 && j < TRIP_DATES.length) { setDate(TRIP_DATES[j]); setSched(null); setManual(false); setOpen(false); } };
  const pick = (id: string | null) => {
    setOpen(false);
    if (id == null) { setSched(null); setManual(true); setMemo(''); return; }
    const s = SCHEDULE.find((x) => x.id === id)!;
    setSched(id); setManual(false); setMemo(s.title); setCc(s.country);
    setCat(w.cats[s.country].includes(s.cat) ? s.cat : '기타');
  };
  const save = () => {
    if (!valid) return;
    addExpense({ country: cc, date, cat: cats.includes(cat) ? cat : '기타', title: memo.trim(), amount: n, scheduleId: sched ?? undefined });
    close();
  };
  const label = (s: string) => <T size={13} sub>{s}</T>;
  const box = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, height: 48, paddingHorizontal: 16, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 };
  const arrow = (d: number, off: boolean) => (
    <Pressable hitSlop={8} onPress={() => moveDate(d)} style={{ opacity: off ? 0.3 : 1 }}><Icon name={d < 0 ? 'chevl' : 'chev'} size={20} color={t.sub} /></Pressable>
  );
  return (
    <Page gap={14} footer={<Big label="저장하기" onPress={save} style={{ opacity: valid ? 1 : 0.4 }} />}>
      <SubHeader title="사용 내역 추가" mb={2} />
      <CountryChips value={cc} onChange={(x) => { setCc(x); setSched(null); if (!manual) setMemo(''); setCat('외식'); }} />
      <View style={{ gap: 6 }}>
        {label('날짜')}
        <View style={box}>
          <Icon name="cal" size={20} color={t.sub} />
          <T size={15} style={{ flex: 1 }}>{dateLong(date)}</T>
          {arrow(-1, di <= 0)}{arrow(1, di >= TRIP_DATES.length - 1)}
        </View>
      </View>
      <View style={{ gap: 6 }}>
        {label('이 날의 일정에서 가져오기')}
        <Pressable onPress={() => setOpen(!open)} style={[box, open ? { borderColor: t.acc } : null]}>
          <T size={15} w={cur || manual ? 'm' : 'r'} color={cur || manual ? t.text : t.sub} numberOfLines={1} style={{ flex: 1 }}>
            {cur ? `${cur.time} · ${cur.title}` : manual ? '직접 입력할게요' : '일정을 선택하세요'}
          </T>
          <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}><Icon name="down" size={18} color={t.sub} /></View>
        </Pressable>
        {open ? (
          <View style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, overflow: 'hidden' }}>
            {items.map((s) => (
              <Pressable key={s.id} onPress={() => pick(s.id)} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: t.line, backgroundColor: s.id === sched ? t.accS : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <T size={14} w={s.id === sched ? 'b' : 'm'} color={s.id === sched ? t.acc : t.text} style={{ flex: 1 }}>{s.time} · {s.title}</T>
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
          <TextInput value={memo} onChangeText={setMemo} placeholder={sched || manual ? '무엇에 쓰셨나요?' : '일정을 고르면 자동으로 채워져요'} placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
        </View>
        {cur ? <Row gap={4}><Icon name="link" size={12} color={t.acc} /><T size={12} color={t.acc}>일정과 연결돼요 · 이름과 카테고리를 자동으로 채웠어요</T></Row> : null}
      </View>
      <View style={{ gap: 6 }}>
        {label(`결제 금액 (${c.sym} 현지 화폐 기준)`)}
        <MoneyInput value={amt} onChange={setAmt} placeholder="예: 21" prefix={c.sym} suffix={c.cur} decimals />
        <T size={12} sub>{n > 0 ? `≈ ${krw(toKRW(n, cc))} · ${c.sym}1 = ${c.rate.toLocaleString('en-US')}원` : `${c.sym}1 = ${c.rate.toLocaleString('en-US')}원 기준으로 환산돼요`}</T>
      </View>
    </Page>
  );
}
