# 📤 GitHub 업로드 추천 순서

이 문서는 프로젝트의 의존성 관계를 고려한 최적의 업로드 순서를 안내합니다.

## 🎯 업로드 전략

### 방법 1: 폴더 단위 업로드 (추천 ⭐)
폴더 전체를 한 번에 업로드하면 파일 간 의존성 문제를 피할 수 있습니다.

### 방법 2: 단계별 업로드
의존성 관계를 고려하여 순서대로 업로드합니다.

---

## 📋 추천 업로드 순서

### 1단계: 필수 설정 파일 (먼저 업로드 필수)

이 파일들은 프로젝트의 기본 구조를 정의하므로 **반드시 먼저** 업로드해야 합니다.

```
✅ .gitignore
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ next.config.js
✅ tailwind.config.js
✅ postcss.config.js
✅ next-env.d.ts
```

**이유**: 
- 다른 파일들이 이 설정들을 참조합니다
- `.gitignore`를 먼저 업로드하면 나중에 실수로 불필요한 파일을 업로드하는 것을 방지합니다

---

### 2단계: 타입 정의 (의존성 없음)

```
✅ types/
   └── index.ts
```

**이유**: 
- 다른 파일들이 이 타입들을 사용하지만, 타입 정의 자체는 독립적입니다
- 먼저 업로드하면 나중에 타입 오류를 피할 수 있습니다

---

### 3단계: 라이브러리/유틸리티 함수 (핵심 의존성)

```
✅ lib/
   ├── get-available-model.ts
   ├── news-api.ts
   ├── openai.ts
   ├── generate-cultural-context.ts
   └── get-article-by-id.ts
```

**업로드 순서 (lib 폴더 내부)**:
1. `get-available-model.ts` (가장 기본)
2. `news-api.ts` (독립적)
3. `openai.ts` (다른 파일들이 많이 참조)
4. `generate-cultural-context.ts` (openai.ts 사용)
5. `get-article-by-id.ts` (openai.ts, news-api.ts 사용)

**이유**: 
- API 라우트와 컴포넌트가 이 함수들을 사용합니다
- `openai.ts`는 여러 곳에서 참조되므로 중요합니다

---

### 4단계: 공통 컴포넌트

```
✅ components/
   ├── Navbar.tsx
   ├── Footer.tsx
   ├── CulturalContextCard.tsx
   └── RephraseCompare.tsx
```

**이유**: 
- 페이지들이 이 컴포넌트들을 사용합니다
- API 라우트와 독립적이므로 먼저 업로드해도 됩니다

---

### 5단계: API 라우트 (서버 사이드)

```
✅ app/api/
   ├── google-models/
   │   └── route.ts
   ├── test-news/
   │   └── route.ts
   ├── test-openai/
   │   └── route.ts
   ├── fetch-article/
   │   └── route.ts
   ├── news/
   │   ├── route.ts
   │   ├── [id]/
   │   │   └── route.ts
   │   └── fetch/
   │       └── route.ts
   ├── quiz/
   │   └── route.ts
   ├── rephrase/
   │   └── route.ts
   ├── generate-question/
   │   └── route.ts
   └── writing-feedback/
       └── route.ts
```

**업로드 순서 (app/api 폴더 내부)**:
1. `google-models/route.ts` (독립적)
2. `test-news/route.ts` (테스트용)
3. `test-openai/route.ts` (테스트용)
4. `news/route.ts` (핵심 API)
5. `news/[id]/route.ts` (news/route.ts 사용)
6. `news/fetch/route.ts` (news/route.ts 사용)
7. `fetch-article/route.ts` (독립적)
8. `quiz/route.ts` (news API 사용)
9. `rephrase/route.ts` (openai.ts 사용)
10. `generate-question/route.ts` (openai.ts 사용)
11. `writing-feedback/route.ts` (openai.ts 사용)

**이유**: 
- 페이지들이 이 API들을 호출합니다
- API들이 `lib/` 폴더의 함수들을 사용합니다

---

### 6단계: 페이지 파일들 (클라이언트 사이드)

```
✅ app/
   ├── layout.tsx (먼저 업로드)
   ├── page.tsx
   ├── globals.css
   ├── about/
   │   └── page.tsx
   ├── news/
   │   ├── page.tsx
   │   └── [id]/
   │       └── page.tsx
   ├── quiz/
   │   └── page.tsx
   ├── review/
   │   └── page.tsx
   ├── writing/
   │   └── page.tsx
   ├── test-api/
   │   └── page.tsx
   └── test-news/
      └── page.tsx
```

**업로드 순서 (app 폴더 내부)**:
1. `layout.tsx` (모든 페이지의 기본 레이아웃)
2. `globals.css` (전역 스타일)
3. `page.tsx` (홈 페이지)
4. `about/page.tsx` (독립적)
5. `news/page.tsx` (뉴스 목록)
6. `news/[id]/page.tsx` (뉴스 상세)
7. `quiz/page.tsx` (퀴즈)
8. `review/page.tsx` (복습)
9. `writing/page.tsx` (작문)
10. `test-api/page.tsx` (테스트)
11. `test-news/page.tsx` (테스트)

**이유**: 
- 페이지들이 컴포넌트와 API를 사용합니다
- `layout.tsx`는 모든 페이지의 기본이므로 먼저 필요합니다

---

### 7단계: 문서 파일들 (언제든 가능)

```
✅ README.md
✅ DEPLOYMENT.md
✅ GITHUB_WEB_UPLOAD.md
✅ VERCEL_DEPLOY_GUIDE.md
✅ API_COMPARISON.md
✅ UPLOAD_CHECKLIST.md
✅ UPLOAD_ORDER.md (이 파일)
✅ env.example.txt
```

**이유**: 
- 문서 파일은 코드와 독립적이므로 언제든 업로드 가능합니다
- 하지만 프로젝트 이해를 돕기 위해 함께 업로드하는 것을 추천합니다

---

## 🚀 빠른 업로드 방법 (추천)

### 방법 A: 폴더 단위 업로드 (가장 빠름)

1. **1차 업로드**: 설정 파일들
   ```
   .gitignore
   package.json
   package-lock.json
   tsconfig.json
   next.config.js
   tailwind.config.js
   postcss.config.js
   next-env.d.ts
   ```

2. **2차 업로드**: 소스 코드 폴더들 (한 번에)
   ```
   types/ (폴더 전체)
   lib/ (폴더 전체)
   components/ (폴더 전체)
   app/ (폴더 전체)
   ```

3. **3차 업로드**: 문서 파일들
   ```
   README.md
   DEPLOYMENT.md
   GITHUB_WEB_UPLOAD.md
   VERCEL_DEPLOY_GUIDE.md
   API_COMPARISON.md
   UPLOAD_CHECKLIST.md
   UPLOAD_ORDER.md
   env.example.txt
   ```

### 방법 B: 단계별 세밀한 업로드

위의 1단계부터 7단계까지 순서대로 업로드합니다.

---

## ⚠️ 주의사항

### 절대 업로드하지 말아야 할 것들

```
❌ node_modules/ (폴더)
❌ .env.local (파일)
❌ .next/ (폴더)
❌ .vercel/ (폴더, 있다면)
❌ *.log (파일들)
```

---

## ✅ 업로드 후 확인 사항

1. **GitHub 저장소에서 확인**:
   - 모든 폴더가 제대로 업로드되었는지 확인
   - 파일 개수가 맞는지 확인

2. **Vercel 배포 확인**:
   - 자동으로 빌드가 시작되는지 확인
   - 빌드 오류가 없는지 확인

3. **환경 변수 설정**:
   - Vercel 대시보드에서 환경 변수 설정 확인
   - `NEWS_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY` 등

---

## 💡 팁

### GitHub 웹 업로드 시

1. **폴더 드래그 앤 드롭**: 
   - Windows 탐색기에서 폴더를 직접 드래그하면 폴더 내 모든 파일이 업로드됩니다

2. **여러 파일 동시 선택**:
   - `Ctrl` 키를 누른 채로 여러 파일을 선택하여 한 번에 업로드 가능

3. **업로드 중단 후 재개**:
   - 업로드 중 문제가 생기면 나중에 이어서 업로드해도 됩니다
   - GitHub는 부분 업로드를 지원합니다

---

## 📊 예상 업로드 시간

- **설정 파일들**: 1-2분
- **소스 코드 폴더들**: 5-10분 (인터넷 속도에 따라 다름)
- **문서 파일들**: 1분

**총 예상 시간**: 약 10-15분

---

## 🎉 완료!

모든 파일을 업로드했다면:
1. GitHub 저장소 확인
2. Vercel에 연결
3. 환경 변수 설정
4. 배포 완료 확인

행운을 빕니다! 🚀

