import { useState } from 'react';
import { View, Pressable, Linking } from 'react-native';
import { Page, Header, T, Row, Icon, Card, Btn, Field, useTheme } from '../../src/kit';

type L = { id: number; title: string; url: string };
const norm = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
const host = (u: string) => { try { return new URL(norm(u)).host.replace(/^www\./, ''); } catch { return u; } };

/** 내 링크 관리하기: 자주 가는 사이트(예약·항공·지도 등) 링크를 여러 개 저장하고 한 번에 열기 */
export default function Links() {
  const { t } = useTheme();
  const [list, setList] = useState<L[]>([]);
  const [title, setTitle] = useState(''); const [url, setUrl] = useState('');
  const add = () => {
    if (!url.trim()) return;
    setList((a) => [...a, { id: Date.now(), title: title.trim() || host(url.trim()), url: norm(url.trim()) }]);
    setTitle(''); setUrl('');
  };
  return (
    <Page gap={14}>
      <Header title="내 링크 관리하기" />
      <Card pad={16} radius={24} style={{ gap: 12 }}>
        <T size={15} w="sb">링크 추가</T>
        <Field placeholder="이름 (예: 호텔 예약)" value={title} onChangeText={setTitle} />
        <Field placeholder="주소 (https://...)" value={url} onChangeText={setUrl} left={<Icon name="link" size={18} color={t.sub} />} />
        <Btn label="추가하기" icon="plus" onPress={add} disabled={!url.trim()} h={48} />
      </Card>
      <T size={14} sub style={{ marginTop: 4 }}>{`저장한 링크 ${list.length}개`}</T>
      {list.map((l) => (
        <Card key={l.id} pad={14} radius={20} onPress={() => Linking.openURL(l.url).catch(() => {})}>
          <Row gap={12}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><Icon name="link" size={18} color={t.acc} /></View>
            <View style={{ flex: 1 }}>
              <T size={15} w="sb" numberOfLines={1}>{l.title}</T>
              <T size={12} sub numberOfLines={1}>{host(l.url)}</T>
            </View>
            <Pressable hitSlop={10} onPress={() => setList((a) => a.filter((x) => x.id !== l.id))}><Icon name="trash" size={20} color={t.sub} /></Pressable>
          </Row>
        </Card>
      ))}
      {list.length === 0 ? <T size={14} sub align="center" style={{ marginTop: 30 }}>저장한 링크가 없어요. 자주 가는 사이트를 추가해 보세요.</T> : null}
    </Page>
  );
}
