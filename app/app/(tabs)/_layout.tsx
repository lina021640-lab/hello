import { Tabs } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';
import { Icon, T, IconName } from '../../src/kit';

const items: { name: string; label: string; icon: IconName }[] = [
  { name: 'saved', label: '저장·공유', icon: 'folder' },
  { name: 'tips', label: '꿀팁', icon: 'chat' },
  { name: 'home', label: '홈', icon: 'star' },
  { name: 'schedule', label: '일정', icon: 'swap' },
  { name: 'wallet', label: '지갑', icon: 'wallet' },
];

/** 피그마 Tab bar: 390×92, 라이트 흰색 + 위쪽 그림자 / 다크 #515151@20% + 블러. 아이콘 26, 라벨 11px(활성 Bold 파랑) */
function Bar({ state, navigation }: any) {
  const { t } = useTheme();
  const ins = useSafeAreaInsets();
  const light = t.mode === 'light';
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 78 + Math.max(ins.bottom, 14), flexDirection: 'row',
      backgroundColor: light ? '#ffffff' : 'rgba(81,81,81,0.2)',
      shadowColor: '#001a4d', shadowOpacity: light ? 0.08 : 0, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: light ? 12 : 0 }}>
      {!light && <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />}
      {state.routes.map((route: any, i: number) => {
        const it = items.find((x) => x.name === route.name)!;
        const active = state.index === i;
        const col = active ? t.acc : t.sub;
        return (
          <Pressable key={route.key} onPress={() => navigation.navigate(route.name)} style={{ flex: 1, alignItems: 'center', paddingTop: 14, gap: 6 }}>
            {active && it.name === 'home'
              ? <View style={{ width: 41, height: 41, borderRadius: 21, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center', marginTop: -7, marginBottom: -8 }}><Icon name="star" size={22} color="#fff" /></View>
              : <Icon name={it.icon} size={26} color={col} />}
            {active && it.name === 'home' ? null : <T size={11} w={active ? 'b' : 'm'} color={col}>{it.label}</T>}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(p) => <Bar {...p} />} screenOptions={{ headerShown: false }} initialRouteName="home">
      {items.map((i) => <Tabs.Screen key={i.name} name={i.name} />)}
    </Tabs>
  );
}
