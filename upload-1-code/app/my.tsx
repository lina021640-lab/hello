import { useState } from 'react';
import { View, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { profile, useProfile } from '../src/data/profile';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, Card, useTheme } from '../src/kit';

function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ width: 44, height: 26, borderRadius: 13, padding: 3, backgroundColor: on ? t.acc : t.mode === 'dark' ? t.line : '#e5e7eb', justifyContent: 'center', alignItems: on ? 'flex-end' : 'flex-start' }}>
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
    </Pressable>
  );
}

export default function My() {
  const r = useRouter(); const { t } = useTheme(); const pf = useProfile();
  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!res.canceled) profile.setMe(res.assets[0].uri);
  };
  const [tg, setTg] = useState([true, true, true, false]);
  const prefs: [string, string][] = [['사용 언어', '한국어'], ['기본 통화', 'KRW'], ['여행지 회화 발음 표기', '한글']];
  const notis = ['일정 변경 알림', '예산 경고 알림', '정산 요청 알림', '마케팅 알림'];
  return (
    <Page gap={12}>
      <Header title="마이페이지" />
      <View style={{ alignItems: 'center', height: 108 }}>
        <Pressable onPress={pick} style={{ width: 108, height: 108, borderRadius: 54, backgroundColor: t.mode === 'dark' ? '#fff' : '#000', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
          {pf.me ? <Image source={{ uri: pf.me }} style={{ width: 108, height: 108 }} /> : <View style={{ marginBottom: -6 }}><Icon name="user" size={84} color={t.mode === 'dark' ? '#000' : '#fff'} /></View>}
        </Pressable>
        <Pressable onPress={pick} style={{ position: 'absolute', left: '50%', marginLeft: 19, top: 71, width: 33, height: 33, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.72)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pencil" size={18} color="#1a1d23" />
        </Pressable>
      </View>
      <Card pad={16} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 }}>
        <View style={{ flex: 1, gap: 4 }}><T size={18} w="b">User</T><T size={13} w="r" sub>****@gmail.com</T></View>
        <T size={13} color={t.acc}>편집</T>
      </Card>
      <Card pad={16} style={{ gap: 14 }}>
        {prefs.map(([a, b]) => (
          <Row key={a} style={{ justifyContent: 'space-between' }}><T size={15} w="r">{a}</T><T size={14} w="r" sub>{b}  {'>'}</T></Row>
        ))}
      </Card>
      <Card pad={16} style={{ gap: 14 }}>
        {notis.map((n, i) => (
          <Row key={n} style={{ justifyContent: 'space-between' }}>
            <T size={15} w="r">{n}</T>
            <Toggle on={tg[i]} onPress={() => setTg((p) => p.map((v, k) => (k === i ? !v : v)))} />
          </Row>
        ))}
      </Card>
      <Card pad={16} style={{ gap: 6 }}>
        <T size={15} w="r">오프라인 데이터</T>
        <T size={13} w="r" sub>오사카·교토 4박 5일 · 128MB 저장됨</T>
      </Card>
      <Card pad={16} style={{ gap: 14 }}>
        <T size={15} w="r">개인정보 처리방침</T>
        <T size={15} w="r">이용약관</T>
        <T size={15} w="r" onPress={() => r.replace('/auth/login')}>로그아웃</T>
      </Card>
      <Card pad={16}>
        <T size={15} w="r" color={t.mode === 'dark' ? t.bad : '#dc2626'}>회원 탈퇴</T>
      </Card>
    </Page>
  );
}
