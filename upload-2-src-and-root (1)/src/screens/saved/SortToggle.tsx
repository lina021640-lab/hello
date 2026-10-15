import { Pressable } from 'react-native';
import { T, Icon, useTheme } from '../../kit';

/** 정렬: 알약 하나를 탭할 때마다 다음 옵션으로 바뀜 (예: 거리순 ⇄ 저장한 순) */
export function SortToggle({ options, value, onChange }: { options: readonly string[]; value: number; onChange: (i: number) => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={() => onChange((value + 1) % options.length)} hitSlop={8}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: t.acc, borderRadius: 16, paddingHorizontal: 12, height: 30 }}>
      <T size={12} w="sb" color="#fff">{options[value]}</T>
      <Icon name="swap" size={14} color="#fff" />
    </Pressable>
  );
}
