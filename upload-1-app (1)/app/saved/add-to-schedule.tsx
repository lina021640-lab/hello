import { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, PhotoPH, Pill, Btn, useGo, useTheme } from '../../src/kit';
import { Chip, ActionBtn } from '../../src/screens/saved/parts';
import { EmptyCard } from '../../src/screens/empty/EmptyCard';
import { usePlace } from '../../src/data/placeData';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { DayItem, fetchDayItems } from '../../src/data/walletStore';
import { supabase, koError } from '../../src/lib/supabase';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

/** 장소를 선택한 날(일차)의 일정에 추가 — schedule_items 에 한 줄 삽입 (시간은 일정 화면에서 지정) */
export default function AddToSchedule() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const pl = usePlace(name);
  const view = useCurrentTrip();
  const [day, setDay] = useState<number | null>(null);
  const [items, setItems] = useState<DayItem[]>([]);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const tripId = view?.trip.id;
  const curDay = day ?? (view ? Math.min(Math.max(view.today, 1), view.days) : 1);
  useEffect(() => {
    let live = true; setItems([]);
    if (tripId) fetchDayItems(tripId, curDay).then((x) => { if (live) setItems(x); });
    return () => { live = false; };
  }, [tripId, curDay]);
  const add = async () => {
    if (!tripId || busy) return;
    setBusy(true); setErr('');
    const { error } = await supabase.from('schedule_items').insert({ trip_id: tripId, day: curDay, title: pl.n, place: pl.addr || null, category: pl.cat, memo: pl.note || null });
    if (error) { setErr(koError(error, '일정에 추가하지 못했어요')); setBusy(false); return; }
    r.canGoBack() ? r.back() : r.replace('/saved');
  };
  const dayLabel = (i: number) => { const d = view!.dateOf(i); return `${i}일차 · ${d.getMonth() + 1}/${d.getDate()}(${DOW[d.getDay()]})`; };
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: Math.max(ins.top, 37) + 33, bottom: 0, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20, gap: 12, paddingBottom: 52 + 22 + 24 + Math.max(ins.bottom, 0) }}>
          <View style={{ alignItems: 'center' }}><View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} /></View>
          <Row>
            <T size={20} w="b" ls={-2} style={{ flex: 1 }}>장소를 일정에 추가</T>
            {view ? <Pill label={view.trip.name} size={12} py={5} /> : null}
          </Row>
          <View style={{ backgroundColor: t.card2, borderRadius: 20, paddingVertical: 10, paddingLeft: 10, paddingRight: 12 }}>
            <Row gap={12}>
              <PhotoPH w={64} h={64} radius={14} iconSize={27} />
              <View style={{ flex: 1, gap: 1 }}>
                <T size={15} w="b">{pl.n}</T>
                <T size={12} sub numberOfLines={1}>{[pl.city, pl.cat, pl.rating].filter(Boolean).join(' · ')}</T>
              </View>
            </Row>
          </View>
          {!view ? (
            <EmptyCard emoji="🧳" title="여행을 먼저 추가해 주세요" body="일정에 넣으려면 여행이 필요해요." cta="여행 추가" onCta={() => go('/trip/new')} />
          ) : (
            <>
              <View style={{ gap: 6 }}>
                <T size={13} sub>날짜</T>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
                  {Array.from({ length: view.days }, (_, i) => i + 1).map((i) => <Chip key={i} label={dayLabel(i)} active={i === curDay} onPress={() => setDay(i)} />)}
                </ScrollView>
              </View>
              <View style={{ gap: 8 }}>
                <T size={13} sub>{curDay}일차에 이미 있는 일정</T>
                {items.length === 0 ? <T size={13} sub>아직 일정이 없어요. 이 장소가 첫 일정이 돼요.</T> : null}
                {items.map((x, i) => (
                  <Row key={x.id} gap={10} style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}><T size={12} w="b" color="#fff">{i + 1}</T></View>
                    <View style={{ flex: 1 }}>
                      {x.time ? <T size={11} w="b" color={t.acc}>{x.time}</T> : null}
                      <T size={14} w="b">{x.title}</T>
                    </View>
                  </Row>
                ))}
              </View>
              <T size={12} sub>시간은 추가한 뒤 일정 화면에서 정할 수 있어요.</T>
              {err ? <T size={13} w="m" color={t.bad}>{err}</T> : null}
            </>
          )}
        </ScrollView>
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(ins.bottom, 22) }}>
        {view ? <ActionBtn label={busy ? '추가 중…' : `${curDay}일차에 추가하기`} size={16} onPress={add} /> : <Btn kind="ghost" label="닫기" onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))} />}
      </View>
    </View>
  );
}
