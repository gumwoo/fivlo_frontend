# Frontend Development Plan - Fivlo App

## 환경
- Node.js: v18.x
- Expo SDK: 54
- React: 19.0.0
- React Native: 0.79.5
- 주요 패키지:
  - @react-navigation/native: ^7.1.14
  - @react-navigation/stack: ^7.4.2
  - @react-navigation/bottom-tabs: ^7.4.2
  - zustand: ^5.0.8
  - axios: ^1.10.0
  - i18next: ^25.5.2
  - react-native-calendars: ^1.1313.0
  - @react-native-async-storage/async-storage: ^2.2.0
  - date-fns: ^4.1.0

## 진행 현황
| 상태 | 작업 내용 | 담당 화면/컴포넌트 |
|------|-----------|-------------------|
| Done | 언어 선택 화면 구현 | LanguageSelectionScreen.jsx |
| Done | 네비게이션 플로우 수정 | AppNavigator.js |
| Done | 로그인 후 언어 선택 연결 | EmailLoginScreen.jsx |
| Done | 회원가입 후 언어 선택 연결 | EmailSignUpScreen.jsx |
| Done | 다국어 파일 업데이트 | ko.json, en.json |

## 변경 로그
| 날짜 | 커밋/변경 내용 | 영향 모듈 |
|------|---------------|----------|
| 2025-10-02 | 작업 이력 문서 생성 | docs/frontend_plan.md |
| 2025-10-02 | 언어 선택 화면 구현 완료 | LanguageSelectionScreen.jsx |
| 2025-10-02 | 네비게이션에 언어 선택 라우트 추가 | AppNavigator.js |
| 2025-10-02 | 로그인 플로우에 언어 선택 추가 | EmailLoginScreen.jsx |
| 2025-10-02 | 회원가입 플로우에 언어 선택 추가 | EmailSignUpScreen.jsx |
| 2025-10-02 | 다국어 파일 업데이트 (언어 선택 텍스트) | ko.json, en.json |

## 리스크 & 대응
- 온보딩 플로우에 언어 선택 화면 누락 → LanguageSelectionScreen.jsx 신규 구현 필요
- PurposeSelectionScreen 디자인 패턴 준수 필요

## TODO
- [x] LanguageSelectionScreen.jsx 생성
- [x] AppNavigator.js에 라우트 추가
- [x] i18n 다국어 파일 업데이트 (ko.json, en.json)
- [x] EmailLoginScreen 로그인 성공 시 LanguageSelectionScreen으로 이동
- [x] EmailSignUpScreen 회원가입 성공 시 LanguageSelectionScreen으로 이동
- [ ] 실제 테스트 및 검증 필요

## 구현 상세
### LanguageSelectionScreen.jsx
- **위치**: `src/screens/LanguageSelectionScreen.jsx`
- **디자인**: PurposeSelectionScreen과 동일한 패턴 (캐릭터 + 질문 + 버튼)
- **기능**:
  - 한국어/English 선택 버튼
  - 선택된 언어 하이라이트 (primary 스타일)
  - i18next 언어 변경 (i18n.changeLanguage)
  - 선택 후 PurposeSelectionScreen으로 이동
- **스타일**: Colors, FontSizes 상수 사용

### 온보딩 플로우 (수정 완료)
```
OnboardingScreen (스플래시)
    ↓
AuthChoiceScreen (계정 선택)
    ↓
EmailSignUp / EmailLogin
    ↓
LanguageSelectionScreen ← [새로 추가]
    ↓
PurposeSelectionScreen (목적 선택)
    ↓
Main (홈)
```

## 로그/디버깅 메모
- Metro bundler 로그: 터미널 확인
- React Native Debugger 포트: 19000
