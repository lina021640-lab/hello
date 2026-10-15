import { View } from 'react-native';
import { useTheme } from '../../src/kit';
import { ConfirmDialog, Dim, FeedPostDim, useClose } from '../../src/screens/wallet-report/parts';

export default function ReportDelete() {
  const { t } = useTheme(); const close = useClose();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <FeedPostDim mine />
      <Dim onPress={close} />
      <ConfirmDialog icon="trash" title="이 장소 공유를 삭제할까요?" confirm="삭제" onCancel={close} onConfirm={close}
        bullets={['삭제하면 복구할 수 없어요', '다른 친구가 저장한 장소는 그대로 남아요', '댓글과 좋아요도 함께 사라져요']} />
    </View>
  );
}
