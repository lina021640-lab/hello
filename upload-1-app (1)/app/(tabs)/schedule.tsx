import { View, Pressable, ScrollView } from 'react-native';
import { Page, T, Row, Icon, Btn, useGo, useTheme } from '../../src/kit';
import { Dashboard, MemoCard, Avatars } from '../../src/screens/schedule/shared';
import { useCurrentTrip } from '../../src/data/currentTrip';
import { useUserSchedule, setAddDay } from '../../src/data/scheduleStore';
import { tripRange } from '../../src/data/tripStore';
import { countryKo } from '../../src/data/cities';

const uniq = <X,>(a: X[]) => a.filter((x, i) => a.indexOf(x) === i);

export default function Schedule() {
  const go = useGo(); const { t } = useTheme();
  const view = useCurrentTrip();
  const items = useUserSchedule();
  const back = (
    <Row style={{ height: 44, marginTop: 8, justifyContent: 'space-between' }}>
      <Pressable hitSlop={10} onPress={() => go('/home')}><Icon name="back" size={24} color={t.text} /></Pressable>
      {view ? (
        <Row gap={16}>
          <Pressable hitSlop={8} onPress={() => go('/schedule/links')}><Icon name="link" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/files')}><Icon name="folder" size={23} color={t.text} /></Pressable>
          <Pressable hitSlop={8} onPress={() => go('/schedule/manage')}><Icon name="menu" size={23} color={t.text} /></Pressable>
        </Row>
      ) : null}
    </Row>
  );
  if (!view) {
    return (
      <Page tab>
        {back}
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 120 }}>
          <Icon name="cal" size={44} color={t.phIcon} />
          <T size={18} w="b">예정된 여행이 없어요</T>
          <T size={13} sub align="center" lh={19}>여행을 추가하면 일정과 항공권, 메모를{'\n'}한곳에서 관리할 수 있어요.</T>
          <Btn label="여행 추가" icon="plus" onPress={() => go('/trip/new')} h={48} style={{ alignSelf: 'stretch', marginTop: 12 }} />
        </View>
      </Page>
    );
  }
  const { trip } = view;
  const countries = uniq(trip.cities.map((c) => c.country || countryKo(c.cc)).filter(Boolean)).join(' · ');
  const dday = view.dday.replace(/^D([+-])(\d+)$/, 'D $1 $2');
  const cities = uniq(trip.cities.map((c) => c.city)).map((n) => ({ n, c: trip.cities.find((x) => x.city === n)?.cc ?? '' }));
  return (
    <Page tab>
      {back}
      {/* 제목 */}
      <View style={{ marginTop: 2 }}>
        {countries ? <T size={15} ls={-1} lh={22}>{countries}</T> : null}
        <T size={39} ls={-1} lh={49} numberOfLines={1} style={{ marginTop: -3 }}>{trip.name}</T>
      </View>
      <Row style={{ marginTop: 8, height: 35, justifyContent: 'space-between' }}>
        <Row gap={6} style={{ flex: 1 }}>
          <View style={{ height: 25, paddingHorizontal: 12, borderRadius: 999, backgroundColor: t.mode === 'dark' ? '#fff' : '#000', alignItems: 'center', justifyContent: 'center' }}>
            <T size={16} w="r" color={t.mode === 'dark' ? '#000' : '#fff'}>{dday}</T>
          </View>
          <T size={15} ls={-1} style={{ marginLeft: 2 }} numberOfLines={1}>{tripRange(trip)}</T>
        </Row>
        <Avatars colors={trip.members} size={35} maxWidth={66} onPress={() => go('/schedule/members')} />
      </Row>
      <View style={{ marginTop: 8 }}>
        <Dashboard view={view} items={items} onMap={() => go('/schedule/map')} onDetail={() => go('/schedule/detail')} onFlight={() => go('/schedule/flight')}
          onAddDay={(d) => { setAddDay(d); go('/schedule/add'); }} />
      </View>
      <View style={{ marginTop: 11 }}><MemoCard key={trip.id} tripId={trip.id} /></View>
      {cities.length ? (
        <>
          <T size={16} ls={-1} style={{ marginTop: 16, marginBottom: 6 }}>방문하는 도시에 대해 알아보기</T>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 21, gap: 10, paddingVertical: 8 }}>
            {cities.map((c) => (
              <Pressable key={c.n} onPress={() => go(`/schedule/city?city=${encodeURIComponent(c.n)}`)} style={{ width: 132, height: 140, borderRadius: 30, overflow: 'hidden', backgroundColor: '#5b6270', justifyContent: 'flex-end', paddingLeft: 16, paddingBottom: 12 }}>
                <View style={{ position: 'absolute', top: 14, right: 14 }}><Icon name="photo" size={22} color="rgba(255,255,255,0.35)" /></View>
                <T size={24} ls={-1} color="#fff" numberOfLines={1} style={{ paddingRight: 8 }}>{c.n}</T>
                <T size={15} ls={-1} color="#fff">더 알아보기</T>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}
    </Page>
  );
}
