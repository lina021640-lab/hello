/** 장소 상세 더미 데이터 (저장·공유 피드 공용). 이름으로 조회한다. */
export type PlaceTip = { who: string; name: string; text: string };
export type PlaceDetail = {
  n: string; en: string; cat: string; city: string; rating: string; reviews: string; open: string;
  addr: string; hours: string; site: string; desc: string; tips: PlaceTip[]; e: string;
};

const P = (d: PlaceDetail) => d;
export const PLACES: Record<string, PlaceDetail> = {
  '버러 마켓': P({ n: '버러 마켓', en: 'Borough Market', cat: '시장', city: '런던', rating: '★ 4.6', reviews: '12,480', open: '영업 중', e: '🥐',
    addr: '8 Southwark St, London SE1 9AL', hours: '10:00–17:00 · 월요일 휴무', site: 'boroughmarket.org.uk',
    desc: '런던 브리지 옆에 있는 1,000년 역사의 식료품 시장이에요. 치즈, 빵, 길거리 음식 노점이 모여 있어 점심 한 끼 해결하기 좋아요.',
    tips: [{ who: '민', name: '민수', text: '평일 오전이 한가해요' }, { who: '지', name: '지연', text: '현금 가져가세요, 일부 가게는 카드 안 돼요' }] }),
  '에펠탑 전망대': P({ n: '에펠탑 전망대', en: 'Eiffel Tower Summit', cat: '명소', city: '파리', rating: '★ 4.7', reviews: '98,230', open: '영업 중', e: '🗼',
    addr: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris', hours: '09:30–23:00 · 연중무휴', site: 'toureiffel.paris',
    desc: '파리의 상징인 에펠탑 꼭대기 전망대예요. 센 강과 시내 전체가 한눈에 보이고, 일몰과 야경 시간대가 특히 인기예요.',
    tips: [{ who: '지', name: '지연', text: '일몰 30분 전에 올라가세요' }, { who: '민', name: '민수', text: '예약 없으면 대기가 1시간 넘어요' }] }),
  'Dishoom': P({ n: 'Dishoom', en: 'Dishoom Covent Garden', cat: '맛집', city: '런던', rating: '★ 4.7', reviews: '21,904', open: '영업 중', e: '🍺',
    addr: "12 Upper St Martin's Ln, London WC2H 9FB", hours: '08:00–23:00 · 연중무휴', site: 'dishoom.com',
    desc: '봄베이 카페 분위기의 인도 레스토랑이에요. 하우스 블랙 달과 베이컨 난 롤이 대표 메뉴예요.',
    tips: [{ who: '민', name: '민수', text: '저녁엔 웨이팅이 길어요' }, { who: '지', name: '지연', text: '아침 메뉴가 의외로 좋아요' }] }),
  'Café de Flore': P({ n: 'Café de Flore', en: 'Café de Flore', cat: '카페', city: '파리', rating: '★ 4.3', reviews: '14,512', open: '영업 중', e: '☕',
    addr: '172 Bd Saint-Germain, 75006 Paris', hours: '07:30–01:30 · 연중무휴', site: 'cafedeflore.fr',
    desc: '생제르맹 거리에 있는 1887년 개업한 파리의 대표 카페예요. 예술가와 작가들이 즐겨 찾던 곳이에요.',
    tips: [{ who: '지', name: '지연', text: '테라스 자리가 좋아요' }, { who: '민', name: '민수', text: '가격은 조금 비싸요' }] }),
  '두오모 쿠폴라': P({ n: '두오모 쿠폴라', en: 'Cupola del Brunelleschi', cat: '명소', city: '피렌체', rating: '★ 4.8', reviews: '35,771', open: '영업 중', e: '🏛️',
    addr: 'Piazza del Duomo, 50122 Firenze', hours: '08:15–19:00 · 일요일 휴무', site: 'duomo.firenze.it',
    desc: '피렌체 대성당의 돔 꼭대기예요. 463개의 계단을 올라가면 붉은 지붕의 피렌체 시내가 펼쳐져요.',
    tips: [{ who: '민', name: '민수', text: '아침 일찍 예약하세요' }, { who: '지', name: '지연', text: '계단이 좁으니 편한 신발을 신으세요' }] }),
  'Monmouth Coffee': P({ n: 'Monmouth Coffee', en: 'Monmouth Coffee Company', cat: '카페', city: '런던', rating: '★ 4.6', reviews: '5,120', open: '영업 중', e: '☕',
    addr: '2 Park St, London SE1 9AB', hours: '07:30–18:00 · 일요일 휴무', site: 'monmouthcoffee.co.uk',
    desc: '버러 마켓 바로 옆의 스페셜티 로스터리 카페예요. 갓 볶은 원두와 페이스트리가 인기예요.',
    tips: [{ who: '나', name: '나', text: '오전 일찍 가면 줄이 짧아요' }] }),
  '하이드 파크': P({ n: '하이드 파크', en: 'Hyde Park', cat: '공원', city: '런던', rating: '★ 4.6', reviews: '110,320', open: '영업 중', e: '🌳',
    addr: 'London W2 2UH', hours: '05:00–24:00 · 연중무휴', site: 'royalparks.org.uk',
    desc: '런던 중심부의 대형 왕립 공원이에요. 서펜타인 호수에서 보트를 타거나 잔디밭에서 산책하기 좋아요.',
    tips: [{ who: '지', name: '지연', text: '날씨 좋은 날 피크닉 추천해요' }] }),
  'Camden Market': P({ n: 'Camden Market', en: 'Camden Market', cat: '쇼핑', city: '런던', rating: '★ 4.4', reviews: '48,090', open: '영업 중', e: '🛍️',
    addr: 'Camden Lock Pl, London NW1 8AF', hours: '10:00–18:00 · 연중무휴', site: 'camdenmarket.com',
    desc: '빈티지 의류, 수공예품, 세계 각국의 길거리 음식이 모인 런던의 대표 마켓이에요.',
    tips: [{ who: '민', name: '민수', text: '주말은 많이 붐벼요' }] }),
  '내셔널 갤러리': P({ n: '내셔널 갤러리', en: 'The National Gallery', cat: '명소', city: '런던', rating: '★ 4.8', reviews: '75,300', open: '영업 중', e: '🖼️',
    addr: 'Trafalgar Square, London WC2N 5DN', hours: '10:00–18:00 · 연중무휴', site: 'nationalgallery.org.uk',
    desc: '트라팔가 광장에 있는 미술관으로, 고흐의 해바라기 등 유럽 회화 명작을 무료로 볼 수 있어요.',
    tips: [{ who: '지', name: '지연', text: '금요일은 밤 9시까지 열어요' }] }),
};

/** 이름으로 조회 (없으면 일반 틀로 대체) */
export function getPlace(name?: string): PlaceDetail {
  if (name && PLACES[name]) return PLACES[name];
  const n = name || '버러 마켓';
  return { n, en: n, cat: '장소', city: '', rating: '★ 4.5', reviews: '1,000', open: '영업 중', e: '📍',
    addr: n, hours: '정보 없음', site: '', desc: '친구들이 공유한 장소예요. 자세한 정보는 구글맵에서 확인해 보세요.', tips: [] };
}
