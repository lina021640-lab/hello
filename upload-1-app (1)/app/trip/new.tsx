import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { T, useTheme } from '../../src/kit';
import { InputBox } from '../../src/screens/auth-home/parts';
import { TripForm, formToStore } from '../../src/screens/trip/TripForm';
import { createTrip, joinByCode } from '../../src/data/tripStore';

export default function TripNew() {
  const r = useRouter(); const { t } = useTheme();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false); const [joinErr, setJoinErr] = useState('');
  const [saving, setSaving] = useState(false); const [err, setErr] = useState('');
  const join = async () => {
    if (joining) return;
    setJoining(true); setJoinErr('');
    try { await joinByCode(code); r.replace('/home'); }
    catch (e) { setJoinErr((e as Error).message); }
    finally { setJoining(false); }
  };
  return (
    <TripForm title="새 여행 만들기" heading="새로운 여행을 계획하세요!" initialName="" initialCities={[]} nameTouched={false} saveLabel="여행 만들기" saving={saving} error={err}
      topExtra={
        <View style={{ gap: 6 }}>
          <T size={13} sub>여행 코드로 여행에 합류하기</T>
          <InputBox h={48} value={code} onChangeText={(s) => { setCode(s); setJoinErr(''); }} placeholder="코드를 입력하세요"
            right={<Pressable hitSlop={8} onPress={join}><T size={13} w="b" color={t.acc}>{joining ? '확인 중…' : '입력 완료'}</T></Pressable>} />
          {joinErr ? <T size={12} w="m" color={t.bad}>{joinErr}</T> : null}
        </View>
      }
      onSave={async (v) => {
        if (saving) return;
        setSaving(true); setErr('');
        try { await createTrip({ name: v.name, cities: formToStore(v.cities), start: v.start, end: v.end }); r.replace('/home'); }
        catch (e) { setErr((e as Error).message); setSaving(false); }
      }} />
  );
}
