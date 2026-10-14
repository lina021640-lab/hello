import React from 'react';
import { View, TextInput, Platform, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { T, Row, Icon, IconTile, useTheme } from '../../kit';
import { Chip } from '../wallet-report/parts';
import { COUNTRIES, CC, Expense, comma, country, dateLabel, krw, local, toKRW } from '../../data/walletStore';

const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

/** 숫자 입력(천 단위 콤마). value 는 숫자 문자열 */
export function MoneyInput({ value, onChange, placeholder, prefix, suffix, size = 20, decimals }: {
  value: string; onChange: (s: string) => void; placeholder?: string; prefix?: string; suffix?: string; size?: number; decimals?: boolean;
}) {
  const { t } = useTheme();
  const shown = decimals ? value : value ? comma(Number(value)) : '';
  return (
    <Row gap={8} style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.line, borderRadius: 16, height: 52, paddingHorizontal: 16 }}>
      {prefix ? <T size={size} w="b" color={t.sub}>{prefix}</T> : null}
      <TextInput value={shown} onChangeText={(s) => onChange(decimals ? s.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') : s.replace(/[^0-9]/g, ''))}
        keyboardType={decimals ? 'decimal-pad' : 'number-pad'} placeholder={placeholder} placeholderTextColor={t.sub}
        style={{ flex: 1, color: t.text, fontSize: size, fontWeight: '700', paddingVertical: 0, ...noOutline }} />
      {suffix ? <T size={15} w="m" sub>{suffix}</T> : null}
    </Row>
  );
}

export function CountryChips({ value, onChange }: { value: CC; onChange: (c: CC) => void }) {
  return (
    <Row gap={8} align="flex-start">
      {COUNTRIES.map((c) => <Chip key={c.code} label={c.name} active={c.code === value} onPress={() => onChange(c.code)} />)}
    </Row>
  );
}

/** 도넛: segs 는 합이 1 이하 비율(남는 부분은 트랙). */
export function Donut({ size = 200, stroke = 26, segs, children }: { size?: number; stroke?: number; segs: { frac: number; color: string }[]; children?: React.ReactNode }) {
  const { t } = useTheme();
  const r = (size - stroke) / 2; const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={t.track} strokeWidth={stroke} fill="none" />
        {segs.filter((s) => s.frac > 0).map((s, i) => {
          const len = Math.min(s.frac, 1) * C; const off = acc; acc += len;
          return <Circle key={i} cx={size / 2} cy={size / 2} r={r} stroke={s.color} strokeWidth={stroke} fill="none"
            strokeDasharray={`${Math.max(len - 2, 0.1)} ${C}`} strokeDashoffset={-off} transform={`rotate(-90 ${size / 2} ${size / 2})`} />;
        })}
      </Svg>
      {children}
    </View>
  );
}

const CAT_ICON: Record<string, any> = { 외식: 'food', 식비: 'food', 교통비: 'bus', 교통: 'bus', 기념품: 'bag', 쇼핑: 'bag', 입장료: 'flag', 기타: 'coin' };
export const catIcon = (c: string) => CAT_ICON[c] ?? 'coin';

export function ExpenseRow({ e, onPress, showCountry }: { e: Expense; onPress?: () => void; showCountry?: boolean }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Row gap={12}>
        <IconTile name={catIcon(e.cat)} size={40} icon={20} radius={20} />
        <View style={{ flex: 1, gap: 1 }}>
          <T size={15} w="b" numberOfLines={1}>{e.title}</T>
          <T size={12} sub>{showCountry ? `${country(e.country).name} · ` : ''}{e.cat} · {dateLabel(e.date)}</T>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 1 }}>
          <T size={15} w="b">{local(e.amount, e.country)}</T>
          <T size={12} sub>≈ {krw(toKRW(e.amount, e.country))}</T>
        </View>
      </Row>
    </Pressable>
  );
}

/** 하단 중앙 확인 다이얼로그(파랑 확인) */
export function ConfirmModal({ title, body, confirm, onCancel, onConfirm }: { title: string; body: string; confirm: string; onCancel: () => void; onConfirm: () => void }) {
  const { t } = useTheme();
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
      <Pressable onPress={onCancel} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ alignSelf: 'stretch', backgroundColor: t.card, borderRadius: 28, paddingTop: 22, paddingBottom: 18, paddingHorizontal: 20, alignItems: 'center', gap: 12 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={28} color={t.acc} />
        </View>
        <T size={19} w="b" ls={-2} align="center">{title}</T>
        <T size={13} lh={19} sub align="center">{body}</T>
        <Row gap={10} style={{ alignSelf: 'stretch', paddingTop: 6 }}>
          <Pressable onPress={onCancel} style={{ flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}><T size={15} w="b">취소</T></Pressable>
          <Pressable onPress={onConfirm} style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}><T size={15} w="b" color="#fff">{confirm}</T></Pressable>
        </Row>
      </View>
    </View>
  );
}
