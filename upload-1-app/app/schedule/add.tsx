import { useMemo, useRef, useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, IconTile, Btn, shadow, useTheme } from '../../src/kit';
import { addScheduleItem, getAddDay } from '../../src/data/scheduleStore';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { OutField, Chip, Toggle } from '../../src/screens/schedule/shared';
import { TimeField } from '../../src/screens/schedule/timePicker';
import { searchPlaces, suggestPlaces, schedCat, SCHED_CATS, PlaceHit } from '../../src/data/placesIndex';
import { useSaved, useFeed } from '../../src/data/savedStore';

const cats = SCHED_CATS;

/** 출처 배지 색: 내 저장=파랑, 친구 공유=피드색, 인기=회색 */
function Badge({ hit }: { hit: PlaceHit }) {
  const { t } = useTheme();
  const bg = hit.src === 'shared' ? t.feed : hit.src === 'saved' ? t.accS : t.card2;
  const fg = hit.src === 'shared' ? t.feedT : hit.src === 'saved' ? t.acc : t.sub;
  return <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}><T size={11} w="sb" color={fg}>{hit.badge}</T></View>;
}

export default function Add() {
  const r = useRouter(); const { t } = useTheme();
  const view = useCurrentTrip();
  const total = view?.days ?? 1;
  const base = Math.min(Math.max(getAddDay(), 1), Math.max(1, total - 2));
  const days = (view ? [base, base + 1, base + 2] : []).filter((n) => n <= total).map((n) => { const d = view!.dateOf(n); return { n, label: `${n}일차 · ${d.getMonth() + 1}/${d.getDate()}` }; });
  const [day, setDay] = useState(Math.max(0, Math.min(getAddDay() - base, days.length - 1)));
  const [saving, setSaving] = useState(false);
  const [cat, setCat] = useState(1); const [alarm, setAlarm] = useState(true);
  const [place, setPlace] = useState(''); const [title, setTitle] = useState(''); const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [picked, setPicked] = useState<PlaceHit | null>(null); const [free, setFree] = useState(false);
  const autoTitle = useRef(true);
  const [memo, setMemo] = useState(''); const [err, setErr] = useState('');
  const saved = useSaved().items; const feed = useFeed().items;
  const dayCity = view && days[day] ? view.cityOf(days[day].n) : '';
  const ctx = useMemo(() => ({ saved, feed, dayCity, tripCities: view?.trip.cities.map((c) => c.city) ?? [] }), [saved, feed, dayCity, view]);
  const q = place.trim();
  const hits = useMemo(() => (q && !picked && !free ? searchPlaces(q, ctx, 6) : []), [q, picked, free, ctx]);
  const recs = useMemo(() => suggestPlaces(ctx, 8), [ctx]);
  const pick = (h: PlaceHit) => {
    setPlace(h.ko); setPicked(h); setFree(false); setErr(''); setCat(Math.max(0, cats.indexOf(schedCat(h.cat))));
    if (autoTitle.current || !title.trim()) { setTitle(h.ko); autoTitle.current = true; }
  };
  const submit = async () => {
    if (saving) return;
    if (!place.trim() && !title.trim()) { setErr('장소 또는 일정 제목을 입력해 주세요'); return; }
    setSaving(true);
    try {
      await addScheduleItem({ day: days[day].n, time: start, end, title: title.trim() || place.trim(), place: place.trim() || title.trim(), category: cats[cat], memo: memo.trim() });
      r.back();
    } catch (e) { setErr((e as Error).message); setSaving(false); }
  };
  if (!view) return <Page gap={14}><Header title="일정 추가" /><T size={14} sub align="center" style={{ marginTop: 40 }}>일정을 추가할 여행이 없어요. 먼저 여행을 만들어 주세요.</T></Page>;
  return (
    <Page gap={14} footer={<Btn label={saving ? '저장 중…' : '일정에 추가'} onPress={submit} disabled={saving} h={52} />}>
      <Header title="일정 추가" />
      <Row gap={8} style={{ marginTop: 2 }}>
        {days.map((d, i) => <Chip key={d.n} label={d.label} active={i === day} onPress={() => setDay(i)} />)}
      </Row>
      {err ? <T size={13} color={t.bad} w="m">{err}</T> : null}
      <View style={{ gap: 8 }}>
        <OutField label="장소" placeholder="장소를 입력하세요 (예: 에펠탑, Tower Bridge)" value={place}
          onChangeText={(v) => { setPlace(v); setPicked(null); setFree(false); setErr(''); }} left={<Icon name="search" size={20} color={t.sub} />} />
        {q && !picked && !free ? (
          <View style={[{ backgroundColor: t.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: t.line }, shadow(t)]}>
            {hits.map((h) => (
              <Pressable key={h.key} onPress={() => pick(h)} accessibilityLabel={`${h.ko} 선택`} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: t.line }}>
                <IconTile name="pin" size={34} icon={17} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T size={15} w="b" numberOfLines={1}>{h.ko}</T>
                  <T size={12} sub numberOfLines={1}>{[h.city, h.cat, h.en].filter(Boolean).join(' · ')}</T>
                </View>
                <Badge hit={h} />
              </Pressable>
            ))}
            <Pressable onPress={() => { setFree(true); setErr(''); if (autoTitle.current || !title.trim()) { setTitle(q); autoTitle.current = true; } }} accessibilityLabel="직접 입력한 장소로 추가"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 13 }}>
              <IconTile name="plus" size={34} icon={17} bg={t.card2} color={t.text} />
              <T size={14} w="m" style={{ flex: 1 }} numberOfLines={1}>{`'${q}' 직접 입력한 장소로 추가`}</T>
            </Pressable>
          </View>
        ) : null}
      </View>
      <OutField label="일정 제목" placeholder="일정 제목을 입력하세요" value={title} onChangeText={(v) => { setTitle(v); autoTitle.current = false; setErr(''); }} />
      {picked ? <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingLeft: 12, paddingRight: 14, paddingVertical: 12 }, shadow(t)]}>
        <IconTile name="pin" size={44} icon={22} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={15} w="b">{picked.ko}</T>
          <T size={12} sub numberOfLines={1}>{picked.addr || [picked.city, picked.cat].filter(Boolean).join(' · ')}</T>
        </View>
        <Icon name="check" size={20} color={t.acc} />
      </View> : null}
      <View style={{ gap: 8 }}>
        <Row>
          <T size={15} w="b" style={{ flex: 1 }}>{dayCity ? `${dayCity} 추천 장소` : '추천 장소'}</T>
          <T size={12} sub>내 저장 · 친구 공유 · 인기순</T>
        </Row>
        {recs.length === 0 ? <T size={12} sub>이 여행의 도시에 맞는 추천 장소가 아직 없어요. 위에서 장소를 검색해 보세요</T> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 6, paddingHorizontal: 1 }} style={{ marginHorizontal: -20 }}>
            <View style={{ width: 10 }} />
            {recs.map((p) => {
              const on = picked?.key === p.key;
              return (
                <Pressable key={p.key} onPress={() => pick(p)} accessibilityLabel={`추천 ${p.ko}`}
                  style={[{ width: 164, borderRadius: 20, backgroundColor: t.card, padding: 12, gap: 6, borderWidth: 1.5, borderColor: on ? t.acc : 'transparent' }, shadow(t)]}>
                  <Row><Badge hit={p} /></Row>
                  <T size={15} w="b" numberOfLines={1}>{p.ko}</T>
                  <T size={11} sub numberOfLines={1}>{p.en || p.cat}</T>
                  <Row gap={8}>
                    <Row gap={3}><Icon name="pin" size={13} color={t.sub} /><T size={12} sub numberOfLines={1}>{p.city || p.cat}</T></Row>
                    {p.src === 'popular' ? <Row gap={3}><Icon name="star" size={13} color="#ff9f0a" /><T size={12} w="sb">{`인기 ${p.pop}`}</T></Row> : null}
                  </Row>
                </Pressable>
              );
            })}
            <View style={{ width: 10 }} />
          </ScrollView>
        )}
      </View>
      <Row gap={10} align="flex-start">
        <TimeField style={{ flex: 1 }} label="시작 시간" title="시작 시간" placeholder="시간 미정" clearLabel="시간 미정" value={start} onChange={setStart} />
        <TimeField style={{ flex: 1 }} label="종료 시간 (선택)" title="종료 시간" placeholder="종료 시간 없음" clearLabel="종료 시간 없음" value={end} onChange={setEnd} />
      </Row>
      <View style={{ gap: 6 }}>
        <T size={13} sub>카테고리</T>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {cats.map((c, i) => <Chip key={c} label={c} active={i === cat} onPress={() => setCat(i)} />)}
        </Row>
      </View>
      <OutField label="메모" placeholder="메모를 입력하세요" h={52} value={memo} onChangeText={setMemo} />
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12 }, shadow(t)]}>
        <T size={15} style={{ flex: 1 }}>출발 30분 전 알림</T>
        <Toggle on={alarm} onPress={() => setAlarm(!alarm)} />
      </View>
    </Page>
  );
}
