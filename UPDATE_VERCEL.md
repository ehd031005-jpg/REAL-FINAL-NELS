# 🔄 Vercel에 업데이트 적용하기

이 문서는 코드를 수정한 후 Vercel에 업데이트를 적용하는 방법을 안내합니다.

## 📋 변경된 파일 목록

다음 파일들이 수정되었습니다:

1. **`app/api/generate-question/route.ts`**
   - 기사에 맞는 맞춤 질문 생성 기능 개선
   - 기사 내용 활용 강화 (2000자 → 5000자)
   - AI 프롬프트 개선

2. **`app/writing/page.tsx`**
   - 기사 전체 내용 자동 가져오기 기능 추가

---

## 🚀 업데이트 적용 방법

### 방법 1: GitHub 웹 인터페이스 사용 (추천)

Vercel은 GitHub 저장소와 연결되어 있으므로, GitHub에 변경사항을 업로드하면 **자동으로 Vercel이 재배포**합니다.

#### 1단계: GitHub 저장소 접속

1. GitHub 웹사이트 접속: https://github.com
2. 로그인
3. NELS 프로젝트 저장소로 이동

#### 2단계: 변경된 파일 업로드

**파일 1: `app/api/generate-question/route.ts`**

1. 저장소에서 `app/api/generate-question/` 폴더로 이동
2. `route.ts` 파일 클릭
3. 연필 아이콘(✏️) 클릭하여 편집 모드 진입
4. 로컬 파일(`C:\Users\김동현\Desktop\project\app\api\generate-question\route.ts`) 내용을 복사하여 붙여넣기
5. 하단의 **"Commit changes"** 클릭
   - Commit message: `Improve question generation to be article-specific`
   - **"Commit directly to the main branch"** 선택
   - **"Commit changes"** 버튼 클릭

**파일 2: `app/writing/page.tsx`**

1. 저장소에서 `app/writing/` 폴더로 이동
2. `page.tsx` 파일 클릭
3. 연필 아이콘(✏️) 클릭하여 편집 모드 진입
4. 로컬 파일(`C:\Users\김동현\Desktop\project\app\writing\page.tsx`) 내용을 복사하여 붙여넣기
5. 하단의 **"Commit changes"** 클릭
   - Commit message: `Add full article content fetching for better question generation`
   - **"Commit directly to the main branch"** 선택
   - **"Commit changes"** 버튼 클릭

#### 3단계: Vercel 자동 배포 확인

1. **Vercel 대시보드** 접속: https://vercel.com/dashboard
2. NELS 프로젝트 선택
3. **"Deployments"** 탭 클릭
4. 최신 배포 항목 확인:
   - 상태가 **"Building"** → **"Ready"**로 변경되는지 확인
   - 보통 1-3분 소요

#### 4단계: 배포 완료 확인

1. 배포 상태가 **"Ready"**가 되면
2. 배포된 사이트 URL 클릭
3. **Writing 탭**에서 테스트:
   - 기사를 선택
   - 생성된 질문이 기사 내용을 구체적으로 참조하는지 확인

---

### 방법 2: GitHub Desktop 사용 (선택사항)

GitHub Desktop이 설치되어 있다면:

1. GitHub Desktop 실행
2. 변경된 파일들이 자동으로 감지됨
3. 변경사항 확인 후 **"Commit to main"** 클릭
4. **"Push origin"** 클릭하여 GitHub에 푸시
5. Vercel이 자동으로 재배포 시작

---

## ⚡ 빠른 업데이트 체크리스트

- [ ] GitHub 저장소 접속
- [ ] `app/api/generate-question/route.ts` 파일 업데이트
- [ ] `app/writing/page.tsx` 파일 업데이트
- [ ] Vercel 대시보드에서 배포 상태 확인
- [ ] 배포 완료 후 사이트 테스트

---

## 🔍 배포 상태 확인 방법

### Vercel 대시보드에서 확인

1. **대시보드** → 프로젝트 선택
2. **"Deployments"** 탭
3. 최신 배포 항목 확인:
   - 🟡 **Building**: 빌드 중
   - 🟢 **Ready**: 배포 완료
   - 🔴 **Error**: 오류 발생 (로그 확인 필요)

### 배포 로그 확인

배포 중 오류가 발생했다면:

1. 배포 항목 클릭
2. **"Logs"** 탭 클릭
3. 오류 메시지 확인
4. 일반적인 오류:
   - TypeScript 오류 → 로컬에서 `npm run build` 실행하여 확인
   - 환경 변수 누락 → Vercel 설정에서 환경 변수 확인

---

## 🎯 자동 배포 작동 원리

Vercel은 GitHub 저장소와 연결되어 있어:

1. **GitHub에 푸시** → Vercel이 자동으로 감지
2. **자동 빌드 시작** → `npm run build` 실행
3. **배포 완료** → 사이트 자동 업데이트

**따라서 GitHub에 파일만 업로드하면 자동으로 배포됩니다!**

---

## ⚠️ 주의사항

### 환경 변수는 그대로 유지됩니다

- 환경 변수(`GOOGLE_API_KEY`, `OPENAI_API_KEY`, `NEWS_API_KEY`)는 별도로 설정할 필요 없음
- 이미 설정된 환경 변수는 그대로 유지됨

### 빌드 실패 시

1. Vercel 대시보드 → **"Deployments"** → 최신 배포 클릭
2. **"Logs"** 탭에서 오류 확인
3. 로컬에서 `npm run build` 실행하여 오류 재현
4. 오류 수정 후 다시 GitHub에 업로드

---

## 📝 업데이트 내용 요약

### 개선된 기능

1. **기사 특정 질문 생성**
   - 기사 내용을 5000자까지 활용
   - 핵심 키워드와 주제 자동 추출
   - 기사 특정 내용을 참조하는 질문 생성

2. **AI 프롬프트 강화**
   - 일반적인 질문 금지
   - 기사 특정 내용 참조 강제
   - 좋은/나쁜 질문 예시 제공

3. **기사 전체 내용 자동 가져오기**
   - 내용이 짧으면 자동으로 전체 내용 가져오기
   - 더 정확한 질문 생성 가능

---

## ✅ 완료 확인

업데이트가 성공적으로 적용되었는지 확인:

1. ✅ Vercel 배포 상태가 **"Ready"**
2. ✅ Writing 탭에서 기사 선택
3. ✅ 생성된 질문이 기사 내용을 구체적으로 참조
4. ✅ 일반적인 질문이 아닌 기사 특정 질문 생성

---

## 🆘 문제 해결

### 배포가 자동으로 시작되지 않음

**해결 방법**:
1. Vercel 대시보드 → 프로젝트 → **"Settings"** → **"Git"** 확인
2. GitHub 저장소가 올바르게 연결되어 있는지 확인
3. 수동으로 재배포: **"Deployments"** → **"..."** → **"Redeploy"**

### 배포는 성공했지만 기능이 작동하지 않음

**해결 방법**:
1. 브라우저 캐시 삭제 (Ctrl + Shift + Delete)
2. 하드 리프레시 (Ctrl + F5)
3. 브라우저 콘솔에서 오류 확인 (F12)

---

## 🎉 완료!

모든 단계를 완료했다면 업데이트가 적용되었습니다!

이제 Writing 탭에서 각 기사에 맞는 맞춤 질문이 생성되는 것을 확인할 수 있습니다.

