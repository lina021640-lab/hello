import { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, IconTile, Btn, shadow, useTheme } from '../../src/kit';
import { OutField, Chip, Toggle } from '../../src/screens/schedule/shared';

const days = ['3일차 · 11/22', '4일차 · 11/23', '5일차'];
type Rec = { name: string; en: string; addr: string; km: number; likes: number; src: '친구 공유' | '내 저장'; cat: number };
// 선택한 날(3일차: 런던 사우스워크 일대) 주변 추천 — 더미
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
  const [day, setDay] = useState(0); const [cat, setCat] = useState(1); const [alarm, setAlarm] = useState(true);
  const [place, setPlace] = useState('Borough Market'); const [start, setStart] = useState('AM 10:00'); const [end, setEnd] = useState('PM 05:00');
  const [addr, setAddr] = useState('8 Southwark St, London SE1'); const [picked, setPicked] = useState('Borough Market');
  const [memo, setMemo] = useState('크로와상 꼭 먹기, 키링 사기');
  return (
    <Page gap={14} footer={<Btn label="일정에 추가" onPress={() => r.back()} h={52} />}>
      <Header title="일정 추가" />
      <Row gap={8} style={{ marginTop: 2 }}>
        {days.map((d, i) => <Chip key={d} label={d} active={i === day} onPress={() => setDay(i)} />)}
      </Row>
      <OutField label="장소" value={place} onChangeText={setPlace} left={<Icon name="search" size={20} color={t.sub} />} />
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingLeft: 12, paddingRight: 14, paddingVertical: 12 }, shadow(t)]}>
        <IconTile name="pin" size={44} icon={22} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={15} w="b">{picked}</T>
          <T size={12} sub>{addr}</T>
        </View>
        <Icon name="check" size={20} color={t.acc} />
      </View>
      <View style={{ gap: 8 }}>
        <Row>
          <T size={15} w="b" style={{ flex: 1 }}>추천 장소</T>
          <T size={12} sub>친구 공유 · 내 저장 · 인기순</T>
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 6, paddingHorizontal: 1 }} style={{ marginHorizontal: -20 }} >
          <View style={{ width: 10 }} />
          {[...RECS].sort((a, b) => b.likes - a.likes).map((p) => {
            const on = picked === p.en; const fr = p.src === '친구 공유';
            return (
              <Pressable key={p.en} onPress={() => { setPlace(p.en); setPicked(p.en); setAddr(p.addr); setCat(p.cat); }}
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
        </ScrollView>
      </View>
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="시작" value={start} onChangeText={setStart} left={<Icon name="clock" size={20} color={t.sub} />} />
        <OutField style={{ flex: 1 }} label="종료" value={end} onChangeText={setEnd} left={<Icon name="clock" size={20} color={t.sub} />} />
      </Row>
      <View style={{ gap: 6 }}>
        <T size={13} sub>카테고리</T>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {cats.map((c, i) => <Chip key={c} label={c} active={i === cat} onPress={() => setCat(i)} />)}
        </Row>
      </View>
      <OutField label="메모" h={52} value={memo} onChangeText={setMemo} />
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12 }, shadow(t)]}>
        <T size={15} style={{ flex: 1 }}>출발 30분 전 알림</T>
        <Toggle on={alarm} onPress={() => setAlarm(!alarm)} />
      </View>
    </Page>
  );
}
