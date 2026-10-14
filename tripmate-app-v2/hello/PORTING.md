# 피그마 → RN 화면 이식 가이드 (트립메이트)

Figma file key: `73vk4T8CsVcKmMhe1lHDir` (Page 1). 프레임은 390 폭, Light/Dark 쌍.
**기준은 Light 프레임**이고, 다크는 `useTheme()` 토큰으로 자동 전환한다.

## 작업 순서 (화면 1개당)
1. `get_design_context(fileKey, nodeId=<Light 프레임 id>, skillNames="resource:figma-design-to-code", clientFrameworks="react-native,expo", clientLanguages="typescript")` 호출 → 코드(React+Tailwind 참고용)와 스크린샷을 얻는다. 스크린샷이 시각 목표.
   - 응답이 sparse(요약)면 자식 노드 id 로 다시 호출.
2. Tailwind 클래스를 **그대로 수치만 옮겨** RN `StyleSheet`/인라인 스타일로 변환한다. (px → dp 동일, `gap-[12px]`→`gap:12`, `rounded-[28px]`→`borderRadius:28`, `text-[30px]`→`fontSize:30`, `tracking-[-1.2px]`→`<T ls={-4}>`(% 단위), `drop-shadow`→`shadow(t)`)
   - 절대좌표(absolute left/top)는 가능하면 flex 레이아웃으로 바꾸되 **간격·크기는 원본 값 유지**. 지도·일러스트처럼 정말 겹쳐야 하는 부분만 absolute.
   - 상태바(9:41, 5G 100%)는 **그리지 않는다**(OS가 그림). 하단 Tab bar도 그리지 않는다(`app/(tabs)/_layout.tsx` 가 담당). 탭 화면은 `<Page tab>` 으로 하단 여백만 확보.
   - 폰트: Paperlogy `3_Light/4_Regular/5_Medium/6_SemiBold/7_Bold` → `<T w="l|r|m|sb|b">`. Noto Sans KR 로 적힌 곳도 같은 w 로.
3. **아이콘**: 원본의 `icon/xxx` 레이어는 전부 `src/components/Icon.tsx` 에 있다 → `<Icon name="xxx" size={…} color={…}/>` (이름이 `icon/`뒤 문자열; `icon/photo placeholder`는 `photo`). 색은 원본 stroke 색(파랑 `t.acc`, 회색 `t.sub`, 본문 `t.text` 등)으로. 필요한 아이콘이 없으면 **Icon.tsx 를 수정하지 말고** 자기 화면 파일 안에 `react-native-svg` 로 로컬 정의.
4. **이미지/사진**: 사진 자리는 `<PhotoPH>`. 래스터 일러스트(지도 PNG 등 다운로드 불가)는 `PhotoPH` 나 단색 도형으로 대체하고 최종 보고에 "원본 이미지 필요" 로 적는다. Figma 에셋 URL 을 코드에 넣지 말 것(7일 만료, 셸에서 접근 불가).
5. **색 토큰** (`useTheme().t`): bg, card, card2, text, sub, line, acc, accS, ok, warn, bad, badS, feed, feedT, track, ph, phIcon. 원본 hex 가 토큰과 같으면 토큰을 쓴다(라이트 `#f6f7f9`=bg, `#fff`=card, `#1a1d23`=text, `#8a8f98`=sub, `#e8eaee`=line, `#1e6fff`=acc, `#eaf2ff`=accS). 토큰에 없는 고정색(예: 파란 히어로 위 흰 글씨, 카테고리 색)은 hex 그대로 두되, 다크 프레임에서 다른 값이면 `t.mode==='dark' ? … : …` 로 분기. 다크 프레임 값은 `use_figma` 로 읽기 전용 조회하거나 Dark 프레임(`… · Dark`)의 `get_design_context` 로 확인.
6. 공통 부품 `src/kit`: `Page, TabTitle, Header, T, Card, Btn, Pill, Seg, Field, PhotoPH, IconTile, Row, Divider, SectionHead, useGo, useTheme, shadow, Icon`. 참고 구현: `app/(tabs)/wallet.tsx` (W-01).
   - 하위 화면 헤더가 원본에서 `←`+제목이면 `<Header title=…/>`, 큰 제목(30px)이면 `<TabTitle>`; 원본을 따를 것.
   - 필요하면 kit 에 없는 부품은 **화면 파일 내부**에 로컬로 만든다. `src/kit/*`, `src/components/Icon.tsx`, `src/theme/*`, `app/_layout.tsx`, `app/(tabs)/_layout.tsx` 는 **수정 금지**(다른 작업자와 충돌). 문제가 있으면 최종 보고에 적는다.
7. 문구·숫자·항목은 **원본 텍스트 그대로**(더미 데이터는 화면 파일 상단 const). 화면 이동은 `useGo()` 로 아래 라우트 표를 사용.
8. 검증: `cd /home/claude/tripmate/app && npx tsc --noEmit` 통과 필수. 가능하면 `CI=1 npx expo export --platform web` 후 playwright(`/tmp/claude-0/-home-claude/90bf7c84-7680-5e0f-a49f-a85e3e32a485/scratchpad/node_modules/playwright-core`, chromium `/opt/pw-browsers/chromium`)로 `http://localhost:<port>/<route>` 를 390×844 로 캡처해 Figma 스크린샷과 비교하고 어긋난 간격/크기를 고친다. (서버: `npx serve -s dist -l <고유포트>`; 다른 작업자와 포트가 겹치지 않게 지정된 포트 사용. `pkill` 은 쓰지 말 것.)

## 라우트 표 (expo-router, `app/` 아래 파일)
- 탭: `/home`, `/tips`, `/saved`, `/schedule`, `/wallet` (파일 `app/(tabs)/*.tsx`)
- 인증: `/auth/login` `/auth/signup` `/auth/reset`
- 여행: `/trip/new`(H-02) `/trip/edit`(H-03) `/trip/mode`(H-04), 마이 `/my`(M-01), 챗봇 `/chatbot`(A-01)
- 일정: `/schedule/members`(일행 팝업) `/schedule/manage`(여행 관리 메뉴) `/schedule/add`(P-02) `/schedule/detail`(P-03) `/schedule/city`(P-03b) `/schedule/map`(P-04) `/schedule/weather`(P-05) `/schedule/weather-detail`(P-05b) `/schedule/flight`(P-06)
- 지갑: `/wallet/country`(W-02) `/wallet/add`(W-03) `/wallet/settle`(W-04) `/wallet/rate`(W-05)
- 저장·공유: `/saved/feed`(C-02) `/saved/add-to-schedule`(C-03) `/saved/friends`(C-04) `/saved/folder`(C-05) `/saved/place`(C-06) `/saved/map`(C-07) `/saved/folder-new`(C-08) `/saved/save`(C-09) `/saved/share`(C-10) `/saved/search`(C-11) `/saved/openmap`(C-12) `/saved/marker`(C-13)
- 신고·차단: `/report/new`(R-01) `/report/more`(R-02) `/report/block`(R-03) `/report/delete`(R-04) `/report/manage`(R-05) `/report/guidelines`(R-06)
- 꿀팁: `/tips/info` `/tips/transport` `/tips/food` `/tips/lang` `/tips/currency` `/tips/emergency` `/tips/culture` `/tips/power` `/tips/manner` (K-02~K-10)
