import { useEffect, useState } from 'react';
import { View, Pressable, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { T, Row, Icon, useTheme } from '../../src/kit';
import { getTrip, fetchMembers, removeMember, type Member } from '../../src/data/tripStore';
import { useAuth } from '../../src/data/authStore';

export default function Members() {
  const r = useRouter(); const { t } = useTheme();
  const trip = getTrip(); const { user } = useAuth();
  const [mates, setMates] = useState<Member[]>([]); const [msg, setMsg] = useState('');
  const isOwner = !!trip && trip.ownerId === user?.id;
  useEffect(() => { if (trip) fetchMembers(trip.id).then(setMates).catch((e) => setMsg(e.message)); }, [trip?.id]);
  const code = trip?.inviteCode ?? '';
  const copy = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) { await navigator.clipboard.writeText(code); setMsg('코드를 복사했어요'); }
      else await Share.share({ message: code });
    } catch { setMsg('복사하지 못했어요'); }
  };
  const invite = () => Share.share({ message: `트립메이트에서 '${trip?.name ?? ''}' 여행에 함께해요! 초대 코드: ${code}` }).catch(() => {});
  const close = () => (r.canGoBack() ? r.back() : r.replace('/schedule'));
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={close} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ position: 'absolute', left: 20, right: 20, top: 176, backgroundColor: t.card, borderRadius: 30, padding: 18, gap: 12, shadowColor: '#1a264d', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }}>
        <Row>
          <T size={18} w="b" style={{ flex: 1 }}>함께하는 친구</T>
          <Pressable hitSlop={10} onPress={close}><Icon name="x" size={22} color={t.text} /></Pressable>
        </Row>
        <View style={{ backgroundColor: t.track, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', gap: 2 }}>
          <T size={12} sub>이번 여행의 초대 코드</T>
          <T size={20} w="b">{code || '-'}</T>
        </View>
        <Row gap={8}>
          {([['코드 복사 하기', copy], ['카톡으로 초대하기', invite]] as [string, () => void][]).map(([l, fn]) => (
            <Pressable key={l} onPress={fn} disabled={!code} style={{ flex: 1, height: 38, borderRadius: 19, backgroundColor: 'rgba(138,143,152,0.9)', alignItems: 'center', justifyContent: 'center' }}>
              <T size={13} w="b" color="#fff">{l}</T>
            </Pressable>
          ))}
        </Row>
        {msg ? <T size={12} w="m" color={t.acc} align="center">{msg}</T> : null}
        {mates.map((f) => (
          <Row key={f.userId} gap={12}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: f.color }} />
            <T size={14} w="b" style={{ flex: 1 }}>{f.nickname}{f.role === 'owner' ? ' (방장)' : f.userId === user?.id ? ' (나)' : ''}</T>
            {isOwner && f.userId !== user?.id && trip ? (
              <Pressable hitSlop={8} onPress={() => removeMember(trip.id, f.userId).then(() => setMates((p) => p.filter((x) => x.userId !== f.userId))).catch((e) => setMsg(e.message))}><Icon name="minus" size={20} color={t.sub} /></Pressable>
            ) : null}
          </Row>
        ))}
      </View>
    </View>
  );
}
