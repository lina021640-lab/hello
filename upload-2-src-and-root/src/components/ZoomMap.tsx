import { useEffect, useMemo, useRef, useState, useSyncExternalStore, ReactNode } from 'react';
import { PanResponder, View, StyleSheet } from 'react-native';

// 지도 위에 얹는 핀/말풍선이 지도와 같이 움직이도록 현재 변환을 공유한다.
let tf = { s: 1, tx: 0, ty: 0 }; const subs = new Set<() => void>();
const pub = (v: typeof tf) => { tf = v; subs.forEach((f) => f()); };
/** 핀의 기준 좌표(left, top)가 지도와 함께 움직이게 하는 offset 스타일 */
export function useMapFollow(left: number, top: number) {
  const v = useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => tf);
  return { transform: [{ translateX: left * (v.s - 1) + v.tx }, { translateY: top * (v.s - 1) + v.ty }] } as const;
}

/** 자리표시 지도용 확대/이동 래퍼: 한 손가락 이동, 두 손가락 핀치, 웹 휠. 실제 지도 SDK로 바꾸면 SDK 자체 제스처를 쓴다. */
export function ZoomMap({ children, min = 1, max = 6 }: { children: ReactNode; min?: number; max?: number }) {
  const [c, setC] = useState({ s: 1, tx: 0, ty: 0 });
  const cur = useRef(c); const size = useRef({ w: 390, h: 844 }); const box = useRef({ x: 0, y: 0 });
  const ref = useRef<View>(null); const g = useRef({ lx: 0, ly: 0, dist: 0 });
  const set = (v: typeof c) => {
    const { w, h } = size.current;
    const tx = Math.min(0, Math.max(w - w * v.s, v.tx)), ty = Math.min(0, Math.max(h - h * v.s, v.ty));
    cur.current = { s: v.s, tx, ty }; setC(cur.current); pub(cur.current);
  };
  const zoomAt = (fx: number, fy: number, k: number) => {
    const o = cur.current; const s = Math.max(min, Math.min(max, o.s * k)); const kk = s / o.s;
    set({ s, tx: fx - (fx - o.tx) * kk, ty: fy - (fy - o.ty) * kk });
  };
  useEffect(() => { pub({ s: 1, tx: 0, ty: 0 }); return () => pub({ s: 1, tx: 0, ty: 0 }); }, []);
  const pts = (e: any) => (e.nativeEvent.touches ?? []) as { pageX: number; pageY: number }[];
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e) => {
      ref.current?.measure((_x, _y, _w, _h, px, py) => { box.current = { x: px, y: py }; });
      const t = pts(e); g.current = { lx: t[0]?.pageX ?? e.nativeEvent.pageX, ly: t[0]?.pageY ?? e.nativeEvent.pageY, dist: 0 };
    },
    onPanResponderMove: (e) => {
      const t = pts(e);
      if (t.length >= 2) {
        const d = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
        const mx = (t[0].pageX + t[1].pageX) / 2, my = (t[0].pageY + t[1].pageY) / 2;
        if (g.current.dist > 0) { zoomAt(mx - box.current.x, my - box.current.y, d / g.current.dist); const o = cur.current; set({ ...o, tx: o.tx + mx - g.current.lx, ty: o.ty + my - g.current.ly }); }
        g.current = { lx: mx, ly: my, dist: d };
      } else {
        const x = t[0]?.pageX ?? e.nativeEvent.pageX, y = t[0]?.pageY ?? e.nativeEvent.pageY;
        if (g.current.dist === 0) { const o = cur.current; set({ ...o, tx: o.tx + x - g.current.lx, ty: o.ty + y - g.current.ly }); }
        g.current = { lx: x, ly: y, dist: 0 };
      }
    },
  }), []);
  const onWheel = (e: any) => {
    const r = e.currentTarget?.getBoundingClientRect?.(); if (!r) return;
    e.preventDefault?.(); zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
  };
  return (
    <View ref={ref} collapsable={false} style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}
      onLayout={(e) => { size.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }; }}
      {...pan.panHandlers} {...({ onWheel } as any)}>
      <View style={[StyleSheet.absoluteFill, { transform: [{ translateX: c.tx }, { translateY: c.ty }, { scale: c.s }], transformOrigin: 'top left' } as any]} pointerEvents="none">{children}</View>
    </View>
  );
}
