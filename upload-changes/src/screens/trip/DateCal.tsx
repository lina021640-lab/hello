import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { T, Row, Icon, useTheme } from '../../kit';
import { daysInMonth, firstDow, iso, parse, diffDays } from './dates';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

/** 인라인 미니 월 달력. min 이전 날짜는 비활성, range 안쪽은 연한 파랑. */
export function DateCal({ value, min, rangeFrom, rangeTo, initial, onPick }: {
  value?: string; min?: string; rangeFrom?: string; rangeTo?: string; initial: string; onPick: (d: string) => void;
}) {
  const { t } = useTheme();
  const i0 = parse(value || initial);
  const [ym, setYm] = useState({ y: i0.y, m: i0.m });
  const move = (n: number) => setYm(({ y, m }) => { const k = y * 12 + (m - 1) + n; return { y: Math.floor(k / 12), m: (k % 12) + 1 }; });
  const cells: (number | null)[] = [...Array(firstDow(ym.y, ym.m)).fill(null), ...Array.from({ length: daysInMonth(ym.y, ym.m) }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return (
    <View style={{ gap: 4, paddingTop: 4 }}>
      <Row style={{ paddingBottom: 6, gap: 4 }}>
        <T size={15} w="b" style={{ flex: 1 }}>{ym.y}년 {ym.m}월</T>
        <Pressable hitSlop={8} onPress={() => move(-1)}><Icon name="chevl" size={20} color={t.acc} /></Pressable>
        <Pressable hitSlop={8} onPress={() => move(1)}><Icon name="chev" size={20} color={t.acc} /></Pressable>
      </Row>
      <Row>{DOW.map((d) => <View key={d} style={{ flex: 1 }}><T size={11} sub align="center">{d}</T></View>)}</Row>
      {rows.map((r, ri) => (
        <Row key={ri}>
          {r.map((d, ci) => {
            const s = d ? iso(ym.y, ym.m, d) : '';
            const off = !!d && !!min && diffDays(min, s) < 0;
            const sel = !!d && s === value;
            const inR = !!d && !sel && !!rangeFrom && !!rangeTo && diffDays(rangeFrom, s) >= 0 && diffDays(s, rangeTo) >= 0;
            return (
              <View key={ci} style={{ flex: 1, alignItems: 'center' }}>
                {d ? (
                  <Pressable disabled={off} onPress={() => onPick(s)}
                    style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? t.acc : inR ? t.accS : 'transparent', opacity: off ? 0.3 : 1 }}>
                    <T size={14} w={sel ? 'b' : 'm'} color={sel ? '#fff' : inR ? t.acc : t.text}>{d}</T>
                  </Pressable>
                ) : <View style={{ width: 36, height: 36 }} />}
              </View>
            );
          })}
        </Row>
      ))}
    </View>
  );
}
