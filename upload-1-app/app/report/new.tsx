import { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Icon, useTheme } from '../../src/kit';
import { Avatar, Big, Dim, FeedPostDim, Grabber, Sep, useClose } from '../../src/screens/wallet-report/parts';

const reasons = ['스팸·광고', '허위·잘못된 정보', '부적절한 사진·내용', '욕설·괴롭힘·혐오', '개인정보 노출', '저작권 침해', '기타'];

export default function ReportNew() {
  const { t } = useTheme(); const close = useClose(); const ins = useSafeAreaInsets();
  const [sel, setSel] = useState(1); const [block, setBlock] = useState(false); const [detail, setDetail] = useState('');
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <FeedPostDim />
      <Dim onPress={close} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 96, bottom: 0, backgroundColor: t.card, borderRadius: 30, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20, gap: 12, paddingBottom: 110 }}>
          <Grabber />
          <T size={20} w="b" ls={-2}>신고하기</T>
          <Row gap={10} style={{ backgroundColor: t.bg, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Avatar ch="민" size={32} bg={t.acc} fg="#fff" fs={13} />
            <View style={{ flex: 1 }}><T size={14} w="b">민수 · 버러 마켓</T><T size={12} sub>“평일 오전이 한가해요”</T></View>
          </Row>
          <T size={13} sub>신고 사유를 선택해 주세요</T>
          <View>
            {reasons.map((r, i) => (
              <View key={r}>
                {i > 0 ? <Sep /> : null}
                <Pressable onPress={() => setSel(i)}>
                  <Row gap={12} style={{ paddingVertical: 11 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: i === sel ? t.acc : 'transparent', borderWidth: i === sel ? 0 : 1.5, borderColor: t.line }}>
                      {i === sel ? <Icon name="check" size={13} color="#fff" /> : null}
                    </View>
                    <T size={14} w={i === sel ? 'b' : 'm'} style={{ flex: 1 }}>{r}</T>
                  </Row>
                </Pressable>
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: t.bg, borderRadius: 16, height: 64, paddingHorizontal: 14, paddingVertical: 10 }}>
            <TextInput value={detail} onChangeText={setDetail} multiline placeholder="자세한 내용 (선택)" placeholderTextColor={t.sub}
              style={{ flex: 1, color: t.text, fontSize: 13, fontWeight: '500', padding: 0, textAlignVertical: 'top', ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null) }} />
          </View>
          <Pressable onPress={() => setBlock(!block)}>
            <Row gap={10}>
              <View style={{ width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: block ? t.acc : 'transparent', borderWidth: block ? 0 : 1.5, borderColor: t.line }}>
                {block ? <Icon name="check" size={13} color="#fff" /> : null}
              </View>
              <T size={14} style={{ flex: 1 }}>이 사용자도 함께 차단하기</T>
            </Row>
          </Pressable>
        </ScrollView>
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(ins.bottom, 26) }}>
        <Big label="신고 제출" kind="danger" onPress={close} />
      </View>
    </View>
  );
}
