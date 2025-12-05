# 📋 GitHub 업로드 체크리스트

이 파일은 GitHub에 업로드해야 할 파일과 업로드하지 말아야 할 파일을 명확하게 정리한 목록입니다.

## ✅ 업로드해야 할 파일/폴더

### 📁 폴더 (전체 업로드)

1. **`app/`** 폴더 전체
   - 모든 페이지와 API 라우트 포함
   - 하위 폴더 모두 포함

2. **`components/`** 폴더 전체
   - 모든 React 컴포넌트 포함

3. **`lib/`** 폴더 전체
   - 모든 유틸리티 함수 포함

4. **`types/`** 폴더 전체
   - TypeScript 타입 정의 포함

### 📄 루트 디렉토리 파일

다음 파일들을 루트 디렉토리에 업로드하세요:

#### 필수 설정 파일
- ✅ `package.json` - 프로젝트 의존성 정보
- ✅ `package-lock.json` - 정확한 패키지 버전 정보
- ✅ `tsconfig.json` - TypeScript 설정
- ✅ `next.config.js` - Next.js 설정
- ✅ `tailwind.config.js` - Tailwind CSS 설정
- ✅ `postcss.config.js` - PostCSS 설정
- ✅ `.gitignore` - Git 제외 파일 목록

#### 문서 파일
- ✅ `README.md` - 프로젝트 설명서
- ✅ `DEPLOYMENT.md` - 배포 가이드
- ✅ `GITHUB_WEB_UPLOAD.md` - GitHub 업로드 가이드
- ✅ `ENV_CHECK.md` - 환경 변수 체크 가이드 (있다면)
- ✅ `env.example.txt` - 환경 변수 예제 파일

#### 기타 파일
- ✅ `next-env.d.ts` - Next.js TypeScript 선언 파일

## ❌ 업로드하지 말아야 할 파일/폴더

### 절대 업로드 금지

1. **`node_modules/`** 폴더
   - ❌ 너무 크고 (수백 MB)
   - ❌ `npm install`로 자동 생성됨
   - ❌ GitHub에 업로드하면 저장소가 너무 커짐

2. **`.env.local`** 파일
   - ❌ API 키 등 보안 정보 포함
   - ❌ 공개되면 위험함

3. **`.next/`** 폴더
   - ❌ 빌드 결과물
   - ❌ `npm run build`로 자동 생성됨

4. **`.vercel/`** 폴더 (있다면)
   - ❌ Vercel 배포 설정 파일
   - ❌ 로컬 전용

5. **로그 파일들**
   - ❌ `*.log` 파일들
   - ❌ `npm-debug.log*`
   - ❌ `yarn-debug.log*`

6. **시스템 파일들**
   - ❌ `.DS_Store` (Mac)
   - ❌ `Thumbs.db` (Windows)

## 📝 업로드 순서 (권장)

### 1차 업로드: 설정 파일들
```
package.json
package-lock.json
tsconfig.json
next.config.js
tailwind.config.js
postcss.config.js
.gitignore
next-env.d.ts
```

### 2차 업로드: 문서 파일들
```
README.md
DEPLOYMENT.md
GITHUB_WEB_UPLOAD.md
ENV_CHECK.md (있다면)
env.example.txt
```

### 3차 업로드: 소스 코드 폴더들
```
app/ (폴더 전체)
components/ (폴더 전체)
lib/ (폴더 전체)
types/ (폴더 전체)
```

## 🔍 확인 방법

업로드 전에 다음을 확인하세요:

1. **`node_modules` 폴더가 업로드 목록에 없는지 확인**
   - GitHub 웹 업로드 시 드래그 앤 드롭할 때 `node_modules` 폴더를 제외하세요

2. **`.env.local` 파일이 없는지 확인**
   - 이 파일은 보안상 절대 업로드하면 안 됩니다

3. **`.next` 폴더가 없는지 확인**
   - 빌드 폴더는 업로드할 필요가 없습니다

## 💡 팁

### 폴더 단위로 업로드하기

GitHub 웹 업로드는 폴더 단위로도 가능합니다:
1. `Add file` → `Upload files` 클릭
2. Windows 탐색기에서 폴더를 드래그 앤 드롭
3. 폴더 내 모든 파일이 자동으로 업로드됩니다

### 여러 번 나눠서 업로드하기

한 번에 모든 파일을 업로드하기 어렵다면:
- 1차: 설정 파일들
- 2차: 문서 파일들  
- 3차: `app/` 폴더
- 4차: `components/` 폴더
- 5차: `lib/` 폴더
- 6차: `types/` 폴더

이렇게 나눠서 업로드해도 됩니다.

## ✅ 최종 체크리스트

업로드 전에 이것들을 확인하세요:

- [ ] `node_modules/` 폴더가 업로드 목록에 없음
- [ ] `.env.local` 파일이 업로드 목록에 없음
- [ ] `.next/` 폴더가 업로드 목록에 없음
- [ ] `package.json` 파일이 있음
- [ ] `app/` 폴더가 있음
- [ ] `components/` 폴더가 있음
- [ ] `lib/` 폴더가 있음
- [ ] `types/` 폴더가 있음
- [ ] `.gitignore` 파일이 있음
- [ ] `README.md` 파일이 있음

모든 항목을 체크했다면 업로드를 시작하세요! 🚀

