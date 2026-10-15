import React, { useMemo, useState } from 'react';
import { View, Pressable, TextInput, Platform } from 'react-native';
import { Page, Header, T, Btn, Row, Icon, Card, useTheme } from '../../kit';
import type { StoreCity, Trip } from '../../data/tripStore';
import { City, CITIES, searchCities, relatedCities, flag, ccLabel, cityByKo } from '../../data/cities';
import { DateCal } from './DateCal';
import { fmt, fmtShort, inclusive, diffDays, parse, iso, todayIso } from './dates';

export type TripCity = { key: string; ko: string; country: string; cc: string; cur: string; tz: string; start: string; end: string };
export const toTripCity = (c: City, start = '', end = ''): TripCity => ({ key: c.ko + Math.random().toString(36).slice(2, 6), ko: c.ko, country: c.country, cc: c.cc, cur: c.cur, tz: c.tz, start, end });
export const seedCity = (ko: string, start: string, end: string) => toTripCity(cityByKo(ko)!, start, end);

export const tripToForm = (tr: Trip): TripCity[] => tr.cities.map((c) => {
  const b = cityByKo(c.city);
  return b ? toTripCity(b, c.start, c.end) : { key: c.city + Math.random().toString(36).slice(2, 6), ko: c.city, country: c.country, cc: c.cc, cur: '', tz: '', start: c.start, end: c.end };
});
export const formToStore = (cs: TripCity[]): StoreCity[] => cs.map((c) => ({ city: c.ko, country: c.country, cc: c.cc, start: c.start, end: c.end }));

/** 입력칸: 틴트 채움(t.track) + 1px 테두리 + 포커스 시 accent 테두리 */
function useFieldStyle(focused: boolean, radius = 16) {
  const { t } = useTheme();
  return {
    backgroundColor: t.track, borderRadius: radius, borderWidth: focused ? 1.5 : 1,
    borderColor: focused ? t.acc : t.mode === 'dark' ? t.line : t.sub + '55',
  } as const;
}
function FormInput({ value, onChangeText, placeholder, h = 48, right }: { value: string; onChangeText: (s: string) => void; placeholder: string; h?: number; right?: React.ReactNode }) {
  const { t } = useTheme(); const [f, setF] = useState(false);
  return (
    <View style={[useFieldStyle(f), { flexDirection: 'row', alignItems: 'center', gap: 10, height: h, paddingHorizontal: 16 }]}>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.sub} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
      {right}
    </View>
  );
}

type Open = { key: string; which: 'start' | 'end' } | null;

export function TripForm({ title, heading, initialName, initialCities, nameTouched, topExtra, saveLabel, bottomExtra, onSave, saving, error }: {
  title: string; heading: string; initialName: string; initialCities: TripCity[]; nameTouched: boolean; topExtra?: React.ReactNode;
  saveLabel: string; bottomExtra?: React.ReactNode; saving?: boolean; error?: string; onSave: (v: { name: string; cities: TripCity[]; start: string; end: string }) => void;
}) {
  const { t } = useTheme();
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(nameTouched);
  const [cities, setCities] = useState<TripCity[]>(initialCities);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Open>(null);
  const [sf, setSf] = useState(false);
  const [lastPicked, setLastPicked] = useState<string | null>(initialCities.length ? initialCities[initialCities.length - 1].ko : null);

  const shownName = touched ? name : cities.length ? `${cities[0].ko} 여행` : '';
  const results = useMemo(() => searchCities(q), [q]);
  const picked = cities.map((c) => c.ko);
  const baseCity = lastPicked ? cityByKo(lastPicked) : undefined;
  const related = useMemo(() => (baseCity ? relatedCities(baseCity, picked, 8) : []), [baseCity, picked.join('|')]);

  const prevEnd = () => cities.map((c) => c.end).filter(Boolean).sort().pop();
  const addCity = (c: City | { custom: string }) => {
    let tc: TripCity;
    if ('custom' in c) tc = { key: c.custom + Math.random().toString(36).slice(2, 6), ko: c.custom, country: '', cc: '', cur: '', tz: '', start: '', end: '' };
    else { tc = toTripCity(c); setLastPicked(c.ko); }
    setCities((p) => [...p, tc]);
    setQ('');
    setOpen({ key: tc.key, which: 'start' });
  };
  const patch = (key: string, p: Partial<TripCity>) => setCities((a) => a.map((c) => (c.key === key ? { ...c, ...p } : c)));
  const remove = (key: string) => { setCities((a) => a.filter((c) => c.key !== key)); setOpen((o) => (o?.key === key ? null : o)); };
  const pickDate = (c: TripCity, which: 'start' | 'end', d: string) => {
    if (which === 'start') {
      patch(c.key, { start: d, end: c.end && diffDays(d, c.end) < 0 ? '' : c.end });
      setOpen({ key: c.key, which: 'end' });
    } else { patch(c.key, { end: d }); setOpen(null); }
  };

  const dated = cities.filter((c) => c.start && c.end);
  const tripStart = dated.map((c) => c.start).sort()[0];
  const tripEnd = dated.map((c) => c.end).sort().pop();
  const canSave = cities.length > 0 && cities.every((c) => c.start && c.end);
  const missing = cities.length === 0 ? '여행지를 한 곳 이상 추가해 주세요'
    : (() => { const m = cities.filter((c) => !c.start || !c.end); if (!m.length) return '';
      const what = (c: TripCity) => `${c.ko} ${!c.start && !c.end ? '시작일·종료일' : !c.start ? '시작일' : '종료일'}`;
      return `날짜를 입력해 주세요 (${m.map(what).join(', ')})`; })();

  const inner = { backgroundColor: t.card, borderWidth: 1, borderColor: t.line + '17', borderRadius: 18, padding: 14, gap: 12 } as const;
  const searchBox = { ...useFieldStyle(sf, 18), padding: 14, gap: 12 } as const;
  const initialMonth = (c: TripCity, which: 'start' | 'end') => (which === 'end' && c.start ? c.start : c.start || prevEnd() || todayIso());

  const note = (i: number) => {
    const a = cities[i - 1]; const b = cities[i];
    if (!a?.end || !b?.start) return null;
    const g = diffDays(a.end, b.start);
    if (g < 0) return `${a.ko}와(과) ${b.ko} 일정이 ${-g}일 겹쳐요`;
    if (g > 1) return `${a.ko} → ${b.ko} 사이 ${g - 1}일이 비어 있어요`;
    return null;
  };

  return (
    <Page gap={12} footer={<View style={{ gap: 8 }}>{error ? <T size={13} w="m" color={t.bad} align="center">{error}</T> : null}{!canSave ? <T size={13} w="m" color={t.warn} align="center">{missing}</T> : null}<Btn label={saving ? '저장 중…' : saveLabel} disabled={!canSave || saving} onPress={() => onSave({ name: shownName.trim() || '새 여행', cities, start: tripStart ?? "", end: tripEnd ?? "" })} /></View>}>
      <Header title={title} />
      <T size={22} w="b" ls={-3}>{heading}</T>
      <View style={{ gap: 6 }}>
        <T size={13} sub>여행 이름</T>
        <FormInput value={shownName} onChangeText={(s) => { setName(s); setTouched(true); }} placeholder="여행 이름을 입력하세요" />
      </View>
      {topExtra}
      <T size={20} w="b" ls={-2}>여행지와 날짜를 정해주세요</T>

      <Card pad={16} radius={24} style={{ gap: 10 }}>
        <T size={14} w="b">여행지</T>
        <T size={13} sub>나라 및 도시 검색</T>
        <View style={searchBox}>
          <Row gap={10}>
            <View style={{ width: 20, height: 20 }}><Icon name="search" size={20} color={t.text} /></View>
            <TextInput value={q} onChangeText={setQ} onFocus={() => setSf(true)} onBlur={() => setSf(false)} placeholder="도시·나라 검색 (예: 로마, venice)" placeholderTextColor={t.sub}
              style={{ flex: 1, color: t.text, fontSize: 15, fontWeight: '500', paddingVertical: 0, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
            {q ? <Pressable hitSlop={8} onPress={() => setQ('')}><Icon name="x" size={20} color={t.sub} /></Pressable> : null}
          </Row>
          {q.trim() ? (
            <>
              <View style={{ height: 1, backgroundColor: t.line }} />
              {results.map((c) => {
                const has = picked.includes(c.ko);
                return (
                  <Pressable key={c.ko} onPress={() => addCity(c)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
                      <T size={16}>{flag(c.cc)}</T>
                    </View>
                    <View style={{ flex: 1 }}>
                      <T size={15} w="b">{c.ko} <T size={12} sub>{c.en}</T></T>
                      <T size={12} sub>{c.country} · {c.cur}</T>
                    </View>
                    <T size={12} sub>{has ? '추가됨 · 한 번 더' : ''}</T>
                    <Icon name="plus" size={20} color={t.acc} />
                  </Pressable>
                );
              })}
              {results.length === 0 ? <T size={13} sub>검색 결과가 없어요</T> : null}
              <Pressable onPress={() => addCity({ custom: q.trim() })}>
                <T size={12} color={t.acc}>+ 찾는 도시가 없나요? ‘{q.trim()}’ 직접 추가</T>
              </Pressable>
            </>
          ) : null}
        </View>

        {related.length > 0 ? (
          <View style={{ gap: 8 }}>
            <T size={13} sub>{baseCity!.ko} 연관 도시 · 눌러서 바로 추가</T>
            <Row gap={8} style={{ flexWrap: 'wrap' }}>
              {related.map((c) => (
                <Pressable key={c.ko} onPress={() => addCity(c)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: t.accS }}>
                  <Icon name="plus" size={13} color={t.acc} />
                  <T size={13} w="m" color={t.acc}>{c.ko}</T>
                  {c.cc !== baseCity!.cc ? <T size={11} color={t.sub}>{c.country}</T> : null}
                </Pressable>
              ))}
            </Row>
          </View>
        ) : null}

        <T size={13} sub style={{ marginTop: 4 }}>내 도시 · 도시마다 시작일·종료일 필수</T>
        {cities.length === 0 ? (
          <View style={[inner, { alignItems: 'center', paddingVertical: 22 }]}><T size={13} sub>위에서 도시를 검색해 추가하세요</T></View>
        ) : cities.map((c, i) => {
          const n = note(i);
          const isOpen = open?.key === c.key;
          return (
            <React.Fragment key={c.key}>
              {n ? <T size={12} sub style={{ paddingLeft: 6 }}>{n}</T> : null}
              <View style={inner}>
                <Row gap={12}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
                    <T size={11} w="b" color={t.acc}>{c.cc ? ccLabel(c.cc) : '+'}</T>
                  </View>
                  <View style={{ flex: 1 }}>
                    <T size={15} w="b">{c.ko}</T>
                    <T size={12} sub numberOfLines={1}>{c.cc ? `${c.country} · ${c.cur} · ${c.tz.split('/').pop()!.replace(/_/g, ' ')}` : '직접 추가한 도시'}</T>
                  </View>
                  <Pressable hitSlop={8} onPress={() => remove(c.key)}><Icon name="x" size={20} color={t.sub} /></Pressable>
                </Row>
                <Row gap={8}>
                  {(['start', 'end'] as const).map((w) => {
                    const v = c[w]; const act = isOpen && open!.which === w;
                    return (
                      <Pressable key={w} onPress={() => setOpen(act ? null : { key: c.key, which: w })}
                        style={{ flex: 1, height: 46, borderRadius: 14, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.track, borderWidth: act ? 1.5 : 1, borderColor: act ? t.acc : t.mode === 'dark' ? t.line : t.sub + '55' }}>
                        <Icon name="cal" size={18} color={v ? t.acc : t.sub} />
                        <View>
                          <T size={10} sub>{w === 'start' ? '시작일' : '종료일'}</T>
                          <T size={13} w={v ? 'b' : 'm'} color={v ? t.text : t.sub}>{v ? fmt(v) : '날짜 선택'}</T>
                        </View>
                      </Pressable>
                    );
                  })}
                </Row>
                {c.start && c.end ? <T size={12} color={t.acc}>{fmtShort(c.start)} – {fmtShort(c.end)} · {inclusive(c.start, c.end)}일</T> : null}
                {isOpen ? (
                  <DateCal key={open!.which + (open!.which === 'end' ? c.start : '')} value={c[open!.which] || undefined}
                    min={open!.which === 'end' ? c.start || undefined : undefined} rangeFrom={c.start || undefined} rangeTo={c.end || undefined}
                    initial={initialMonth(c, open!.which)} onPick={(d) => pickDate(c, open!.which, d)} />
                ) : null}
              </View>
            </React.Fragment>
          );
        })}
      </Card>

      <Card pad={16} radius={24} style={{ gap: 8 }}>
        <T size={14} w="b">전체 여행 기간</T>
        <Row gap={10} style={{ height: 50, paddingHorizontal: 16, borderRadius: 16, backgroundColor: t.track, borderWidth: 1, borderColor: t.mode === 'dark' ? t.line : t.sub + '55' }}>
          <Icon name="cal" size={20} color={t.sub} />
          <T size={15} w={tripStart ? 'm' : 'r'} color={tripStart ? t.text : t.sub} style={{ flex: 1 }}>
            {tripStart ? `${fmt(tripStart)} – ${fmt(tripEnd!)} · ${inclusive(tripStart, tripEnd!)}일` : '도시별 날짜를 정하면 자동으로 계산돼요'}
          </T>
        </Row>
        <T size={12} sub>가장 이른 시작일부터 가장 늦은 종료일까지 · 도시 일정이 겹치거나 비어도 괜찮아요</T>
      </Card>
      {bottomExtra}
    </Page>
  );
}
