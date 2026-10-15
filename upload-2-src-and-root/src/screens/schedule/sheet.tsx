/** 지도 위에 얹는 바텀시트의 높이를 손가락으로 끌어 조절하는 훅 (지도를 길게 ↔ 기능을 길게) */
import { useMemo, useRef, useState } from 'react';
import { PanResponder } from 'react-native';

export function useSheetY(initial: number, snaps: number[]) {
  const [y, setY] = useState(initial);
  const yRef = useRef(initial); const start = useRef(initial); const raf = useRef(0);
  const lo = Math.min(...snaps), hi = Math.max(...snaps);
  const set = (v: number) => { yRef.current = v; setY(v); };
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { cancelAnimationFrame(raf.current); start.current = yRef.current; },
    onPanResponderMove: (_e, g) => set(Math.max(lo, Math.min(hi, start.current + g.dy))),
    onPanResponderRelease: (_e, g) => {
      const proj = yRef.current + g.vy * 140;
      const to = snaps.reduce((a, b) => (Math.abs(b - proj) < Math.abs(a - proj) ? b : a));
      const from = yRef.current; const t0 = Date.now();
      const step = () => {
        const p = Math.min(1, (Date.now() - t0) / 220), e = 1 - Math.pow(1 - p, 3);
        set(from + (to - from) * e);
        if (p < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
  }), [lo, hi]);
  return { y, handlers: pan.panHandlers };
}
