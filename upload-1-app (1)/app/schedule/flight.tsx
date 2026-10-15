import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, Btn, useTheme } from '../../src/kit';
import { OutField } from '../../src/screens/schedule/shared';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { addScheduleItem } from '../../src/data/scheduleStore';

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 항공편 추가: 현재 여행의 일정(카테고리 '항공')으로 저장 → 메인 항공권 카드에 표시 */
export default function Flight() {
  const r = useRouter(); const { t } = useTheme();
  const view = useCurrentTrip();
  const [f, setF] = useState({ air: '', no: '', from: '', to: '', date: view ? ymd(view.dateOf(1)) : '', dep: '', arr: '', rsv: '', seat: '' });
  const set = (k: keyof typeof f) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setErr(''); };
  const [err, setErr] = useState(''); const [saving, setSaving] = useState(false);
  if (!view) return <Page gap={14}><Header title="항공편 추가" /><T size={14} sub align="center" style={{ marginTop: 40 }}>항공편을 추가할 여행이 없어요. 먼저 여행을 만들어 주세요.</T></Page>;
  const cal = <Icon name="cal" size={20} color={t.sub} />;
  const save = async () => {
    if (saving) return;
    const m = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/.exec(f.date.trim());
    if (!f.no.trim() && !f.air.trim()) return setErr('항공사 또는 편명을 입력해 주세요');
    if (!f.from.trim() || !f.to.trim()) return setErr('출발·도착 공항을 입력해 주세요');
    if (!m) return setErr('출발 날짜를 2026-11-20 형식으로 입력해 주세요');
    const day = Math.round((new Date(+m[1], +m[2] - 1, +m[3]).getTime() - view.dateOf(1).getTime()) / 86400000) + 1;
    if (day < 1 || day > view.days) return setErr('여행 기간 안의 날짜를 입력해 주세요');
    setSaving(true);
    try {
      await addScheduleItem({ day, time: f.dep.trim(), end: f.arr.trim(), title: `${f.air.trim()} ${f.no.trim()}`.trim(), place: `${f.from.trim()} → ${f.to.trim()}`, category: '항공',
        memo: [f.rsv.trim() && `예약번호 ${f.rsv.trim()}`, f.seat.trim() && `좌석 ${f.seat.trim()}`].filter(Boolean).join(' · ') });
      r.back();
    } catch (e) { setErr((e as Error).message); setSaving(false); }
  };
  return (
    <Page gap={12} footer={<Btn label={saving ? '저장 중…' : '항공편 저장'} onPress={save} disabled={saving} h={52} />}>
      <Header title="항공편 추가" />
      <Row gap={8} align="flex-start" style={{ backgroundColor: t.accS, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginTop: 4 }}>
        <View style={{ marginTop: 1 }}><Icon name="info" size={16} color={t.acc} /></View>
        <T size={12} lh={17} style={{ flex: 1 }}>항공편은 직접 입력해요. 시간은 각 공항의 현지 시각으로 넣어 주세요. 공항은 &quot;ICN · 인천국제공항&quot;처럼 코드로 시작하면 카드에 코드가 표시돼요.</T>
      </Row>
      {err ? <T size={13} color={t.bad} w="m">{err}</T> : null}
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="항공사" placeholder="예: 대한항공" value={f.air} onChangeText={set('air')} />
        <OutField style={{ flex: 1 }} label="편명" placeholder="예: KE344" value={f.no} onChangeText={set('no')} />
      </Row>
      <OutField label="출발 공항" placeholder="예: ICN · 인천국제공항" value={f.from} onChangeText={set('from')} />
      <OutField label="도착 공항" placeholder="예: LHR · 런던 히드로" value={f.to} onChangeText={set('to')} />
      <OutField label="출발 날짜" placeholder="2026-11-20" value={f.date} onChangeText={set('date')} left={cal} />
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="출발 시각" placeholder="예: 10:55" value={f.dep} onChangeText={set('dep')} left={<Icon name="clock" size={20} color={t.sub} />} />
        <OutField style={{ flex: 1 }} label="도착 시각" placeholder="예: 17:20" value={f.arr} onChangeText={set('arr')} left={<Icon name="clock" size={20} color={t.sub} />} />
      </Row>
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="예약번호 (선택)" value={f.rsv} onChangeText={set('rsv')} />
        <OutField style={{ flex: 1 }} label="좌석 (선택)" value={f.seat} onChangeText={set('seat')} />
      </Row>
    </Page>
  );
}
