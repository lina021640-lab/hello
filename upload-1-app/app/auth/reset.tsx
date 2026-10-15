import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Btn, Icon, Card, useTheme } from '../../src/kit';
import { InputBox } from '../../src/screens/auth-home/parts';
import { resetPassword } from '../../src/data/authStore';

export default function Reset() {
  const r = useRouter(); const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [sent, setSent] = useState(false);
  const send = async () => {
    if (busy) return;
    if (!/\S+@\S+\.\S+/.test(email)) { setErr('올바른 이메일 주소를 입력해 주세요'); return; }
    setBusy(true); setErr('');
    const res = await resetPassword(email);
    setBusy(false);
    if (!res.ok) setErr(res.error); else setSent(true);
  };
  return (
    <Page gap={14} footer={<Btn label="확인" kind={sent ? 'primary' : 'ghost'} onPress={() => r.replace('/auth/login')} />}>
      <Header title="비밀번호 찾기" />
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
        <Icon name="lock" size={32} color={t.acc} />
      </View>
      <T size={26} w="b" ls={-3} lh={34}>{'가입한 이메일을\n입력해 주세요'}</T>
      <T size={14} sub>비밀번호 재설정 링크를 메일로 보내드려요</T>
      <InputBox icon="mail" value={email} onChangeText={(s) => { setEmail(s); setErr(''); setSent(false); }} placeholder="이메일" />
      {err ? <T size={13} w="m" color={t.bad}>{err}</T> : null}
      <Btn label={busy ? '보내는 중…' : sent ? '링크 다시 보내기' : '재설정 링크 보내기'} disabled={busy} onPress={send} />
      {sent ? (
        <Card pad={16} radius={20} style={{ gap: 6, backgroundColor: t.accS }}>
          <T size={15} w="b" color={t.acc}>메일을 보냈어요</T>
          <T size={13} sub>{email.trim()} 로 보낸 링크를 눌러 새 비밀번호를 정해 주세요. 메일이 안 보이면 스팸함도 확인해 주세요.</T>
        </Card>
      ) : null}
    </Page>
  );
}
