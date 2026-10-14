import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Page, T, Row, Icon, useGo, useTheme } from '../../src/kit';
import { SubHeader, Chip, Box, Big } from '../../src/screens/wallet-report/parts';

import { COUNTRIES } from '../../src/data/walletStore';
const RATE = COUNTRIES[0].rate; // £1 = 1,900원
const keys = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['.', '0', '⌫']];
const quick = [1, 5, 10, 20, 50, 100].map((n) => [`£${n}`, `${(n * RATE).toLocaleString('en-US')}원`]);

const fmt = (s: string) => {
  const [i, d] = s.split('.');
  const head = (i || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return d === undefined ? head : `${head}.${d}`;
};

export default function Rate() {
  const { t } = useTheme(); const go = useGo();
  const [krwIn, setKrwIn] = useState(true); // 입력 중인 통화가 KRW 인지
  const [v, setV] = useState('1000000');
  const [cur, setCur] = useState(0);
  const n = parseFloat(v || '0') || 0;
  const out = krwIn ? n / RATE : n * RATE;
  const outStr = krwIn ? out.toFixed(2) : String(Math.round(out));
  const press = (k: string) => setV((p) => {
    if (k === '⌫') return p.slice(0, -1);
    if (k === '.') return krwIn || p.includes('.') ? p : (p || '0') + '.'; // KRW 입력은 소수점 없음
    if (p === '0') return k;
    const d = p.split('.')[1];
    if (d !== undefined && d.length >= 2) return p;
    return p.length >= 12 ? p : p + k;
  });
  const swap = () => { setV(outStr.replace(/\.00$/, '')); setKrwIn(!krwIn); };

  const rows = [
    { code: 'KRW', name: '대한민국 원', badge: 'KR', active: krwIn, val: krwIn ? fmt(v || '0') : fmt(outStr) },
    { code: 'GBP', name: '영국 파운드', badge: 'GB', active: !krwIn, val: !krwIn ? fmt(v || '0') : fmt(outStr) },
  ];
  return (
    <Page gap={12}>
      <SubHeader title="환율 계산" mb={3} />
      <Box style={{ borderRadius: 26, paddingTop: 16, paddingBottom: 14, paddingHorizontal: 16, gap: 10 }}>
        {rows.map((r) => (
          <Row key={r.code} gap={10} style={{ backgroundColor: r.active ? t.accS : t.bg, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 6 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: r.active ? t.acc : t.line, alignItems: 'center', justifyContent: 'center' }}>
              <T size={12} w="b" color={r.active ? '#fff' : t.sub}>{r.badge}</T>
            </View>
            <View style={{ flex: 1 }}><T size={14} w="b">{r.code}</T><T size={11} sub>{r.name}</T></View>
            <T size={28} w="b" ls={-2} color={r.active ? t.acc : t.text}>{r.val}</T>
          </Row>
        ))}
        <Row gap={6}>
          <T size={12} sub style={{ flex: 1 }}>£1 = {RATE.toLocaleString('en-US')}원 · 09:00 기준</T>
          <Icon name="refresh" size={14} color={t.acc} />
          <T size={12} w="b" color={t.acc}>새로고침</T>
        </Row>
        <Pressable onPress={swap} style={{ position: 'absolute', left: '50%', marginLeft: -20, top: 49, width: 40, height: 40, borderRadius: 20, backgroundColor: t.acc, borderWidth: 3, borderColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="swap" size={20} color="#fff" />
        </Pressable>
      </Box>
      <Row gap={8} align="flex-start">
        {['GBP', 'EUR', 'JPY', 'USD'].map((c, i) => <Chip key={c} label={c} active={i === cur} size={13} py={6} onPress={() => setCur(i)} />)}
      </Row>
      <Box style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {[quick.slice(0, 3), quick.slice(3)].map((r, i) => (
          <Row key={i} align="flex-start" style={{ justifyContent: 'space-between' }}>
            {r.map(([a, b]) => <View key={a}><T size={12} sub>{a}</T><T size={14} w="b">{b}</T></View>)}
          </Row>
        ))}
      </Box>
      <View style={{ gap: 8, marginTop: 52 }}>
        {keys.map((row, i) => (
          <Row key={i} gap={8}>
            {row.map((k) => (
              <Pressable key={k} onPress={() => press(k)} style={{ flex: 1, height: 50, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
                <T size={22} w="b">{k}</T>
              </Pressable>
            ))}
          </Row>
        ))}
      </View>
      <Big label="이 금액으로 지출 추가" onPress={() => go('/wallet/add')} />
    </Page>
  );
}
