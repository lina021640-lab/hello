import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { Icon, T, IconName } from '../kit';

export const TAB_ITEMS: { name: string; label: string; icon: IconName }[] = [
  { name: 'saved', label: '저장·공유', icon: 'folder' },
  { name: 'tips', label: '꿀팁', icon: 'chat' },
  { name: 'home', label: '홈', icon: 'star' },
  { name: 'schedule', label: '일정', icon: 'swap' },
  { name: 'wallet', label: '지갑', icon: 'wallet' },
];

export const TAB_H = 68;
/** 피그마 Tab bar: 390×92, 라이트 흰색 + 위쪽 그림자 / 다크 #515151@20% + 블러. 탭 화면 밖(공유 피드·친구 일정)에서도 같이 쓴다 */
export function AppTabBar({ active, onPress }: { active: string; onPress: (name: string) => void }) {
  const { t } = useTheme();
  const ins = useSafeAreaInsets();
  const light = t.mode === 'light';
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: TAB_H + Math.max(ins.bottom - 14, 0), flexDirection: 'row',
      backgroundColor: light ? '#ffffff' : 'rgba(81,81,81,0.2)',
      shadowColor: '#001a4d', shadowOpacity: light ? 0.08 : 0, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: light ? 12 : 0 }}>
      {!light && <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />}
      {TAB_ITEMS.map((it) => {
        const on = active === it.name;
        const col = on ? t.acc : t.sub;
        return (
          <Pressable key={it.name} onPress={() => onPress(it.name)} style={{ flex: 1, alignItems: 'center', paddingTop: on && it.name === 'home' ? 0 : 8, justifyContent: on && it.name === 'home' ? 'center' : 'flex-start', paddingBottom: on && it.name === 'home' ? Math.max(ins.bottom - 14, 0) : 0, gap: 4 }}>
            {on && it.name === 'home'
              ? <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}><Icon name="star" size={27} color="#fff" /></View>
              : <Icon name={it.icon} size={26} color={col} />}
            {on && it.name === 'home' ? null : <T size={11} w={on ? 'b' : 'm'} color={col}>{it.label}</T>}
          </Pressable>
        );
      })}
    </View>
  );
}
