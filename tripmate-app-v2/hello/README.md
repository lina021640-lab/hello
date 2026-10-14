# 트립메이트 (가칭) — Expo UI 프로토타입

Figma 디자인(Glassmorphism v2, 라이트/다크)을 React Native + Expo(expo-router)로 옮긴 **UI 전용** 프로토타입입니다.
백엔드 없이 `src/data/dummy.ts` 의 더미 데이터로 동작합니다.

## 실행
```bash
npm install
npx expo start        # 폰의 Expo Go 앱으로 QR 스캔
npx expo start --web  # 브라우저 미리보기
```

## 구조
- `app/` 화면(파일 기반 라우팅): `auth/` 인증, `(tabs)/` 하단 탭(저장·공유, 꿀팁, 홈, 일정, 지갑), `trip/`, `schedule/`, `wallet/`, `saved/`, `report/`, `tips/[id]`, `my`, `chatbot`
- `src/theme` 디자인 토큰(라이트/다크) + 테마 전환
- `src/components` 공통 UI(Screen, Card, Chip, Btn, Seg, Field, Photo …), 도트 세계지도, 지도 플레이스홀더
- `src/data/dummy.ts` 더미 데이터

## 다음 단계
지도(react-native-maps), 날씨(WeatherKit), 인증/DB(Firebase 또는 Supabase), Paperlogy 폰트 적용, 홈 지도 국가 하이라이트용 일러스트 교체.
