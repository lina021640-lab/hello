import { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T, Row, Icon, useGo, useTheme, shadow } from '../../src/kit';
import { MapBase, Fade } from '../../src/screens/schedule/shared';

const dates = [
  { d: '21', w: '토' }, { d: '11/ 20', w: '금', day: '3일차' }, { d: '22', w: '일' }, { d: '23', w: '월' },
  { d: '24', w: '화' }, { d: '25', w: '수' }, { d: '26', w: '목' },
];

export default function Detail() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const top = Math.max(ins.top, 37);
  const [sel, setSel] = useState(1);
  const [tab, setTab] = useState(2);
  const tabs = ['검색', '공식홈페이지', '지도'];
  const Tri = ({ c }: { c: string }) => <T size={14} color={c} style={{ width: 20 }}>▼</T>;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* 배경 지도 */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 408 }}><MapBase vw={415} vh={408} scale={1.2} /></View>
      {/* 헤더 */}
      <Row style={{ position: 'absolute', left: 20, right: 20, top: top + 9, height: 44, justifyContent: 'space-between' }}>
        <Pressable hitSlop={10} onPress={() => (r.canGoBack() ? r.back() : r.replace('/schedule'))}><Icon name="back" size={24} color={t.text} /></Pressable>
        <Row gap={16}>
          <Icon name="link" size={23} color={t.text} /><Icon name="folder" size={23} color={t.text} /><Icon name="menu" size={23} color={t.text} />
        </Row>
      </Row>
      {/* 날씨 배지 */}
      <Pressable onPress={() => go('/schedule/weather')} style={[{ position: 'absolute', right: 21, top: top + 183, width: 40, height: 76, borderRadius: 20, backgroundColor: t.card, alignItems: 'center', paddingTop: 6, gap: 2 }, shadow(t)]}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#2a3a8c', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', width: 40, height: 5, backgroundColor: '#fff', transform: [{ rotate: '35deg' }] }} />
          <View style={{ position: 'absolute', width: 40, height: 5, backgroundColor: '#fff', transform: [{ rotate: '-35deg' }] }} />
          <View style={{ position: 'absolute', width: 40, height: 3, backgroundColor: '#e1263a', transform: [{ rotate: '35deg' }] }} />
          <View style={{ position: 'absolute', width: 40, height: 3, backgroundColor: '#e1263a', transform: [{ rotate: '-35deg' }] }} />
          <View style={{ position: 'absolute', width: 40, height: 8, backgroundColor: '#fff' }} /><View style={{ position: 'absolute', width: 8, height: 40, backgroundColor: '#fff' }} />
          <View style={{ position: 'absolute', width: 40, height: 4, backgroundColor: '#e1263a' }} /><View style={{ position: 'absolute', width: 4, height: 40, backgroundColor: '#e1263a' }} />
        </View>
        <T size={16}>25°</T>
        <View style={{ width: 7, height: 1, backgroundColor: t.text }} />
      </Pressable>
      {/* 바텀시트 */}
      <View style={[{ flex: 1, marginTop: top + 287, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30 }, shadow(t)]}>
        <View style={{ alignSelf: 'center', marginTop: 6, width: 35, height: 3, borderRadius: 2, backgroundColor: t.line }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, height: 80, marginTop: 8 }} contentContainerStyle={{ paddingHorizontal: 22, gap: 4, alignItems: 'center' }}>
          {dates.map((x, i) => {
            const on = i === sel;
            return (
              <Pressable key={i} onPress={() => setSel(i)} style={{ width: on ? 66 : 40, height: on ? 72 : 52, borderRadius: 20, backgroundColor: on ? t.acc : 'transparent', alignItems: 'center', justifyContent: 'center', gap: 4, ...(on ? { borderWidth: 1, borderColor: '#fff' } : null) }}>
                {on && x.day ? <T size={12} w="l" color="#fff">{x.day}</T> : null}
                <T size={on ? 16 : 15} w={on ? 'sb' : 'm'} color={on ? '#fff' : t.text}>{x.d}</T>
                <T size={13} w={on ? 'm' : 'l'} color={on ? '#fff' : t.text}>{x.w}</T>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={{ height: 1, backgroundColor: t.line, marginHorizontal: 20, marginTop: 4 }} />
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {/* 이전 장소 */}
          <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
            <Tri c={t.text} />
            <T size={20} style={{ marginLeft: 18 }}>세인트 폴 대성당</T>
          </View>
          {/* 현재(펼침) */}
          <View style={{ marginHorizontal: 20, backgroundColor: t.accS, borderRadius: 16, padding: 14, paddingTop: 14, gap: 0 }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <View style={{ width: 26 }}><T size={14} color={t.text}>▲</T></View>
              <View style={{ flex: 1 }}>
                <T size={14} w="b" color={t.acc}>PM 03:00</T>
                <T size={20} lh={28}>버러 마켓</T>
              </View>
              <T size={15} color="#7e7e7e" style={{ textDecorationLine: 'underline' }}>수정</T>
            </Row>
            <Row gap={5} style={{ marginTop: 6, marginLeft: 26 }}>
              <Row gap={4} style={{ backgroundColor: '#a8c7ff', borderRadius: 33, paddingHorizontal: 8, height: 20 }}>
                <Icon name="clock" size={14} color="#004cd4" /><T size={12} w="r" color="#004cd4">10:00 - 17:00</T>
              </Row>
              <Row gap={4} style={{ backgroundColor: '#ffb3b3', borderRadius: 33, paddingHorizontal: 8, height: 20 }}>
                <Icon name="x" size={13} color="#d40000" /><T size={12} w="r" color="#d40000">월요일 휴무</T>
              </Row>
            </Row>
            <Row gap={7} style={{ marginTop: 14 }}>
              {tabs.map((l, i) => (
                <Pressable key={l} onPress={() => { setTab(i); if (i === 2) go('/schedule/map'); }} style={{ height: 40, paddingHorizontal: i === 1 ? 20 : 20, borderRadius: 33, backgroundColor: i === tab ? t.acc : t.card, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={15} color={i === tab ? '#fff' : t.text}>{l}</T>
                </Pressable>
              ))}
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="star" size={22} color={t.sub} />
              </View>
            </Row>
            <View style={{ marginTop: 14, height: 242, borderRadius: 10, backgroundColor: t.card, overflow: 'hidden', paddingHorizontal: 16, paddingTop: 12 }}>
              <T size={15} style={{ lineHeight: 17 }}>장소 설명</T>
              <T size={14} w="l" ls={-3} lh={19} style={{ marginTop: 8 }}>런던 브리지(London Bridge) 근처에 위치한 곳으로 약 1,000년의 역사를 자랑하는 영국 대표 식자재 & 스트리트 푸드 마켓입니다. 신선한 과일, 치즈, 육류부터 세계 각국의 다채로운 요리까지 한자리에서 즐길 수 있어 여행객 필수 코스로 꼽힙니다.</T>
              <T size={15} style={{ marginTop: 22, lineHeight: 17 }}>방문 시 필수 꿀팁</T>
              <T size={14} w="l" ls={-3} lh={19} style={{ marginTop: 8 }}>1.  카드 결제 우선: 대부분의 점포에서 컨택트리스(Contactless) 카드나 트래블월렛, 애플페이를 사용합니다. 현금은 받지 않는 곳이 많습니다.{'\n'}2.  먹을 공간 확보: 마켓 내부 테이블은 경쟁이 치열합니다.</T>
              <Fade id="fadeDetail" color={t.card} height={82} style={{ bottom: 0 }} />
            </View>
          </View>
          {/* 다음 장소들 */}
          <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
            <Row gap={6} style={{ marginLeft: 33 }}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.sub }} /><T size={13} w="l" color="#747474" ls={-3}>도보 15분 / 대중교통 약 1분</T></Row>
            <Row style={{ marginTop: 6, alignItems: 'flex-start' }}>
              <View style={{ width: 40, paddingTop: 2 }}><T size={14} color={t.sub}>▼</T></View>
              <View><T size={14} w="b" color={t.acc}>PM 05:00</T><T size={20} lh={26}>타워브릿지</T></View>
            </Row>
            <Row gap={6} style={{ marginLeft: 33, marginTop: 8 }}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.sub }} /><T size={13} w="l" color="#747474" ls={-3}>도보 40분 / 대중교통 약 15분</T></Row>
            <Row style={{ marginTop: 6, alignItems: 'flex-start' }}>
              <View style={{ width: 40, paddingTop: 2 }}><T size={14} color={t.sub}>▼</T></View>
              <View><T size={14} w="b" color={t.acc}>PM 09:00</T><T size={20} lh={26}>호텔</T></View>
            </Row>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
