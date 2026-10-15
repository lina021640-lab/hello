import { useEffect, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTabBar } from '../../src/components/AppTabBar';
import { Page, TabTitle, T, Row, Pill, Icon, useGo, useTheme } from '../../src/kit';
import { EmptyCard } from '../../src/screens/empty/EmptyCard';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { useAuth } from '../../src/data/authStore';
import { Member, fetchMembers } from '../../src/data/tripStore';
import { supabase, koError } from '../../src/lib/supabase';
import { SegTabs } from '../../src/screens/saved/parts';

type Cat = 'tour' | 'food' | 'shop' | 'cafe' | 'move' | 'stay';
const CAT: Record<Cat, { name: string; bg: string; fg: string; dbg: string; dfg: string }> = {
  tour: { name: '관광', bg: '#e9d5f5', fg: '#5b2b7a', dbg: '#3a2a47', dfg: '#e2c8f3' },
  food: { name: '식사', bg: '#d5f0cf', fg: '#2d6a21', dbg: '#243a20', dfg: '#bfe8b6' },
  shop: { name: '쇼핑', bg: '#d3f1ec', fg: '#17665b', dbg: '#1c3a36', dfg: '#a8e4d9' },
  cafe: { name: '카페', bg: '#f3f1c3', fg: '#6b6212', dbg: '#3b3a1a', dfg: '#e8e49a' },
  move: { name: '이동', bg: '#d6e6f8', fg: '#1f4f86', dbg: '#1f3350', dfg: '#b5d3f5' },
  stay: { name: '숙소', bg: '#efedc9', fg: '#5f5a1b', dbg: '#38371c', dfg: '#e6e3a5' },
};
/** "AM 10:00" / "PM 05:20" / "오후 3:00" / "14:30" → 시(소수). 해석 불가면 null */
function hourOf(s?: string | null): number | null {
  if (!s) return null;
  const m = /(AM|PM|오전|오후)?\s*(\d{1,2})\s*[:시]?\s*(\d{2})?/i.exec(s);
  if (!m) return null;
  let h = Number(m[2]); const pm = /PM|오후/i.test(m[1] ?? ''); const am = /AM|오전/i.test(m[1] ?? '');
  if (pm && h < 12) h += 12; if (am && h === 12) h = 0;
  return h > 24 ? null : h + Number(m[3] || 0) / 60;
}
const catOf = (c?: string | null): Cat => {
  const s = c ?? '';
  if (/식|맛집|외식/.test(s)) return 'food'; if (/카페/.test(s)) return 'cafe'; if (/쇼핑|기념/.test(s)) return 'shop';
  if (/이동|교통|비행|항공/.test(s)) return 'move'; if (/숙/.test(s)) return 'stay'; return 'tour';
};
const clock = (h: number) => `${h < 12 ? 'AM' : 'PM'} ${Math.floor(h % 12 === 0 ? 12 : h % 12)}`;
type Item = { id: string; day: number; start_time: string | null; end_time: string | null; title: string | null; place: string | null; category: string | null; created_by: string | null };
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const Y0 = 34, HR = 26;
const hourLines = Array.from({ length: 19 }, (_, k) => ({ y: Y0 + k * HR, big: k % 6 === 0 }));
const hourLabels = [{ y: 28, s: '6시' }, { y: 184, s: '12시' }, { y: 340, s: '6시' }, { y: 486, s: '12시' }];

export default function Friends() {
  const { t } = useTheme(); const r = useRouter(); const go = useGo();
  const view = useCurrentTrip(); const { user } = useAuth();
  const dark = t.mode === 'dark';
  const [day0, setDay] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false); const [err, setErr] = useState('');
  const tripId = view?.trip.id;
  useEffect(() => {
    let live = true; setMembers([]); setItems([]); setErr('');
    if (!tripId) return;
    setLoading(true);
    Promise.all([
      fetchMembers(tripId),
      supabase.from('schedule_items').select('id, day, start_time, end_time, title, place, category, created_by').eq('trip_id', tripId).order('start_time', { ascending: true }),
    ]).then(([m, res]) => {
      if (!live) return;
      if (res.error) throw res.error;
      setMembers(m); setItems((res.data ?? []) as Item[]); setLoading(false);
    }).catch((e) => { if (live) { setErr(koError(e, '일정을 불러오지 못했어요')); setLoading(false); } });
    return () => { live = false; };
  }, [tripId]);

  const header = (
    <>
      <TabTitle title="저장·공유" right={view ? <View style={{ alignItems: 'flex-end', gap: 2 }}><T size={12} w="b" color={t.acc}>보기만 가능해요</T></View> : undefined} />
      <SegTabs active={2} />
    </>
  );
  const tabBar = <AppTabBar active="saved" onPress={(n) => r.navigate(`/${n}` as any)} />;
  if (!view) {
    return (
      <View style={{ flex: 1 }}>
        <Page tab gap={12}>{header}<EmptyCard emoji="🧳" title="여행을 먼저 추가해 주세요" body="여행 동료의 일정을 한눈에 보려면 여행이 필요해요." cta="여행 추가" onCta={() => go('/trip/new')} /></Page>
        {tabBar}
      </View>
    );
  }
  const days = view.days;
  const day = Math.min(day0 ?? Math.min(Math.max(view.today, 1), days), days) - 1; // 0-based
  const dayLabel = (i: number) => { const d = view.dateOf(i + 1); return `${d.getMonth() + 1}/${d.getDate()}(${DOW[d.getDay()]})`; };
  const cols = [...members].sort((a, b) => (a.userId === user?.id ? -1 : b.userId === user?.id ? 1 : 0));
  const dayItems = items.filter((x) => x.day === day + 1);
  const byUser = (uid: string) => dayItems.filter((x) => x.created_by === uid);
  const timed = (uid: string) => byUser(uid).map((x) => ({ x, s: hourOf(x.start_time) })).filter((o): o is { x: Item; s: number } => o.s != null);
  const untimed = (uid: string) => byUser(uid).filter((x) => hourOf(x.start_time) == null);
  const col = (c: Cat) => dark ? { bg: CAT[c].dbg, fg: CAT[c].dfg } : { bg: CAT[c].bg, fg: CAT[c].fg };
  const W = 42 + 78 * Math.max(cols.length, 1);
  const hourLines = Array.from({ length: 19 }, (_, k) => ({ y: Y0 + k * HR, big: k % 6 === 0 }));
  const hourLabels = [{ y: 28, s: '6시' }, { y: 184, s: '12시' }, { y: 340, s: '6시' }, { y: 486, s: '12시' }];
  const prev = () => setDay(Math.max(1, day));
  const next = () => setDay(Math.min(days, day + 2));
  return (
    <View style={{ flex: 1 }}>
    <Page tab>
      {header}
      <Row gap={8} style={{ marginTop: 10 }}>
        <Pressable onPress={prev} disabled={day === 0} hitSlop={10} accessibilityLabel="이전 날" style={{ opacity: day === 0 ? 0.3 : 1 }}><Icon name="chevl" size={20} color={t.text} /></Pressable>
        <T size={15} w="b">{day + 1}일차 · {dayLabel(day)}</T>
        <Pressable onPress={next} disabled={day === days - 1} hitSlop={10} accessibilityLabel="다음 날" style={{ opacity: day === days - 1 ? 0.3 : 1 }}><Icon name="chev" size={20} color={t.text} /></Pressable>
        <View style={{ flex: 1 }} />
        <Pill label={view.trip.name} size={12} py={5} style={{ maxWidth: 180 }} />
      </Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20, marginTop: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {Array.from({ length: days }, (_, i) => i).map((i) => (
          <Pressable key={i} onPress={() => setDay(i + 1)} accessibilityLabel={`${i + 1}일차`} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, alignItems: 'center', backgroundColor: i === day ? t.acc : t.card, borderWidth: i === day ? 0 : 1, borderColor: t.line }}>
            <T size={12} w="b" color={i === day ? '#fff' : t.text}>{i + 1}일차</T>
            <T size={11} color={i === day ? '#fff' : t.sub}>{dayLabel(i)}</T>
          </Pressable>
        ))}
      </ScrollView>
      {err ? <T size={12} color={t.bad} style={{ marginTop: 12 }}>{err}</T> : null}
      {dayItems.length === 0 && !loading ? (
        <View style={{ marginTop: 14 }}>
          <EmptyCard emoji="🗓️" title={items.length === 0 ? '아직 등록된 일정이 없어요' : '이 날은 등록된 일정이 없어요'}
            body={cols.length < 2 ? '여행 동료를 초대하면 서로의 일정을 여기서 볼 수 있어요.' : '동료가 일정을 추가하면 여기에 나타나요.'} />
        </View>
      ) : (
        <>
          <Row gap={10} style={{ marginTop: 13 }}>
            {(Object.keys(CAT) as Cat[]).map((c) => (
              <Row key={c} gap={4}>
                <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: col(c).bg, borderWidth: 1, borderColor: col(c).fg + '80' }} />
                <T size={11} sub>{CAT[c].name}</T>
              </Row>
            ))}
          </Row>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 12 }}>
            <View style={{ width: W, height: 504 }}>
              {hourLines.map((l, i) => (
                <View key={i} style={{ position: 'absolute', left: 0, top: l.y, width: W, height: l.big ? 1.5 : 1, backgroundColor: t.line, opacity: l.big ? 1 : 0.6 }} />
              ))}
              {cols.map((_, i) => (
                <View key={i} style={{ position: 'absolute', left: 40 + 78 * i, top: 4, width: 1, height: 498, backgroundColor: t.line, opacity: 0.6 }} />
              ))}
              {hourLabels.map((l, i) => (
                <T key={i} size={11} w="b" sub align="right" style={{ position: 'absolute', left: 0, width: 36, top: l.y }}>{l.s}</T>
              ))}
              {cols.map((m, i) => {
                const me = m.userId === user?.id;
                return (
                  <View key={m.userId} style={{ position: 'absolute', left: 42 + 78 * i, top: 2, width: 74, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: me ? t.accS : undefined }}>
                    <T size={12} w="b" color={me ? t.acc : t.text} numberOfLines={1}>{me ? `${m.nickname} (나)` : m.nickname}</T>
                  </View>
                );
              })}
              {cols.map((m, ci) => timed(m.userId).map(({ x, s }) => {
                const e0 = hourOf(x.end_time); const e = e0 != null && e0 > s ? e0 : s + 1;
                const c = col(catOf(x.category)); const top = Y0 + (Math.max(s, 6) - 6) * HR + 1.5;
                return (
                  <View key={x.id} style={{ position: 'absolute', left: 42 + 78 * ci, width: 74, top, height: Math.max(22, (Math.min(e, 24) - Math.max(s, 6)) * HR - 3), backgroundColor: c.bg, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 4, gap: 1, overflow: 'hidden' }}>
                    <T size={10} w="b" color={c.fg}>{x.title || x.place || '일정'}</T>
                    {e - s > 1 ? <T size={10} w="m" color={c.fg + 'cc'}>{clock(s)}–{clock(e)}</T> : null}
                  </View>
                );
              }))}
            </View>
          </ScrollView>
          {cols.some((m) => untimed(m.userId).length) ? (
            <View style={{ gap: 6, marginTop: 8 }}>
              <T size={13} w="b">시간 미정</T>
              {cols.map((m) => untimed(m.userId).map((x) => (
                <Row key={x.id} gap={8}>
                  <T size={12} w="b" color={t.acc}>{m.userId === user?.id ? '나' : m.nickname}</T>
                  <T size={13} style={{ flex: 1 }}>{x.title || x.place || '일정'}</T>
                </Row>
              )))}
            </View>
          ) : null}
        </>
      )}
    </Page>
    {tabBar}
    </View>
  );
}
