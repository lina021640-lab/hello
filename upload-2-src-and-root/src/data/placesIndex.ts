/** 일정 추가 자동완성/추천용 인기 장소 색인(번들, 네트워크 없음) + 내 저장·친구 공유 장소 병합.
 *  - 인기 장소는 예시 큐레이션 데이터(좌표는 대략값). Google Places 연동 전까지의 자리표시.
 *  - 순위: 내 저장 · 친구 공유(티어 0) → 인기(티어 1). 같은 티어 안에서는 선택한 날의 도시 → 여행 도시 → 일치도 → 인기도. */
import type { SavedPlace, FeedPlace } from './savedStore';

export type PlaceSrc = 'saved' | 'shared' | 'popular';
export type PlaceHit = {
  key: string; ko: string; en: string; city: string; cat: string; addr: string; lat: number | null; lng: number | null;
  src: PlaceSrc; badge: '내 저장' | '친구 공유' | '인기'; pop: number;
};

export const SCHED_CATS = ['관광', '식사', '카페', '쇼핑', '이동', '숙소'];
const BADGE = { saved: '내 저장', shared: '친구 공유', popular: '인기' } as const;

// 도시|한글|영문|분류|주소|위도|경도|인기도(1~100)
const RAW = `
런던|타워브리지|Tower Bridge|관광|Tower Bridge Rd, London SE1|51.5055|-0.0754|95
런던|대영박물관|British Museum|관광|Great Russell St, London WC1B|51.5194|-0.1270|93
런던|테이트 모던|Tate Modern|관광|Bankside, London SE1|51.5076|-0.0994|84
런던|버러 마켓|Borough Market|식사|8 Southwark St, London SE1|51.5055|-0.0910|88
런던|몽머스 커피|Monmouth Coffee|카페|2 Park St, London SE1|51.5056|-0.0911|72
런던|더 샤드|The Shard|관광|32 London Bridge St, London SE1|51.5045|-0.0865|82
런던|해러즈 백화점|Harrods|쇼핑|87-135 Brompton Rd, London SW1X|51.4994|-0.1632|78
파리|에펠탑|Eiffel Tower|관광|Champ de Mars, 75007 Paris|48.8584|2.2945|99
파리|루브르 박물관|Louvre Museum|관광|Rue de Rivoli, 75001 Paris|48.8606|2.3376|97
파리|오르세 미술관|Musée d'Orsay|관광|1 Rue de la Légion d'Honneur, 75007 Paris|48.8600|2.3266|86
파리|몽마르트르 언덕|Montmartre|관광|75018 Paris|48.8867|2.3431|85
파리|카페 드 플로르|Café de Flore|카페|172 Bd Saint-Germain, 75006 Paris|48.8541|2.3326|74
파리|르 마레 팔라펠|L'As du Fallafel|식사|34 Rue des Rosiers, 75004 Paris|48.8571|2.3589|66
로마|콜로세움|Colosseum|관광|Piazza del Colosseo, 00184 Roma|41.8902|12.4922|98
로마|트레비 분수|Trevi Fountain|관광|Piazza di Trevi, 00187 Roma|41.9009|12.4833|94
로마|바티칸 박물관|Vatican Museums|관광|Viale Vaticano, 00165 Roma|41.9065|12.4536|92
로마|판테온|Pantheon|관광|Piazza della Rotonda, 00186 Roma|41.8986|12.4769|87
로마|산 에우스타키오 일 카페|Sant'Eustachio Il Caffè|카페|Piazza di S. Eustachio, 82, Roma|41.8981|12.4752|70
로마|다 엔초 알 29|Da Enzo al 29|식사|Via dei Vascellari 29, 00153 Roma|41.8892|12.4745|76
피렌체|두오모 대성당|Duomo di Firenze|관광|Piazza del Duomo, 50122 Firenze|43.7731|11.2560|96
피렌체|우피치 미술관|Uffizi Gallery|관광|Piazzale degli Uffizi, 50122 Firenze|43.7677|11.2553|91
피렌체|미켈란젤로 광장|Piazzale Michelangelo|관광|Piazzale Michelangelo, 50125 Firenze|43.7629|11.2650|84
피렌체|베키오 다리|Ponte Vecchio|관광|Ponte Vecchio, 50125 Firenze|43.7680|11.2531|88
피렌체|메르카토 센트랄레|Mercato Centrale|식사|Piazza del Mercato Centrale, Firenze|43.7767|11.2532|73
베니스|산마르코 광장|Piazza San Marco|관광|Piazza San Marco, 30124 Venezia|45.4340|12.3388|97
베니스|리알토 다리|Rialto Bridge|관광|Ponte di Rialto, 30125 Venezia|45.4380|12.3359|90
베니스|두칼레 궁전|Doge's Palace|관광|Piazza San Marco 1, Venezia|45.4337|12.3402|85
베니스|부라노 섬|Burano|관광|Burano, 30142 Venezia|45.4853|12.4167|82
베니스|카페 플로리안|Caffè Florian|카페|Piazza San Marco 57, Venezia|45.4335|12.3383|71
밀라노|밀라노 두오모|Duomo di Milano|관광|Piazza del Duomo, 20122 Milano|45.4642|9.1916|96
밀라노|갈레리아 비토리오 에마누엘레 2세|Galleria Vittorio Emanuele II|쇼핑|Piazza del Duomo, 20123 Milano|45.4655|9.1900|89
밀라노|최후의 만찬|The Last Supper|관광|Piazza di Santa Maria delle Grazie, Milano|45.4660|9.1708|88
밀라노|스포르체스코 성|Sforza Castle|관광|Piazza Castello, 20121 Milano|45.4705|9.1794|77
밀라노|루이니|Luini Panzerotti|식사|Via Santa Radegonda 16, Milano|45.4651|9.1914|68
바르셀로나|사그라다 파밀리아|Sagrada Família|관광|C/ de Mallorca, 401, Barcelona|41.4036|2.1744|99
바르셀로나|구엘 공원|Park Güell|관광|Carrer d'Olot, Barcelona|41.4145|2.1527|93
바르셀로나|보케리아 시장|La Boqueria|식사|La Rambla, 91, Barcelona|41.3817|2.1719|87
바르셀로나|카사 바트요|Casa Batlló|관광|Pg. de Gràcia, 43, Barcelona|41.3916|2.1649|90
바르셀로나|고딕 지구|Gothic Quarter|관광|Barri Gòtic, Barcelona|41.3833|2.1767|82
마드리드|프라도 미술관|Prado Museum|관광|C. de Ruiz de Alarcón, 23, Madrid|40.4138|-3.6921|91
마드리드|레티로 공원|Retiro Park|관광|Plaza de la Independencia, Madrid|40.4153|-3.6844|88
마드리드|왕궁|Royal Palace of Madrid|관광|C. de Bailén, Madrid|40.4180|-3.7143|86
마드리드|산 미겔 시장|Mercado de San Miguel|식사|Plaza de San Miguel, Madrid|40.4155|-3.7089|82
마드리드|초콜라테리아 산 히네스|Chocolatería San Ginés|카페|Pasadizo de San Ginés, 5, Madrid|40.4168|-3.7066|78
베를린|브란덴부르크 문|Brandenburg Gate|관광|Pariser Platz, 10117 Berlin|52.5163|13.3777|95
베를린|베를린 장벽 기념관|Berlin Wall Memorial|관광|Bernauer Str. 111, 13355 Berlin|52.5352|13.3903|84
베를린|박물관 섬|Museum Island|관광|Museumsinsel, 10178 Berlin|52.5169|13.4019|86
베를린|마우어파크 벼룩시장|Mauerpark Flea Market|쇼핑|Bernauer Str. 63, Berlin|52.5441|13.4023|72
베를린|이스트 사이드 갤러리|East Side Gallery|관광|Mühlenstraße 3-100, Berlin|52.5050|13.4397|88
프라하|카를교|Charles Bridge|관광|Karlův most, 110 00 Praha|50.0865|14.4114|97
프라하|프라하 성|Prague Castle|관광|119 08 Praha 1|50.0910|14.4005|95
프라하|구시가지 광장|Old Town Square|관광|Staroměstské nám., 110 00 Praha|50.0875|14.4213|93
프라하|천문 시계|Prague Astronomical Clock|관광|Staroměstské nám. 1, Praha|50.0870|14.4208|90
프라하|카페 슬라비아|Café Slavia|카페|Smetanovo nábř. 1012/2, Praha|50.0816|14.4141|70
비엔나|쇤브룬 궁전|Schönbrunn Palace|관광|Schönbrunner Schloßstraße 47, Wien|48.1845|16.3122|95
비엔나|성 슈테판 대성당|St. Stephen's Cathedral|관광|Stephansplatz 3, 1010 Wien|48.2087|16.3726|91
비엔나|카페 자허|Café Sacher|카페|Philharmoniker Str. 4, 1010 Wien|48.2038|16.3699|84
비엔나|벨베데레 궁전|Belvedere Palace|관광|Prinz Eugen-Straße 27, Wien|48.1916|16.3809|87
비엔나|나슈마르크트|Naschmarkt|식사|Naschmarkt, 1060 Wien|48.1987|16.3631|78
암스테르담|안네 프랑크의 집|Anne Frank House|관광|Westermarkt 20, 1016 Amsterdam|52.3752|4.8840|93
암스테르담|반 고흐 미술관|Van Gogh Museum|관광|Museumplein 6, Amsterdam|52.3584|4.8811|94
암스테르담|라익스 미술관|Rijksmuseum|관광|Museumstraat 1, Amsterdam|52.3600|4.8852|92
암스테르담|담 광장|Dam Square|관광|Dam, 1012 Amsterdam|52.3731|4.8926|80
암스테르담|보헤미안 카페 드 프로이트|Café de Pijp|카페|Ferdinand Bolstraat, Amsterdam|52.3548|4.8957|62
도쿄|센소지|Senso-ji|관광|2 Chome-3-1 Asakusa, Taito City|35.7148|139.7967|96
도쿄|시부야 스크램블 교차로|Shibuya Crossing|관광|Shibuya, Tokyo|35.6595|139.7005|97
도쿄|도쿄 스카이트리|Tokyo Skytree|관광|1 Chome-1-2 Oshiage, Sumida City|35.7101|139.8107|90
도쿄|츠키지 장외시장|Tsukiji Outer Market|식사|Tsukiji, Chuo City, Tokyo|35.6655|139.7707|90
도쿄|블루보틀 커피 기요스미|Blue Bottle Coffee Kiyosumi|카페|1 Chome-4-8 Hirano, Koto City|35.6819|139.8029|74
도쿄|메이지 신궁|Meiji Jingu|관광|1-1 Yoyogikamizonocho, Shibuya City|35.6764|139.6993|91
도쿄|이치란 라멘 시부야|Ichiran Shibuya|식사|1 Chome-22-7 Jinnan, Shibuya City|35.6618|139.6993|80
오사카|오사카성|Osaka Castle|관광|1-1 Osakajo, Chuo Ward|34.6873|135.5262|93
오사카|도톤보리|Dotonbori|식사|Dotonbori, Chuo Ward, Osaka|34.6687|135.5013|97
오사카|유니버셜 스튜디오 재팬|Universal Studios Japan|관광|2 Chome-1-33 Sakurajima, Konohana Ward|34.6654|135.4323|95
오사카|구로몬 시장|Kuromon Market|식사|2 Chome-4-1 Nipponbashi, Chuo Ward|34.6627|135.5063|85
오사카|신사이바시|Shinsaibashi|쇼핑|Shinsaibashisuji, Chuo Ward, Osaka|34.6724|135.5011|88
교토|후시미 이나리 신사|Fushimi Inari Taisha|관광|68 Fukakusa Yabunouchicho, Fushimi Ward|34.9671|135.7727|98
교토|기요미즈데라|Kiyomizu-dera|관광|1 Chome-294 Kiyomizu, Higashiyama Ward|34.9949|135.7850|96
교토|아라시야마 대나무숲|Arashiyama Bamboo Grove|관광|Sagaogurayama, Ukyo Ward|35.0170|135.6713|94
교토|금각사|Kinkaku-ji|관광|1 Kinkakujicho, Kita Ward|35.0394|135.7292|92
교토|니시키 시장|Nishiki Market|식사|Nishikikoji, Nakagyo Ward, Kyoto|35.0050|135.7649|86
교토|% 아라비카 교토|%Arabica Kyoto Higashiyama|카페|Hoshinocho, Higashiyama Ward, Kyoto|34.9986|135.7807|83
후쿠오카|캐널시티 하카타|Canal City Hakata|쇼핑|1 Chome-2 Sumiyoshi, Hakata Ward|33.5896|130.4112|85
후쿠오카|나카스 포장마차 거리|Nakasu Yatai|식사|Nakasu, Hakata Ward, Fukuoka|33.5922|130.4048|90
후쿠오카|오호리 공원|Ohori Park|관광|1 Ohorikoen, Chuo Ward, Fukuoka|33.5865|130.3763|78
후쿠오카|다자이후 텐만구|Dazaifu Tenmangu|관광|4 Chome-7-1 Zaifu, Dazaifu|33.5215|130.5348|88
후쿠오카|이치란 본점|Ichiran Honsha|식사|5 Chome-3-2 Nakasu, Hakata Ward|33.5933|130.4079|80
삿포로|삿포로 맥주 박물관|Sapporo Beer Museum|관광|9 Chome Kita 7 Jo Higashi, Higashi Ward|43.0711|141.3665|84
삿포로|오도리 공원|Odori Park|관광|Odorinishi, Chuo Ward, Sapporo|43.0600|141.3470|86
삿포로|니조 시장|Nijo Market|식사|Minami 3 Jo Higashi 1, Chuo Ward|43.0575|141.3591|80
삿포로|삿포로 TV 타워|Sapporo TV Tower|관광|1 Chome Odorinishi, Chuo Ward|43.0611|141.3564|78
삿포로|스스키노 라멘 요코초|Ramen Alley Susukino|식사|Minami 5 Jo Nishi 3, Chuo Ward|43.0553|141.3534|82
방콕|왓 아룬|Wat Arun|관광|158 Thanon Wang Doem, Bangkok Yai|13.7437|100.4888|94
방콕|왓 포|Wat Pho|관광|2 Sanamchai Rd, Phra Nakhon|13.7465|100.4927|93
방콕|짜뚜짝 주말시장|Chatuchak Weekend Market|쇼핑|Kamphaeng Phet 2 Rd, Chatuchak|13.7999|100.5503|92
방콕|아이콘시암|ICONSIAM|쇼핑|299 Charoen Nakhon Rd, Khlong San|13.7267|100.5107|85
방콕|팁싸마이 팟타이|Thip Samai Pad Thai|식사|313 Maha Chai Rd, Phra Nakhon|13.7524|100.5043|88
싱가포르|마리나 베이 샌즈|Marina Bay Sands|관광|10 Bayfront Ave, Singapore|1.2834|103.8607|98
싱가포르|가든스 바이 더 베이|Gardens by the Bay|관광|18 Marina Gardens Dr, Singapore|1.2816|103.8636|96
싱가포르|라우 파 삿|Lau Pa Sat|식사|18 Raffles Quay, Singapore|1.2807|103.8504|82
싱가포르|송파 바쿠테|Song Fa Bak Kut Teh|식사|11 New Bridge Rd, Singapore|1.2882|103.8465|80
싱가포르|머라이언 파크|Merlion Park|관광|1 Fullerton Rd, Singapore|1.2868|103.8545|90
홍콩|빅토리아 피크|Victoria Peak|관광|The Peak, Hong Kong|22.2759|114.1455|96
홍콩|심포니 오브 라이트|Symphony of Lights|관광|Tsim Sha Tsui Promenade, Hong Kong|22.2930|114.1741|88
홍콩|팀호완 센트럴|Tim Ho Wan Central|식사|IFC Mall, Central, Hong Kong|22.2850|114.1585|84
홍콩|레이디스 마켓|Ladies' Market|쇼핑|Tung Choi St, Mong Kok, Hong Kong|22.3193|114.1722|82
홍콩|템플 스트리트 야시장|Temple Street Night Market|쇼핑|Temple St, Yau Ma Tei, Hong Kong|22.3098|114.1713|80
타이베이|타이베이 101|Taipei 101|관광|No. 7, Section 5, Xinyi Rd, Taipei|25.0340|121.5645|97
타이베이|지우펀|Jiufen Old Street|관광|Jiufen, Ruifang District|25.1091|121.8450|94
타이베이|스린 야시장|Shilin Night Market|식사|No. 101 Jihe Rd, Shilin, Taipei|25.0879|121.5240|93
타이베이|딘타이펑 신이점|Din Tai Fung Xinyi|식사|No. 194 Xinyi Rd Sec 2, Taipei|25.0335|121.5299|90
타이베이|중정기념당|Chiang Kai-shek Memorial Hall|관광|No. 21 Zhongshan S Rd, Taipei|25.0361|121.5219|82
뉴욕|자유의 여신상|Statue of Liberty|관광|Liberty Island, New York|40.6892|-74.0445|96
뉴욕|센트럴 파크|Central Park|관광|Central Park, New York|40.7829|-73.9654|98
뉴욕|타임스 스퀘어|Times Square|관광|Manhattan, NY 10036|40.7580|-73.9855|97
뉴욕|브루클린 브리지|Brooklyn Bridge|관광|Brooklyn Bridge, New York|40.7061|-73.9969|92
뉴욕|메트로폴리탄 미술관|The Met|관광|1000 5th Ave, New York|40.7794|-73.9632|93
뉴욕|조스 피자|Joe's Pizza|식사|7 Carmine St, New York|40.7306|-74.0021|82
로스앤젤레스|그리피스 천문대|Griffith Observatory|관광|2800 E Observatory Rd, Los Angeles|34.1184|-118.3004|93
로스앤젤레스|산타모니카 피어|Santa Monica Pier|관광|200 Santa Monica Pier, Santa Monica|34.0100|-118.4962|94
로스앤젤레스|할리우드 사인|Hollywood Sign|관광|Hollywood Sign, Los Angeles|34.1341|-118.3215|90
로스앤젤레스|더 그로브|The Grove|쇼핑|189 The Grove Dr, Los Angeles|34.0722|-118.3581|78
로스앤젤레스|인앤아웃 버거|In-N-Out Burger|식사|7009 Sunset Blvd, Los Angeles|34.0981|-118.3441|80
서울|경복궁|Gyeongbokgung Palace|관광|161 Sajik-ro, Jongno-gu, Seoul|37.5796|126.9770|96
서울|N서울타워|N Seoul Tower|관광|105 Namsangongwon-gil, Yongsan-gu|37.5512|126.9882|93
서울|광장시장|Gwangjang Market|식사|88 Changgyeonggung-ro, Jongno-gu|37.5701|126.9998|92
서울|북촌 한옥마을|Bukchon Hanok Village|관광|37 Gyedong-gil, Jongno-gu|37.5826|126.9835|90
서울|성수동 카페거리|Seongsu Cafe Street|카페|Seongsu-dong, Seongdong-gu, Seoul|37.5446|127.0560|85
서울|명동 쇼핑거리|Myeongdong Shopping Street|쇼핑|Myeongdong, Jung-gu, Seoul|37.5636|126.9827|91
부산|해운대 해수욕장|Haeundae Beach|관광|264 Haeundaehaebyeon-ro, Haeundae-gu|35.1587|129.1604|96
부산|감천문화마을|Gamcheon Culture Village|관광|203 Gamnae 2-ro, Saha-gu|35.0975|129.0107|92
부산|자갈치 시장|Jagalchi Market|식사|52 Jagalchihaean-ro, Jung-gu|35.0966|129.0306|90
부산|광안대교|Gwangandaegyo Bridge|관광|Gwangalli Beach, Suyeong-gu|35.1478|129.1304|86
부산|흰여울문화마을|Huinnyeoul Culture Village|관광|Yeongdo-gu, Busan|35.0789|129.0446|80
제주|성산일출봉|Seongsan Ilchulbong|관광|284-12 Ilchul-ro, Seogwipo|33.4580|126.9425|95
제주|한라산 국립공원|Hallasan National Park|관광|Hallasan, Jeju|33.3617|126.5292|91
제주|협재 해수욕장|Hyeopjae Beach|관광|329-10 Hyeopjae-ri, Hallim-eup|33.3940|126.2397|90
제주|동문시장|Dongmun Market|식사|Dongmun-ro, Jeju-si|33.5130|126.5276|84
제주|오설록 티뮤지엄|Osulloc Tea Museum|카페|15 Sinhwayeoksa-ro, Seogwipo|33.3057|126.2894|82
`;

type Pop = { key: string; ko: string; en: string; city: string; cat: string; addr: string; lat: number; lng: number; pop: number };
export const POPULAR: Pop[] = RAW.trim().split('\n').map((line, i) => {
  const [city, ko, en, cat, addr, lat, lng, pop] = line.split('|');
  return { key: `pop${i}`, ko, en, city, cat, addr, lat: +lat, lng: +lng, pop: +pop };
});

const norm = (s: string) => (s || '').toLowerCase().replace(/[\s.'’\-·]/g, '');
export const schedCat = (c: string) => {
  if (SCHED_CATS.includes(c)) return c;
  if (/맛집|식당|음식|레스토랑|식사/.test(c)) return '식사';
  if (/카페|커피/.test(c)) return '카페';
  if (/쇼핑|시장|마트/.test(c)) return '쇼핑';
  if (/숙소|호텔|숙박/.test(c)) return '숙소';
  return '관광';
};

const CITY_KEYS = Array.from(new Set(POPULAR.map((p) => p.city)));
/** 주소/이름 속에서 색인에 있는 도시 이름을 찾는다(없으면 ''). */
const guessCity = (...texts: string[]) => {
  const h = texts.join(' ');
  return CITY_KEYS.find((c) => h.includes(c)) ?? '';
};

export type SearchCtx = {
  saved?: SavedPlace[]; feed?: FeedPlace[];
  /** 선택한 날에 머무는 도시(가장 우선) */ dayCity?: string;
  /** 여행에 포함된 모든 도시 */ tripCities?: string[];
};

function personal(ctx: SearchCtx): PlaceHit[] {
  const out: PlaceHit[] = [];
  (ctx.saved ?? []).forEach((s) => out.push({ key: `s${s.id}`, ko: s.n, en: '', city: guessCity(s.addr, s.n), cat: schedCat(s.cat), addr: s.addr, lat: s.lat, lng: s.lng, src: 'saved', badge: BADGE.saved, pop: 100 }));
  (ctx.feed ?? []).forEach((f) => out.push({ key: `f${f.id}`, ko: f.n, en: f.e && /[A-Za-z]/.test(f.e) ? f.e : '', city: guessCity(f.n, f.q), cat: schedCat(f.cat), addr: '', lat: f.lat, lng: f.lng, src: 'shared', badge: BADGE.shared, pop: 100 + f.likes }));
  return out;
}
const popHit = (p: Pop): PlaceHit => ({ key: p.key, ko: p.ko, en: p.en, city: p.city, cat: p.cat, addr: p.addr, lat: p.lat, lng: p.lng, src: 'popular', badge: BADGE.popular, pop: p.pop });

const cityBoost = (city: string, ctx: SearchCtx) =>
  ctx.dayCity && city === ctx.dayCity ? 2 : ctx.tripCities?.includes(city) ? 1 : 0;

/** 한글/영문 부분 일치 검색. 내 저장·친구 공유가 먼저, 그다음 인기. 같은 이름은 한 번만. */
export function searchPlaces(query: string, ctx: SearchCtx = {}, limit = 8): PlaceHit[] {
  const q = norm(query);
  if (!q) return [];
  const all = [...personal(ctx), ...POPULAR.map(popHit)];
  const seen = new Set<string>();
  const scored: { h: PlaceHit; s: number }[] = [];
  for (const h of all) {
    const names = [norm(h.ko), norm(h.en)];
    const hit = names.some((n) => n && n.includes(q)) || (norm(h.city) === q && h.src === 'popular');
    if (!hit) continue;
    const id = norm(h.ko);
    const dupKey = `${id}`;
    if (seen.has(dupKey)) continue;
    seen.add(dupKey);
    const prefix = names.some((n) => n && n.startsWith(q)) ? 1 : 0;
    const tier = h.src === 'popular' ? 0 : 1;
    scored.push({ h, s: tier * 1e6 + cityBoost(h.city, ctx) * 1e4 + prefix * 1e3 + Math.min(h.pop, 999) });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.h);
}

/** 같은 도시(선택한 날 → 여행 도시 순)의 추천: 내 저장·친구 공유 + 인기 장소. */
export function suggestPlaces(ctx: SearchCtx = {}, limit = 8, exclude: string[] = []): PlaceHit[] {
  const ex = new Set(exclude.map(norm));
  const cities = [ctx.dayCity, ...(ctx.tripCities ?? [])].filter((c, i, a): c is string => !!c && a.indexOf(c) === i);
  const mine = personal(ctx).filter((h) => !cities.length || !h.city || cities.includes(h.city));
  const pops = cities.flatMap((c, ci) => POPULAR.filter((p) => p.city === c).sort((a, b) => b.pop - a.pop).map((p) => ({ h: popHit(p), ci })))
    .sort((a, b) => a.ci - b.ci || b.h.pop - a.h.pop).map((x) => x.h);
  const seen = new Set<string>();
  return [...mine.sort((a, b) => b.pop - a.pop), ...pops].filter((h) => {
    const k = norm(h.ko); if (seen.has(k) || ex.has(k)) return false; seen.add(k); return true;
  }).slice(0, limit);
}
