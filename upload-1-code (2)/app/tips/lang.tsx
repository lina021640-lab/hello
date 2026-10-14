import { View, Pressable } from 'react-native';
import { T, Row, Icon, IconTile, shadow, useGo, useTheme } from '../../src/kit';
import { TipPage, Chips } from '../../src/screens/tips/parts';

const phrases = [
  ['안녕하세요', 'Hello', '헬로우'],
  ['감사합니다', 'Thank you', '땡큐'],
  ['실례합니다', 'Excuse me', '익스큐즈 미'],
  ['얼마예요?', 'How much is it?', '하우 머치 이즈 잇'],
  ['화장실이 어디예요?', 'Where is the restroom?', '웨어 이즈 더 레스트룸'],
  ['계산서 주세요', 'Could I have the bill, please?', '쿠다이 해브 더 빌 플리즈'],
];

export default function Lang() {
  const { t } = useTheme(); const go = useGo();
  return (
    <TipPage title="언어">
      <Chips items={['기본', '식당', '교통', '쇼핑', '긴급']} />
      {phrases.map(([ko, en, rd]) => (
        <View key={en} style={[{ backgroundColor: t.card, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 12, paddingVertical: 12 }, shadow(t)]}>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={12} sub>{ko}</T>
            <T size={16} w="b">{en}</T>
            <T size={12} color={t.acc}>{rd}</T>
          </View>
          <IconTile name="speaker" size={40} icon={20} />
        </View>
      ))}
      <Pressable onPress={() => go('/chatbot')} style={{ height: 52, borderRadius: 26, backgroundColor: t.card, borderWidth: 1, borderColor: t.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18 }}>
        <Icon name="chat" size={18} color={t.text} />
        <T size={15} w="b">챗봇에게 번역 요청하기</T>
      </Pressable>
    </TipPage>
  );
}
