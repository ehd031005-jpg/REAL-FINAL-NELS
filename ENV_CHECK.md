# .env.local 파일 확인 가이드

## 올바른 형식

`.env.local` 파일은 프로젝트 루트 디렉토리에 있어야 하며, 다음 형식을 따라야 합니다:

```env
# 주석은 #으로 시작합니다

# News API Key (정확한 변수명 사용)
NEWS_API_KEY=your_actual_api_key_here

# Google AI API Key
GOOGLE_API_KEY=your_google_api_key_here

# 또는 OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

## 주의사항

1. **변수명 정확히**: `NEWS_API_KEY` (대문자, 언더스코어)
2. **등호 주변 공백 없음**: `NEWS_API_KEY = value` ❌ (공백 있음)
   - 올바른 형식: `NEWS_API_KEY=value` ✅
3. **따옴표 불필요**: `NEWS_API_KEY="value"` (따옴표는 값의 일부로 포함됨)
4. **주석 처리 확인**: `# NEWS_API_KEY=...` (주석 처리되면 작동 안 함)
5. **파일 위치**: 프로젝트 루트 (`package.json`과 같은 위치)

## 확인 방법

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 변수명이 정확한지 확인 (`NEWS_API_KEY`)
3. 등호 주변에 공백이 없는지 확인
4. 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

## 테스트

서버 재시작 후 `http://localhost:3000/test-news`에서 테스트하세요.


