import { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Icon, PhotoPH, Pill, useTheme } from '../../src/kit';
import { Chip, ActionBtn } from '../../src/screens/saved/parts';
import { getPlace } from '../../src/data/placeData';

const photoOpts = ['자동 (Google 사진)', '내 사진 올리기', '사진 없음'];
const days = ['3일차 · 11/20', '4일차 · 11/21', '5일차'];
const items = [{ time: 'AM 10:00', title: '세인트 폴 대성당' }, { time: 'PM 05:00', title: '타워브리지' }, { time: 'PM 09:00', title: '호텔' }];
const slotLabel = ['맨 앞에 추가', '여기에 추가', '여기에 추가', '맨 뒤에 추가'];
const slotSub = ['첫 장소로 추가돼요 · 예상 AM 08:00', '세인트 폴에서 도보 12분 · 예상 PM 02:00', '타워브리지에서 도보 8분 · 예상 PM 07:00', '호텔 다음 · 예상 PM 10:00'];

export default function AddToSchedule() {
  const r = useRouter(); const { t } = useTheme(); const ins = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const pl = getPlace(name);
  const [photo, setPhoto] = useState(0); const [day, setDay] = useState(0); const [slot, setSlot] = useState(1);
  const dash = 'rgba(138,143,152,0.45)';
  const Slot = ({ i }: { i: number }) => slot === i ? (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: t.accS, borderWidth: 1.5, borderColor: t.acc }}>
      <View style={{ flex: 1 }}>
        <T size={14} w="b" color={t.acc}>{pl.n}</T>
        <T size={11} sub>{slotSub[i]}</T>
      </View>
      <Icon name="check" size={18} color={t.acc} />
    </View>
  ) : (
    <Pressable onPress={() => setSlot(i)} style={{ height: 28, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: dash, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <Icon name="plus" size={12} color={t.sub} />
      <T size={12} sub>{slotLabel[i]}</T>
    </Pressable>
  );
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.42)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: Math.max(ins.top, 37) + 33, bottom: 0, backgroundColor: t.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20, gap: 12, paddingBottom: 52 + 22 + 24 + Math.max(ins.bottom, 0) }}>
          <View style={{ alignItems: 'center' }}><View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.line }} /></View>
          <Row>
            <T size={20} w="b" ls={-2} style={{ flex: 1 }}>장소를 일정에 추가</T>
            <Pill label="유럽여행" trail="down" size={12} py={5} />
          </Row>
          <View style={{ backgroundColor: t.card2, borderRadius: 20, paddingTop: 10, paddingBottom: 12, paddingLeft: 10, paddingRight: 12, gap: 10 }}>
            <Row gap={12}>
              <PhotoPH w={64} h={64} radius={14} iconSize={27} />
              <View style={{ flex: 1, gap: 1 }}>
                <T size={15} w="b">{pl.n}</T>
                <T size={12} sub>{pl.city} · {pl.cat} · {pl.rating.replace('★ ', '★')}</T>
              </View>
            </Row>
            <Row gap={6} style={{ flexWrap: 'wrap' }}>
              {photoOpts.map((x, i) => <Chip key={x} label={x} size={12} py={5} px={10} active={i === photo} onPress={() => setPhoto(i)} trail={i === 1 ? 'camera' : undefined} />)}
            </Row>
            <T size={11} sub>사진은 일정 카드에 표시돼요. 나중에 바꿀 수 있어요.</T>
          </View>
          <View style={{ gap: 6 }}>
            <T size={13} sub>날짜</T>
            <Row gap={8}>{days.map((x, i) => <Chip key={x} label={x} active={i === day} onPress={() => setDay(i)} />)}</Row>
          </View>
          <View style={{ gap: 6 }}>
            <T size={13} sub>어느 장소 사이에 넣을까요?</T>
            <View style={{ gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ gap: 6 }}>
                  <Slot i={i} />
                  <Row gap={10} style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: t.acc, alignItems: 'center', justifyContent: 'center' }}><T size={12} w="b" color="#fff">{i + 1}</T></View>
                    <View style={{ flex: 1 }}>
                      <T size={11} w="b" color={t.acc}>{items[i].time}</T>
                      <T size={14} w="b">{items[i].title}</T>
                    </View>
                  </Row>
                </View>
              ))}
              <Slot i={3} />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(ins.bottom, 22) }}>
        <ActionBtn label={`${days[day].split(' ')[0]}에 추가하기`} size={16} onPress={() => r.back()} />
      </View>
    </View>
  );
}
