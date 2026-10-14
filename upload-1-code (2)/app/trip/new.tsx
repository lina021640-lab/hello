import { useState } from 'react';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { T, useTheme } from '../../src/kit';
import { InputBox } from '../../src/screens/auth-home/parts';
import { TripForm, formToStore } from '../../src/screens/trip/TripForm';
import { addTrip } from '../../src/data/tripStore';

export default function TripNew() {
  const r = useRouter(); const { t } = useTheme();
  const [code, setCode] = useState('');
  return (
    <TripForm title="새 여행 만들기" heading="새로운 여행을 계획하세요!" initialName="" initialCities={[]} nameTouched={false} saveLabel="여행 만들기"
      topExtra={
        <View style={{ gap: 6 }}>
          <T size={13} sub>여행 코드로 여행에 합류하기</T>
          <InputBox h={48} value={code} onChangeText={setCode} placeholder="코드를 입력하세요"
            right={<Pressable hitSlop={8} onPress={() => r.push('/trip/edit')}><T size={13} w="b" color={t.acc}>입력 완료</T></Pressable>} />
        </View>
      }
      onSave={(v) => { addTrip({ name: v.name, cities: formToStore(v.cities), start: v.start, end: v.end }); r.replace('/home'); }} />
  );
}
