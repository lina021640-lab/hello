import { useState } from 'react';
import { View } from 'react-native';
import { Page, T, Row, Icon, useTheme } from '../../src/kit';
import { SubHeader, Status, Notice, Sep, Box, MiniBtn, Big } from '../../src/screens/wallet-report/parts';

type St = 'done' | 'asked' | 'todo';
const init: { who: string; note: string; amt: string; st: St; when?: string }[] = [
  { who: '지연 → 민수', note: '11/20 저녁 계산', amt: '52,300원', st: 'done' },
  { who: '나 → 민수', note: '숙소 1박 결제분', amt: '118,400원', st: 'asked', when: '어제' },
  { who: '나 → 지연', note: '택시비', amt: '31,000원', st: 'todo' },
];

export default function Settle() {
  const { t } = useTheme();
  const [items, setItems] = useState(init);
  const ask = (i: number) => setItems((p) => p.map((x, j) => (j === i ? { ...x, st: 'asked', when: '방금' } : x)));
  const askAll = () => setItems((p) => p.map((x) => (x.st === 'todo' ? { ...x, st: 'asked', when: '방금' } : x)));
  return (
    <Page gap={12}>
      <SubHeader title="정산" mb={11} />
      <Box style={{ borderRadius: 24, padding: 18, gap: 6 }}>
        <T size={13} sub>총 지출</T>
        <T size={34} w="b" ls={-3}>2,486,300원</T>
        <Row gap={8}>
          <View style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <T size={12}>3명</T>
          </View>
          <T size={14} w="b" color={t.acc}>1인당 828,767원 (균등 분할)</T>
        </Row>
      </Box>
      <Notice text="앱에서 실제 송금은 하지 않아요. 정산 내용을 메모하고 친구에게 요청 알림만 보내요." />
      <T size={17} w="b">정산 메모</T>
      <Box style={{ borderRadius: 24, padding: 16, gap: 14 }}>
        {items.map((x, i) => (
          <View key={x.who} style={{ gap: 14 }}>
            {i > 0 ? <Sep /> : null}
            <View style={{ gap: 8 }}>
              <Row gap={8}>
                <View style={{ flex: 1, gap: 1 }}>
                  <T size={15} w="b">{x.who}</T>
                  <Row gap={4}><Icon name="note" size={12} color={t.sub} /><T size={12} sub>{x.note}</T></Row>
                </View>
                <T size={15} w="b">{x.amt}</T>
              </Row>
              <Row gap={8}>
                {x.st === 'done' && <Status label="정산 완료" bg={t.ok + '26'} fg={t.ok} border />}
                {x.st === 'asked' && <Status label={`요청함 · ${x.when}`} bg={t.accS} fg={t.acc} border />}
                {x.st === 'todo' && <Status label="요청 전" bg={t.bg} fg={t.sub} border />}
                <View style={{ flex: 1 }} />
                {x.st === 'done' ? <T size={11} sub>받은 사람이 직접 완료 표시해요</T> : <MiniBtn label="요청 알림" icon="bell" onPress={() => ask(i)} />}
              </Row>
            </View>
          </View>
        ))}
      </Box>
      <View style={{ gap: 10 }}>
        <Big label="미정산 전체에 요청 알림 보내기" icon="bell" size={15} onPress={askAll} />
        <Big label="정산 내용 복사하기 (메신저용)" icon="copy" kind="ghost" size={15} />
      </View>
    </Page>
  );
}
