import { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, Linking, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, Row, Icon, Btn, Page, Header, useGo, useTheme, shadow } from '../../src/kit';
import { ZoomMap } from '../../src/components/ZoomMap';
import { MapBase } from '../../src/screens/schedule/shared';
import { useUserSchedule, userItemsOf, timeKey, timeLabel, setAddDay } from '../../src/data/scheduleStore';
import { useCurrentTrip, TripView } from '../../src/data/currentTrip';
import { nowItem } from '../../src/screens/schedule/shared';
import { useSheetY } from '../../src/screens/schedule/sheet';
import { Bubble } from '../../src/screens/saved/parts';
import { FlagCircle } from '../../src/screens/tips/parts';

const W = Dimensions.get('window').width, H = Dimensions.get('window').height;
const WK = ['일', '월', '화', '수', '목', '금', '토'];

type PageT = { title: string; body: string };
type Place = { id: string; time: string; name: string; hours?: string; closed?: string; url?: string; walk?: string; pt: [number, number]; pages: PageT[] };

const CURRENT_NONE = '';

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
      <T size={15} color="#7e7e7e" onPress={() => go(`/schedule/edit?id=${p.id}`)} style={{ textDecorationLine: 'underline' }}>수정</T>
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
  const view = useCurrentTrip();
  if (!view) return <Page gap={14}><Header title="세부일정" /><T size={14} sub align="center" style={{ marginTop: 40 }}>예정된 여행이 없어요. 여행을 추가하면 일정을 볼 수 있어요.</T></Page>;
  return <DetailInner view={view} />;
}

function DetailInner({ view }: { view: TripView }) {
  const r = useRouter(); const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const top = Math.max(ins.top, 37);
  const { y, handlers } = useSheetY(top + 287, [top + 70, top + 287, H - 230]);
  const focus = Math.min(Math.max(view.today, 1), view.days);
  const [sel, setSel] = useState(focus);
  const [friends, setFriends] = useState(false);
  const all = useUserSchedule();
  const cur = nowItem(all, view.today)?.item.id ?? CURRENT_NONE;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const days = Array.from({ length: view.days }, (_, i) => i + 1);
  const dateOf = view.dateOf;
  const strip = useRef<ScrollView>(null);
  useEffect(() => { const id = setTimeout(() => strip.current?.scrollTo({ x: Math.max(0, (focus - 2) * 44 - 8), animated: false }), 50); return () => clearTimeout(id); }, []);
  const mine = userItemsOf(all, sel);
  const places: Place[] = [...mine].sort((a, b) => timeKey(a.time) - timeKey(b.time)).map((u, i) => ({
    id: u.id, time: timeLabel(u.time), name: u.title || u.place,
    pt: [70 + ((i * 53) % 260), 120 + ((i * 41) % 90)] as [number, number],
    pages: [{ title: '메모', body: u.memo || '메모가 없어요.' }],
  }));
  const pts = places.map((p) => p.pt);
  const city = view.trip.cities.find((c) => c.city === view.cityOf(sel)) ?? view.trip.cities[0];
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* 배경 지도(기본 지도와 같은 양식) + 오늘 동선 */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: H }}><ZoomMap><MapBase vw={415} vh={H} scale={1.2} /></ZoomMap></View>
      {pts.length > 1 ? (
        <Svg pointerEvents="none" width={W} height={H} style={{ position: 'absolute', left: 0, top: top }}>
          <Path d={`M${pts.map((p) => p.join(' ')).join(' L')}`} stroke={t.acc} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => <Circle key={i} cx={p[0]} cy={p[1]} r={7} fill={places[i].id === cur ? '#000' : t.card} stroke={places[i].id === cur ? '#fff' : t.acc} strokeWidth={3} />)}
        </Svg>
      ) : null}
      {friends ? (
        <View style={[{ position: 'absolute', left: 20, right: 20, top: top + 64, backgroundColor: t.card, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 }, shadow(t)]}>
          <T size={13} sub align="center">아직 친구가 공유한 장소가 없어요</T>
        </View>
      ) : null}
      {/* 헤더 */}
      <Row style={{ position: 'absolute', left: 20, right: 20, top: top + 9, height: 44, justifyContent: 'space-between' }}>
        <Pressable hitSlop={10} onPress={() => (r.canGoBack() ? r.back() : r.replace('/schedule'))}><Icon name="back" size={24} color={t.text} /></Pressable>
        {/* 지도 보기 전환 */}
        <View style={[{ flexDirection: 'row', backgroundColor: t.card, borderRadius: 999, padding: 3 }, shadow(t)]}>
          {[['내 장소만', false], ['친구 추천 장소 보기', true]].map(([l, v]) => (
            <Pressable key={String(l)} onPress={() => setFriends(v as boolean)} style={{ height: 30, paddingHorizontal: 9, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: friends === v ? t.acc : 'transparent' }}>
              <T size={12} w="sb" color={friends === v ? '#fff' : t.text}>{l as string}</T>
            </Pressable>
          ))}
        </View>
        <Row gap={14}>
          <Pressable hitSlop={8} onPress={() => go('/schedule/links')}><Icon name="link" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/files')}><Icon name="folder" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/manage')}><Icon name="menu" size={23} color={t.text} /></Pressable>
        </Row>
      </Row>
      {/* 날씨 배지: 시트 위쪽 가장자리에 붙어 같이 움직임 */}
      <Pressable onPress={() => go('/schedule/weather')} style={[{ position: 'absolute', right: 21, top: y - 92, width: 44, height: 80, borderRadius: 22, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', gap: 5 }, shadow(t)]}>
        {city?.cc ? <FlagCircle code={city.cc} size={28} /> : <Icon name="cloud" size={26} color={t.sub} />}
        <T size={16} lh={20} color={t.sub}>-°</T>
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
            <PlaceBlock key={p.id} p={p} current={p.id === cur} open={!!open[p.id]} last={i === places.length - 1}
              onToggle={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))} />
          ))}
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Btn label="일정 추가" icon="plus" kind="dark" h={48} onPress={() => { setAddDay(sel); go('/schedule/add'); }} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
