import { View, Pressable } from 'react-native';
import { Page, Header, T, Card, Row, useGo, useTheme } from '../../src/kit';
import { Grad } from '../../src/screens/schedule/shared';
import { tipCategories } from '../../src/data/dummy';

export default function City() {
  const go = useGo(); const { t } = useTheme();
  return (
    <Page gap={14}>
      <Header title="런던 · 도시 정보" />
      <Grad id="cityHero" from="#7d9cc9" to="#27395c" style={{ height: 150, borderRadius: 30, justifyContent: 'flex-end', padding: 18 }}>
        <T size={24} color="#fff">런던</T>
        <T size={13} color="rgba(255,255,255,0.9)">영국 · 2026.11.20 - 11.26</T>
      </Grad>
      <T size={16} w="b" style={{ marginTop: 2 }}>여행 전에 알아두면 좋은 정보</T>
      <Card pad={16} radius={26}>
        <Row gap={10} style={{ flexWrap: 'wrap' }} align="flex-start">
          {tipCategories.slice(0, 8).map((c) => (
            <Pressable key={c.id} onPress={() => go('/tips/' + c.id)} style={{ width: '22.5%', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center' }}>
                <T size={24}>{c.emoji}</T>
              </View>
              <T size={12} w="m" numberOfLines={1} align="center">{c.name}</T>
            </Pressable>
          ))}
        </Row>
      </Card>
    </Page>
  );
}
