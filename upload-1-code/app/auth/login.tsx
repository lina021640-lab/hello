import { useState } from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Page, T, Btn, Row, Icon, useTheme } from '../../src/kit';
import { InputBox } from '../../src/screens/auth-home/parts';

/** 300x300 도트 글로브(원본은 SVG 일러스트) — 가장자리로 갈수록 작고 옅게 */
function DotGlobe() {
  const { t } = useTheme();
  const S = 300, step = 12, c = S / 2, dots: React.ReactNode[] = [];
  for (let y = 6; y < S; y += step) for (let x = 6; x < S; x += step) {
    const d = Math.hypot(x - c, y - c);
    if (d > 150) continue;
    const k = 1 - d / 150;
    dots.push(<Circle key={`${x}-${y}`} cx={x} cy={y} r={1.2 + k * 1.6} fill={t.acc} opacity={0.18 + k * 0.7} />);
  }
  return <Svg width={S} height={S}>{dots}</Svg>;
}

export default function Login() {
  const r = useRouter(); const { t } = useTheme();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false);
  const home = () => r.replace('/home');
  return (
    <Page pad={24} gap={12}>
      <View style={{ alignItems: 'center', marginTop: 28, height: 300, justifyContent: 'center' }}>
        <View style={{ position: 'absolute' }}><DotGlobe /></View>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="star" size={36} color="#fff" />
        </View>
      </View>
      <View style={{ height: 12 }} />
      <T size={30} w="b" ls={-4} lh={38}>{'여행의 모든 순간을\n한 곳에서'}</T>
      <T size={14} sub>일정, 지도, 가계부까지 함께 만드는 여행 플래너</T>
      <View style={{ height: 4 }} />
      <InputBox icon="mail" value={email} onChangeText={setEmail} placeholder="이메일" />
      <InputBox icon="lock" value={pw} onChangeText={setPw} placeholder="비밀번호" secure={!show}
        right={<Pressable hitSlop={8} onPress={() => setShow((s) => !s)}><Icon name={show ? 'eyeoff' : 'eye'} size={20} color={t.sub} /></Pressable>} />
      <Btn label="로그인" onPress={home} />
      <Row gap={14} style={{ justifyContent: 'center' }}>
        <T size={13} sub onPress={() => r.push('/auth/reset')}>비밀번호 찾기</T>
        <T size={13} color={t.line}>|</T>
        <T size={13} w="b" color={t.acc} onPress={() => r.push('/auth/signup')}>회원가입</T>
      </Row>
      <Row gap={10}>
        <View style={{ flex: 1, height: 1, backgroundColor: t.line }} />
        <T size={12} sub>또는</T>
        <View style={{ flex: 1, height: 1, backgroundColor: t.line }} />
      </Row>
      <Row gap={8}>
        {['Google', 'Apple', '카카오'].map((s) => (
          <Pressable key={s} onPress={home} style={{ flex: 1, height: 46, borderRadius: 23, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
            <T size={14} w="b">{s}</T>
          </Pressable>
        ))}
      </Row>
    </Page>
  );
}
