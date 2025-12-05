# GitHub 웹사이트에서 직접 파일 업로드하기

Git을 설치하지 않고도 GitHub 웹사이트에서 직접 파일을 업로드할 수 있습니다!

## 📤 단계별 가이드

### 1단계: GitHub 저장소 생성

1. [GitHub.com](https://github.com)에 로그인
2. 우측 상단의 `+` 버튼 클릭 → `New repository`
3. 저장소 정보 입력:
   - **Repository name**: `nels-english-learning` (원하는 이름)
   - **Description**: `News English Learning System - 뉴스 기반 영어 학습 플랫폼`
   - **Public** 또는 **Private** 선택
   - **Initialize this repository with a README** 체크하지 않기
4. `Create repository` 클릭

### 2단계: 파일 업로드

1. 저장소가 생성되면 "uploading an existing file" 링크를 클릭하거나
2. 또는 저장소 페이지에서 `Add file` 버튼 클릭 → `Upload files` 선택

### 3단계: 파일 드래그 앤 드롭

1. **중요**: 다음 파일/폴더는 업로드하지 마세요:
   - `node_modules/` 폴더 (너무 크고 불필요)
   - `.env.local` 파일 (보안상 위험)
   - `.next/` 폴더 (빌드 파일)
   - `.git/` 폴더 (이미 있다면)

2. **업로드할 파일/폴더**:
   - `app/` 폴더 전체
   - `components/` 폴더 전체
   - `lib/` 폴더 전체
   - `types/` 폴더 전체
   - `public/` 폴더 (있다면)
   - `package.json`
   - `package-lock.json`
   - `tsconfig.json`
   - `tailwind.config.js`
   - `next.config.js`
   - `postcss.config.js`
   - `README.md`
   - `DEPLOYMENT.md`
   - `.gitignore`
   - 기타 설정 파일들

3. 파일을 드래그 앤 드롭하거나 "choose your files" 클릭하여 선택

### 4단계: 커밋 및 푸시

1. 페이지 하단의 "Commit changes" 섹션에서:
   - **Commit message**: `Initial commit: NELS project`
   - **Add description** (선택사항): 프로젝트 설명
2. `Commit changes` 버튼 클릭

### 5단계: 추가 파일 업로드

한 번에 모든 파일을 업로드할 수 없으면:
1. `Add file` → `Upload files`를 다시 클릭
2. 나머지 파일들을 추가로 업로드
3. 각 업로드마다 커밋 메시지 작성 후 `Commit changes`

## ⚠️ 주의사항

### 업로드하지 말아야 할 것들

다음은 `.gitignore`에 포함되어 있지만, 웹 업로드 시 수동으로 제외해야 합니다:

- ❌ `node_modules/` - 너무 크고 npm install로 재생성 가능
- ❌ `.env.local` - API 키 등 보안 정보 포함
- ❌ `.next/` - 빌드 파일 (자동 생성됨)
- ❌ `.vercel/` - 배포 설정 파일
- ❌ `*.log` - 로그 파일

### 파일 크기 제한

- GitHub는 개별 파일 100MB, 저장소 1GB 제한이 있습니다
- `node_modules`는 보통 수백 MB이므로 업로드하지 마세요

## 🚀 다음 단계: Vercel 배포

파일 업로드가 완료되면:

1. [Vercel](https://vercel.com)에 가입 (GitHub 계정으로)
2. "New Project" 클릭
3. 방금 만든 GitHub 저장소 선택
4. 환경 변수 설정:
   - `GOOGLE_API_KEY`
   - `OPENAI_API_KEY` (선택)
   - `NEWS_API_KEY` (선택)
5. "Deploy" 클릭

## 💡 팁

### 파일이 너무 많을 때

폴더 단위로 압축해서 업로드할 수도 있지만, GitHub는 ZIP 파일을 자동으로 압축 해제하지 않습니다. 따라서 개별 파일/폴더를 직접 업로드하는 것이 좋습니다.

### 나중에 파일 수정하기

1. GitHub 저장소에서 파일 클릭
2. 연필 아이콘(✏️) 클릭하여 편집
3. 변경사항 커밋

### 로컬에서 작업하고 싶을 때

나중에 Git을 설치하면:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

이렇게 하면 로컬에서도 작업할 수 있습니다.

