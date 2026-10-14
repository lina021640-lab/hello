import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Btn, Row, Icon, Card, useTheme } from '../../src/kit';
import { LabeledInput } from '../../src/screens/auth-home/parts';

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
  const [nick, setNick] = useState('여행자'); const [email, setEmail] = useState('hello@tripmate.app');
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState(''); const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(true); const [priv, setPriv] = useState(true); const [mkt, setMkt] = useState(false);
  const all = terms && priv && mkt;
  const setAll = () => { const v = !all; setTerms(v); setPriv(v); setMkt(v); };
  const okEmail = /\S+@\S+\.\S+/.test(email);
  const items: [string, boolean, () => void, string][] = [
    ['이용약관 동의', terms, () => setTerms(!terms), '필수'],
    ['개인정보 처리방침 동의', priv, () => setPriv(!priv), '필수'],
    ['마케팅 정보 수신 동의', mkt, () => setMkt(!mkt), '선택'],
  ];
  return (
    <Page gap={12} footer={<Btn label="가입하기" disabled={!(terms && priv)} onPress={() => r.replace('/home')} />}>
      <Header title="회원가입" />
      <T size={24} w="b" ls={-3} style={{ marginTop: 4 }}>트립메이트에 오신 걸 환영해요</T>
      <T size={14} sub>30초면 가입이 끝나요</T>
      <LabeledInput label="닉네임" icon="user" h={48} value={nick} onChangeText={setNick} placeholder="닉네임" />
      <LabeledInput label="이메일" icon="mail" h={48} value={email} onChangeText={setEmail} placeholder="이메일"
        right={okEmail ? <Icon name="check" size={20} color={t.ok} /> : undefined} />
      <LabeledInput label="비밀번호" icon="lock" h={48} value={pw} onChangeText={setPw} placeholder="8자 이상, 영문·숫자 포함" secure={!show}
        right={<Pressable hitSlop={8} onPress={() => setShow((s) => !s)}><Icon name={show ? 'eyeoff' : 'eye'} size={20} color={t.sub} /></Pressable>} />
      <LabeledInput label="비밀번호 확인" icon="lock" h={48} value={pw2} onChangeText={setPw2} placeholder="비밀번호를 한 번 더 입력" secure={!show} />
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
