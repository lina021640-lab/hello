import React from 'react';
import { View, TextInput, Pressable, Platform, StyleProp, ViewStyle } from 'react-native';
import { T, Row, Icon, IconName, Card, useTheme } from '../../kit';

/** 피그마 입력창: 흰 배경 + 1px line 테두리, radius 16 */
export function InputBox({ value, onChangeText, placeholder, secure, icon, h = 52, right, style, editable = true }: {
  value?: string; onChangeText?: (s: string) => void; placeholder?: string; secure?: boolean; icon?: IconName; h?: number;
  right?: React.ReactNode; style?: StyleProp<ViewStyle>; editable?: boolean;
}) {
  const { t } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, height: h, paddingHorizontal: 16, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }, style]}>
      {icon ? <Icon name={icon} size={20} color={t.sub} /> : null}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.sub} secureTextEntry={secure} editable={editable}
        style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
      {right}
    </View>
  );
}

export function LabeledInput({ label, ...p }: React.ComponentProps<typeof InputBox> & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T size={13} sub>{label}</T>
      <InputBox {...p} />
    </View>
  );
}

export function SmallChip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: active ? t.acc : t.card, borderWidth: active ? 0 : 1, borderColor: t.line }}>
      <T size={13} w={active ? 'b' : 'm'} color={active ? '#fff' : t.text}>{label}</T>
    </Pressable>
  );
}

/** "정했어요 / 추천받을래요" */
export function DecidedChips({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  return (
    <Row gap={8}>
      <SmallChip label="정했어요" active={value === 0} onPress={() => onChange(0)} />
      <SmallChip label="추천받을래요" active={value === 1} onPress={() => onChange(1)} />
    </Row>
  );
}

function CityBadge({ code }: { code: string }) {
  const { t } = useTheme();
  return <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><T size={11} w="b" color={t.acc}>{code}</T></View>;
}

function CityRow({ code, name, country, icon, onPress }: { code: string; name: string; country: string; icon: IconName; onPress?: () => void }) {
  const { t } = useTheme();
  return (
    <Row gap={12}>
      <CityBadge code={code} />
      <View style={{ flex: 1 }}><T size={15} w="b">{name}</T><T size={12} sub>{country}</T></View>
      <Pressable hitSlop={8} onPress={onPress}><Icon name={icon} size={20} color={t.sub} /></Pressable>
    </Row>
  );
}

/** 여행지 카드 (H-02/H-03 공통) */
export function DestinationCard() {
  const { t } = useTheme();
  const [mode, setMode] = React.useState(0);
  const [q, setQ] = React.useState('베니스');
  const [picked, setPicked] = React.useState([{ code: 'UK', name: '런던', country: '영국' }, { code: 'FR', name: '파리', country: '프랑스' }]);
  const inner = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line + '17', borderRadius: 18, padding: 14, gap: 12 } as const;
  return (
    <Card pad={16} radius={24} style={{ gap: 10 }}>
      <T size={14} w="b">여행지</T>
      <DecidedChips value={mode} onChange={setMode} />
      <T size={13} sub>나라 및 도시 검색</T>
      <View style={inner}>
        <Row gap={10}>
          <Icon name="search" size={20} color={t.text} />
          <TextInput value={q} onChangeText={setQ} placeholder="도시 검색" placeholderTextColor={t.sub}
            style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          <Pressable hitSlop={8} onPress={() => setQ('')}><Icon name="minus" size={20} color={t.sub} /></Pressable>
        </Row>
        <View style={{ height: 1, backgroundColor: t.line }} />
        <CityRow code="IT" name="베니스" country="이탈리아" icon="plus" onPress={() => setPicked((p) => (p.some((c) => c.name === '베니스') ? p : [...p, { code: 'IT', name: '베니스', country: '이탈리아' }]))} />
        <T size={12} color={t.acc}>+ 찾는 도시가 없나요? 지도에서 직접 추가</T>
      </View>
      <View style={inner}>
        {picked.map((c) => <CityRow key={c.name} {...c} icon="minus" onPress={() => setPicked((p) => p.filter((x) => x.name !== c.name))} />)}
      </View>
    </Card>
  );
}

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
/** 날짜 카드 (H-02/H-03 공통): 2026년 11월, 20일 시작 ~ 30일 */
export function DatesCard() {
  const { t } = useTheme();
  const [mode, setMode] = React.useState(0);
  const rows: (number | null)[][] = [];
  const cells: (number | null)[] = Array.from({ length: 30 }, (_, i) => i + 1);
  while (cells.length % 7) cells.push(null);
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return (
    <Card pad={16} radius={24} style={{ gap: 10 }}>
      <T size={14} w="b">날짜</T>
      <DecidedChips value={mode} onChange={setMode} />
      <Row gap={10} style={{ height: 50, paddingHorizontal: 16, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }}>
        <Icon name="cal" size={20} color={t.sub} />
        <T size={15} style={{ flex: 1 }}>2026.11.20 - 2026.12.29</T>
        <T size={13} w="b" color={t.acc}>변경</T>
      </Row>
      <View style={{ gap: 4 }}>
        <Row style={{ paddingBottom: 6 }}>
          <T size={15} w="b" style={{ flex: 1 }}>2026년 11월</T>
          <Icon name="chevl" size={20} color={t.acc} />
          <Icon name="chev" size={20} color={t.acc} />
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          {DOW.map((d) => <T key={d} size={11} sub align="center" style={{ width: 42 }}>{d}</T>)}
        </Row>
        {rows.map((r, ri) => (
          <Row key={ri} style={{ justifyContent: 'space-between' }}>
            {r.map((d, ci) => {
              const start = d === 20; const inRange = d !== null && d > 20;
              return (
                <View key={ci} style={{ width: 42, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: start ? t.acc : inRange ? t.accS : 'transparent' }}>
                  {d !== null ? <T size={15} w={start ? 'b' : 'm'} color={start ? '#fff' : inRange ? t.acc : t.text}>{d}</T> : null}
                </View>
              );
            })}
          </Row>
        ))}
        <Row style={{ paddingTop: 8 }}>
          <T size={15} style={{ flex: 1 }}>시간</T>
          <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: t.card, borderWidth: 1, borderColor: t.line }}><T size={14}>9:41 AM</T></View>
        </Row>
      </View>
    </Card>
  );
}
