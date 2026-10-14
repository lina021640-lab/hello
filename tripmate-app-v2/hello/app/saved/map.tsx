import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Icon, PhotoPH, useGo, useTheme, shadow } from '../../src/kit';
import { Chip, ActionBtn, RoundBtn, MapBg } from '../../src/screens/saved/parts';

const BLUE = '#1e6fff', ORANGE = '#ff9f0a', GREEN = '#34c759';
const markers = [
  { e: '☕', x: 77, y: 341, c: BLUE }, { e: '🗼', x: 213, y: 281, c: BLUE }, { e: '🏛️', x: 279, y: 195, c: ORANGE },
  { e: '🌳', x: 131, y: 181, c: GREEN }, { e: '🛍️', x: 311, y: 401, c: ORANGE }, { e: '🍺', x: 51, y: 431, c: BLUE },
];

export default function SavedMap() {
  const go = useGo(); const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [chip, setChip] = useState(0);
  const T0 = Math.max(ins.top, 37) - 37;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MapBg />
      <RoundBtn icon="back" onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))} style={{ position: 'absolute', left: 20, top: 48 + T0 }} />
      <Pressable onPress={() => go('/saved/search')} style={{ position: 'absolute', left: 72, right: 20, top: 48 + T0, height: 44, borderRadius: 22, backgroundColor: t.card, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, ...shadow(t) }}>
        <Icon name="search" size={18} color={t.sub} />
        <T size={14} style={{ flex: 1 }}>내 저장 장소 · 12곳</T>
      </Pressable>
      <Row gap={8} style={{ position: 'absolute', left: 20, top: 104 + T0 }}>
        {[['전체', undefined], ['런던', BLUE], ['파리', ORANGE], ['피렌체', GREEN]].map(([l, d], i) => (
          <Chip key={l as string} label={l as string} dot={d as string | undefined} active={i === chip} onPress={() => setChip(i)} />
        ))}
      </Row>
      {markers.map((m) => (
        <View key={m.e} style={{ position: 'absolute', left: m.x, top: m.y, width: 38, height: 38, borderRadius: 19, borderWidth: 3, borderColor: m.c, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', ...shadow(t) }}>
          <T size={20}>{m.e}</T>
        </View>
      ))}
      <View style={{ position: 'absolute', left: 132, top: 392, backgroundColor: t.card, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, ...shadow(t) }}>
        <T size={12} w="b">버러 마켓</T>
      </View>
      <View style={{ position: 'absolute', left: 155, top: 415, width: 50, height: 50, borderRadius: 25, borderWidth: 4, borderColor: BLUE, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', ...shadow(t) }}>
        <T size={26}>🥐</T>
      </View>
      <View style={{ position: 'absolute', right: 20, top: 160 + T0, gap: 10 }}>
        <RoundBtn icon="list" iconSize={22} onPress={() => go('/saved/folder')} />
        <RoundBtn icon="locate" />
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 90, backgroundColor: t.card, borderRadius: 26, padding: 14, gap: 12, ...shadow(t) }}>
        <Row gap={12}>
          <PhotoPH w={64} h={64} radius={14} iconSize={27} />
          <View style={{ flex: 1, gap: 2 }}>
            <T size={17} w="b" onPress={() => go('/saved/place')}>버러 마켓</T>
            <T size={12} sub>런던 폴더 · 시장 · ★4.6</T>
            <T size={12} color={t.acc}>메모 · 크로와상 꼭 먹기</T>
          </View>
          <Pressable onPress={() => go('/saved/marker')} style={{ alignItems: 'center', gap: 2 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2.5, borderColor: BLUE, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
              <T size={20}>🥐</T>
            </View>
            <T size={10} w="b" color={t.acc}>마커 꾸미기</T>
          </Pressable>
        </Row>
        <Row gap={8}>
          <ActionBtn kind="ghost" h={44} size={14} label="구글맵 보기" icon="pin" onPress={() => go('/saved/openmap')} style={{ flex: 1 }} />
          <ActionBtn h={44} size={14} label="일정에 추가" onPress={() => go('/saved/add-to-schedule')} style={{ flex: 1 }} />
        </Row>
      </View>
    </View>
  );
}
