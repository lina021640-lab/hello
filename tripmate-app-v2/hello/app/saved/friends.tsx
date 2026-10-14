import { View, ScrollView } from 'react-native';
import { Page, TabTitle, T, Row, Pill, Icon, useTheme } from '../../src/kit';
import { SegTabs } from '../../src/screens/saved/parts';

type Cat = 'tour' | 'food' | 'shop' | 'cafe' | 'move' | 'stay';
const CAT: Record<Cat, { name: string; bg: string; fg: string }> = {
  tour: { name: '관광', bg: '#e9d5f5', fg: '#5b2b7a' },
  food: { name: '식사', bg: '#d5f0cf', fg: '#2d6a21' },
  shop: { name: '쇼핑', bg: '#d3f1ec', fg: '#17665b' },
  cafe: { name: '카페', bg: '#f3f1c3', fg: '#6b6212' },
  move: { name: '이동', bg: '#d6e6f8', fg: '#1f4f86' },
  stay: { name: '숙소', bg: '#efedc9', fg: '#5f5a1b' },
};
const names = ['현도연 (나)', '김명성', '우종엽', '한수진', '신다솜'];
// [시작시, 끝시, 이름, 시간표기, 분류]
type Blk = [number, number, string, string | undefined, Cat];
const H: Blk = [21, 24, '호텔', 'PM 9–12', 'stay'];
const cols: Blk[][] = [
  [[10, 12, '세인트 폴 대성당', 'AM 10–12', 'tour'], [14, 17, '버러 마켓', 'PM 2–5', 'food'], [17, 19, '타워브리지', 'PM 5–7', 'tour'], H],
  [[10, 14, '대영박물관', 'AM 10–2', 'tour'], [14, 15, '점심', undefined, 'food'], [15, 18, '코벤트 가든', 'PM 3–6', 'shop'], H],
  [[7, 21, '남부 투어', 'AM 7–9', 'move'], H],
  [[9, 10, '브런치', undefined, 'food'], [11, 13, '소호 거리', 'AM 11–1', 'shop'], [14, 15, '카페', undefined, 'cafe'], [16, 18, '템스 크루즈', 'PM 4–6', 'tour'], [19, 21, '야경 산책', 'PM 7–9', 'tour'], H],
  [[12, 13, '점심', undefined, 'food'], [13, 16, '내셔널 갤러리', 'PM 1–4', 'tour'], [16, 19, '쇼핑', 'PM 4–7', 'shop'], H],
];
const Y0 = 34, HR = 26;
const hourLines = Array.from({ length: 19 }, (_, k) => ({ y: Y0 + k * HR, big: k % 6 === 0 }));
const hourLabels = [{ y: 28, s: '6시' }, { y: 184, s: '12시' }, { y: 340, s: '6시' }, { y: 486, s: '12시' }];

export default function Friends() {
  const { t } = useTheme();
  const dark = t.mode === 'dark';
  const col = (c: Cat) => dark ? { bg: CAT[c].fg + '40', fg: '#e8eaee' } : { bg: CAT[c].bg, fg: CAT[c].fg };
  return (
    <Page>
      <TabTitle title="저장·공유" right={
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <T size={12} sub>런던 현지 시각 기준</T>
          <T size={12} w="b" color={t.acc}>내 일정만 수정할 수 있어요</T>
        </View>} />
      <SegTabs active={2} />
      <Row gap={8} style={{ marginTop: 10 }}>
        <Icon name="chevl" size={20} color={t.text} />
        <T size={15} w="b">3일차 · 11/20(금)</T>
        <Icon name="chev" size={20} color={t.text} />
        <View style={{ flex: 1 }} />
        <Pill label="유럽여행" trail="down" size={12} py={5} />
      </Row>
      <Row gap={10} style={{ marginTop: 13 }}>
        {(Object.keys(CAT) as Cat[]).map((c) => (
          <Row key={c} gap={4}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: col(c).bg, borderWidth: 1, borderColor: CAT[c].fg + '80' }} />
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
                <T size={10} w="b" color={dark ? c.fg : CAT[cat].fg}>{name}</T>
                {time ? <T size={10} w="m" color={dark ? c.fg : CAT[cat].fg + 'cc'}>{time}</T> : null}
              </View>
            );
          }))}
        </View>
      </ScrollView>
    </Page>
  );
}
