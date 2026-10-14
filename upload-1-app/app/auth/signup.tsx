import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Btn, Row, Icon, Card, useTheme } from '../../src/kit';
import { LabeledInput } from '../../src/screens/auth-home/parts';
import { signUp } from '../../src/data/authStore';

function Check({ on, onPress }: { on: boolean; onPress: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={6} style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? t.acc : 'transparent', borderWidth: on ? 0 : 1.5, borderColor: t.line }}>
      {on ? <Icon name="check" size={14} color="#fff" /> : null}
    </Pressable>
  );
}

export default function Signup() {
  const r = useRouter(); const { t } = useTheme();
  const [nick, setNick] = useState(''); const [email, setEmail] = useState('');
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState(''); const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(true); const [priv, setPriv] = useState(true); const [mkt, setMkt] = useState(false);
  const all = terms && priv && mkt;
  const setAll = () => { const v = !all; setTerms(v); setPriv(v); setMkt(v); };
  const okEmail = /\S+@\S+\.\S+/.test(email);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [sent, setSent] = useState(false);
  const submit = async () => {
    if (busy) return;
    if (!nick.trim()) { setErr('닉네임을 입력해 주세요'); return; }
    if (!okEmail) { setErr('올바른 이메일 주소를 입력해 주세요'); return; }
    if (pw.length < 6) { setErr('비밀번호는 6자 이상이어야 해요'); return; }
    if (pw !== pw2) { setErr('비밀번호가 서로 달라요'); return; }
    setBusy(true); setErr('');
    const res = await signUp(email, pw, nick);
    setBusy(false);
    if (!res.ok) { setErr(res.error); return; }
    if (res.needsConfirm) setSent(true); else r.replace('/home');
  };
  const items: [string, boolean, () => void, string][] = [
    ['이용약관 동의', terms, () => setTerms(!terms), '필수'],
    ['개인정보 처리방침 동의', priv, () => setPriv(!priv), '필수'],
    ['마케팅 정보 수신 동의', mkt, () => setMkt(!mkt), '선택'],
  ];
  return (
    <Page gap={12} footer={sent ? <Btn label="로그인 화면으로" onPress={() => r.replace('/auth/login')} /> : <Btn label={busy ? '가입 중…' : '가입하기'} disabled={busy || !(terms && priv)} onPress={submit} />}>
      <Header title="회원가입" />
      <T size={24} w="b" ls={-3} style={{ marginTop: 4 }}>트립메이트에 오신 걸 환영해요</T>
      <T size={14} sub>30초면 가입이 끝나요</T>
      {sent ? (
        <Card pad={16} radius={20} style={{ gap: 6, backgroundColor: t.accS }}>
          <T size={15} w="b" color={t.acc}>메일로 보낸 인증 링크를 눌러 주세요</T>
          <T size={13} sub>{email.trim()} 로 인증 메일을 보냈어요. 인증이 끝나면 로그인할 수 있어요.</T>
        </Card>
      ) : null}
      <LabeledInput label="닉네임" icon="user" h={48} value={nick} onChangeText={setNick} placeholder="닉네임" />
      <LabeledInput label="이메일" icon="mail" h={48} value={email} onChangeText={setEmail} placeholder="이메일"
        right={okEmail ? <Icon name="check" size={20} color={t.ok} /> : undefined} />
      <LabeledInput label="비밀번호" icon="lock" h={48} value={pw} onChangeText={setPw} placeholder="6자 이상" secure={!show}
        right={<Pressable hitSlop={8} onPress={() => setShow((s) => !s)}><Icon name={show ? 'eyeoff' : 'eye'} size={20} color={t.sub} /></Pressable>} />
      <LabeledInput label="비밀번호 확인" icon="lock" h={48} value={pw2} onChangeText={setPw2} placeholder="비밀번호를 한 번 더 입력" secure={!show} />
      {err ? <T size={13} w="m" color={t.bad}>{err}</T> : null}
      <Card pad={0} radius={20} style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
        <Row gap={10}>
          <Check on={all} onPress={setAll} />
          <T size={14} w="b" style={{ flex: 1 }}>전체 동의</T>
        </Row>
        <View style={{ height: 1, backgroundColor: t.line }} />
        {items.map(([label, on, fn, tag]) => (
          <Row key={label} gap={10}>
            <Check on={on} onPress={fn} />
            <T size={14} style={{ flex: 1 }}>{label}</T>
            <T size={12} color={tag === '필수' ? t.acc : t.sub}>{tag}</T>
          </Row>
        ))}
      </Card>
    </Page>
  );
}
