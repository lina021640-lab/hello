import { useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Btn, Row, Icon, Card, useTheme } from '../../src/kit';
import { InputBox } from '../../src/screens/auth-home/parts';

export default function Reset() {
  const r = useRouter(); const { t } = useTheme();
  const [email, setEmail] = useState('hello@tripmate.app');
  const [code, setCode] = useState('384');
  return (
    <Page gap={14} footer={<Btn label="확인" onPress={() => r.replace('/auth/login')} />}>
      <Header title="비밀번호 찾기" />
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
        <Icon name="lock" size={32} color={t.acc} />
      </View>
      <T size={26} w="b" ls={-3} lh={34}>{'가입한 이메일을\n입력해 주세요'}</T>
      <T size={14} sub>비밀번호 재설정 링크와 인증번호를 보내드려요</T>
      <InputBox icon="mail" value={email} onChangeText={setEmail} placeholder="이메일" />
      <Btn label="인증번호 받기" />
      <Card pad={16} radius={20} style={{ gap: 12 }}>
        <Row><T size={14} w="b" style={{ flex: 1 }}>인증번호 6자리</T><T size={14} w="b" color={t.warn}>02:41</T></Row>
        <View>
          <Row gap={8} style={{ justifyContent: 'center' }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const focus = i === code.length;
              return (
                <View key={i} style={{ width: 44, height: 56, borderRadius: 14, backgroundColor: t.card, borderWidth: focus ? 2 : 1, borderColor: focus ? t.acc : t.line, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={22} w="b">{code[i] ?? ''}</T>
                </View>
              );
            })}
          </Row>
          <TextInput value={code} onChangeText={(s) => setCode(s.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" maxLength={6}
            style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0, color: 'transparent' }, Platform.OS === 'web' ? ({ cursor: 'text' } as any) : null]} />
        </View>
        <T size={13} w="b" color={t.acc} align="center">인증번호 다시 받기</T>
      </Card>
    </Page>
  );
}
