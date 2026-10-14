import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '../theme';

/** 지도 플레이스홀더(실제 앱에서는 react-native-maps 로 교체). markers: 이모지 마커 */
export function MiniMap({ height = 200, markers = [] as { x: number; y: number; e: string; color?: string }[] }) {
  const { t } = useTheme();
  return (
    <View style={{ height, backgroundColor: t.ph, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
        {[40, 90, 140, 180].map((y) => <Line key={y} x1="0" y1={y} x2="300" y2={y - 20} stroke={t.line} strokeWidth="2" />)}
        {[60, 130, 210, 270].map((x) => <Line key={x} x1={x} y1="0" x2={x + 30} y2="200" stroke={t.line} strokeWidth="2" />)}
        <Path d="M0 120 C60 100 100 150 160 130 S260 110 300 140 L300 160 C250 140 200 170 150 150 S50 120 0 140 Z" fill={t.acc} opacity={0.25} />
      </Svg>
      {markers.map((m, i) => (
        <View key={i} style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, width: 36, height: 36, borderRadius: 18, backgroundColor: t.card, borderWidth: 3, borderColor: m.color ?? t.acc, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 17 }}>{m.e}</Text>
        </View>
      ))}
    </View>
  );
}
