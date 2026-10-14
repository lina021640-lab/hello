import { View, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, T, Row, Icon, IconName, Pill, useGo, useTheme, shadow } from '../../src/kit';
import { ActionBtn } from '../../src/screens/saved/parts';
import { MapBase } from '../../src/screens/schedule/shared';
import { ZoomMap } from '../../src/components/ZoomMap';
import { getPlace } from '../../src/data/placeData';
import { useSaved, isSavedName, toggleSavedName, clearToast } from '../../src/data/savedStore';

export default function Place() {
  const go = useGo(); const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const pl = getPlace(name);
  const sv = useSaved(); const saved = isSavedName(sv, pl.n);
  useEffect(() => { if (!sv.toast) return; const id = setTimeout(clearToast, 2200); return () => clearTimeout(id); }, [sv.toast]);
  const toggle = () => toggleSavedName(pl.n, pl);
  const info: { icon: IconName; text: string }[] = [
    { icon: 'pin', text: pl.addr }, { icon: 'clock', text: pl.hours }, ...(pl.site ? [{ icon: 'globe' as IconName, text: pl.site }] : []),
  ];
  const btnTop = Math.max(ins.top, 37) + 9;
  const fb = { position: 'absolute' as const, top: btnTop, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center' as const, justifyContent: 'center' as const };
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Page top={false} pad={0}
        footer={<View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
          <Row gap={10}>
            <ActionBtn kind="ghost" label="구글맵 보기" icon="pin" onPress={() => go(`/saved/openmap?name=${encodeURIComponent(pl.n)}`)} style={{ flex: 1 }} />
            <ActionBtn label="일정에 추가" onPress={() => go(`/saved/add-to-schedule?name=${encodeURIComponent(pl.n)}`)} style={{ flex: 1 }} />
          </Row>
        </View>}>
        <View style={{ height: 270, backgroundColor: t.ph, alignItems: 'center', paddingTop: 71, position: 'absolute', left: 0, right: 0, top: 0 }}>
          <Icon name="photo" size={108} color={t.phIcon} />
        </View>
        <View style={{ marginTop: 240, backgroundColor: t.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 22, paddingHorizontal: 20, gap: 12, minHeight: 560 }}>
          <View style={{ gap: 2 }}>
            <T size={26} w="b" ls={-3}>{pl.n}</T>
            <T size={13} sub>{pl.en}</T>
          </View>
          <Row gap={8}>
            <Pill label={pl.cat} size={12} py={5} />
            <Pill label={`${pl.rating} (${pl.reviews})`} size={12} py={5} />
            <Pill label={pl.open} size={12} py={5} />
          </Row>
          <T size={14} lh={22}>{pl.desc}</T>
          <Row gap={10}>
            <ActionBtn kind={saved ? 'ghost' : 'primary'} h={44} size={14} label={saved ? '저장됨' : '저장'} icon="bookmark" onPress={toggle} style={{ flex: 1 }} />
            <ActionBtn kind="lime" h={44} size={14} label="장소 추가" icon="plus" onPress={() => go(`/saved/add-to-schedule?name=${encodeURIComponent(pl.n)}`)} style={{ flex: 1 }} />
          </Row>
          <View style={{ height: 170, borderRadius: 20, overflow: 'hidden', backgroundColor: t.card2 }}>
            <ZoomMap>
              <MapBase vw={390} vh={170} />
              <Svg width={390} height={170} style={{ position: 'absolute', left: 0, top: 0 }}>
                <Circle cx={195} cy={92} r={9} fill="#000" opacity={0.15} />
                <Path d="M195 52 C186 52 180 59 180 67 C180 78 195 92 195 92 C195 92 210 78 210 67 C210 59 204 52 195 52 Z" fill={t.acc} />
                <Circle cx={195} cy={67} r={5} fill="#fff" />
              </Svg>
            </ZoomMap>
          </View>
          <View style={{ backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14, gap: 12, ...shadow(t) }}>
            {info.map((x) => (
              <Row key={x.icon} gap={10}>
                <Icon name={x.icon} size={18} color={t.sub} />
                <T size={14} style={{ flex: 1 }}>{x.text}</T>
              </Row>
            ))}
          </View>
          <View style={{ backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14, gap: 6, ...shadow(t) }}>
            <Row><T size={13} sub style={{ flex: 1 }}>내 메모</T><T size={13} w="b" color={t.acc}>수정</T></Row>
            <T size={14}>크로와상 꼭 먹기</T>
          </View>
          <Pressable onPress={() => go('/saved/save')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, ...shadow(t) }}>
            <Icon name="folder" size={18} color={t.acc} />
            <T size={14} style={{ flex: 1 }}>{saved ? `${pl.city || '내'} 폴더에 저장됨` : '아직 저장하지 않았어요'}</T>
            <T size={13} w="b" color={t.acc}>{saved ? '변경' : '폴더 선택'}</T>
          </Pressable>
          <T size={15} w="b">공유한 친구 · 한줄평</T>
          {pl.tips.length === 0 ? <T size={13} sub>아직 공유한 친구가 없어요</T> : null}
          {pl.tips.map((x) => (
            <Row key={x.who + x.text} gap={10} align="flex-start">
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><T size={12} w="b" color={t.acc}>{x.who}</T></View>
              <View style={{ flex: 1, gap: 2 }}><T size={12} w="b" sub>{x.name}</T><T size={14} lh={21}>“{x.text}”</T></View>
            </Row>
          ))}
        </View>
      </Page>
      <Pressable onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))} style={[fb, { left: 20 }]}><Icon name="back" size={20} color="#1a1d23" /></Pressable>
      <Pressable onPress={() => go('/saved/share')} style={[fb, { right: 66 }]}><Icon name="share" size={20} color="#1a1d23" /></Pressable>
      <Pressable onPress={toggle} style={[fb, { right: 16 }]}><Icon name="bookmark" size={20} color={saved ? '#1e6fff' : '#8a8f98'} /></Pressable>
      {sv.toast ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 20, right: 20, bottom: 96 + Math.max(ins.bottom, 0), alignItems: 'center' }}>
          <View style={{ backgroundColor: t.text, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12 }}><T size={14} w="b" color={t.bg}>{sv.toast}</T></View>
        </View>
      ) : null}
    </View>
  );
}
