import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, T, Row, Icon, useTheme } from '../../src/kit';
import { Backdrop, AVATAR_COLORS } from '../../src/screens/schedule/shared';

const friends = [{ n: '45efgh', c: AVATAR_COLORS[0] }, { n: 'abcd123', c: '#9be18f' }];

export default function Members() {
  const r = useRouter(); const { t } = useTheme();
  const close = () => (r.canGoBack() ? r.back() : r.replace('/schedule'));
  return (
    <View style={{ flex: 1 }}>
      <Page scroll={false} pad={0}><Backdrop /></Page>
      <Pressable onPress={close} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ position: 'absolute', left: 20, right: 20, top: 176, backgroundColor: t.card, borderRadius: 30, padding: 18, gap: 12, shadowColor: '#1a264d', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }}>
        <Row>
          <T size={18} w="b" style={{ flex: 1 }}>함께하는 친구</T>
          <Pressable hitSlop={10} onPress={close}><Icon name="x" size={22} color={t.text} /></Pressable>
        </Row>
        <View style={{ backgroundColor: t.track, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', gap: 2 }}>
          <T size={12} sub>이번 여행의 초대 코드</T>
          <T size={20} w="b">W684251E4</T>
        </View>
        <Row gap={8}>
          {['코드 복사 하기', '카톡으로 초대하기'].map((l) => (
            <Pressable key={l} style={{ flex: 1, height: 38, borderRadius: 19, backgroundColor: 'rgba(138,143,152,0.9)', alignItems: 'center', justifyContent: 'center' }}>
              <T size={13} w="b" color="#fff">{l}</T>
            </Pressable>
          ))}
        </Row>
        {friends.map((f) => (
          <Row key={f.n} gap={12}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: f.c }} />
            <T size={14} w="b" style={{ flex: 1 }}>{f.n}</T>
            <Icon name="minus" size={20} color={t.sub} />
          </Row>
        ))}
      </View>
    </View>
  );
}
