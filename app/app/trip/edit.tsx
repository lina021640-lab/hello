import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Btn, Row, Icon, Card, useGo, useTheme } from '../../src/kit';
import { InputBox, DestinationCard, DatesCard } from '../../src/screens/auth-home/parts';

export default function TripEdit() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme();
  const [name, setName] = useState('유럽 여행');
  const [mates, setMates] = useState([{ n: '45efgh', c: '#ff8a4c' }, { n: 'abcd123', c: '#9be18f' }]);
  return (
    <Page gap={12}>
      <Header title="내 여행 수정하기" />
      <T size={22} w="b" ls={-3}>여행을 수정하고 저장하세요!</T>
      <View style={{ gap: 6 }}>
        <T size={13} sub>여행 이름</T>
        <InputBox h={48} value={name} onChangeText={setName} placeholder="여행 이름" />
      </View>
      <View style={{ gap: 6 }}>
        <T size={13} sub>여행 친구 추가하기</T>
        <Row gap={10} style={{ height: 46, paddingHorizontal: 16, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }}>
          <T size={15} style={{ flex: 1 }}>코드 공유</T>
          <T size={13} w="b" color={t.acc} onPress={() => go('/schedule/members')}>공유 바로가기</T>
        </Row>
        <Card pad={16} radius={20} style={{ gap: 12 }}>
          <T size={14} w="b">함께하는 동행</T>
          {mates.map((m) => (
            <Row key={m.n} gap={12}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: m.c }} />
              <T size={14} w="b" style={{ flex: 1 }}>{m.n}</T>
              <Pressable hitSlop={8} onPress={() => setMates((p) => p.filter((x) => x.n !== m.n))}><Icon name="minus" size={20} color={t.sub} /></Pressable>
            </Row>
          ))}
        </Card>
      </View>
      <T size={20} w="b" ls={-2}>여행지와 날짜를 정하셨나요?</T>
      <DestinationCard />
      <DatesCard />
      <Btn label="여행 수정 저장하기" onPress={() => r.back()} />
      <Pressable onPress={() => r.push('/report/delete')} style={{ height: 52, borderRadius: 26, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
        <T size={16} w="b" color={t.bad}>여행 삭제하기</T>
      </Pressable>
    </Page>
  );
}
