import { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Page, Header, T, Row, Icon, IconTile, Btn, shadow, useTheme } from '../../src/kit';
import { OutField, Chip } from '../../src/screens/schedule/shared';
import { TimeField } from '../../src/screens/schedule/timePicker';
import { useUserSchedule, updateScheduleItem, deleteScheduleItem } from '../../src/data/scheduleStore';
import { useCurrentTrip } from '../../src/data/currentTrip';

const cats = ['관광', '식사', '카페', '쇼핑', '이동', '숙소'];

/** 일정 수정: /schedule/edit?id=<항목 id>. 시간·카테고리·메모 변경 / 삭제 (항목이 없으면 안내만) */
export default function Edit() {
  const r = useRouter(); const { t } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const view = useCurrentTrip(); const all = useUserSchedule();
  const item = all.find((x) => x.id === id);
  const [form, setForm] = useState<{ start: string; end: string; memo: string; cat: number } | null>(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  if (!item || !view) return <Page gap={14}><Header title="일정 수정" /><T size={14} sub align="center" style={{ marginTop: 40 }}>수정할 일정을 찾을 수 없어요</T></Page>;
  const f = form ?? { start: item.time, end: item.end, memo: item.memo, cat: Math.max(0, cats.indexOf(item.category)) };
  const set = (p: Partial<typeof f>) => setForm({ ...f, ...p });
  const d = view.dateOf(item.day);
  const save = async () => {
    if (busy) return; setBusy(true); setErr('');
    try { await updateScheduleItem(item.id, { time: f.start.trim(), end: f.end.trim(), memo: f.memo.trim(), category: item.category === '항공' ? '항공' : cats[f.cat] }); r.back(); }
    catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  const del = async () => {
    if (busy) return; setBusy(true); setErr('');
    try { await deleteScheduleItem(item.id); r.back(); }
    catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  return (
    <Page gap={14} footer={<Row gap={10}><Btn label="삭제" kind="ghost" h={52} style={{ flex: 1 }} disabled={busy} onPress={del} /><Btn label={busy ? '저장 중…' : '저장하기'} h={52} style={{ flex: 2 }} disabled={busy} onPress={save} /></Row>}>
      <Header title="일정 수정" />
      <T size={13} sub>{`${item.day}일차 · ${d.getMonth() + 1}/${d.getDate()}`}</T>
      {err ? <T size={13} color={t.bad} w="m">{err}</T> : null}
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingLeft: 12, paddingRight: 14, paddingVertical: 12 }, shadow(t)]}>
        <IconTile name="pin" size={44} icon={22} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={15} w="b">{item.title || item.place}</T>
          {item.place && item.place !== item.title ? <T size={12} sub>{item.place}</T> : null}
        </View>
        <Icon name="check" size={20} color={t.acc} />
      </View>
      <Row gap={10} align="flex-start">
        <TimeField style={{ flex: 1 }} label="시작 시간" title="시작 시간" placeholder="시간 미정" clearLabel="시간 미정" value={f.start} onChange={(v) => set({ start: v })} />
        <TimeField style={{ flex: 1 }} label="종료 시간 (선택)" title="종료 시간" placeholder="종료 시간 없음" clearLabel="종료 시간 없음" value={f.end} onChange={(v) => set({ end: v })} />
      </Row>
      {item.category !== '항공' ? (
        <View style={{ gap: 6 }}>
          <T size={13} sub>카테고리</T>
          <Row gap={8} style={{ flexWrap: 'wrap' }}>
            {cats.map((c, i) => <Chip key={c} label={c} active={i === f.cat} onPress={() => set({ cat: i })} />)}
          </Row>
        </View>
      ) : null}
      <OutField label="메모" placeholder="메모를 입력하세요" h={52} value={f.memo} onChangeText={(v) => set({ memo: v })} />
    </Page>
  );
}
