export const trips = [
  { id: 'lon', city: '런던', country: '영국', flag: '🇬🇧', range: '10.21 – 10.28', dday: 'D-7', days: 8, members: ['나', '민지', '준호'] },
  { id: 'tyo', city: '도쿄', country: '일본', flag: '🇯🇵', range: '12.05 – 12.09', dday: 'D-52', days: 5, members: ['나', '서연'] },
  { id: 'bcn', city: '바르셀로나', country: '스페인', flag: '🇪🇸', range: '2027.02.10 – 02.17', dday: 'D-119', days: 8, members: ['나'] },
];

export const schedule = [
  { time: '09:00', title: '브런치 · Dishoom', cat: '🍽', place: 'Covent Garden', color: '#ff9f0a' },
  { time: '11:30', title: '대영박물관', cat: '🏛', place: 'Bloomsbury', color: '#1e6fff' },
  { time: '14:30', title: '코벤트 가든 산책', cat: '🚶', place: 'Covent Garden', color: '#34c759' },
  { time: '18:00', title: '웨스트엔드 뮤지컬', cat: '🎭', place: 'Soho', color: '#af52de' },
];

export const flights = [
  { from: 'ICN', to: 'LHR', dep: '10.21 10:30', arr: '10.21 15:55', dur: '15시간 25분', no: 'KE907' },
  { from: 'LHR', to: 'ICN', dep: '10.28 13:10', arr: '10.29 08:30', dur: '11시간 20분 (+1일)', no: 'KE908' },
];

export const places = [
  { id: 'p1', name: 'Dishoom Covent Garden', cat: '🍽 맛집', emoji: '🍛', folder: '런던 맛집', color: '#ff9f0a', addr: '12 Upper St Martin\'s Ln' },
  { id: 'p2', name: '대영박물관', cat: '🏛 관광', emoji: '🏛', folder: '런던 관광', color: '#1e6fff', addr: 'Great Russell St' },
  { id: 'p3', name: 'Borough Market', cat: '🍽 시장', emoji: '🥖', folder: '런던 맛집', color: '#ff9f0a', addr: '8 Southwark St' },
  { id: 'p4', name: 'Sky Garden', cat: '🌇 전망', emoji: '🌇', folder: '런던 관광', color: '#1e6fff', addr: '20 Fenchurch St' },
  { id: 'p5', name: 'Camden Market', cat: '🛍 쇼핑', emoji: '🛍', folder: '쇼핑', color: '#ff2d55', addr: 'Camden Lock Pl' },
];
export const folders = [
  { id: 'f1', name: '런던 맛집', emoji: '🍽', count: 12, color: '#ff9f0a' },
  { id: 'f2', name: '런던 관광', emoji: '🏛', count: 8, color: '#1e6fff' },
  { id: 'f3', name: '쇼핑', emoji: '🛍', count: 5, color: '#ff2d55' },
  { id: 'f4', name: '카페', emoji: '☕', count: 9, color: '#a2845e' },
];

export const feed = [
  { id: 'd1', user: '하늘', place: 'Sky Garden', city: '런던', note: '무료 전망대! 예약은 3주 전부터 열려요. 해질녘 추천.', likes: 128, emoji: '🌇' },
  { id: 'd2', user: '민준', place: 'Borough Market', city: '런던', note: '점심 시간 피하면 한산해요. 굴이랑 치즈 토스트 꼭!', likes: 86, emoji: '🥖' },
  { id: 'd3', user: '수아', place: 'Dishoom', city: '런던', note: '웨이팅 길지만 아침 메뉴가 진짜 맛있음.', likes: 64, emoji: '🍛' },
];

export const friends = [
  { name: '나', color: '#1e6fff', blocks: [{ s: 9, e: 12, c: '🍽' }, { s: 14, e: 18, c: '🏛' }, { s: 19, e: 22, c: '🎭' }] },
  { name: '민지', color: '#ff2d55', blocks: [{ s: 8, e: 11, c: '☕' }, { s: 13, e: 17, c: '🛍' }] },
  { name: '준호', color: '#34c759', blocks: [{ s: 10, e: 14, c: '🏛' }, { s: 18, e: 21, c: '🍽' }] },
];

export const expenses = [
  { id: 'e1', title: '히드로 익스프레스', cat: '🚆', krw: 35200, gbp: 25, who: '나', date: '10.21' },
  { id: 'e2', title: 'Dishoom 브런치', cat: '🍽', krw: 52800, gbp: 38, who: '민지', date: '10.22' },
  { id: 'e3', title: '대영박물관 기념품', cat: '🛍', krw: 27800, gbp: 20, who: '준호', date: '10.22' },
  { id: 'e4', title: '뮤지컬 티켓', cat: '🎭', krw: 208500, gbp: 150, who: '나', date: '10.23' },
];
export const countrySpend = [
  { flag: '🇬🇧', name: '영국', krw: 324300, pct: 0.78 },
  { flag: '🇯🇵', name: '일본', krw: 91000, pct: 0.22 },
];

export const hourly = Array.from({ length: 24 }, (_, i) => {
  const h = (6 + i) % 24;
  const temp = Math.round(8 + 6 * Math.sin(((h - 8) / 24) * Math.PI * 2));
  return { h, label: `${h}시`, temp, icon: h >= 6 && h < 18 ? (h % 5 === 0 ? '🌦' : '⛅') : '🌙' };
});
export const daily = [
  { d: '오늘', icon: '⛅', lo: 8, hi: 14, pop: 20 },
  { d: '내일', icon: '🌦', lo: 7, hi: 12, pop: 60 },
  { d: '목', icon: '☀️', lo: 6, hi: 13, pop: 0 },
  { d: '금', icon: '☁️', lo: 7, hi: 11, pop: 30 },
  { d: '토', icon: '🌧', lo: 8, hi: 10, pop: 80 },
];

export const tipCategories = [
  { id: 'info', emoji: '📋', name: '기본정보' },
  { id: 'transport', emoji: '🚇', name: '교통' },
  { id: 'food', emoji: '🍽', name: '음식' },
  { id: 'lang', emoji: '💬', name: '자주 쓰는 언어' },
  { id: 'currency', emoji: '💷', name: '통화' },
  { id: 'emergency', emoji: '🚨', name: '긴급시' },
  { id: 'culture', emoji: '🎎', name: '문화' },
  { id: 'power', emoji: '🔌', name: '전압·통신' },
  { id: 'manner', emoji: '🤝', name: '매너·팁' },
];

export const tipContent: Record<string, { title: string; items: { k: string; v: string }[] }> = {
  info: { title: '기본정보', items: [{ k: '수도', v: '런던' }, { k: '언어', v: '영어' }, { k: '시차', v: '한국 −9시간 (서머타임 −8시간)' }, { k: '비자', v: '무비자 6개월 (ETA 필요)' }, { k: '인구', v: '약 6,700만 명' }] },
  transport: { title: '교통', items: [{ k: '지하철', v: 'Oyster/컨택리스 카드로 탑승, 일일 요금 상한제' }, { k: '버스', v: '현금 불가, 컨택리스만 · 1회 £1.75' }, { k: '택시', v: '블랙캐브 · Uber / Bolt 이용 가능' }, { k: '공항 이동', v: '히드로 익스프레스 15분 (£25)' }] },
  food: { title: '음식', items: [{ k: '대표 음식', v: '피시 앤 칩스, 선데이 로스트, 풀 잉글리시 브렉퍼스트' }, { k: '식사 예절', v: '식당 입장 후 안내를 기다리기' }, { k: '물', v: '수돗물 음용 가능, 요청 시 무료' }, { k: '예산', v: '한 끼 £12–25' }] },
  lang: { title: '자주 쓰는 언어', items: [{ k: '안녕하세요', v: 'Hello / Hi' }, { k: '감사합니다', v: 'Thank you / Cheers' }, { k: '얼마예요?', v: 'How much is it?' }, { k: '화장실 어디예요?', v: 'Where is the toilet?' }, { k: '도와주세요', v: 'Could you help me?' }] },
  currency: { title: '통화', items: [{ k: '통화', v: '파운드 스털링 (GBP, £)' }, { k: '환율 예시', v: '£1 ≈ 1,390원' }, { k: '카드', v: '컨택리스 거의 모든 곳 사용 가능' }, { k: '환전', v: '현금은 소액만 준비 추천' }] },
  emergency: { title: '긴급시', items: [{ k: '경찰·구급·소방', v: '999 / 112' }, { k: '비응급 경찰', v: '101' }, { k: '주영 한국대사관', v: '+44 20 7227 5500' }, { k: '여행자 보험', v: '증서 사진을 미리 저장해 두세요' }] },
  culture: { title: '문화', items: [{ k: '줄서기', v: '줄을 서는 문화, 새치기는 큰 실례' }, { k: '펍', v: '바에서 직접 주문하고 결제' }, { k: '에스컬레이터', v: '오른쪽에 서고 왼쪽은 비워 두기' }] },
  power: { title: '전압·통신', items: [{ k: '전압', v: '230V / 50Hz' }, { k: '플러그', v: 'G타입 (3핀) 어댑터 필수' }, { k: '유심', v: 'eSIM 추천 · 로밍 대비 저렴' }, { k: '와이파이', v: '카페·지하철역에서 무료 제공' }] },
  manner: { title: '매너·팁', items: [{ k: '팁', v: '서비스 요금 12.5% 포함 여부 확인' }, { k: '펍', v: '팁은 필수가 아님' }, { k: '택시', v: '10% 정도 또는 금액 올림' }] },
};

export const guidelines = [
  '타인을 비방하거나 혐오를 조장하는 게시물은 삭제될 수 있어요.',
  '개인정보(연락처, 숙소 주소 등)를 공개하지 마세요.',
  '광고·홍보성 게시물은 신고 대상입니다.',
  '허위 정보로 다른 여행자에게 피해를 주지 마세요.',
];
