import { useState } from 'react';
import { View } from 'react-native';
import { Page, T, Row, useTheme } from '../../src/kit';
import { SubHeader, Avatar, Box, MiniBtn, Notice, Sep, Status } from '../../src/screens/wallet-report/parts';

const blockedInit = [{ ch: '민', name: '민수', date: '2026.11.02 차단' }, { ch: '도', name: '도윤', date: '2026.10.28 차단' }];

export default function Manage() {
  const { t } = useTheme();
  const [blocked, setBlocked] = useState(blockedInit);
  const reports = [
    { why: '허위·잘못된 정보', sub: '버러 마켓 · 11/20', label: '조치 완료', bg: t.ok + '26', fg: t.ok },
    { why: '스팸·광고', sub: '런던 맛집 모음 · 11/18', label: '검토 중', bg: t.warn + '26', fg: t.warn },
    { why: '부적절한 사진·내용', sub: '에펠탑 후기 · 11/15', label: '해당 없음', bg: t.bg, fg: t.sub },
  ];
  return (
    <Page gap={12}>
      <SubHeader title="차단·신고 관리" mb={13} />
      <Row><T size={16} w="b" style={{ flex: 1 }}>차단한 사용자</T><T size={12} sub>{blocked.length}명</T></Row>
      <Box style={{ borderRadius: 22, paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        {blocked.map((b, i) => (
          <View key={b.name} style={{ gap: 12 }}>
            {i > 0 ? <Sep /> : null}
            <Row gap={12}>
              <Avatar ch={b.ch} size={40} bg={t.line} fg={t.sub} fs={15} />
              <View style={{ flex: 1 }}><T size={15} w="b">{b.name}</T><T size={12} sub>{b.date}</T></View>
              <MiniBtn label="해제" onPress={() => setBlocked((p) => p.filter((x) => x.name !== b.name))} />
            </Row>
          </View>
        ))}
        {blocked.length === 0 ? <T size={13} sub align="center">차단한 사용자가 없어요</T> : null}
      </Box>
      <Notice text="차단하면 서로의 공유 글과 댓글이 보이지 않아요. 함께하는 여행의 일정은 그대로예요." />
      <Row style={{ paddingTop: 8 }}><T size={16} w="b" style={{ flex: 1 }}>신고 내역</T><T size={12} sub>3건</T></Row>
      <Box style={{ borderRadius: 22, paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        {reports.map((r, i) => (
          <View key={r.why} style={{ gap: 12 }}>
            {i > 0 ? <Sep /> : null}
            <Row gap={10}>
              <View style={{ flex: 1 }}><T size={14} w="b">{r.why}</T><T size={12} sub>{r.sub}</T></View>
              <Status label={r.label} bg={r.bg} fg={r.fg} w="b" px={10} />
            </Row>
          </View>
        ))}
      </Box>
      <T size={12} lh={17} sub>신고 처리 결과는 알림으로 알려드려요. 신고자 정보는 상대방에게 공개되지 않아요.</T>
    </Page>
  );
}
