import { View } from 'react-native';
import { useTheme } from '../../src/kit';
import { ConfirmDialog, Dim, FeedPostDim, useClose } from '../../src/screens/wallet-report/parts';

export default function ReportBlock() {
  const { t } = useTheme(); const close = useClose();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <FeedPostDim />
      <Dim onPress={close} />
      <ConfirmDialog icon="userx" title="민수님을 차단할까요?" confirm="차단" onCancel={close} onConfirm={close}
        bullets={['민수님의 글과 댓글이 보이지 않아요', '민수님도 내 공유 글을 볼 수 없어요', '함께하는 여행의 일정은 그대로 유지돼요', '설정 > 차단·신고 관리에서 언제든 해제할 수 있어요']} />
    </View>
  );
}
