import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, T, Row, Icon, IconName, Pill, useGo, useTheme, shadow } from '../../src/kit';
import { ActionBtn } from '../../src/screens/saved/parts';

const info: { icon: IconName; text: string }[] = [
  { icon: 'pin', text: '8 Southwark St, London SE1 9AL' },
  { icon: 'clock', text: '10:00–17:00 · 월요일 휴무' },
  { icon: 'globe', text: 'boroughmarket.org.uk' },
];
const tips = [{ who: '민', text: '평일 오전이 한가해요' }, { who: '지', text: '현금 가져가세요, 일부 가게는 카드 안 돼요' }];

export default function Place() {
  const go = useGo(); const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const btnTop = Math.max(ins.top, 37) + 9;
  const fb = { position: 'absolute' as const, top: btnTop, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center' as const, justifyContent: 'center' as const };
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Page top={false} pad={0}
        footer={<View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
          <Row gap={10}>
            <ActionBtn kind="ghost" label="구글맵 보기" icon="pin" onPress={() => go('/saved/openmap')} style={{ flex: 1 }} />
            <ActionBtn label="일정에 추가" onPress={() => go('/saved/add-to-schedule')} style={{ flex: 1 }} />
          </Row>
        </View>}>
        <View style={{ height: 270, backgroundColor: t.ph, alignItems: 'center', paddingTop: 71, position: 'absolute', left: 0, right: 0, top: 0 }}>
          <Icon name="photo" size={108} color={t.phIcon} />
        </View>
        <View style={{ marginTop: 240, backgroundColor: t.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 22, paddingHorizontal: 20, gap: 12, minHeight: 560 }}>
          <View style={{ gap: 2 }}>
            <T size={26} w="b" ls={-3}>버러 마켓</T>
            <T size={13} sub>Borough Market</T>
          </View>
          <Row gap={8}>
            <Pill label="시장" size={12} py={5} />
            <Pill label="★ 4.6 (12,480)" size={12} py={5} />
            <Pill label="영업 중" size={12} py={5} />
          </Row>
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
          <Pressable onPress={() => go('/saved/folder')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, ...shadow(t) }}>
            <Icon name="folder" size={18} color={t.acc} />
            <T size={14} style={{ flex: 1 }}>런던 폴더에 저장됨</T>
            <T size={13} w="b" color={t.acc}>변경</T>
          </Pressable>
          <T size={15} w="b">친구들의 한 줄 팁</T>
          {tips.map((x) => (
            <Row key={x.who} gap={10}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><T size={12} w="b" color={t.acc}>{x.who}</T></View>
              <T size={13} style={{ flex: 1 }}>{x.text}</T>
            </Row>
          ))}
        </View>
      </Page>
      <Pressable onPress={() => (r.canGoBack() ? r.back() : r.replace('/saved'))} style={[fb, { left: 20 }]}><Icon name="back" size={20} color="#1a1d23" /></Pressable>
      <Pressable style={[fb, { right: 66 }]}><Icon name="share" size={20} color="#1a1d23" /></Pressable>
      <Pressable style={[fb, { right: 16 }]}><Icon name="bookmark" size={20} color="#1e6fff" /></Pressable>
    </View>
  );
}
