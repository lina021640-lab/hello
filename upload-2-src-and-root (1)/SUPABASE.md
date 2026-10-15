# Supabase 연결 (로그인 + 여행 + 지갑 + 저장·공유)

## 1. 실행할 것
1. Supabase 대시보드 > **SQL Editor** 에 `supabase/schema.sql` 전체를 붙여넣고 Run (처음 한 번).
2. **Authentication > Sign In / Providers > Email**: 개발 중에는 **Confirm email 을 OFF**.
   - ON 이면 가입 후 세션이 없어서 앱이 "메일로 보낸 인증 링크를 눌러 주세요"를 보여 준다.
3. (비밀번호 재설정 링크용) Authentication > URL Configuration 의 Site URL / Redirect URLs 에 앱 주소를 등록. 지금은 링크만 보내고, 링크로 돌아와 새 비밀번호를 받는 화면은 아직 없다(후속).

## 2. 환경변수 (선택, 기본값은 코드에 있음)
- `EXPO_PUBLIC_SUPABASE_URL` (기본 `https://xllzghpdvpvyvwwarjoj.supabase.co`)
- `EXPO_PUBLIC_SUPABASE_KEY` (publishable key `sb_publishable_...`)
- service / secret 키는 앱에 절대 넣지 않는다.

## 3. 코드 위치
- `src/lib/supabase.ts` 클라이언트 + 한국어 오류 변환 `koError`
- `src/data/authStore.ts` 세션 복원, signIn/signUp/signOut/resetPassword, 닉네임(profiles) 수정
- `src/data/scheduleStore.ts` 현재 여행의 `schedule_items` 로딩/추가/수정/삭제(낙관적) + realtime 동기화. 항공권은 category `항공` 항목으로 저장(제목 "항공사 편명", 장소 "출발 → 도착")
- `src/data/currentTrip.ts` 선택된 여행에서 파생(일수·D-day·도시 구간). 일정 화면은 모두 이걸 기준으로 그린다
- `src/data/tripStore.ts` trips + trip_cities + trip_members 로딩, createTrip/updateTrip/deleteTrip/joinByCode, fetchMembers/removeMember
- `src/data/walletStore.ts` **expenses** (현재 여행 기준 불러오기/추가/수정/삭제, 낙관적 갱신). 나라·통화는 여행 도시에서 파생, 정산은 실제 멤버+지출로 계산
- `src/data/savedStore.ts` **saved_places**(내 저장, 여행 없이도), **shared_places + place_likes**(현재 여행의 공유 피드·좋아요). 작성자 닉네임은 profiles
- 친구 일정(`app/saved/friends.tsx`)은 **schedule_items** 를 읽기 전용으로 읽어 멤버(created_by)·일차별로 보여 줌. 지출/장소의 '일정에서 가져오기·일정에 추가'도 schedule_items 를 직접 읽고/삽입

- 일정 실시간 동기화를 쓰려면 schema.sql 맨 아래의 `alter publication supabase_realtime add table public.schedule_items;` 도 실행(없어도 화면을 열 때마다 다시 불러온다).

## 4. 아직 더미/로컬인 것 (후속)
- 일정 항목 화면 (`scheduleStore.ts`) → `schedule_items` (다른 작업에서 진행)
- 환율: `walletStore.ts` 의 대략값 표(참고용). 실시간 환율 API 연동 필요
- 예산(기기 AsyncStorage), 지출 카테고리 편집(메모리), 정산 진행 상태(요청/완료, 메모리) → 테이블 없음
- 공유 장소 사진·구글맵 링크 토글·저장 폴더 (스키마에 컬럼 없음, 화면에서 제거)
- 장소 검색 결과(`FOUND`)는 예시 목업 (Google Places 연동 전). 지도 마커 위치는 임시 배치(좌표 투영 전)
- 꿀팁 상세는 영국(GB)만 있음. 프랑스/이탈리아는 탭의 '오늘의 꿀팁'만, 그 외 나라는 '준비 중' 카드
- 프로필 사진 (`profile.ts`, 기기 로컬 URI) → `profiles.avatar_url` + Storage
- 소셜 로그인 (카카오/구글/애플) 은 "준비 중" 버튼
