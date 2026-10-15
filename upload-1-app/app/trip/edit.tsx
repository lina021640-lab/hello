import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { T, Row, Icon, Card, useGo, useTheme } from '../../src/kit';
import { TripForm, tripToForm, formToStore } from '../../src/screens/trip/TripForm';
import { getTrip, updateTrip, deleteTrip, fetchMembers, removeMember, type Member } from '../../src/data/tripStore';
import { useAuth } from '../../src/data/authStore';


export default function TripEdit() {
  const r = useRouter(); const go = useGo(); const { t } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [trip] = useState(() => getTrip(id));
  const [initCities] = useState(() => (trip ? tripToForm(trip) : []));
  const { user } = useAuth();
  const [mates, setMates] = useState<Member[]>([]);
  const [askDel, setAskDel] = useState(false);
  const [saving, setSaving] = useState(false); const [err, setErr] = useState('');
  const isOwner = !!trip && trip.ownerId === user?.id;
  useEffect(() => { if (trip) fetchMembers(trip.id).then(setMates).catch(() => {}); }, [trip?.id]);
  if (!trip) return <TripForm title="내 여행 수정하기" heading="수정할 여행이 없어요" initialName="" nameTouched={false} initialCities={[]} saveLabel="돌아가기" onSave={() => r.replace('/home')} />;
  return (
    <TripForm title="내 여행 수정하기" heading="여행을 수정하고 저장하세요!" initialName={trip.name} nameTouched initialCities={initCities} saveLabel="여행 수정 저장하기" saving={saving} error={err}
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
              <Row key={m.userId} gap={12}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: m.color }} />
                <T size={14} w="b" style={{ flex: 1 }}>{m.nickname}{m.role === 'owner' ? ' (방장)' : m.userId === user?.id ? ' (나)' : ''}</T>
                {isOwner && m.userId !== user?.id ? (
                  <Pressable hitSlop={8} onPress={() => removeMember(trip.id, m.userId).then(() => setMates((p) => p.filter((x) => x.userId !== m.userId))).catch((e) => setErr(e.message))}><Icon name="minus" size={20} color={t.sub} /></Pressable>
                ) : null}
              </Row>
            ))}
          </Card>
        </View>
      }
      bottomExtra={
        <Pressable onPress={() => { if (!askDel) { setAskDel(true); return; } deleteTrip(trip.id).then(() => r.replace('/home')).catch((e) => { setErr(e.message); setAskDel(false); }); }} style={{ height: 52, borderRadius: 26, backgroundColor: askDel ? t.badS : t.card, borderWidth: 1, borderColor: askDel ? t.bad : t.line, alignItems: 'center', justifyContent: 'center' }}>
          <T size={16} w="b" color={t.bad}>{askDel ? '정말 삭제할까요? 한 번 더 누르면 삭제돼요' : '여행 삭제하기'}</T>
        </Pressable>
      }
      onSave={async (v) => {
        if (saving) return;
        setSaving(true); setErr('');
        try { await updateTrip(trip.id, { name: v.name, cities: formToStore(v.cities), start: v.start, end: v.end }); r.replace('/home'); }
        catch (e) { setErr((e as Error).message); setSaving(false); }
      }} />
  );
}
