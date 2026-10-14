import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Icon, IconName, useTheme } from '../../src/kit';
import { Big, Dim, FeedPostDim, Grabber, Sep, useClose } from '../../src/screens/wallet-report/parts';

export default function ReportMore() {
  const { t } = useTheme(); const close = useClose(); const r = useRouter(); const ins = useSafeAreaInsets();
  const items: { icon: IconName; label: string; bad?: boolean; on?: () => void }[] = [
    { icon: 'bookmark', label: '장소 저장', on: close },
    { icon: 'copy', label: '링크 복사', on: close },
    { icon: 'eyeoff', label: '이 글 숨기기', on: close },
    { icon: 'userx', label: '민수님 차단하기', bad: true, on: () => r.replace('/report/block') },
    { icon: 'flag', label: '신고하기', bad: true, on: () => r.replace('/report/new') },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <FeedPostDim />
      <Dim onPress={close} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 374, backgroundColor: t.card, borderRadius: 30, paddingTop: 10, paddingHorizontal: 20, gap: 12, overflow: 'hidden' }}>
        <Grabber />
        <View>
          {items.map((it, i) => (
            <View key={it.label}>
              {i > 0 ? <Sep /> : null}
              <Pressable onPress={it.on}>
                <Row gap={12} style={{ paddingVertical: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: it.bad ? t.badS : t.accS, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={it.icon} size={18} color={it.bad ? t.bad : t.acc} />
                  </View>
                  <T size={15} w="b" color={it.bad ? t.bad : t.text} style={{ flex: 1 }}>{it.label}</T>
                </Row>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(ins.bottom, 26) }}>
        <Big label="닫기" kind="ghost" onPress={close} />
      </View>
    </View>
  );
}
