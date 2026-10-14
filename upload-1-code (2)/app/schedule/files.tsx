import { useState } from 'react';
import { View, Pressable, Image, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Page, Header, T, Row, Icon, Card, Btn, useTheme } from '../../src/kit';

type F = { id: number; name: string; uri?: string; image: boolean; size?: number };
const fmt = (n?: number) => (n === undefined ? '' : n > 1048576 ? `${(n / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`);

/** 내 파일 관리하기: 바우처·티켓·예약 확인서 등 파일/이미지를 저장해 두고 바로 열기 */
export default function Files() {
  const { t } = useTheme();
  const [list, setList] = useState<F[]>([]);
  const pickFiles = async () => {
    const r = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: true });
    if (r.canceled) return;
    setList((a) => [...a, ...r.assets.map((x, i) => ({ id: Date.now() + i, name: x.name, uri: x.uri, size: x.size, image: (x.mimeType ?? '').startsWith('image/') }))]);
  };
  const pickImages = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 1 });
    if (r.canceled) return;
    setList((a) => [...a, ...r.assets.map((x, i) => ({ id: Date.now() + i, name: x.fileName ?? '이미지', uri: x.uri, size: x.fileSize, image: true }))]);
  };
  const images = list.filter((f) => f.image), files = list.filter((f) => !f.image);
  const del = (id: number) => setList((a) => a.filter((x) => x.id !== id));
  return (
    <Page gap={14}>
      <Header title="내 파일 관리하기" />
      <Row gap={10}>
        <Btn label="파일 추가" icon="plus" onPress={pickFiles} h={48} style={{ flex: 1 }} />
        <Btn label="이미지 추가" icon="image" kind="soft" onPress={pickImages} h={48} style={{ flex: 1 }} />
      </Row>
      {list.length === 0 ? (
        <Card pad={28} radius={24} style={{ alignItems: 'center', gap: 8 }}>
          <Icon name="folder" size={40} color={t.phIcon} />
          <T size={15} w="sb">저장한 파일이 없어요</T>
          <T size={13} sub align="center">항공권·호텔 바우처·예약 확인서 같은{'\n'}파일이나 이미지를 추가해 두세요.</T>
        </Card>
      ) : null}
      {images.length > 0 ? (
        <>
          <T size={14} sub>{`이미지 ${images.length}개`}</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {images.map((f) => (
              <Pressable key={f.id} onPress={() => f.uri && Linking.openURL(f.uri).catch(() => {})} style={{ width: '31.8%', aspectRatio: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: t.ph }}>
                {f.uri ? <Image source={{ uri: f.uri }} style={{ width: '100%', height: '100%' }} /> : null}
                <Pressable hitSlop={6} onPress={() => del(f.id)} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="x" size={14} color="#fff" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
      {files.length > 0 ? <T size={14} sub style={{ marginTop: 4 }}>{`파일 ${files.length}개`}</T> : null}
      {files.map((f) => (
        <Card key={f.id} pad={14} radius={20} onPress={() => f.uri && Linking.openURL(f.uri).catch(() => {})}>
          <Row gap={12}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}><Icon name="note" size={20} color={t.acc} /></View>
            <View style={{ flex: 1 }}>
              <T size={15} w="sb" numberOfLines={1}>{f.name}</T>
              <T size={12} sub>{fmt(f.size)}</T>
            </View>
            <Pressable hitSlop={10} onPress={() => del(f.id)}><Icon name="trash" size={20} color={t.sub} /></Pressable>
          </Row>
        </Card>
      ))}
    </Page>
  );
}
