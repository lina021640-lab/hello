import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Page, Header, T, useTheme } from '../../src/kit';
import { InputBox, DestinationCard, DatesCard } from '../../src/screens/auth-home/parts';
import { View, Pressable } from 'react-native';

export default function TripNew() {
  const r = useRouter(); const { t } = useTheme();
  const [name, setName] = useState(''); const [code, setCode] = useState('');
  return (
    <Page gap={12}>
      <Header title="새 여행 만들기" />
      <T size={22} w="b" ls={-3}>새로운 여행을 계획하세요!</T>
      <View style={{ gap: 6 }}>
        <T size={13} sub>여행 이름</T>
        <InputBox h={48} value={name} onChangeText={setName} placeholder="여행 이름을 입력하세요" />
      </View>
      <View style={{ gap: 6 }}>
        <T size={13} sub>여행 코드로 여행에 합류하기</T>
        <InputBox h={48} value={code} onChangeText={setCode} placeholder="코드를 입력하세요"
          right={<Pressable hitSlop={8} onPress={() => r.push('/trip/edit')}><T size={13} w="b" color={t.acc}>입력 완료</T></Pressable>} />
      </View>
      <T size={20} w="b" ls={-2}>여행지와 날짜를 정하셨나요?</T>
      <DestinationCard />
      <DatesCard />
      <Pressable onPress={() => r.push('/trip/mode')} style={{ height: 64, borderRadius: 32, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
        <T size={14} w="b" color="#fff" lh={20} align="center">{'11.20(금) – 12.29(화)\n런던 · 파리 일정으로 여행 만들기'}</T>
      </Pressable>
    </Page>
  );
}
