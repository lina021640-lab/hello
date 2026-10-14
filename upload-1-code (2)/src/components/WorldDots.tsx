import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme';

// 간단한 도트 지도(예시): 대륙 대략 위치를 점 격자로 표현. 실제 앱에서는 일러스트 레이어로 교체.
const blobs = [
  { cx: 8, cy: 6, rx: 6, ry: 4 },   // 북미
  { cx: 11, cy: 12, rx: 3, ry: 4 }, // 남미
  { cx: 24, cy: 5, rx: 3, ry: 2.5 },// 유럽
  { cx: 25, cy: 11, rx: 3.5, ry: 4 },// 아프리카
  { cx: 34, cy: 6, rx: 8, ry: 4 },  // 아시아
  { cx: 40, cy: 14, rx: 3, ry: 2 }, // 호주
];
const pins = [{ x: 24, y: 5 }, { x: 37, y: 6 }, { x: 25, y: 7 }];

export function WorldDots({ highlight = 0, width = 360 }: { highlight?: number; width?: number }) {
  const { t } = useTheme();
  const cols = 48, rows = 18, gap = width / cols;
  const dots: React.ReactNode[] = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const on = blobs.some((b) => ((x - b.cx) / b.rx) ** 2 + ((y - b.cy) / b.ry) ** 2 <= 1);
    if (!on) continue;
    const p = pins[highlight];
    const near = p && Math.hypot(x - p.x, y - p.y) < 3.2;
    dots.push(<Circle key={`${x}-${y}`} cx={x * gap + gap / 2} cy={y * gap + gap / 2} r={gap * 0.28} fill={near ? t.acc : t.line} />);
  }
  return <Svg width={width} height={rows * gap}>{dots}</Svg>;
}
