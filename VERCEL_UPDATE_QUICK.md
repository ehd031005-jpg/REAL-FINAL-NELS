# ⚡ Vercel 빠른 업데이트 가이드

## 📋 변경된 파일

이번 업데이트에서 수정된 파일:
- **`app/api/generate-question/route.ts`** - 쟁점 기반 질문 생성 기능

---

## 🚀 업데이트 방법 (3단계)

### 1단계: GitHub 저장소 접속

1. **GitHub 웹사이트** 접속: https://github.com
2. 로그인
3. **NELS 프로젝트 저장소**로 이동

---

### 2단계: 파일 업로드

#### 파일: `app/api/generate-question/route.ts`

1. 저장소에서 `app/api/generate-question/` 폴더로 이동
2. **`route.ts`** 파일 클릭
3. 우측 상단의 **연필 아이콘(✏️)** 클릭 (Edit this file)
4. **로컬 파일 내용 복사**:
   - Windows 탐색기에서 `C:\Users\김동현\Desktop\project\app\api\generate-question\route.ts` 파일 열기
   - 전체 내용 선택 (Ctrl + A) → 복사 (Ctrl + C)
5. **GitHub 편집 창에 붙여넣기** (Ctrl + V)
6. 화면 하단으로 스크롤
7. **"Commit changes"** 섹션에서:
   - **Commit message** 입력: `Add issue-based question generation - analyze article controversies`
   - **"Commit directly to the main branch"** 선택 (기본값)
   - **"Commit changes"** 버튼 클릭

---

### 3단계: Vercel 자동 배포 확인

1. **Vercel 대시보드** 접속: https://vercel.com/dashboard
2. **NELS 프로젝트** 선택
3. **"Deployments"** 탭 클릭
4. 최신 배포 항목 확인:
   - 🟡 **"Building"** → 빌드 중 (1-3분 소요)
   - 🟢 **"Ready"** → 배포 완료!

---

## ✅ 배포 완료 확인

배포가 완료되면:

1. 배포된 사이트 URL 클릭
2. **Writing 탭**에서 테스트:
   - 기사 선택
   - 생성된 질문이 **쟁점을 다루는지** 확인
   - 질문이 **다양한 관점을 제시하는지** 확인
   - 질문이 **입장을 요구하는지** 확인

---

## 🎯 예상 질문 예시

업데이트 후 다음과 같은 질문이 생성됩니다:

**기후 정책 기사:**
> "The article states that countries agreed to reduce emissions by 50% by 2030, but some experts argue this will hurt economic growth. What are the potential benefits and drawbacks of this policy? Do you think the environmental benefits outweigh the economic costs?"

**기술 기사:**
> "The article discusses AI replacing human workers in healthcare. Some people support this for efficiency, while others worry about job losses. What is your opinion on this debate? Should AI replace human workers, or should it only assist them?"

---

## ⚠️ 문제 해결

### 배포가 자동으로 시작되지 않음

1. Vercel 대시보드 → 프로젝트 → **"Settings"** → **"Git"** 확인
2. GitHub 저장소가 올바르게 연결되어 있는지 확인
3. 수동 재배포: **"Deployments"** → 최신 배포 → **"..."** → **"Redeploy"**

### 배포는 성공했지만 기능이 작동하지 않음

1. 브라우저 캐시 삭제 (Ctrl + Shift + Delete)
2. 하드 리프레시 (Ctrl + F5)
3. 브라우저 콘솔에서 오류 확인 (F12)

---

## 📝 체크리스트

- [ ] GitHub 저장소 접속
- [ ] `app/api/generate-question/route.ts` 파일 업데이트
- [ ] Commit message 입력 및 저장
- [ ] Vercel 대시보드에서 배포 상태 확인
- [ ] 배포 완료 후 사이트 테스트

---

## 🎉 완료!

모든 단계를 완료했다면 업데이트가 적용되었습니다!

이제 Writing 탭에서 각 기사의 **쟁점을 분석하여 질문**이 생성됩니다.

