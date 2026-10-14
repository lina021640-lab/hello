import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, PanResponder } from 'react-native';
import Svg, { G, Path, Defs, Mask, LinearGradient, Stop, Rect } from 'react-native-svg';
import { WORLD_COLS, WORLD_ROWS, WORLD_COUNTRIES, WORLD_RUNS } from '../data/worldDots';

const SW = 0.8; // 점 굵기(격자 간격 대비)
const idOf: Record<string, number> = {};
WORLD_COUNTRIES.forEach((n, i) => { idOf[n] = i; });

function buildPath(filter?: (cid: number) => boolean) {
  let d = '';
  for (const [r, c, len, cid] of WORLD_RUNS) {
    if (filter && !filter(cid)) continue;
    const y = r + 0.5;
    for (let k = 0; k < len; k++) d += `M${c + k + 0.5} ${y}h0`;
  }
  return d;
}
let ALL: string | null = null;
const Base = React.memo(function Base({ color }: { color: string }) {
  if (!ALL) ALL = buildPath();
  return <Path d={ALL} stroke={color} strokeWidth={SW} strokeLinecap="round" fill="none" />;
});
const High = React.memo(function High({ ids, color }: { ids: number[]; color: string }) {
  const d = useMemo(() => { const s = new Set(ids); return buildPath((c) => s.has(c)); }, [ids]);
  return <Path d={d} stroke={color} strokeWidth={SW} strokeLinecap="round" fill="none" />;
});

/** 나라 목록(영어 이름)을 모두 담는 확대 변환 (격자 좌표 → 화면) */
function fit(countries: string[], vw: number, vh: number) {
  const ids = new Set(countries.map((c) => idOf[c]).filter((v) => v !== undefined));
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
  for (const [r, c, len, cid] of WORLD_RUNS) if (ids.has(cid)) { x0 = Math.min(x0, c); x1 = Math.max(x1, c + len); y0 = Math.min(y0, r); y1 = Math.max(y1, r + 1); }
  if (x1 < 0) { const s = vw / WORLD_COLS; return { s, tx: 0, ty: (vh - WORLD_ROWS * s) / 2 }; }
  const bw = x1 - x0, bh = y1 - y0;
  const s = Math.min((vw * 0.78) / bw, (vh * 0.68) / bh, 12);
  return { s, tx: vw / 2 - ((x0 + x1) / 2) * s, ty: vh / 2 - ((y0 + y1) / 2) * s };
}

export function WorldDotMap({ width, height, countries, base, hi, interactive = true, btnBg = '#000' }: { width: number; height: number; countries: string[]; base: string; hi: string; interactive?: boolean; btnBg?: string }) {
  const target = useMemo(() => fit(countries, width, height), [countries.join('|'), width, height]);
  const [cur, setCur] = useState(target);
  const from = useRef(target); const curRef = useRef(target);
  const raf = useRef(0);
  const minS = width / WORLD_COLS, maxS = 60;
  const stop = () => cancelAnimationFrame(raf.current);
  const animateTo = (tg: { s: number; tx: number; ty: number }) => {
    stop(); from.current = curRef.current; const t0 = Date.now(); const D = 700;
    const step = () => {
      const p = Math.min(1, (Date.now() - t0) / D), e = 1 - Math.pow(1 - p, 3);
      const s = Math.exp(Math.log(from.current.s) + (Math.log(tg.s) - Math.log(from.current.s)) * e);
      const tx = from.current.tx + (tg.tx - from.current.tx) * e;
      const ty = from.current.ty + (tg.ty - from.current.ty) * e;
      curRef.current = { s, tx, ty }; setCur(curRef.current);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => { animateTo(target); return stop; }, [target]);

  // ── 손가락/마우스 제스처: 한 손가락 이동, 두 손가락 핀치 확대·축소(웹: 휠 확대·축소) ──
  const zoomAt = (fx: number, fy: number, k: number) => {
    const c = curRef.current; const s = Math.max(minS, Math.min(maxS, c.s * k)); const kk = s / c.s;
    curRef.current = { s, tx: fx - (fx - c.tx) * kk, ty: fy - (fy - c.ty) * kk }; setCur(curRef.current);
  };
  const box = useRef({ x: 0, y: 0 }); const ref = useRef<View>(null);
  const g = useRef({ lx: 0, ly: 0, dist: 0 });
  const touches = (e: any) => (e.nativeEvent.touches ?? []) as { pageX: number; pageY: number }[];
  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => interactive,
    onMoveShouldSetPanResponder: () => interactive,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e) => {
      stop(); ref.current?.measure((_x, _y, _w, _h, px, py) => { box.current = { x: px, y: py }; });
      const t = touches(e); g.current = { lx: t[0]?.pageX ?? e.nativeEvent.pageX, ly: t[0]?.pageY ?? e.nativeEvent.pageY, dist: 0 };
    },
    onPanResponderMove: (e) => {
      const t = touches(e);
      if (t.length >= 2) {
        const d = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
        const mx = (t[0].pageX + t[1].pageX) / 2, my = (t[0].pageY + t[1].pageY) / 2;
        if (g.current.dist > 0) {
          zoomAt(mx - box.current.x, my - box.current.y, d / g.current.dist);
          const c = curRef.current; curRef.current = { ...c, tx: c.tx + (mx - g.current.lx), ty: c.ty + (my - g.current.ly) }; setCur(curRef.current);
        }
        g.current = { lx: mx, ly: my, dist: d };
      } else {
        const x = t[0]?.pageX ?? e.nativeEvent.pageX, y = t[0]?.pageY ?? e.nativeEvent.pageY;
        if (g.current.dist === 0) { const c = curRef.current; curRef.current = { ...c, tx: c.tx + (x - g.current.lx), ty: c.ty + (y - g.current.ly) }; setCur(curRef.current); }
        g.current = { lx: x, ly: y, dist: 0 };
      }
    },
  }), [interactive, width]);
  const onWheel = (e: any) => {
    const r = e.currentTarget?.getBoundingClientRect?.(); if (!r) return;
    e.preventDefault?.(); stop();
    zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
  };
  const ids = useMemo(() => countries.map((c) => idOf[c]).filter((v) => v !== undefined), [countries.join('|')]);
  return (
    <View ref={ref} collapsable={false} style={{ width, height }} {...pan.panHandlers} {...({ onWheel } as any)}>
      <Svg width={width} height={height} pointerEvents="none">
        <Defs>
          <LinearGradient id="fadeY" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#fff" stopOpacity="0" /><Stop offset="0.28" stopColor="#fff" stopOpacity="1" />
            <Stop offset="0.8" stopColor="#fff" stopOpacity="1" /><Stop offset="1" stopColor="#fff" stopOpacity="0" />
          </LinearGradient>
          <Mask id="m" x="0" y="0" width={width} height={height} maskUnits="userSpaceOnUse">
            <Rect width={width} height={height} fill="url(#fadeY)" />
          </Mask>
        </Defs>
        <G mask="url(#m)"><G transform={`translate(${cur.tx} ${cur.ty}) scale(${cur.s})`}>
          <Base color={base} />
          <High ids={ids} color={hi} />
        </G></G>
      </Svg>
    </View>
  );
}
