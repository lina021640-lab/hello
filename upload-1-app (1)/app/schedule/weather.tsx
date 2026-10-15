import { useState } from 'react';
import { View } from 'react-native';
import { Page, Header, T, Row, Icon, shadow, useTheme } from '../../src/kit';
import { Chip } from '../../src/screens/schedule/shared';
import { useCurrentTrip } from '../../src/data/currentTrip';

/** 날씨: 실제 날씨 API 연동 전(후속) — 여행 도시 이름만 보여 주고 '준비 중' 상태 */
export default function Weather() {
  const { t } = useTheme();
  const view = useCurrentTrip();
  const names = (view?.trip.cities ?? []).map((c) => c.city).filter((n, i, a) => a.indexOf(n) === i);
  const [city, setCity] = useState(0);
  return (
    <Page gap={12}>
      <Header title="날씨" />
      {names.length ? (
        <Row gap={8} style={{ marginTop: 4, flexWrap: 'wrap' }}>
          {names.map((c, i) => <Chip key={c} label={c} size={13} py={7} active={i === city} onPress={() => setCity(i)} />)}
        </Row>
      ) : null}
      <View style={[{ backgroundColor: t.card, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 36, alignItems: 'center', gap: 10 }, shadow(t)]}>
        <Icon name="cloud" size={44} color={t.phIcon} />
        <T size={13} sub>{names[city] ? `${names[city]} · 지금` : '날씨'}</T>
        <T size={18} w="b">날씨 정보를 준비 중이에요</T>
        <T size={13} sub align="center" lh={19}>{names.length ? '실시간 날씨와 일별 예보는\n곧 제공될 예정이에요.' : '여행을 추가하면 도시별 날씨를\n볼 수 있게 될 예정이에요.'}</T>
      </View>
    </Page>
  );
}
