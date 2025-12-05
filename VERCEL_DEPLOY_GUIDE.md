# 🚀 Vercel 배포 가이드

GitHub에 업로드가 완료되었다면, 이제 Vercel에 배포해보세요!

## 📋 사전 준비

1. ✅ GitHub 저장소에 코드가 업로드되어 있어야 합니다
2. ✅ Vercel 계정이 필요합니다 (무료)

## 🎯 1단계: Vercel 가입 및 로그인

1. [Vercel 공식 사이트](https://vercel.com) 접속
2. 우측 상단의 **"Sign Up"** 또는 **"Log In"** 클릭
3. **"Continue with GitHub"** 클릭 (GitHub 계정으로 간편 가입)
4. GitHub 계정 인증 완료

## 🎯 2단계: 새 프로젝트 생성

1. Vercel 대시보드에서 **"Add New..."** 버튼 클릭
2. **"Project"** 선택
3. GitHub 저장소 목록에서 방금 업로드한 **NELS 프로젝트** 선택
4. **"Import"** 버튼 클릭

## 🎯 3단계: 프로젝트 설정

### 기본 설정 (자동 감지됨)

Vercel이 Next.js 프로젝트를 자동으로 감지하므로 대부분의 설정은 자동으로 채워집니다:

- **Framework Preset**: `Next.js` ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅

**이 설정들은 그대로 두고 넘어가면 됩니다!**

## 🎯 4단계: 환경 변수 설정 (중요!)

### 환경 변수란?

API 키 등 보안이 필요한 정보를 저장하는 곳입니다. GitHub에는 업로드하지 않았지만, Vercel에서는 이렇게 설정해야 합니다.

### 설정 방법

1. 프로젝트 설정 화면에서 **"Environment Variables"** 섹션 찾기
2. 다음 변수들을 하나씩 추가:

#### 필수 환경 변수

```
GOOGLE_API_KEY
```
- **Value**: Google AI API 키 값 입력
- **Environment**: 
  - ✅ Production 체크
  - ✅ Preview 체크 (선택)
  - ✅ Development 체크 (선택)

#### 선택적 환경 변수

```
OPENAI_API_KEY
```
- **Value**: OpenAI API 키 값 입력 (있다면)
- **Environment**: Production, Preview, Development 모두 체크

```
NEWS_API_KEY
```
- **Value**: NewsAPI 키 값 입력 (있다면)
- **Environment**: Production, Preview, Development 모두 체크

### 환경 변수 추가 방법

1. **Name** 필드에 변수 이름 입력 (예: `GOOGLE_API_KEY`)
2. **Value** 필드에 실제 API 키 값 입력
3. **Environment**에서 적용할 환경 선택:
   - **Production**: 실제 배포된 사이트
   - **Preview**: Pull Request나 브랜치별 미리보기
   - **Development**: 로컬 개발 환경
4. **"Add"** 버튼 클릭
5. 모든 환경 변수를 추가할 때까지 반복

### ⚠️ 주의사항

- API 키 값은 정확하게 입력하세요 (공백 없이)
- 환경 변수를 추가한 후에는 반드시 **"Redeploy"**가 필요합니다

## 🎯 5단계: 배포 시작

1. 모든 환경 변수를 추가했는지 확인
2. 화면 하단의 **"Deploy"** 버튼 클릭
3. 배포가 시작됩니다! (1-3분 소요)

## 🎯 6단계: 배포 완료 확인

### 배포 진행 상황

1. 배포가 시작되면 **"Building"** 상태가 표시됩니다
2. 빌드가 완료되면 **"Ready"** 상태로 변경됩니다
3. 배포가 완료되면 자동으로 URL이 생성됩니다:
   - 예: `https://nels-xxx.vercel.app`

### 배포된 사이트 확인

1. 생성된 URL을 클릭하거나
2. 대시보드에서 **"Visit"** 버튼 클릭
3. 사이트가 정상적으로 작동하는지 확인

## 🔄 환경 변수 추가 후 재배포

환경 변수를 나중에 추가하거나 수정했다면:

1. Vercel 대시보드에서 프로젝트 선택
2. **"Deployments"** 탭 클릭
3. 최신 배포 항목 옆의 **"..."** 메뉴 클릭
4. **"Redeploy"** 선택
5. **"Redeploy"** 버튼 클릭

## 📝 배포 후 확인 사항

### ✅ 정상 작동 확인

1. **홈페이지 로드**: 메인 페이지가 정상적으로 표시되는지
2. **뉴스 탭**: 뉴스 목록이 표시되는지
3. **퀴즈 탭**: 퀴즈 페이지가 작동하는지
4. **작문 탭**: 작문 피드백이 작동하는지

### ⚠️ 문제가 있다면

1. **Vercel 대시보드** → **"Deployments"** 탭
2. 최신 배포 항목 클릭
3. **"Logs"** 탭에서 오류 메시지 확인
4. 일반적인 문제:
   - 환경 변수가 설정되지 않음 → 환경 변수 확인
   - 빌드 오류 → 로그에서 오류 확인
   - API 호출 실패 → API 키 확인

## 🔗 도메인 설정 (선택사항)

### 커스텀 도메인 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **"Settings"** → **"Domains"** 클릭
3. 원하는 도메인 입력
4. DNS 설정 안내에 따라 도메인 연결

### 기본 도메인 사용

- Vercel이 자동으로 제공하는 도메인 사용 가능
- 예: `https://your-project-name.vercel.app`
- HTTPS 자동 적용됨

## 🔄 자동 배포 설정

### 자동 배포는 기본으로 활성화되어 있습니다!

- **메인 브랜치에 푸시** → Production 환경에 자동 배포
- **다른 브랜치에 푸시** → Preview 환경에 자동 배포
- **Pull Request 생성** → Preview URL 자동 생성

### 자동 배포 확인

1. GitHub에서 코드 수정
2. GitHub에 푸시
3. Vercel 대시보드에서 자동으로 배포가 시작되는지 확인

## 📊 배포 상태 모니터링

### Vercel 대시보드에서 확인 가능한 정보

- ✅ 배포 상태 (Building, Ready, Error)
- ✅ 배포 시간
- ✅ 빌드 로그
- ✅ 환경 변수 목록
- ✅ 도메인 설정
- ✅ 분석 데이터 (트래픽, 성능 등)

## 🛠️ 문제 해결

### 빌드 실패

**증상**: 배포가 실패하고 "Build Failed" 메시지 표시

**해결 방법**:
1. **"Deployments"** → 최신 배포 클릭
2. **"Logs"** 탭에서 오류 메시지 확인
3. 일반적인 원인:
   - TypeScript 오류 → 로컬에서 `npm run build` 실행하여 확인
   - 의존성 문제 → `package.json` 확인
   - 환경 변수 누락 → 환경 변수 설정 확인

### 환경 변수가 적용되지 않음

**증상**: API 호출이 실패하거나 오류 발생

**해결 방법**:
1. 환경 변수가 올바르게 설정되었는지 확인
2. 환경 변수 추가 후 **반드시 "Redeploy"** 실행
3. 브라우저 콘솔에서 오류 메시지 확인

### 사이트가 로드되지 않음

**증상**: 404 오류 또는 빈 페이지

**해결 방법**:
1. 배포 상태가 "Ready"인지 확인
2. URL이 올바른지 확인
3. Vercel 대시보드에서 배포 로그 확인

## 📚 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 지원 센터](https://vercel.com/support)

## ✅ 체크리스트

배포 전 확인:

- [ ] GitHub 저장소에 코드가 업로드되어 있음
- [ ] Vercel 계정이 생성되어 있음
- [ ] 프로젝트가 Vercel에 import되었음
- [ ] 환경 변수가 모두 설정되었음 (GOOGLE_API_KEY 필수)
- [ ] 배포가 완료되었음
- [ ] 배포된 사이트가 정상 작동함

모든 항목을 체크했다면 배포 완료! 🎉

