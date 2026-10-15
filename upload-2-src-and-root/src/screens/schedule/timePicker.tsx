/** 시간 선택: 필드를 누르면 바텀시트(오전/오후 · 시 · 분 칩)가 열린다. 네이티브 의존성 없이 웹·앱 공통.
 *  값은 24시간 'HH:mm' 문자열로 주고받고, 화면에는 '오전 10:00' 로 보여 준다. */
import React, { useState } from 'react';
import { View, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Icon, Btn, Row, useTheme } from '../../kit';
import { parseMin, toHHmm, fmtTime } from '../../data/scheduleStore';

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function Grid<X extends number>({ items, value, onPick, fmt }: { items: X[]; value: number; onPick: (v: X) => void; fmt: (v: X) => string }) {
  const { t } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {items.map((v) => {
        const on = v === value;
        return (
          <Pressable key={v} onPress={() => onPick(v)} accessibilityRole="button" accessibilityLabel={fmt(v)}
            style={{ width: '14.6%', minWidth: 44, flexGrow: 1, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? t.acc : t.card2 }}>
            <T size={16} w={on ? 'b' : 'm'} color={on ? '#fff' : t.text}>{fmt(v)}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TimeField({ label, value, onChange, placeholder = '시간 선택', clearLabel, title, style }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string;
  /** 있으면 시트에 '지우기' 버튼을 보여 준다 (예: '종료 시간 없음') */ clearLabel?: string; title?: string; style?: object;
}) {
  const { t } = useTheme(); const ins = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [pm, setPm] = useState(false); const [h, setH] = useState(10); const [m, setM] = useState(0);
  const show = () => {
    const k = parseMin(value);
    if (k != null) { const hh = Math.floor(k / 60); setPm(hh >= 12); setH(hh % 12 || 12); setM(Math.round((k % 60) / 5) * 5 % 60); }
    else { setPm(false); setH(10); setM(0); }
    setOpen(true);
  };
  const min24 = ((h % 12) + (pm ? 12 : 0)) * 60 + m;
  const done = () => { onChange(toHHmm(min24)); setOpen(false); };
  const txt = fmtTime(value);
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <T size={13} sub>{label}</T> : null}
      <Pressable onPress={show} accessibilityRole="button" accessibilityLabel={label ?? '시간 선택'}
        style={{ height: 48, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Icon name="clock" size={20} color={t.sub} />
        <T size={15} w="m" color={txt ? t.text : t.sub + '80'} style={{ flex: 1 }} numberOfLines={1}>{txt || placeholder}</T>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable onPress={() => setOpen(false)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          <View style={{ backgroundColor: t.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: Math.max(ins.bottom, 16) + 8, gap: 16, width: '100%', maxWidth: 520, alignSelf: 'center' }}>
            <View style={{ alignSelf: 'center', width: 35, height: 4, borderRadius: 2, backgroundColor: t.line }} />
            <Row style={{ justifyContent: 'space-between' }}>
              <T size={17} w="b">{title ?? label ?? '시간 선택'}</T>
              <T size={22} w="b" color={t.acc}>{fmtTime(toHHmm(min24))}</T>
            </Row>
            <View style={{ flexDirection: 'row', backgroundColor: t.track, borderRadius: 999, padding: 4 }}>
              {['오전', '오후'].map((l, i) => (
                <Pressable key={l} onPress={() => setPm(i === 1)} style={{ flex: 1, height: 38, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: (i === 1) === pm ? t.card : 'transparent' }}>
                  <T size={15} w="b" color={(i === 1) === pm ? t.text : t.sub}>{l}</T>
                </Pressable>
              ))}
            </View>
            <View style={{ gap: 8 }}>
              <T size={13} sub>시</T>
              <Grid items={HOURS} value={h} onPick={setH} fmt={(v) => String(v)} />
            </View>
            <View style={{ gap: 8 }}>
              <T size={13} sub>분</T>
              <Grid items={MINS} value={m} onPick={setM} fmt={(v) => String(v).padStart(2, '0')} />
            </View>
            <Row gap={10}>
              {clearLabel ? <Btn label={clearLabel} kind="ghost" h={52} style={{ flex: 1 }} onPress={() => { onChange(''); setOpen(false); }} /> : null}
              <Btn label="완료" h={52} style={{ flex: clearLabel ? 1 : 1 }} onPress={done} />
            </Row>
          </View>
        </View>
      </Modal>
    </View>
  );
}
