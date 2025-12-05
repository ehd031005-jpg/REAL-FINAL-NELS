# NELS 배포 가이드

이 문서는 NELS 프로젝트를 GitHub에 업로드하고 배포하는 방법을 안내합니다.

## 📋 사전 준비

1. **Git 설치 확인**
   ```bash
   git --version
   ```
   설치되어 있지 않다면 [Git 공식 사이트](https://git-scm.com/downloads)에서 다운로드

2. **GitHub 계정 생성**
   - [GitHub](https://github.com)에서 계정 생성

## 🔧 1단계: GitHub 저장소 생성

1. GitHub에 로그인
2. 우측 상단의 `+` 버튼 클릭 → `New repository`
3. 저장소 정보 입력:
   - Repository name: `nels-english-learning` (원하는 이름)
   - Description: `News English Learning System - 뉴스 기반 영어 학습 플랫폼`
   - Public 또는 Private 선택
   - **Initialize this repository with a README는 체크하지 않기** (이미 README.md가 있음)
4. `Create repository` 클릭

## 📤 2단계: 로컬 프로젝트를 GitHub에 푸시

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
# 1. Git 초기화 (이미 되어있다면 생략)
git init

# 2. 현재 상태 확인
git status

# 3. 모든 파일 추가 (node_modules는 .gitignore에 의해 제외됨)
git add .

# 4. 첫 커밋
git commit -m "Initial commit: NELS project setup"

# 5. GitHub 저장소 연결
# YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경하세요
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. 메인 브랜치로 이름 변경
git branch -M main

# 7. GitHub에 푸시
git push -u origin main
```

### 문제 해결

**인증 오류가 발생하는 경우:**
- GitHub에서 Personal Access Token을 사용해야 할 수 있습니다
- [GitHub Personal Access Token 생성 가이드](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

**이미 Git이 초기화되어 있는 경우:**
```bash
# 기존 원격 저장소 확인
git remote -v

# 기존 원격 저장소 제거 후 새로 추가
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## 🌐 3단계: Vercel에 배포

### Vercel이란?
- Next.js를 만든 회사에서 제공하는 무료 배포 플랫폼
- GitHub와 연동하여 자동 배포 가능
- HTTPS, CDN, 자동 스케일링 등 제공

### 배포 절차

1. **Vercel 가입**
   - [Vercel](https://vercel.com) 접속
   - "Sign Up" 클릭
   - GitHub 계정으로 로그인 (권장)

2. **프로젝트 가져오기**
   - Vercel 대시보드에서 "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 방금 만든 저장소 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: `Next.js` (자동 감지됨)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
   - Install Command: `npm install` (기본값)
   - **"Deploy" 클릭**

4. **환경 변수 설정**
   - 배포가 시작되면 "Environment Variables" 섹션으로 이동
   - 다음 변수들을 추가:
     ```
     GOOGLE_API_KEY=your_google_api_key_here
     OPENAI_API_KEY=your_openai_api_key_here (선택)
     NEWS_API_KEY=your_news_api_key_here (선택)
     ```
   - 각 변수에 대해 환경 선택:
     - Production: 프로덕션 환경
     - Preview: 프리뷰 환경
     - Development: 개발 환경
   - "Save" 클릭

5. **재배포**
   - 환경 변수를 추가한 후 "Redeploy" 클릭하여 재배포

6. **배포 완료**
   - 배포가 완료되면 `https://your-project-name.vercel.app` 형태의 URL이 생성됩니다
   - 이 URL을 클릭하면 배포된 사이트를 확인할 수 있습니다

## 🔄 자동 배포 설정

Vercel은 GitHub 저장소와 연동되어 자동으로 배포됩니다:

- **메인 브랜치에 푸시**: 프로덕션 환경에 자동 배포
- **다른 브랜치에 푸시**: 프리뷰 환경에 자동 배포
- **Pull Request 생성**: 프리뷰 URL 자동 생성

## 📝 업데이트 배포

코드를 수정한 후:

```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "설명: 변경 내용"

# GitHub에 푸시
git push
```

푸시하면 Vercel이 자동으로 감지하여 재배포를 시작합니다.

## 🔍 배포 확인

1. **Vercel 대시보드**
   - [Vercel Dashboard](https://vercel.com/dashboard)에서 배포 상태 확인
   - 각 배포의 로그, 빌드 시간, 오류 등을 확인 가능

2. **배포된 사이트**
   - 생성된 URL로 접속하여 사이트가 정상 작동하는지 확인

## 🛠️ 문제 해결

### 빌드 실패
- Vercel 대시보드의 "Deployments" 탭에서 로그 확인
- 일반적인 원인:
  - 환경 변수 누락
  - 의존성 설치 실패
  - TypeScript 오류

### 환경 변수가 적용되지 않음
- 환경 변수 추가 후 반드시 "Redeploy" 필요
- Production, Preview, Development 환경을 모두 확인

### API 호출 오류
- 브라우저 콘솔에서 CORS 오류 확인
- API 키가 올바르게 설정되었는지 확인
- Vercel의 환경 변수 설정 확인

## 📚 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [GitHub 가이드](https://guides.github.com/)

