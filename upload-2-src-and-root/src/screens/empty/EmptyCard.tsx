/** 빈 상태 카드 (여행 없음 / 데이터 없음 공용) */
import React from 'react';
import { View } from 'react-native';
import { Card, T, Btn, Page, TabTitle, Header, useGo, useTheme } from '../../kit';

export function EmptyCard({ emoji = '🧳', title, body, cta, onCta }: { emoji?: string; title: string; body?: string; cta?: string; onCta?: () => void }) {
  const { t } = useTheme();
  return (
    <Card pad={24} radius={28} style={{ alignItems: 'center', gap: 8, paddingVertical: 32 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.accS, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <T size={30}>{emoji}</T>
      </View>
      <T size={17} w="b" align="center">{title}</T>
      {body ? <T size={13} lh={19} sub align="center">{body}</T> : null}
      {cta && onCta ? <Btn label={cta} onPress={onCta} h={48} style={{ alignSelf: 'stretch', marginTop: 12 }} /> : null}
    </Card>
  );
}

/** 여행이 없을 때 화면 전체 대체 (탭 화면은 tab+title, 하위 화면은 header) */
export function NoTripPage({ title, tab, text = '여행을 먼저 추가해 주세요', body = '여행을 만들거나 초대 코드로 합류하면 이 화면이 채워져요.' }: { title: string; tab?: boolean; text?: string; body?: string }) {
  const go = useGo();
  return (
    <Page tab={tab} gap={12}>
      {tab ? <View style={{ paddingTop: 20 }}><TabTitle title={title} /></View> : <Header title={title} />}
      <EmptyCard title={text} body={body} cta="여행 추가" onCta={() => go('/trip/new')} />
    </Page>
  );
}
