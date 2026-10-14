/** 번들 도시 데이터(약 150개) + 검색/연관 도시 도우미. 네트워크 없이 동작. */
export type City = {
  ko: string; en: string; country: string; cc: string; tz: string; cur: string; lat: number; lng: number; alias: string[];
};

// cc → [나라(한글), 통화, 기본 시간대]
const CC: Record<string, [string, string, string]> = {
  KR: ['대한민국', 'KRW', 'Asia/Seoul'], JP: ['일본', 'JPY', 'Asia/Tokyo'], CN: ['중국', 'CNY', 'Asia/Shanghai'],
  TW: ['대만', 'TWD', 'Asia/Taipei'], HK: ['홍콩', 'HKD', 'Asia/Hong_Kong'], MO: ['마카오', 'MOP', 'Asia/Macau'],
  TH: ['태국', 'THB', 'Asia/Bangkok'], VN: ['베트남', 'VND', 'Asia/Ho_Chi_Minh'], SG: ['싱가포르', 'SGD', 'Asia/Singapore'],
  MY: ['말레이시아', 'MYR', 'Asia/Kuala_Lumpur'], ID: ['인도네시아', 'IDR', 'Asia/Jakarta'], PH: ['필리핀', 'PHP', 'Asia/Manila'],
  KH: ['캄보디아', 'KHR', 'Asia/Phnom_Penh'], LA: ['라오스', 'LAK', 'Asia/Vientiane'], IN: ['인도', 'INR', 'Asia/Kolkata'],
  NP: ['네팔', 'NPR', 'Asia/Kathmandu'], LK: ['스리랑카', 'LKR', 'Asia/Colombo'], MV: ['몰디브', 'MVR', 'Indian/Maldives'],
  MN: ['몽골', 'MNT', 'Asia/Ulaanbaatar'], UZ: ['우즈베키스탄', 'UZS', 'Asia/Tashkent'],
  AE: ['아랍에미리트', 'AED', 'Asia/Dubai'], QA: ['카타르', 'QAR', 'Asia/Qatar'], TR: ['튀르키예', 'TRY', 'Europe/Istanbul'],
  IL: ['이스라엘', 'ILS', 'Asia/Jerusalem'], JO: ['요르단', 'JOD', 'Asia/Amman'], EG: ['이집트', 'EGP', 'Africa/Cairo'],
  MA: ['모로코', 'MAD', 'Africa/Casablanca'], ZA: ['남아프리카공화국', 'ZAR', 'Africa/Johannesburg'], KE: ['케냐', 'KES', 'Africa/Nairobi'],
  GB: ['영국', 'GBP', 'Europe/London'], IE: ['아일랜드', 'EUR', 'Europe/Dublin'], FR: ['프랑스', 'EUR', 'Europe/Paris'],
  IT: ['이탈리아', 'EUR', 'Europe/Rome'], ES: ['스페인', 'EUR', 'Europe/Madrid'], DE: ['독일', 'EUR', 'Europe/Berlin'],
  NL: ['네덜란드', 'EUR', 'Europe/Amsterdam'], BE: ['벨기에', 'EUR', 'Europe/Brussels'], PT: ['포르투갈', 'EUR', 'Europe/Lisbon'],
  AT: ['오스트리아', 'EUR', 'Europe/Vienna'], CH: ['스위스', 'CHF', 'Europe/Zurich'], CZ: ['체코', 'CZK', 'Europe/Prague'],
  HU: ['헝가리', 'HUF', 'Europe/Budapest'], PL: ['폴란드', 'PLN', 'Europe/Warsaw'], GR: ['그리스', 'EUR', 'Europe/Athens'],
  HR: ['크로아티아', 'EUR', 'Europe/Zagreb'], DK: ['덴마크', 'DKK', 'Europe/Copenhagen'], SE: ['스웨덴', 'SEK', 'Europe/Stockholm'],
  NO: ['노르웨이', 'NOK', 'Europe/Oslo'], FI: ['핀란드', 'EUR', 'Europe/Helsinki'], IS: ['아이슬란드', 'ISK', 'Atlantic/Reykjavik'],
  RU: ['러시아', 'RUB', 'Europe/Moscow'], US: ['미국', 'USD', 'America/New_York'], CA: ['캐나다', 'CAD', 'America/Toronto'],
  MX: ['멕시코', 'MXN', 'America/Mexico_City'], BR: ['브라질', 'BRL', 'America/Sao_Paulo'], AR: ['아르헨티나', 'ARS', 'America/Argentina/Buenos_Aires'],
  PE: ['페루', 'PEN', 'America/Lima'], CL: ['칠레', 'CLP', 'America/Santiago'], CO: ['콜롬비아', 'COP', 'America/Bogota'],
  AU: ['호주', 'AUD', 'Australia/Sydney'], NZ: ['뉴질랜드', 'NZD', 'Pacific/Auckland'], FJ: ['피지', 'FJD', 'Pacific/Fiji'],
  GU: ['괌', 'USD', 'Pacific/Guam'], MP: ['북마리아나제도', 'USD', 'Pacific/Saipan'],
};

// 한글|영문|cc|lat|lng|tz(선택)|별칭,별칭(선택)  — 같은 나라 안에서는 인기순
const RAW = `
서울|Seoul|KR|37.57|126.98
부산|Busan|KR|35.18|129.08
제주|Jeju|KR|33.5|126.53|
경주|Gyeongju|KR|35.86|129.22
강릉|Gangneung|KR|37.75|128.88
전주|Jeonju|KR|35.82|127.15
여수|Yeosu|KR|34.76|127.66
인천|Incheon|KR|37.46|126.7
도쿄|Tokyo|JP|35.68|139.69||동경
오사카|Osaka|JP|34.69|135.5
교토|Kyoto|JP|35.01|135.77
후쿠오카|Fukuoka|JP|33.59|130.4
삿포로|Sapporo|JP|43.06|141.35
오키나와|Okinawa|JP|26.21|127.68||나하
나고야|Nagoya|JP|35.18|136.91
나라|Nara|JP|34.69|135.8
히로시마|Hiroshima|JP|34.39|132.46
고베|Kobe|JP|34.69|135.2
가나자와|Kanazawa|JP|36.56|136.66
하코네|Hakone|JP|35.23|139.1
요코하마|Yokohama|JP|35.44|139.64
방콕|Bangkok|TH|13.76|100.5
치앙마이|Chiang Mai|TH|18.79|98.98
푸켓|Phuket|TH|7.88|98.39||푸껫
파타야|Pattaya|TH|12.93|100.88
코사무이|Koh Samui|TH|9.51|100.01
크라비|Krabi|TH|8.09|98.91
하노이|Hanoi|VN|21.03|105.85
다낭|Da Nang|VN|16.05|108.2
호치민|Ho Chi Minh City|VN|10.82|106.63||사이공
나트랑|Nha Trang|VN|12.24|109.19||냐짱
푸꾸옥|Phu Quoc|VN|10.29|103.98
호이안|Hoi An|VN|15.88|108.34
달랏|Da Lat|VN|11.94|108.44
싱가포르|Singapore|SG|1.35|103.82
쿠알라룸푸르|Kuala Lumpur|MY|3.14|101.69
코타키나발루|Kota Kinabalu|MY|5.98|116.07
페낭|Penang|MY|5.41|100.33
랑카위|Langkawi|MY|6.35|99.8
발리|Bali|ID|-8.41|115.19|Asia/Makassar|덴파사르
자카르타|Jakarta|ID|-6.21|106.85
세부|Cebu|PH|10.32|123.89
보라카이|Boracay|PH|11.97|121.92
마닐라|Manila|PH|14.6|120.98
보홀|Bohol|PH|9.85|124.14
시엠립|Siem Reap|KH|13.36|103.86
프놈펜|Phnom Penh|KH|11.56|104.93
루앙프라방|Luang Prabang|LA|19.89|102.13
비엔티안|Vientiane|LA|17.97|102.6
타이베이|Taipei|TW|25.03|121.57||타이페이
타이중|Taichung|TW|24.15|120.67
가오슝|Kaohsiung|TW|22.63|120.3
홍콩|Hong Kong|HK|22.32|114.17
마카오|Macau|MO|22.2|113.54
상하이|Shanghai|CN|31.23|121.47
베이징|Beijing|CN|39.9|116.41||북경
청두|Chengdu|CN|30.57|104.07
시안|Xi'an|CN|34.34|108.94
광저우|Guangzhou|CN|23.13|113.26
칭다오|Qingdao|CN|36.07|120.38
장가계|Zhangjiajie|CN|29.12|110.48
델리|Delhi|IN|28.61|77.21
뭄바이|Mumbai|IN|19.08|72.88
자이푸르|Jaipur|IN|26.91|75.79
아그라|Agra|IN|27.18|78.02
카트만두|Kathmandu|NP|27.72|85.32
콜롬보|Colombo|LK|6.93|79.86
말레|Male|MV|4.18|73.51
울란바토르|Ulaanbaatar|MN|47.89|106.91
사마르칸트|Samarkand|UZ|39.65|66.96
두바이|Dubai|AE|25.2|55.27
아부다비|Abu Dhabi|AE|24.45|54.38
도하|Doha|QA|25.29|51.53
이스탄불|Istanbul|TR|41.01|28.98
카파도키아|Cappadocia|TR|38.64|34.83
안탈리아|Antalya|TR|36.9|30.69
텔아비브|Tel Aviv|IL|32.09|34.78
예루살렘|Jerusalem|IL|31.77|35.21
암만|Amman|JO|31.95|35.93
페트라|Petra|JO|30.33|35.44
카이로|Cairo|EG|30.04|31.24
마라케시|Marrakech|MA|31.63|-8.0
카사블랑카|Casablanca|MA|33.57|-7.59
케이프타운|Cape Town|ZA|-33.92|18.42
나이로비|Nairobi|KE|-1.29|36.82
런던|London|GB|51.51|-0.13
에든버러|Edinburgh|GB|55.95|-3.19
맨체스터|Manchester|GB|53.48|-2.24
옥스퍼드|Oxford|GB|51.75|-1.26
더블린|Dublin|IE|53.35|-6.26
파리|Paris|FR|48.86|2.35
니스|Nice|FR|43.7|7.26
마르세유|Marseille|FR|43.3|5.37
리옹|Lyon|FR|45.76|4.84
스트라스부르|Strasbourg|FR|48.57|7.75
보르도|Bordeaux|FR|44.84|-0.58
로마|Rome|IT|41.9|12.5
피렌체|Florence|IT|43.77|11.26||피렌째,플로렌스
베니스|Venice|IT|45.44|12.32||베네치아
밀라노|Milan|IT|45.46|9.19
나폴리|Naples|IT|40.85|14.27
베로나|Verona|IT|45.44|10.99
볼로냐|Bologna|IT|44.49|11.34
시칠리아|Sicily|IT|37.6|14.02||팔레르모
소렌토|Sorrento|IT|40.63|14.38
바르셀로나|Barcelona|ES|41.39|2.17
마드리드|Madrid|ES|40.42|-3.7
세비야|Seville|ES|37.39|-5.98
그라나다|Granada|ES|37.18|-3.6
발렌시아|Valencia|ES|39.47|-0.38
말라가|Malaga|ES|36.72|-4.42
베를린|Berlin|DE|52.52|13.4
뮌헨|Munich|DE|48.14|11.58
프랑크푸르트|Frankfurt|DE|50.11|8.68
함부르크|Hamburg|DE|53.55|9.99||함부르그
쾰른|Cologne|DE|50.94|6.96
하이델베르크|Heidelberg|DE|49.4|8.67
암스테르담|Amsterdam|NL|52.37|4.9
로테르담|Rotterdam|NL|51.92|4.48
브뤼셀|Brussels|BE|50.85|4.35
브뤼헤|Bruges|BE|51.21|3.22
리스본|Lisbon|PT|38.72|-9.14
포르투|Porto|PT|41.16|-8.63
비엔나|Vienna|AT|48.21|16.37||빈
잘츠부르크|Salzburg|AT|47.81|13.04
할슈타트|Hallstatt|AT|47.56|13.65
인스브루크|Innsbruck|AT|47.26|11.39
취리히|Zurich|CH|47.38|8.54
인터라켄|Interlaken|CH|46.69|7.86
루체른|Lucerne|CH|47.05|8.31
제네바|Geneva|CH|46.2|6.14
체르마트|Zermatt|CH|46.02|7.75
프라하|Prague|CZ|50.08|14.44
체스키크룸로프|Cesky Krumlov|CZ|48.81|14.32
부다페스트|Budapest|HU|47.5|19.04
바르샤바|Warsaw|PL|52.23|21.01
크라쿠프|Krakow|PL|50.06|19.94
아테네|Athens|GR|37.98|23.73
산토리니|Santorini|GR|36.39|25.46
크레타|Crete|GR|35.34|25.14
두브로브니크|Dubrovnik|HR|42.65|18.09
자그레브|Zagreb|HR|45.81|15.98
스플리트|Split|HR|43.51|16.44
코펜하겐|Copenhagen|DK|55.68|12.57
스톡홀름|Stockholm|SE|59.33|18.07
오슬로|Oslo|NO|59.91|10.75
베르겐|Bergen|NO|60.39|5.32
헬싱키|Helsinki|FI|60.17|24.94
로바니에미|Rovaniemi|FI|66.5|25.73
레이캬비크|Reykjavik|IS|64.15|-21.94
모스크바|Moscow|RU|55.76|37.62
상트페테르부르크|Saint Petersburg|RU|59.93|30.34
뉴욕|New York|US|40.71|-74.01||맨해튼
로스앤젤레스|Los Angeles|US|34.05|-118.24|America/Los_Angeles|엘에이,LA
샌프란시스코|San Francisco|US|37.77|-122.42|America/Los_Angeles
라스베이거스|Las Vegas|US|36.17|-115.14|America/Los_Angeles
시애틀|Seattle|US|47.61|-122.33|America/Los_Angeles
시카고|Chicago|US|41.88|-87.63|America/Chicago
워싱턴DC|Washington D.C.|US|38.91|-77.04||워싱턴
보스턴|Boston|US|42.36|-71.06
마이애미|Miami|US|25.76|-80.19
올랜도|Orlando|US|28.54|-81.38
하와이|Hawaii|US|21.31|-157.86|Pacific/Honolulu|호놀룰루,와이키키
샌디에이고|San Diego|US|32.72|-117.16|America/Los_Angeles
뉴올리언스|New Orleans|US|29.95|-90.07|America/Chicago
밴쿠버|Vancouver|CA|49.28|-123.12|America/Vancouver
토론토|Toronto|CA|43.65|-79.38
몬트리올|Montreal|CA|45.5|-73.57
퀘벡|Quebec City|CA|46.81|-71.21
밴프|Banff|CA|51.18|-115.57|America/Edmonton
멕시코시티|Mexico City|MX|19.43|-99.13
칸쿤|Cancun|MX|21.16|-86.85|America/Cancun
리우데자네이루|Rio de Janeiro|BR|-22.91|-43.17||리우
상파울루|Sao Paulo|BR|-23.55|-46.63
부에노스아이레스|Buenos Aires|AR|-34.6|-58.38
리마|Lima|PE|-12.05|-77.04
쿠스코|Cusco|PE|-13.53|-71.97
산티아고|Santiago|CL|-33.45|-70.67
보고타|Bogota|CO|4.71|-74.07
시드니|Sydney|AU|-33.87|151.21
멜버른|Melbourne|AU|-37.81|144.96|Australia/Melbourne
브리즈번|Brisbane|AU|-27.47|153.03|Australia/Brisbane
골드코스트|Gold Coast|AU|-28.02|153.4|Australia/Brisbane
케언즈|Cairns|AU|-16.92|145.77|Australia/Brisbane
퍼스|Perth|AU|-31.95|115.86|Australia/Perth
오클랜드|Auckland|NZ|-36.85|174.76
퀸스타운|Queenstown|NZ|-45.03|168.66
크라이스트처치|Christchurch|NZ|-43.53|172.64
난디|Nadi|FJ|-17.8|177.42
괌|Guam|GU|13.44|144.79
사이판|Saipan|MP|15.18|145.75
`;

export const CITIES: City[] = RAW.trim().split('\n').map((line) => {
  const [ko, en, cc, lat, lng, tz, alias] = line.split('|');
  const [country, cur, dtz] = CC[cc];
  return { ko, en, country, cc, tz: tz || dtz, cur, lat: +lat, lng: +lng, alias: alias ? alias.split(',') : [] };
});

/** ISO 코드 → 국기 이모지 */
export const flag = (cc: string) => cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
/** 화면 표기용 국가 코드 (Figma 는 GB 대신 UK) */
export const ccLabel = (cc: string) => (cc === 'GB' ? 'UK' : cc);

export const cityByKo = (ko: string) => CITIES.find((c) => c.ko === ko);

// ───── 검색 ─────
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const choseong = (s: string) => Array.from(s).map((ch) => {
  const c = ch.charCodeAt(0) - 0xac00;
  return c >= 0 && c < 11172 ? CHO[Math.floor(c / 588)] : ch;
}).join('');
const norm = (s: string) => s.toLowerCase().replace(/[\s.'\-]/g, '');
const isJamoOnly = (s: string) => s.length > 0 && Array.from(s).every((ch) => CHO.includes(ch));

const INDEX = CITIES.map((c) => ({
  c, names: [c.ko, c.en, ...c.alias].map(norm), country: norm(c.country), cho: choseong(c.ko),
}));

/** 한글/영문 접두·부분 일치, 나라 이름, 초성 검색. 점수 낮을수록 위. */
export function searchCities(query: string, limit = 6): City[] {
  const q = norm(query);
  if (!q) return [];
  const jamo = isJamoOnly(q);
  const out: { c: City; s: number; i: number }[] = [];
  INDEX.forEach((e, i) => {
    let s = 99;
    if (e.names.some((n) => n === q)) s = 0;
    else if (e.names.some((n) => n.startsWith(q))) s = 1;
    else if (jamo && e.cho.startsWith(q)) s = 2;
    else if (e.country.startsWith(q)) s = 3;
    else if (e.names.some((n) => n.includes(q))) s = 4;
    else if (jamo && e.cho.includes(q)) s = 5;
    if (s < 99) out.push({ c: e.c, s, i });
  });
  out.sort((a, b) => a.s - b.s || a.i - b.i);
  return out.slice(0, limit).map((x) => x.c);
}

const dist = (a: City, b: City) => {
  const r = Math.PI / 180; const dLa = (b.lat - a.lat) * r; const dLo = (b.lng - a.lng) * r;
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

/** 연관 도시: 같은 나라 도시 → 가까운(800km 이내) 다른 나라 도시. 이미 담은 도시 제외. */
export function relatedCities(base: City, exclude: string[] = [], limit = 10): City[] {
  const ok = (c: City) => c.ko !== base.ko && !exclude.includes(c.ko);
  const same = CITIES.filter((c) => c.cc === base.cc && ok(c));
  const near = CITIES.filter((c) => c.cc !== base.cc && ok(c) && dist(base, c) < 800).sort((a, b) => dist(base, a) - dist(base, b));
  return [...same, ...near].slice(0, limit);
}
