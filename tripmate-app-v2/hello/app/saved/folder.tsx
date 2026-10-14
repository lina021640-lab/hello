import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, Header, T, Row, Icon, PhotoPH, Pill, useGo, useTheme, shadow } from '../../src/kit';
import { Chip, ActionBtn } from '../../src/screens/saved/parts';

const places = [
  { n: '버러 마켓', m: '시장 · ★4.6 (12,480)', memo: '메모 · 크로와상 꼭 먹기' },
  { n: '타워브리지', m: '명소 · ★4.7 (98,210)', memo: '메모 · 야경 때 한 번 더' },
  { n: '대영박물관', m: '박물관 · ★4.8 (150,332)', memo: '무료 입장 · 예약 필요' },
  { n: '코벤트 가든', m: '쇼핑 · ★4.5 (60,114)' },
  { n: 'Dishoom', m: '맛집 · ★4.7 (21,903)', memo: '메모 · 웨이팅 길어요' },
];

export default function Folder() {
  const go = useGo(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <Page gap={12}>
        <Header title="런던" right={
          <Row gap={14}><Icon name="search" size={22} color={t.text} /><Icon name="more" size={22} color={t.text} /></Row>} />
        <Row gap={6}>
          <Icon name="lock" size={14} color={t.sub} />
          <T size={13} sub style={{ flex: 1 }}>5곳 · 나만 보기</T>
          <T size={13} w="b" color={t.acc} onPress={() => go('/saved/folder-new')}>편집</T>
        </Row>
        <Row gap={8}>
          <Chip label="리스트" active />
          <Chip label="지도" icon="map" onPress={() => go('/saved/map')} />
          <View style={{ flex: 1 }} />
          <Pill label="최근 저장순" trail="down" size={13} />
        </Row>
        {places.map((p) => (
          <Pressable key={p.n} onPress={() => go('/saved/place')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, backgroundColor: t.card, ...shadow(t) }}>
            <PhotoPH w={64} h={64} radius={14} iconSize={26} />
            <View style={{ flex: 1, gap: 2 }}>
              <T size={15} w="b" numberOfLines={1}>{p.n}</T>
              <T size={12} sub numberOfLines={1}>{p.m}</T>
              {p.memo ? <T size={12} color={t.acc} numberOfLines={1}>{p.memo}</T> : null}
            </View>
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Icon name="bookmark" size={20} color={t.acc} />
              <Icon name="more" size={18} color={t.sub} />
            </View>
          </Pressable>
        ))}
        <View style={{ height: 60 }} />
      </Page>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: Math.max(ins.bottom, 26), alignItems: 'center' }}>
        <ActionBtn kind="dark" h={48} size={14} label="지도로 보기" icon="map" onPress={() => go('/saved/map')} style={{ width: 160, ...shadow(t) }} />
      </View>
    </View>
  );
}
