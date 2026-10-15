import { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, IconTile, Btn, shadow, useTheme } from '../../src/kit';
import { addScheduleItem, getAddDay } from '../../src/data/scheduleStore';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { OutField, Chip, Toggle } from '../../src/screens/schedule/shared';

type Rec = { name: string; en: string; addr: string; km: number; likes: number; src: '친구 공유' | '내 저장'; cat: number };
// 예시 카드(런던 여행에서만 표시). 친구 공유/내 저장 장소 연동 전까지의 자리표시
const RECS: Rec[] = [
  { name: '버러 마켓', en: 'Borough Market', addr: '8 Southwark St, London SE1', km: 0.3, likes: 248, src: '친구 공유', cat: 1 },
  { name: '타워브리지', en: 'Tower Bridge', addr: 'Tower Bridge Rd, London SE1', km: 1.2, likes: 212, src: '내 저장', cat: 0 },
  { name: '테이트 모던', en: 'Tate Modern', addr: 'Bankside, London SE1', km: 0.9, likes: 187, src: '친구 공유', cat: 0 },
  { name: '더 샤드', en: 'The Shard', addr: '32 London Bridge St, London SE1', km: 0.4, likes: 164, src: '내 저장', cat: 0 },
  { name: '몽머스 커피', en: 'Monmouth Coffee', addr: '2 Park St, London SE1', km: 0.2, likes: 131, src: '친구 공유', cat: 2 },
  { name: '셰익스피어 글로브', en: "Shakespeare's Globe", addr: '21 New Globe Walk, London SE1', km: 0.8, likes: 96, src: '내 저장', cat: 0 },
];
const cats = ['관광', '식사', '카페', '쇼핑', '이동', '숙소'];

export default function Add() {
  const r = useRouter(); const { t } = useTheme();
  const view = useCurrentTrip();
  const total = view?.days ?? 1;
  const base = Math.min(Math.max(getAddDay(), 1), Math.max(1, total - 2));
  const days = (view ? [base, base + 1, base + 2] : []).filter((n) => n <= total).map((n) => { const d = view!.dateOf(n); return { n, label: `${n}일차 · ${d.getMonth() + 1}/${d.getDate()}` }; });
  const [day, setDay] = useState(Math.max(0, Math.min(getAddDay() - base, days.length - 1)));
  const [saving, setSaving] = useState(false);
  const london = !!view?.trip.cities.some((c) => c.cc === 'GB'); const [cat, setCat] = useState(1); const [alarm, setAlarm] = useState(true);
  const [place, setPlace] = useState(''); const [title, setTitle] = useState(''); const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [addr, setAddr] = useState(''); const [picked, setPicked] = useState('');
  const [memo, setMemo] = useState(''); const [err, setErr] = useState('');
  const submit = async () => {
    if (saving) return;
    if (!place.trim() && !title.trim()) { setErr('장소 또는 일정 제목을 입력해 주세요'); return; }
    setSaving(true);
    try {
      await addScheduleItem({ day: days[day].n, time: start.trim(), end: end.trim(), title: title.trim() || place.trim(), place: place.trim() || title.trim(), category: cats[cat], memo: memo.trim() });
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
      <OutField label="장소" placeholder="장소를 입력하세요" value={place} onChangeText={(v) => { setPlace(v); setPicked(''); setErr(''); }} left={<Icon name="search" size={20} color={t.sub} />} />
      <OutField label="일정 제목" placeholder="일정 제목을 입력하세요" value={title} onChangeText={(v) => { setTitle(v); setErr(''); }} />
      {picked ? <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingLeft: 12, paddingRight: 14, paddingVertical: 12 }, shadow(t)]}>
        <IconTile name="pin" size={44} icon={22} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={15} w="b">{picked}</T>
          <T size={12} sub>{addr}</T>
        </View>
        <Icon name="check" size={20} color={t.acc} />
      </View> : null}
      <View style={{ gap: 8 }}>
        <Row>
          <T size={15} w="b" style={{ flex: 1 }}>{london ? '추천 장소 (예시)' : '추천 장소'}</T>
          <T size={12} sub>친구 공유 · 내 저장 · 인기순</T>
        </Row>
        {!london ? <T size={12} sub>친구가 공유한 장소나 내가 저장한 장소가 생기면 여기에 추천돼요</T> : null}
        {london ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 6, paddingHorizontal: 1 }} style={{ marginHorizontal: -20 }} >
          <View style={{ width: 10 }} />
          {[...RECS].sort((a, b) => b.likes - a.likes).map((p) => {
            const on = picked === p.name; const fr = p.src === '친구 공유';
            return (
              <Pressable key={p.en} onPress={() => { setPlace(p.name); setPicked(p.name); setErr(''); setAddr(p.addr); setCat(p.cat); }}
                style={[{ width: 164, borderRadius: 20, backgroundColor: t.card, padding: 12, gap: 6, borderWidth: 1.5, borderColor: on ? t.acc : 'transparent' }, shadow(t)]}>
                <Row>
                  <View style={{ backgroundColor: fr ? t.feed : t.accS, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <T size={11} w="sb" color={fr ? t.feedT : t.acc}>{p.src}</T>
                  </View>
                </Row>
                <T size={15} w="b" numberOfLines={1}>{p.name}</T>
                <T size={11} sub numberOfLines={1}>{p.en}</T>
                <Row gap={8}>
                  <Row gap={3}><Icon name="pin" size={13} color={t.sub} /><T size={12} sub>{p.km < 1 ? `${Math.round(p.km * 1000)}m` : `${p.km}km`}</T></Row>
                  <Row gap={3}><Icon name="star" size={13} color="#ff9f0a" /><T size={12} w="sb">{`인기 ${p.likes}`}</T></Row>
                </Row>
              </Pressable>
            );
          })}
          <View style={{ width: 10 }} />
        </ScrollView> : null}
      </View>
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="시작" placeholder="예: AM 10:00" value={start} onChangeText={setStart} left={<Icon name="clock" size={20} color={t.sub} />} />
        <OutField style={{ flex: 1 }} label="종료" placeholder="예: PM 05:00" value={end} onChangeText={setEnd} left={<Icon name="clock" size={20} color={t.sub} />} />
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
