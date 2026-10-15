import { View } from 'react-native';
import { Page, Header, T, Icon, shadow, useTheme } from '../../src/kit';
import { useCurrentTrip } from '../../src/data/currentTrip';

/** 시간별 예보: 실제 날씨 API 연동 전(후속) — 준비 중 상태 */
export default function WeatherDetail() {
  const { t } = useTheme();
  const view = useCurrentTrip();
  const city = view?.trip.cities[0]?.city;
  return (
    <Page gap={12}>
      <Header title={city ? `시간별 예보 · ${city}` : '시간별 예보'} />
      <View style={[{ backgroundColor: t.card, borderRadius: 26, paddingHorizontal: 18, paddingVertical: 36, alignItems: 'center', gap: 10 }, shadow(t)]}>
        <Icon name="cloud" size={44} color={t.phIcon} />
        <T size={18} w="b">예보를 준비 중이에요</T>
        <T size={13} sub align="center" lh={19}>시간별 기온과 강수확률은{'\n'}곧 제공될 예정이에요.</T>
      </View>
    </Page>
  );
}
