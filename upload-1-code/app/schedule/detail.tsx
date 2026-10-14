import { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, Linking, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, Row, Icon, Btn, useGo, useTheme, shadow } from '../../src/kit';
import { ZoomMap } from '../../src/components/ZoomMap';
import { MapBase } from '../../src/screens/schedule/shared';
import { TRIP, dateOf } from '../../src/screens/schedule/days';
import { useSheetY } from '../../src/screens/schedule/sheet';
import { Bubble } from '../../src/screens/saved/parts';
import { FlagCircle } from '../../src/screens/tips/parts';

const W = Dimensions.get('window').width, H = Dimensions.get('window').height;
const WK = ['일', '월', '화', '수', '목', '금', '토'];

type Page = { title: string; body: string };
type Place = { id: string; time: string; name: string; hours?: string; closed?: string; url?: string; walk?: string; pt: [number, number]; pages: Page[] };

const generic = (n: string): Page[] => [
  { title: '장소 설명', body: `${n}에 대한 설명이 여기에 표시돼요. 장소의 역사, 분위기, 어떤 곳인지 간단히 소개합니다.` },
  { title: '방문 시 필수 꿀팁', body: '1.  혼잡 시간대를 피해 오전 일찍 방문하세요.\n2.  카드 결제가 가능한지 미리 확인하세요.' },
  { title: '공휴일 · 운영시간', body: '운영시간과 공휴일 휴무 정보를 확인하세요. 현지 공휴일에는 운영 시간이 달라질 수 있습니다.' },
  { title: '주요 관람 포인트', body: '놓치면 아쉬운 대표 볼거리와 포토 스팟을 정리해 두었어요.' },
  { title: '현장 필수 현지 표현', body: '“How much is this?” — 이거 얼마예요?\n“Could I have the bill, please?” — 계산서 부탁해요.' },
];
const PLACES: Place[] = [
  { id: 'sp', time: 'AM 11:00', name: '세인트 폴 대성당', hours: '08:30 - 16:30', walk: '도보 15분 / 대중교통 약 1분', pt: [105, 215], pages: generic('세인트 폴 대성당') },
  { id: 'bm', time: 'PM 03:00', name: '버러 마켓', hours: '10:00 - 17:00', closed: '월요일 휴무', url: 'https://boroughmarket.org.uk', walk: '도보 40분 / 대중교통 약 15분', pt: [200, 175], pages: [
    { title: '장소 설명', body: '런던 브리지(London Bridge) 근처에 위치한 곳으로 약 1,000년의 역사를 자랑하는 영국 대표 식자재 & 스트리트 푸드 마켓입니다. 신선한 과일, 치즈, 육류부터 세계 각국의 다채로운 요리까지 한자리에서 즐길 수 있어 여행객 필수 코스로 꼽힙니다.' },
    { title: '방문 시 필수 꿀팁', body: '1.  카드 결제 우선: 대부분의 점포에서 컨택트리스(Contactless) 카드나 트래블월렛, 애플페이를 사용합니다. 현금은 받지 않는 곳이 많습니다.\n2.  먹을 공간 확보: 마켓 내부 테이블은 경쟁이 치열합니다.' },
    { title: '공휴일 · 운영시간', body: '월요일 휴무 · 화~일 10:00 - 17:00. 크리스마스와 박싱데이에는 쉽니다.' },
    { title: '주요 관람 포인트', body: '치즈 & 샌드위치 가게, 크로와상 베이커리, 스페인식 하몽 가게가 특히 인기예요.' },
    { title: '현장 필수 현지 표현', body: '“Can I try a sample?” — 시식해 봐도 될까요?\n“Contactless, please.” — 카드로 결제할게요.' },
  ] },
  { id: 'tb', time: 'PM 05:00', name: '타워브릿지', hours: '09:00 - 18:00', closed: '월요일 휴무', url: 'https://www.towerbridge.org.uk', walk: '도보 40분 / 대중교통 약 15분', pt: [305, 135], pages: [
    { title: '장소 설명', body: '1894년에 완공된 타워 브리지는 템스강 위에 세워진 런던의 상징적인 다리입니다. 두 개의 고딕 양식 타워가 현수교와 도개교 구조로 연결되어 있으며, 대형 선박이 지나갈 때 다리 중앙이 열리는 장관을 연출합니다. 버러 마켓에서 도보 10~15분 거리에 있어 함께 둘러보기 좋습니다.' },
    { title: '방문 시 필수 꿀팁', body: '1.  카드 결제 우선: 전시관 입장권은 컨택트리스 카드로 결제할 수 있어요.\n2.  다리 개폐 시간표는 공식 홈페이지에서 미리 확인하세요.' },
    { title: '공휴일 · 운영시간', body: '월요일 휴무 · 화~일 09:00 - 18:00.' },
    { title: '주요 관람 포인트', body: '유리 바닥 보행로(글래스 워크웨이)와 고딕 양식 타워 전시관을 꼭 보세요.' },
    { title: '현장 필수 현지 표현', body: '“Two tickets, please.” — 표 두 장 주세요.' },
  ] },
  { id: 'ht', time: 'PM 09:00', name: '호텔', pt: [250, 95], pages: generic('호텔') },
];
const CURRENT = 'bm'; // 지금 진행 중인 일정(연한 파랑)

function Tri({ up, color }: { up?: boolean; color: string }) {
  return (
    <Svg width={14} height={12} viewBox="0 0 14 12"><Path d={up ? 'M7 1.5L13 10.5H1Z' : 'M7 10.5L1 1.5H13Z'} fill={color} /></Svg>
  );
}

function PlaceBlock({ p, open, onToggle, current, last }: { p: Place; open: boolean; onToggle: () => void; current: boolean; last: boolean }) {
  const { t } = useTheme(); const go = useGo();
  const [tab, setTab] = useState(2); const [star, setStar] = useState(false); const [pg, setPg] = useState(0);
  const [pw, setPw] = useState(0);
  const boxBg = current ? t.accS : t.card2;
  const q = encodeURIComponent(p.name);
  const actions = [
    { l: '검색', f: () => Linking.openURL(`https://search.naver.com/search.naver?query=${q}`) },
    ...(p.url ? [{ l: '공식홈페이지', f: () => Linking.openURL(p.url!) }] : []),
    { l: '지도', f: () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`) },
  ];
  const head = (
    <Row style={{ alignItems: 'flex-start' }}>
      <Pressable hitSlop={10} onPress={onToggle} style={{ width: 28, height: 28, justifyContent: 'center' }}><Tri up={open} color={t.text} /></Pressable>
      <Pressable onPress={onToggle} style={{ flex: 1 }}>
        <T size={14} w="b" color={t.acc} lh={18}>{p.time}</T>
        <T size={20} lh={28} ls={-1}>{p.name}</T>
      </Pressable>
      <T size={15} color="#7e7e7e" onPress={() => go('/schedule/edit')} style={{ textDecorationLine: 'underline' }}>수정</T>
    </Row>
  );
  return (
    <View>
      {open || current ? (
        <View style={{ marginHorizontal: 20, backgroundColor: boxBg, borderRadius: 16, padding: 14 }}>
          {head}
          {open ? (
            <>
              {p.hours ? (
                <Row gap={5} style={{ marginTop: 6, marginLeft: 28 }}>
                  <Row gap={4} style={{ backgroundColor: '#a8c7ff', borderRadius: 33, paddingHorizontal: 8, height: 20 }}>
                    <Icon name="clock" size={14} color="#004cd4" /><T size={12} w="r" color="#004cd4">{p.hours}</T>
                  </Row>
                  {p.closed ? (
                    <Row gap={4} style={{ backgroundColor: '#ffb3b3', borderRadius: 33, paddingHorizontal: 8, height: 20 }}>
                      <Icon name="x" size={13} color="#d40000" /><T size={12} w="r" color="#d40000">{p.closed}</T>
                    </Row>
                  ) : null}
                </Row>
              ) : null}
              <Row gap={7} style={{ marginTop: 14 }}>
                {actions.map((a, i) => (
                  <Pressable key={a.l} onPress={() => { setTab(i); a.f().catch(() => {}); }} style={{ height: 40, paddingHorizontal: 20, borderRadius: 33, backgroundColor: i === tab ? t.acc : t.card, alignItems: 'center', justifyContent: 'center' }}>
                    <T size={15} color={i === tab ? '#fff' : t.text}>{a.l}</T>
                  </Pressable>
                ))}
                <Pressable onPress={() => setStar((s) => !s)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="star" size={22} color={star ? '#ff9f0a' : t.sub} />
                </Pressable>
              </Row>
              {/* 장소 설명: 가로로 넘겨 보기 */}
              <View onLayout={(e) => setPw(e.nativeEvent.layout.width)} style={{ marginTop: 14 }}>
                {pw > 0 ? (
                  <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} nestedScrollEnabled
                    onMomentumScrollEnd={(e) => setPg(Math.round(e.nativeEvent.contentOffset.x / pw))} style={{ borderRadius: 10 }}>
                    {p.pages.map((g) => (
                      <View key={g.title} style={{ width: pw, height: 214, backgroundColor: t.card, borderRadius: 10, paddingHorizontal: 16, paddingTop: 12 }}>
                        <T size={15} w="sb" lh={17}>{g.title}</T>
                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ marginTop: 8 }}>
                          <T size={14} w="l" ls={-1} lh={19}>{g.body}</T>
                        </ScrollView>
                      </View>
                    ))}
                  </ScrollView>
                ) : null}
                <Row gap={5} style={{ justifyContent: 'center', marginTop: 8 }}>
                  {p.pages.map((g, i) => <View key={g.title} style={{ width: i === pg ? 14 : 6, height: 6, borderRadius: 3, backgroundColor: i === pg ? t.acc : t.line }} />)}
                </Row>
              </View>
            </>
          ) : null}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 34, paddingVertical: 6 }}>{head}</View>
      )}
      {!last && p.walk ? (
        <Row gap={6} style={{ paddingLeft: 62, paddingTop: 8, paddingBottom: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.sub }} /><T size={13} w="l" color="#747474" ls={-1}>{p.walk}</T>
        </Row>
      ) : null}
    </View>
  );
}

export default function Detail() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const top = Math.max(ins.top, 37);
  const { y, handlers } = useSheetY(top + 287, [top + 70, top + 287, H - 230]);
  const [sel, setSel] = useState(TRIP.today);
  const [friends, setFriends] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ [CURRENT]: true });
  const days = Array.from({ length: TRIP.days }, (_, i) => i + 1);
  const strip = useRef<ScrollView>(null);
  useEffect(() => { const id = setTimeout(() => strip.current?.scrollTo({ x: Math.max(0, (TRIP.today - 2) * 44 - 8), animated: false }), 50); return () => clearTimeout(id); }, []);
  const places = sel === TRIP.today ? PLACES : [];
  const pts = places.map((p) => p.pt);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* 배경 지도(기본 지도와 같은 양식) + 오늘 동선 */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: H }}><ZoomMap><MapBase vw={415} vh={H} scale={1.2} /></ZoomMap></View>
      {pts.length > 1 ? (
        <Svg pointerEvents="none" width={W} height={H} style={{ position: 'absolute', left: 0, top: top }}>
          <Path d={`M${pts.map((p) => p.join(' ')).join(' L')}`} stroke={t.acc} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => <Circle key={i} cx={p[0]} cy={p[1]} r={7} fill={places[i].id === CURRENT ? '#000' : t.card} stroke={places[i].id === CURRENT ? '#fff' : t.acc} strokeWidth={3} />)}
        </Svg>
      ) : null}
      {friends ? (
        <>
          <Bubble label="🥐 크로와상 맛집" left={42} top={top + 130} />
          <Bubble label="☕ 지연 추천 카페" left={W - 170} top={top + 190} />
          <Bubble label="🍺 펍 · 민수" left={140} top={top + 70} />
        </>
      ) : null}
      {/* 헤더 */}
      <Row style={{ position: 'absolute', left: 20, right: 20, top: top + 9, height: 44, justifyContent: 'space-between' }}>
        <Pressable hitSlop={10} onPress={() => (r.canGoBack() ? r.back() : r.replace('/schedule'))}><Icon name="back" size={24} color={t.text} /></Pressable>
        <Row gap={16}>
          <Pressable hitSlop={8} onPress={() => go('/schedule/links')}><Icon name="link" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/files')}><Icon name="folder" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/manage')}><Icon name="menu" size={23} color={t.text} /></Pressable>
        </Row>
      </Row>
      {/* 지도 보기 전환: 내 장소만 ↔ 친구 추천 장소 포함 */}
      <View style={[{ position: 'absolute', left: 20, top: top + 60, flexDirection: 'row', backgroundColor: t.card, borderRadius: 999, padding: 3 }, shadow(t)]}>
        {[['내 장소만', false], ['친구 추천 장소 보기', true]].map(([l, v]) => (
          <Pressable key={String(l)} onPress={() => setFriends(v as boolean)} style={{ height: 30, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: friends === v ? t.acc : 'transparent' }}>
            <T size={12} w="sb" color={friends === v ? '#fff' : t.text}>{l as string}</T>
          </Pressable>
        ))}
      </View>
      {/* 날씨 배지: 시트 위쪽 가장자리에 붙어 같이 움직임 */}
      <Pressable onPress={() => go('/schedule/weather')} style={[{ position: 'absolute', right: 21, top: y - 92, width: 44, height: 80, borderRadius: 22, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', gap: 5 }, shadow(t)]}>
        <FlagCircle code="GB" size={28} />
        <T size={16} lh={20}>25°</T>
        <View style={{ width: 9, height: 2, borderRadius: 1, backgroundColor: t.text }} />
      </Pressable>
      {/* 바텀시트 */}
      <View style={[{ position: 'absolute', left: 0, right: 0, top: y, bottom: 0, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30 }, shadow(t)]}>
        <View {...handlers} style={{ height: 26, alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? ({ cursor: 'grab', touchAction: 'none' } as any) : null) }}>
          <View style={{ width: 35, height: 3, borderRadius: 2, backgroundColor: t.line }} />
        </View>
        <ScrollView ref={strip} horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0, height: 98 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 4, alignItems: 'center', paddingVertical: 10 }}>
          {days.map((n) => {
            const on = n === sel, d = dateOf(n);
            return (
              <Pressable key={n} onPress={() => setSel(n)} style={{ width: on ? 68 : 40, height: on ? 74 : 54, borderRadius: 20, backgroundColor: on ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                {on ? <T size={12} w="l" color="#fff" lh={14}>{`${n}일차`}</T> : null}
                <T size={on ? 16 : 15} w={on ? 'sb' : 'm'} color={on ? '#fff' : t.text} lh={20}>{on ? `${d.getMonth() + 1}/${d.getDate()}` : `${d.getDate()}`}</T>
                <T size={13} w={on ? 'm' : 'l'} color={on ? '#fff' : t.text} lh={16}>{WK[d.getDay()]}</T>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={{ height: 1, backgroundColor: t.line, marginHorizontal: 20 }} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          {places.length === 0 ? <T size={14} sub align="center" style={{ marginVertical: 30 }}>이 날은 저장된 일정이 없어요</T> : null}
          {places.map((p, i) => (
            <PlaceBlock key={p.id} p={p} current={p.id === CURRENT} open={!!open[p.id]} last={i === places.length - 1}
              onToggle={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))} />
          ))}
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Btn label="일정 추가" icon="plus" kind="dark" h={48} onPress={() => go('/schedule/add')} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
