import { useState } from 'react';
import { View, Pressable, Linking, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { T, Btn, Row, Icon, IconName, useTheme, shadow } from '../../src/kit';
import { SheetScreen, Toggle, IconBadge } from '../../src/screens/saved2/parts';
import { usePlace } from '../../src/data/placeData';
import { relTime } from '../../src/data/savedStore';


export default function OpenMap() {
  const r = useRouter(); const { t } = useTheme();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const pl = usePlace(name); const ADDR = pl.addr;
  const Q = encodeURIComponent(`${pl.n} ${pl.city}`.trim());
  const MAPS = `https://www.google.com/maps/search/?api=1&query=${Q}`;
  const DIR = `https://www.google.com/maps/dir/?api=1&destination=${Q}&travelmode=transit`;
  const [always, setAlways] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { (globalThis as any).navigator?.clipboard?.writeText(ADDR); } catch {}
    setCopied(true);
  };
  const opts: { icon: IconName; title: string; sub?: string; on: () => void }[] = [
    { icon: 'pin', title: 'Google 지도 앱에서 열기', sub: '설치돼 있으면 앱으로 바로 이동해요', on: () => Linking.openURL(MAPS) },
    { icon: 'route', title: '길찾기 · 대중교통', sub: `현재 위치에서 ${pl.n}까지`, on: () => Linking.openURL(DIR) },
    { icon: 'globe', title: '브라우저에서 열기', sub: '앱이 없을 때 웹으로 열려요', on: () => Linking.openURL(MAPS) },
    ...(ADDR ? [{ icon: 'copy' as IconName, title: copied ? '주소 복사됨' : '주소 복사', on: copy }] : []),
  ];
  return (
    <SheetScreen top={236} title="구글맵에서 열기"
      back={
        <View style={[{ backgroundColor: t.card, borderRadius: 22, padding: 14, gap: 10, marginTop: 0 }, shadow(t)]}>
          {pl.sharedBy ? (
            <Row gap={10}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}><T size={14} w="b" color="#fff">{pl.sharedBy.slice(0, 1)}</T></View>
              <View style={{ flex: 1 }}><T size={14} w="b">{pl.sharedBy}</T><T size={12} sub>{pl.sharedAt ? `${relTime(pl.sharedAt)} 공유` : '공유한 장소'}</T></View>
            </Row>
          ) : null}
          <T size={16} w="b">{pl.n}</T>
          {pl.tips[0] ? <T size={13}>“{pl.tips[0].text}”</T> : null}
        </View>
      }
      footer={<Btn kind="ghost" label="취소" onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))} />}>
      <Row gap={12} style={{ backgroundColor: t.card2, borderRadius: 18, paddingLeft: 10, paddingRight: 12, paddingVertical: 10 }}>
        <LinearGradient colors={['#8cc0ff', '#1e6fff']} locations={[0, 0.714]} start={{ x: -0.06, y: 0.19 }} end={{ x: 1.06, y: 0.81 }} style={{ width: 48, height: 48, borderRadius: 12 }} />
        <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">{pl.n}</T>{ADDR ? <T size={12} sub>{ADDR}</T> : null}</View>
      </Row>
      <View style={{ backgroundColor: t.card2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 }}>
        {opts.map((o, i) => (
          <View key={o.title}>
            {i > 0 ? <View style={{ height: 1, backgroundColor: t.line }} /> : null}
            <Pressable onPress={o.on}>
              <Row gap={12} style={{ paddingVertical: 10 }}>
                <IconBadge name={o.icon} bg={t.accS} color={t.acc} />
                <View style={{ flex: 1 }}><T size={15} w="b">{o.title}</T>{o.sub ? <T size={12} sub>{o.sub}</T> : null}</View>
                <Icon name="chev" size={18} color={t.sub} />
              </Row>
            </Pressable>
          </View>
        ))}
      </View>
      <Row gap={8} align="flex-start" style={{ paddingTop: 2, paddingHorizontal: 2 }}>
        <View style={{ paddingTop: 1.5 }}><Icon name="info" size={14} color={t.sub} /></View>
        <T size={12} sub lh={17} style={{ flex: 1 }}>외부 앱으로 이동해요. 이동한 뒤에도 트립메이트의 일정은 그대로 저장돼요.</T>
      </Row>
      <Row style={{ backgroundColor: t.card2, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 }}>
        <T size={14} style={{ flex: 1 }}>다음부터 바로 열기</T>
        <Toggle on={always} onChange={setAlways} />
      </Row>
    </SheetScreen>
  );
}
