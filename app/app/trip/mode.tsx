import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Btn, Row, Icon, Card, useTheme } from '../../src/kit';

function Radio({ on }: { on: boolean }) {
  const { t } = useTheme();
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? t.acc : 'transparent', borderWidth: on ? 0 : 1.5, borderColor: t.line }}>
      {on ? <Icon name="check" size={14} color="#fff" /> : null}
    </View>
  );
}
function Tag({ label, bg }: { label: string; bg: string }) {
  const { t } = useTheme();
  return <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg, borderWidth: 1, borderColor: t.line }}><T size={11}>{label}</T></View>;
}

export default function Mode() {
  const r = useRouter(); const { t } = useTheme();
  const [sel, setSel] = useState(1);
  const dk = t.mode === 'dark';
  const gray = dk ? t.line : '#e8eaee';
  const Opt = ({ i, title, children, desc, tags }: { i: number; title: string; children: React.ReactNode; desc: string; tags: string[] }) => {
    const on = sel === i;
    return (
      <Pressable onPress={() => setSel(i)}>
        <Card pad={16} radius={22} style={{ gap: 10, borderWidth: 2, borderColor: on ? t.acc : 'transparent', backgroundColor: on ? t.accS : t.card }}>
          <Row gap={10}><Radio on={on} /><T size={16} w="b" style={{ flex: 1 }}>{title}</T></Row>
          <View style={{ height: 44, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>{children}</View>
          <T size={13} sub lh={19}>{desc}</T>
          <Row gap={6} style={{ flexWrap: 'wrap' }}>{tags.map((x) => <Tag key={x} label={x} bg={on ? t.card : t.bg} />)}</Row>
        </Card>
      </Pressable>
    );
  };
  const Av = ({ l, me }: { l: string; me?: boolean }) => (
    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: me ? t.acc : gray, alignItems: 'center', justifyContent: 'center' }}>
      <T size={12} w="b" color={me ? '#fff' : t.sub}>{l}</T>
    </View>
  );
  const Bar = ({ h, label, me }: { h: number; label: string; me?: boolean }) => (
    <View style={{ width: 64, alignItems: 'center', gap: 4 }}>
      <View style={{ width: 56, height: h, borderRadius: 8, backgroundColor: me ? t.acc : gray }} />
      <T size={10} w="b" color={me ? t.acc : t.sub}>{label}</T>
    </View>
  );
  const perms: [string, string, string?][] = [['일정 보기', '일행 모두'], ['내 일정 수정', '나만'], ['친구 일정 수정', '불가', t.bad], ['여행 이름·날짜 수정', '방장만']];
  return (
    <Page gap={12}>
      <Header title="일정 방식 선택" />
      <T size={24} w="b" ls={-3} lh={32} style={{ marginTop: 4 }}>{'이 여행의 일정은\n어떻게 만들까요?'}</T>
      <T size={13} sub>여행을 시작하기 전까지만 바꿀 수 있어요</T>
      <Opt i={0} title="공통 일정 하나" desc="모두가 같은 일정을 함께 봐요. 일행 누구나 일정을 추가·수정할 수 있어요." tags={['함께 편집', '일정 1개']}>
        <Av l="민" /><Av l="지" /><Av l="나" me />
        <T size={16} sub style={{ marginBottom: 6 }}>→</T>
        <View style={{ height: 38, width: 150, borderRadius: 10, backgroundColor: 'rgba(30,111,255,0.9)', alignItems: 'center', justifyContent: 'center' }}><T size={12} w="b" color="#fff">모두의 일정 1개</T></View>
      </Opt>
      <Opt i={1} title="같은 여행, 각자 일정" desc="여행과 날짜는 함께 쓰고 일정은 사람마다 따로 만들어요. 친구 일정은 볼 수만 있고, 내 일정만 수정할 수 있어요." tags={['내 일정은 나만 수정', '친구 일정은 읽기 전용']}>
        <Bar h={24} label="민 (보기)" /><Bar h={34} label="지 (보기)" /><Bar h={40} label="나 (수정)" me />
      </Opt>
      <T size={16} w="b" style={{ marginTop: 4 }}>시간 기준</T>
      <Card pad={0} radius={20} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 12, paddingRight: 16, paddingVertical: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><Icon name="clock" size={20} color={t.acc} /></View>
        <View style={{ flex: 1, gap: 1 }}><T size={15} w="b">영국 · 런던 현지 시각</T><T size={12} sub>GMT+0 · 여행 첫 나라 기준</T></View>
        <Icon name="down" size={18} color={t.sub} />
      </Card>
      <Row gap={8} align="flex-start" style={{ backgroundColor: t.accS, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ marginTop: 0 }}><Icon name="info" size={16} color={t.acc} /></View>
        <T size={12} lh={17} style={{ flex: 1 }}>일정과 친구 일정 표는 이 시간 기준으로 보여요. 여러 나라를 이동하면 일정마다 그 나라의 현지 시각이 적용돼요.</T>
      </Row>
      <T size={16} w="b" style={{ marginTop: 4 }}>권한 요약</T>
      <Card pad={0} radius={20} style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
        {perms.map(([a, b, c], i) => (
          <View key={a} style={{ gap: 10 }}>
            {i ? <View style={{ height: 1, backgroundColor: t.line }} /> : null}
            <Row><T size={14} style={{ flex: 1 }}>{a}</T><T size={14} w="b" color={c ?? t.acc}>{b}</T></Row>
          </View>
        ))}
      </Card>
      <Btn label="일정 방식 확정" onPress={() => r.replace('/schedule')} />
    </Page>
  );
}
