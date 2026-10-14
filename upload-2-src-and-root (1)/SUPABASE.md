# Supabase 연결 (1차: 로그인 + 여행)

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
- `src/data/tripStore.ts` trips + trip_cities + trip_members 로딩, createTrip/updateTrip/deleteTrip/joinByCode, fetchMembers/removeMember

## 4. 아직 인메모리 더미인 것 (후속)
- 일정 항목 (`scheduleStore.ts`) → `schedule_items`
- 저장한 장소 / 공유 장소 / 좋아요 (`savedStore.ts`) → `saved_places`, `shared_places`, `place_likes`
- 지출·정산 (`walletStore.ts`) → `expenses`
- 프로필 사진 (`profile.ts`, 기기 로컬 URI) → `profiles.avatar_url` + Storage
- 소셜 로그인 (카카오/구글/애플) 은 "준비 중" 버튼
