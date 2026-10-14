import { View } from 'react-native';
import { Page, T, Row, Icon, IconName, useTheme } from '../../src/kit';
import { SubHeader, Box, Notice } from '../../src/screens/wallet-report/parts';

const sections: { icon: IconName; title: string; bad?: boolean; num?: boolean; items: string[] }[] = [
  { icon: 'x', title: '올릴 수 없는 콘텐츠', bad: true, items: ['스팸·광고, 허위 정보', '욕설·혐오·괴롭힘', '얼굴·위치·연락처 등 개인정보 무단 노출', '타인의 사진·글 도용(저작권 침해)', '불법·위험 행위, 성적·폭력적 콘텐츠'] },
  { icon: 'flag', title: '신고하면 이렇게 처리돼요', num: true, items: ['접수: 신고는 익명으로 바로 접수돼요', '검토: 24시간 이내 검토를 목표로 해요', '조치: 콘텐츠 숨김·삭제, 경고, 이용 제한', '결과: 신고자와 게시자 모두에게 알림을 보내요'] },
  { icon: 'shield', title: '반복 위반 시', items: ['1회 경고 → 7일 제한 → 영구 제한 순으로 적용해요', '심각한 위반은 바로 제한할 수 있어요', '조치에 이의가 있으면 7일 이내에 제기할 수 있어요'] },
  { icon: 'userx', title: '차단하면', items: ['서로의 공유 글과 댓글이 보이지 않아요', '함께하는 여행의 일정은 그대로 유지돼요', '설정에서 언제든 해제할 수 있어요'] },
  { icon: 'trash', title: '내 글 삭제', items: ['내가 올린 공유 글은 언제든 삭제할 수 있어요', '삭제하면 복구할 수 없어요', '법령상 보관이 필요한 기록은 정해진 기간 동안 보관돼요'] },
];

export default function Guidelines() {
  const { t } = useTheme();
  return (
    <Page gap={12}>
      <SubHeader title="커뮤니티 가이드라인" mb={13} />
      <Notice text="초안입니다. 서비스 출시 전에 법무 검토가 필요해요." bg={t.warn + '26'} color={t.warn} />
      <T size={15} w="b" lh={22}>모두가 안전하게 여행 정보를 나누기 위한 약속이에요</T>
      {sections.map((s) => (
        <Box key={s.title} style={{ borderRadius: 22, paddingHorizontal: 16, paddingVertical: 14, gap: 8 }}>
          <Row gap={10}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: s.bad ? t.badS : t.accS, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={s.icon} size={18} color={s.bad ? t.bad : t.acc} />
            </View>
            <T size={15} w="b" style={{ flex: 1 }}>{s.title}</T>
          </Row>
          {s.items.map((it, i) => (
            <Row key={it} align="flex-start" gap={8}>
              <T size={13} w="b" color={t.acc} style={{ width: s.num ? 18 : 10 }}>{s.num ? `${i + 1}.` : '•'}</T>
              <T size={13} lh={19} style={{ flex: 1 }}>{it}</T>
            </Row>
          ))}
        </Box>
      ))}
    </Page>
  );
}
