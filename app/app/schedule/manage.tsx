import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, T, Row, Icon, IconName, useGo, useTheme } from '../../src/kit';
import { Backdrop } from '../../src/screens/schedule/shared';

export default function Manage() {
  const r = useRouter(); const go = useGo(); const { t, toggle } = useTheme();
  const close = () => (r.canGoBack() ? r.back() : r.replace('/schedule'));
  const items: { icon: IconName; label: string; onPress?: () => void; danger?: boolean }[] = [
    { icon: 'pencil', label: '일정 수정하기', onPress: () => go('/trip/edit') },
    { icon: 'folder', label: '내 파일 관리하기', onPress: () => go('/schedule/files') },
    { icon: 'link', label: '내 링크 관리하기', onPress: () => go('/schedule/links') },
    { icon: 'cal', label: '내 일정 캘린더에 저장하기' },
    { icon: 'contrast', label: '다크 모드 켬 / 끔', onPress: toggle },
    { icon: 'trash', label: '일정 삭제하기', danger: true, onPress: () => go('/report/delete') },
  ];
  return (
    <View style={{ flex: 1 }}>
      <Page scroll={false} pad={0}><Backdrop /></Page>
      <Pressable onPress={close} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 322, backgroundColor: t.card, borderTopLeftRadius: 30, borderBottomLeftRadius: 30, paddingTop: 60, paddingHorizontal: 22, gap: 20 }}>
        <Pressable hitSlop={10} onPress={close} style={{ alignSelf: 'flex-start' }}><Icon name="x" size={24} color={t.text} /></Pressable>
        <Pressable onPress={() => go('/my')}>
          <Row gap={14}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.text, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={32} color={t.bg} />
            </View>
            <View style={{ gap: 2 }}>
              <T size={28} w="b" ls={-3}>user</T>
              <T size={12} sub>내 정보 수정 ▷</T>
            </View>
          </Row>
        </Pressable>
        <View style={{ height: 8 }} />
        {items.map((it) => (
          <Pressable key={it.label} onPress={it.onPress}>
            <Row gap={14} style={{ paddingVertical: 8 }}>
              <Icon name={it.icon} size={22} color={it.danger ? t.bad : t.text} />
              <T size={14} color={it.danger ? t.bad : t.text}>{it.label}</T>
            </Row>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
