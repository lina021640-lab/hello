import { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/data/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Icon, useTheme, Glass, AvatarStack } from '../../src/kit';
import { useProfile } from '../../src/data/profile';
import { useTripStore, selectTrip, tripCountriesEn, tripCountriesKo, tripRange } from '../../src/data/tripStore';
import { WorldDotMap } from '../../src/components/WorldDotMap';

const W = Dimensions.get('window').width;
// 피그마 H-01 (390 기준): 카드 322×265, 선택 안 된 카드 304 폭, 카드 간격 9
const CARD_H = 265, SEL_W = 322, OFF_W = 304, GAP = 9;
export default function Home() {
  const { t } = useTheme(); const r = useRouter(); const ins = useSafeAreaInsets();
  const { trips, selectedId, loading, error } = useTripStore();
  const { session, nickname, loading: authLoading } = useAuth();
  // 세션이 없으면(만료·로그아웃) 로그인 화면으로
  useEffect(() => { if (!authLoading && !session) r.replace('/auth/login'); }, [authLoading, session]);
  const homeTrips = useMemo(() => trips.map((tr) => ({ id: tr.id, name: tr.name, range: tripRange(tr), sub: tripCountriesKo(tr), countries: tripCountriesEn(tr), avatars: tr.members })), [trips]);
  const selIdx = Math.max(0, trips.findIndex((x) => x.id === selectedId));
  const [idx, setIdx] = useState(selIdx); const pf = useProfile();
  const scroller = useRef<ScrollView>(null); const lock = useRef(0);
  const dark = t.mode === 'dark';
  const top = Math.max(ins.top, 44);
  const mapColors = dark ? { base: '#34363f', hi: '#4d95ff' } : { base: '#c3cde0', hi: '#2f7bff' };
  const countries = homeTrips[Math.min(idx, homeTrips.length - 1)]?.countries ?? [];
  const bottomPad = 806 - 739 - 0; // 카드 아래 ~ 탭바 간격(피그마 27)
  const offs = useMemo(() => homeTrips.map((_, i) => i * (SEL_W + GAP)), [homeTrips.length]);
  // 스토어에서 선택이 바뀌면(새 여행 추가·삭제) 해당 카드로 스크롤
  useEffect(() => {
    setIdx(selIdx);
    lock.current = Date.now() + 600;
    const id = setTimeout(() => scroller.current?.scrollTo({ x: selIdx * (SEL_W + GAP), animated: false }), 0);
    return () => clearTimeout(id);
  }, [selectedId, homeTrips.length]);
  return (
    <View style={{ flex: 1, backgroundColor: dark ? '#0b0b0d' : '#f6f7f9' }}>
      <Image source={dark ? require('../../assets/bg/dark.png') : require('../../assets/bg/light.png')} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
      {/* 지도 (피그마: 이미지가 y219~584) */}
      <View style={{ position: 'absolute', left: 0, top: top + 150, width: W, height: 340 }}>
        <WorldDotMap width={W} height={340} countries={countries} base={mapColors.base} hi={mapColors.hi} btnBg={dark ? '#fff' : '#000'} />
      </View>
      {/* 인사 / 타이틀 / 추가 버튼 */}
      <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, top }}>
        <T size={22} ls={-1} style={{ position: 'absolute', left: 23, top: 28 }}>{`${nickname ?? '여행자'}님! `}</T>
        <Pressable onPress={() => r.push('/my')} style={{ position: 'absolute', right: 21, top: 12, width: 48, height: 47, borderRadius: 24, backgroundColor: dark ? '#fff' : '#000', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 9, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
          {pf.me ? <Image source={{ uri: pf.me }} style={{ width: 48, height: 47, borderRadius: 24 }} /> : <Icon name="user" size={26} color={dark ? '#000' : '#fff'} />}
        </Pressable>
        <T size={dark ? 36 : 39} ls={-1} lh={50} style={{ position: 'absolute', left: dark ? 29 : 21, top: 73 }}>{'이번 여행은\n어디로 가나요?'}</T>
        <Pressable onPress={() => r.push('/trip/new')} style={{ position: 'absolute', left: 21, top: 186, height: 40, paddingHorizontal: 15, borderRadius: 31, backgroundColor: dark ? '#fff' : '#000', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 9, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
          <T size={16} w="r" color={dark ? '#000' : '#fff'}>+ 여행 추가</T>
        </Pressable>
      </View>
      {/* 여행이 없을 때 안내 */}
      {homeTrips.length === 0 ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 68 + 40, alignItems: 'center', paddingHorizontal: 32 }}>
          <T size={14} w="m" align="center" color={error ? t.bad : t.sub}>{loading ? '여행을 불러오는 중…' : error ?? '아직 여행이 없어요. 여행 추가를 눌러 시작해 보세요'}</T>
        </View>
      ) : null}
      {/* 여행 카드 */}
      <ScrollView ref={scroller} horizontal snapToOffsets={offs} decelerationRate="fast" showsHorizontalScrollIndicator={false} scrollEventThrottle={16}
        onScroll={(e) => {
          const i = Math.max(0, Math.min(homeTrips.length - 1, Math.round(e.nativeEvent.contentOffset.x / (SEL_W + GAP))));
          if (Date.now() < lock.current) return;
          setIdx(i); if (homeTrips[i]) selectTrip(homeTrips[i].id);
        }}
        contentContainerStyle={{ paddingHorizontal: 22, gap: GAP, paddingVertical: 30 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 68 + 27 - 30, flexGrow: 0, height: CARD_H + 60 }}>
        {homeTrips.map((tr, i) => {
          const on = i === idx;
          const sub = on ? 'rgba(60,60,60,0.65)' : '#d9d9d9';
          const main = on ? t.text : (dark ? 'rgba(255,255,255,0.45)' : '#d9d9d9');
          const body = (
            <>
              <View style={{ position: 'absolute', left: 15, top: 15 }}><AvatarStack colors={tr.avatars} photos={[pf.me]} size={52} maxWidth={150} border="#fff" /></View>
              <Pressable onPress={() => r.push('/schedule')} style={{ position: 'absolute', right: 17, top: 15, height: 43, width: 121, borderRadius: 31, backgroundColor: dark ? '#fff' : '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <T size={16} color={dark ? '#000' : '#fff'} ls={-1}>바로가기</T>
                <View style={{ transform: [{ rotate: '45deg' }] }}><Icon name="arrow" size={18} color={dark ? '#000' : '#fff'} /></View>
              </Pressable>
              <T size={15} ls={-1} color={dark && on ? 'rgba(255,255,255,0.65)' : sub} lh={31} style={{ position: 'absolute', left: 20, top: 84 }}>{tr.range}</T>
              <T size={35} ls={-1} color={dark && on ? '#fff' : main} lh={39} style={{ position: 'absolute', left: 20, top: 121 }}>{tr.name}</T>
              <T size={15} w="l" color={dark && on ? '#fff' : main} lh={31} style={{ position: 'absolute', left: 20, top: 168 }}>{tr.sub}</T>
              <Pressable onPress={() => r.push({ pathname: '/trip/edit', params: { id: tr.id } })} style={{ position: 'absolute', left: 22, bottom: 22, height: 43, width: 128, borderRadius: 54, backgroundColor: '#737373', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="pencil" size={15} color="#fff" />
                <T size={15} color="#fff" ls={-1}>여행 수정하기</T>
              </Pressable>
            </>
          );
          if (on) {
            return (
              <Glass key={tr.id} radius={37} blur={dark ? 20 : 12} fill={dark ? 'rgba(77,149,255,0.35)' : 'rgba(255,255,255,0.13)'} style={{ width: SEL_W, height: CARD_H }}>
                {body}
              </Glass>
            );
          }
          return (
            <View key={tr.id} style={{ width: OFF_W, height: CARD_H, borderRadius: 37, backgroundColor: dark ? 'rgba(77,149,255,0.18)' : '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 21, shadowOffset: { width: 0, height: 9 }, elevation: 6 }}>
              {body}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
