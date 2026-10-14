import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTabBar } from '../../src/components/AppTabBar';
import { Page, TabTitle, T, Row, Pill, Icon, useTheme } from '../../src/kit';
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
const names = ['현도연 (나)', '김명성', '우종엽', '한수진', '신다솜'];
// [시작시, 끝시, 이름, 시간표기, 분류]
type Blk = [number, number, string, string | undefined, Cat];
const H: Blk = [21, 24, '호텔', 'PM 9–12', 'stay'];
const tl = (s: number, e: number) => { const f = (h: number) => (h % 12 === 0 ? 12 : h % 12); return `${s < 12 ? 'AM' : 'PM'} ${f(s)}–${f(e)}`; };
const b = (s: number, e: number, name: string, cat: Cat, show = true): Blk => [s, e, name, show && e - s > 1 ? tl(s, e) : undefined, cat];
/** 일차별 · 친구별(5명) 더미 일정. DAYS[일차 인덱스][친구 인덱스] */
const DAYS: Blk[][][] = [
  [ // 1일차 11/18(수)
    [b(8, 10, '히드로 공항 도착', 'move'), b(11, 13, '호텔 체크인', 'stay'), b(14, 17, '코벤트 가든', 'shop'), b(18, 20, '저녁 식사', 'food'), H],
    [b(9, 11, '히드로 공항 도착', 'move'), b(12, 13, '점심', 'food'), b(14, 18, '소호 거리', 'shop'), H],
    [b(10, 12, '히드로 공항 도착', 'move'), b(13, 14, '호텔 체크인', 'stay'), b(15, 17, '카페', 'cafe'), b(18, 21, '야경 산책', 'tour'), H],
    [b(7, 9, '공항 이동', 'move'), b(10, 12, '브런치', 'food'), b(13, 16, '하이드 파크', 'tour'), b(17, 19, '쇼핑', 'shop'), H],
    [b(11, 13, '공항 도착', 'move'), b(14, 15, '점심', 'food'), b(16, 19, '피카딜리 서커스', 'tour'), H],
  ],
  [ // 2일차 11/19(목)
    [b(9, 12, '웨스트민스터 사원', 'tour'), b(12, 13, '점심', 'food'), b(14, 17, '버킹엄 궁전', 'tour'), b(18, 20, '펍 저녁', 'food'), H],
    [b(10, 13, '런던 아이', 'tour'), b(13, 14, '점심', 'food'), b(15, 17, '카페', 'cafe'), b(18, 21, '웨스트엔드 뮤지컬', 'tour'), H],
    [b(8, 10, '빅벤 산책', 'tour'), b(11, 13, '테이트 모던', 'tour'), b(13, 14, '점심', 'food'), b(15, 18, '캠든 마켓', 'shop'), H],
    [b(10, 12, '브런치', 'food'), b(12, 16, '대영박물관', 'tour'), b(16, 17, '카페', 'cafe'), b(18, 20, '코벤트 가든', 'shop'), H],
    [b(9, 11, '런던 탑', 'tour'), b(12, 13, '점심', 'food'), b(14, 17, '타워브리지', 'tour'), H],
  ],
  null as unknown as Blk[][],
  [ // 4일차 11/21(토)
    [b(9, 11, '노팅힐', 'tour'), b(11, 13, '포토벨로 마켓', 'shop'), b(13, 14, '점심', 'food'), b(15, 18, '켄싱턴 궁전', 'tour'), H],
    [b(10, 12, '브런치', 'food'), b(13, 17, '해리 포터 스튜디오', 'tour'), b(18, 20, '저녁 식사', 'food'), H],
    [b(8, 12, '옥스퍼드 당일치기', 'move'), b(12, 14, '점심', 'food'), b(14, 18, '대학 투어', 'tour'), H],
    [b(11, 13, '리버티 백화점', 'shop'), b(13, 14, '점심', 'food'), b(15, 16, '카페', 'cafe'), b(17, 20, '옥스퍼드 스트리트', 'shop'), H],
    [b(9, 10, '아침', 'food'), b(10, 13, '자연사 박물관', 'tour'), b(14, 17, '하이드 파크', 'tour'), H],
  ],
  [ // 5일차 11/22(일)
    [b(10, 12, '선데이 로스트', 'food'), b(13, 16, '그리니치 천문대', 'tour'), b(17, 19, '템스 크루즈', 'tour'), H],
    [b(9, 11, '브릭 레인 마켓', 'shop'), b(11, 13, '브런치', 'food'), b(14, 17, '쇼디치 거리', 'tour'), H],
    [b(10, 12, '세인트 제임스 파크', 'tour'), b(12, 13, '점심', 'food'), b(14, 16, '기념품 쇼핑', 'shop'), b(17, 19, '마지막 저녁', 'food'), H],
    [b(9, 11, '버러 마켓', 'food'), b(12, 14, '내셔널 갤러리', 'tour'), b(15, 16, '카페', 'cafe'), b(17, 19, '짐 정리', 'stay'), H],
    [b(11, 12, '브런치', 'food'), b(13, 16, '코벤트 가든', 'shop'), b(17, 19, '공항 이동', 'move')],
  ],
];
const day3: Blk[][] = [
  [[10, 12, '세인트 폴 대성당', 'AM 10–12', 'tour'], [14, 17, '버러 마켓', 'PM 2–5', 'food'], [17, 19, '타워브리지', 'PM 5–7', 'tour'], H],
  [[10, 14, '대영박물관', 'AM 10–2', 'tour'], [14, 15, '점심', undefined, 'food'], [15, 18, '코벤트 가든', 'PM 3–6', 'shop'], H],
  [[7, 21, '남부 투어', 'AM 7–9', 'move'], H],
  [[9, 10, '브런치', undefined, 'food'], [11, 13, '소호 거리', 'AM 11–1', 'shop'], [14, 15, '카페', undefined, 'cafe'], [16, 18, '템스 크루즈', 'PM 4–6', 'tour'], [19, 21, '야경 산책', 'PM 7–9', 'tour'], H],
  [[12, 13, '점심', undefined, 'food'], [13, 16, '내셔널 갤러리', 'PM 1–4', 'tour'], [16, 19, '쇼핑', 'PM 4–7', 'shop'], H],
];
DAYS[2] = day3;
const DAY_LABEL = ['11/18(수)', '11/19(목)', '11/20(금)', '11/21(토)', '11/22(일)'];
const Y0 = 34, HR = 26;
const hourLines = Array.from({ length: 19 }, (_, k) => ({ y: Y0 + k * HR, big: k % 6 === 0 }));
const hourLabels = [{ y: 28, s: '6시' }, { y: 184, s: '12시' }, { y: 340, s: '6시' }, { y: 486, s: '12시' }];

export default function Friends() {
  const { t } = useTheme(); const r = useRouter();
  const dark = t.mode === 'dark';
  const [day, setDay] = useState(2);
  const cols = DAYS[day];
  const prev = () => setDay((d) => Math.max(0, d - 1));
  const next = () => setDay((d) => Math.min(DAYS.length - 1, d + 1));
  const col = (c: Cat) => dark ? { bg: CAT[c].dbg, fg: CAT[c].dfg } : { bg: CAT[c].bg, fg: CAT[c].fg };
  return (
    <View style={{ flex: 1 }}>
    <Page tab>
      <TabTitle title="저장·공유" right={
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <T size={12} sub>런던 현지 시각 기준</T>
          <T size={12} w="b" color={t.acc}>내 일정만 수정할 수 있어요</T>
        </View>} />
      <SegTabs active={2} />
      <Row gap={8} style={{ marginTop: 10 }}>
        <Pressable onPress={prev} disabled={day === 0} hitSlop={10} accessibilityLabel="이전 날" style={{ opacity: day === 0 ? 0.3 : 1 }}><Icon name="chevl" size={20} color={t.text} /></Pressable>
        <T size={15} w="b">{day + 1}일차 · {DAY_LABEL[day]}</T>
        <Pressable onPress={next} disabled={day === DAYS.length - 1} hitSlop={10} accessibilityLabel="다음 날" style={{ opacity: day === DAYS.length - 1 ? 0.3 : 1 }}><Icon name="chev" size={20} color={t.text} /></Pressable>
        <View style={{ flex: 1 }} />
        <Pill label="유럽여행" trail="down" size={12} py={5} />
      </Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -20, marginTop: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {DAY_LABEL.map((d, i) => (
          <Pressable key={d} onPress={() => setDay(i)} accessibilityLabel={`${i + 1}일차`} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, alignItems: 'center', backgroundColor: i === day ? t.acc : t.card, borderWidth: i === day ? 0 : 1, borderColor: t.line }}>
            <T size={12} w="b" color={i === day ? '#fff' : t.text}>{i + 1}일차</T>
            <T size={11} color={i === day ? '#fff' : t.sub}>{d}</T>
          </Pressable>
        ))}
      </ScrollView>
      <Row gap={10} style={{ marginTop: 13 }}>
        {(Object.keys(CAT) as Cat[]).map((c) => (
          <Row key={c} gap={4}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: col(c).bg, borderWidth: 1, borderColor: col(c).fg + '80' }} />
            <T size={11} sub>{CAT[c].name}</T>
          </Row>
        ))}
      </Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 12 }}>
        <View style={{ width: 468, height: 504 }}>
          {hourLines.map((l, i) => (
            <View key={i} style={{ position: 'absolute', left: 0, top: l.y, width: 468, height: l.big ? 1.5 : 1, backgroundColor: t.line, opacity: l.big ? 1 : 0.6 }} />
          ))}
          {[40, 118, 196, 274, 352, 430].map((x) => (
            <View key={x} style={{ position: 'absolute', left: x, top: 4, width: 1, height: 498, backgroundColor: t.line, opacity: 0.6 }} />
          ))}
          {hourLabels.map((l, i) => (
            <T key={i} size={11} w="b" sub align="right" style={{ position: 'absolute', left: 0, width: 36, top: l.y }}>{l.s}</T>
          ))}
          {names.map((n, i) => (
            <View key={n} style={{ position: 'absolute', left: 42 + 78 * i, top: 2, width: 74, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: i === 0 ? t.accS : undefined }}>
              <T size={12} w="b" color={i === 0 ? t.acc : t.text}>{n}</T>
            </View>
          ))}
          {cols.map((blocks, ci) => blocks.map(([s, e, name, time, cat], bi) => {
            const c = col(cat);
            return (
              <View key={`${ci}-${bi}`} style={{ position: 'absolute', left: 42 + 78 * ci, width: 74, top: Y0 + (s - 6) * HR + 1.5, height: (e - s) * HR - 3, backgroundColor: c.bg, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 4, gap: 1, overflow: 'hidden' }}>
                <T size={10} w="b" color={c.fg}>{name}</T>
                {time ? <T size={10} w="m" color={c.fg + 'cc'}>{time}</T> : null}
              </View>
            );
          }))}
        </View>
      </ScrollView>
    </Page>
    <AppTabBar active="saved" onPress={(n) => r.navigate(`/${n}` as any)} />
    </View>
  );
}
