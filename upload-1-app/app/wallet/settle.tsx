import { useState } from 'react';
import { View } from 'react-native';
import { Page, T, Row, Icon, useTheme } from '../../src/kit';
import { SubHeader, Status, Notice, Sep, Box, MiniBtn, Big } from '../../src/screens/wallet-report/parts';
import { ConfirmModal } from '../../src/screens/wallet/parts';
import { EmptyCard, NoTripPage } from '../../src/screens/empty/EmptyCard';
import { computeTransfers, krw, settleAsk, settleAskAll, settleComplete, settlePaid, settleReopen, useWallet } from '../../src/data/walletStore';

export default function Settle() {
  const { t } = useTheme();
  const w = useWallet(); const { settled } = w.settle;
  const [confirm, setConfirm] = useState(false);
  if (!w.trip) return <NoTripPage title="정산" />;
  const { total, perPerson, people, items } = computeTransfers(w);
  const pending = items.filter((x) => x.st !== 'done').length;
  const todo = items.filter((x) => x.st === 'todo').map((x) => x.key);
  return (
    <View style={{ flex: 1 }}>
      <Page gap={12}>
        <SubHeader title="정산" mb={11} right={settled ? <Status label="정산 완료" bg={t.ok + '26'} fg={t.ok} w="b" /> : undefined} />
        <Box style={{ borderRadius: 24, padding: 18, gap: 6 }}>
          <T size={13} sub>총 지출</T>
          <T size={34} w="b" ls={-3}>{krw(total)}</T>
          <Row gap={8}>
            <View style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
              <T size={12}>{people}명</T>
            </View>
            <T size={14} w="b" color={t.acc}>1인당 {krw(perPerson)} (균등 분할)</T>
          </Row>
        </Box>
        {settled ? (
          <Row gap={10} align="flex-start" style={{ backgroundColor: t.ok + '26', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 }}>
            <Icon name="check" size={18} color={t.ok} />
            <View style={{ flex: 1, gap: 2 }}>
              <T size={14} w="b" color={t.ok}>정산이 모두 완료되었어요</T>
              <T size={12} sub>모든 정산 메모가 완료로 표시됐어요. 필요하면 다시 열 수 있어요.</T>
            </View>
          </Row>
        ) : (
          <Notice text="앱에서 실제 송금은 하지 않아요. 정산 내용을 메모하고 친구에게 요청 알림만 보내요." />
        )}
        <T size={17} w="b">정산 메모</T>
        {items.length === 0 ? (
          <EmptyCard emoji="🤝" title={w.expenses.length === 0 ? '정산할 지출이 없어요' : people < 2 ? '일행을 초대하면 정산할 수 있어요' : '주고받을 돈이 없어요'}
            body={w.expenses.length === 0 ? '지출을 추가하면 일행 기준으로 자동 계산돼요.' : people < 2 ? '여행 멤버가 2명 이상이어야 정산이 계산돼요.' : '모두 비슷하게 결제했거나 정산이 끝났어요.'} />
        ) : (
        <Box style={{ borderRadius: 24, padding: 16, gap: 14 }}>
          {items.map((x, i) => (
            <View key={x.key} style={{ gap: 14 }}>
              {i > 0 ? <Sep /> : null}
              <View style={{ gap: 8 }}>
                <Row gap={8}>
                  <View style={{ flex: 1, gap: 1 }}>
                    <T size={15} w="b">{`${w.nameOf(x.from)} → ${w.nameOf(x.to)}`}</T>
                    <Row gap={4}><Icon name="note" size={12} color={t.sub} /><T size={12} sub>지출 {w.expenses.length}건 기준 정산</T></Row>
                  </View>
                  <T size={15} w="b">{krw(x.amt)}</T>
                </Row>
                <Row gap={8}>
                  {x.st === 'done' && <Status label="정산 완료" bg={t.ok + '26'} fg={t.ok} border />}
                  {x.st === 'asked' && <Status label={`요청함 · ${x.when}`} bg={t.accS} fg={t.acc} border />}
                  {x.st === 'todo' && <Status label="요청 전" bg={t.bg} fg={t.sub} border />}
                  <View style={{ flex: 1 }} />
                  {settled ? null : x.st === 'done' ? <MiniBtn label="되돌리기" onPress={() => settlePaid(x.key, false)} /> : (
                    <>
                      {x.st === 'todo' ? <MiniBtn label="요청 알림" icon="bell" onPress={() => settleAsk(x.key)} /> : null}
                      <MiniBtn label="지불 완료" icon="check" onPress={() => settlePaid(x.key, true)} />
                    </>
                  )}
                </Row>
              </View>
            </View>
          ))}
        </Box>
        )}
        {items.length === 0 ? null : <View style={{ gap: 10 }}>
          {settled ? (
            <Big label="정산 다시 열기" kind="ghost" size={15} onPress={settleReopen} />
          ) : (
            <>
              <Big label={pending ? `정산 완료 (미정산 ${pending}건)` : '정산 완료'} icon="check" onPress={() => setConfirm(true)} />
              <Big label="미정산 전체에 요청 알림 보내기" icon="bell" size={15} kind="ghost" onPress={() => settleAskAll(todo)} />
            </>
          )}
          <Big label="정산 내용 복사하기 (메신저용)" icon="copy" kind="ghost" size={15} />
        </View>}
      </Page>
      {confirm ? (
        <ConfirmModal title="정산을 완료할까요?" confirm="정산 완료"
          body={pending ? `아직 ${pending}건이 미정산이에요. 완료하면 모두 정산 완료로 표시돼요.` : '모든 정산이 끝났어요. 완료로 마무리할까요?'}
          onCancel={() => setConfirm(false)} onConfirm={() => { settleComplete(); setConfirm(false); }} />
      ) : null}
    </View>
  );
}
