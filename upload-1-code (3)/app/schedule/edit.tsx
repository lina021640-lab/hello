import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Header, T, Row, Icon, IconTile, Btn, shadow, useTheme } from '../../src/kit';
import { OutField, Chip, Toggle } from '../../src/screens/schedule/shared';

const cats = ['관광', '식사', '카페', '쇼핑', '이동', '숙소'];

/** 일정 수정: 세부일정 장소의 "수정"을 눌렀을 때 (장소는 고정, 시간·카테고리·메모·알림 변경 / 삭제) */
export default function Edit() {
  const r = useRouter(); const { t } = useTheme();
  const [cat, setCat] = useState(1); const [alarm, setAlarm] = useState(true);
  const [start, setStart] = useState('PM 03:00'); const [end, setEnd] = useState('PM 05:00');
  const [memo, setMemo] = useState('크로와상 꼭 먹기, 키링 사기');
  return (
    <Page gap={14} footer={<Row gap={10}><Btn label="삭제" kind="ghost" h={52} style={{ flex: 1 }} onPress={() => r.back()} /><Btn label="저장하기" h={52} style={{ flex: 2 }} onPress={() => r.back()} /></Row>}>
      <Header title="일정 수정" />
      <T size={13} sub>3일차 · 11/22</T>
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingLeft: 12, paddingRight: 14, paddingVertical: 12 }, shadow(t)]}>
        <IconTile name="pin" size={44} icon={22} />
        <View style={{ flex: 1, gap: 2 }}>
          <T size={15} w="b">버러 마켓</T>
          <T size={12} sub>8 Southwark St, London SE1</T>
        </View>
        <Icon name="check" size={20} color={t.acc} />
      </View>
      <Row gap={10} align="flex-start">
        <OutField style={{ flex: 1 }} label="시작" value={start} onChangeText={setStart} left={<Icon name="clock" size={20} color={t.sub} />} />
        <OutField style={{ flex: 1 }} label="종료" value={end} onChangeText={setEnd} left={<Icon name="clock" size={20} color={t.sub} />} />
      </Row>
      <View style={{ gap: 6 }}>
        <T size={13} sub>카테고리</T>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {cats.map((c, i) => <Chip key={c} label={c} active={i === cat} onPress={() => setCat(i)} />)}
        </Row>
      </View>
      <OutField label="메모" h={52} value={memo} onChangeText={setMemo} />
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12 }, shadow(t)]}>
        <T size={15} style={{ flex: 1 }}>출발 30분 전 알림</T>
        <Toggle on={alarm} onPress={() => setAlarm(!alarm)} />
      </View>
    </Page>
  );
}
