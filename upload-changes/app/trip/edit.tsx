import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { T, Row, Icon, Card, useGo, useTheme } from '../../src/kit';
import { TripForm, seedCity } from '../../src/screens/trip/TripForm';

const SEED = [seedCity('런던', '2026-11-20', '2026-11-30'), seedCity('파리', '2026-12-01', '2026-12-22'), seedCity('피렌체', '2026-12-23', '2026-12-29')];

export default function TripEdit() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme();
  const [mates, setMates] = useState([{ n: '45efgh', c: '#ff8a4c' }, { n: 'abcd123', c: '#9be18f' }]);
  return (
    <TripForm title="내 여행 수정하기" heading="여행을 수정하고 저장하세요!" initialName="유럽 여행" nameTouched initialCities={SEED} saveLabel="여행 수정 저장하기"
      topExtra={
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
      }
      bottomExtra={
        <Pressable onPress={() => r.push('/report/delete')} style={{ height: 52, borderRadius: 26, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
          <T size={16} w="b" color={t.bad}>여행 삭제하기</T>
        </Pressable>
      }
      onSave={() => r.replace('/home')} />
  );
}
