import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, IconTile, Btn, shadow, useTheme } from '../../src/kit';
import { OutField, Toggle } from '../../src/screens/schedule/shared';

export default function Flight() {
  const r = useRouter(); const { t } = useTheme();
  const [f, setF] = useState({ air: '대한항공', no: 'KE344', from: 'ICN · 인천국제공항', to: 'LHR · 런던 히드로', dep: '2026.11.20 (금)  10:55', arr: '2026.11.20 (금)  17:20', rsv: 'ABC123', seat: '32A' });
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const [show, setShow] = useState(true); const [alarm, setAlarm] = useState(true);
  const cal = <Icon name="cal" size={20} color={t.sub} />;
  return (
    <Page gap={12} footer={<Btn label="항공편 저장" onPress={() => r.back()} h={52} />}>
      <Header title="항공편 추가" />
      <Row gap={8} align="flex-start" style={{ backgroundColor: t.accS, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginTop: 4 }}>
        <View style={{ marginTop: 1 }}><Icon name="info" size={16} color={t.acc} /></View>
        <T size={12} lh={17} style={{ flex: 1 }}>항공편은 직접 입력해요. 시간은 각 공항의 현지 시각으로 넣어 주세요.</T>
      </Row>
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="항공사" value={f.air} onChangeText={set('air')} />
        <OutField style={{ flex: 1 }} label="편명" value={f.no} onChangeText={set('no')} />
      </Row>
      <OutField label="출발 공항" value={f.from} onChangeText={set('from')} />
      <OutField label="도착 공항" value={f.to} onChangeText={set('to')} />
      <OutField label="출발 일시 (인천 현지)" value={f.dep} onChangeText={set('dep')} left={cal} right={<T size={12} w="b" color={t.acc}>KST</T>} />
      <OutField label="도착 일시 (런던 현지)" value={f.arr} onChangeText={set('arr')} left={cal} right={<T size={12} w="b" color={t.acc}>GMT</T>} />
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 18, paddingLeft: 14, paddingRight: 16, paddingVertical: 12 }, shadow(t)]}>
        <IconTile name="plane" size={36} icon={18} />
        <View style={{ flex: 1 }}>
          <T size={15} w="b">소요 시간 15시간 25분</T>
          <T size={12} sub>현지 시각 차이를 반영해 자동 계산돼요</T>
        </View>
      </View>
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="예약번호 (선택)" value={f.rsv} onChangeText={set('rsv')} />
        <OutField style={{ flex: 1 }} label="좌석 (선택)" value={f.seat} onChangeText={set('seat')} />
      </Row>
      <View style={[{ backgroundColor: t.card, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12, gap: 10 }, shadow(t)]}>
        <Row><T size={14} style={{ flex: 1 }}>일정에 항공편 표시</T><Toggle on={show} onPress={() => setShow(!show)} /></Row>
        <Row><T size={14} style={{ flex: 1 }}>출발 3시간 전 알림</T><Toggle on={alarm} onPress={() => setAlarm(!alarm)} /></Row>
      </View>
    </Page>
  );
}
