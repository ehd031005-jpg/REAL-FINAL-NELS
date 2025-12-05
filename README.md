# NELS - News English Learning System

뉴스 기반 영어 학습 플랫폼

## 📖 프로젝트 소개

NELS (News English Learning System)는 뉴스 컨텐츠를 기반으로 영어를 학습하는 맥락 중심 영어 학습 플랫폼입니다. 사용자는 최신 시사 뉴스를 통해 영어 표현뿐 아니라 문화적 배경, 사회적 맥락, 비판적 사고력을 함께 학습할 수 있습니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## ⚙️ 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정하세요:

```env
# AI API 키 (필수 중 하나)
GOOGLE_API_KEY=your_google_api_key_here
# 또는
OPENAI_API_KEY=your_openai_api_key_here

# 실시간 뉴스 (선택, 있으면 최신 뉴스 표시)
NEWS_API_KEY=your_news_api_key_here
```

### API 키 발급 방법

- **Google AI API 키**: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급
- **OpenAI API 키**: [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급
- **NewsAPI 키**: [NewsAPI.org](https://newsapi.org/register)에서 무료로 발급 (하루 100회 요청 가능)

> **참고**: 
> - AI API 키가 없어도 앱은 동작하지만, AI 기능은 샘플 데이터로 동작합니다.
> - NewsAPI 키가 없어도 샘플 뉴스가 표시됩니다.

## ✨ 주요 기능

### 1. Daily News Digest
- AI가 매일 주요 글로벌 뉴스를 선별해 학습자 수준(초급·중급·고급)에 맞게 요약 제공
- 핵심 어휘, 문법 포인트, 주요 문장 구조 자동 표시
- 기사 본문에는 발음 듣기 기능과 관련 주제 링크 포함

### 2. Cultural Context Card
- 기사에 등장하는 문화적 배경, 사회적 맥락, 관용 표현 등을 카드 형태로 정리
- 각 카드에는 짧은 설명, 예문, 관련 이미지가 포함되어 직관적 이해를 돕습니다

### 3. Writing Feedback
- 학습자가 기사에 대한 의견문을 영어로 작성하면 AI가 문법·어휘·논리적 구조를 피드백
- 단순 교정 중심이 아니라, 학습자가 작성한 글의 장단점을 균형 있게 시각화
- 수정 전후 비교 기능 및 피드백 리포트 자동 생성

### 4. Rephrase and Compare
- 같은 문장을 초급, 중급, 고급 수준의 영어로 자동 변환
- 문체 차이를 색상으로 구분하여 비교하여 자연스럽게 표현력과 문체 감각 향상
- 구어체 영어와 문어체 영어의 차이를 학습 가능

### 5. Vocabulary Quiz
- 기사 내 주요 어휘와 표현에 관해 자동 생성되는 퀴즈
- 오답은 "Review List"에 저장되어 주기적 복습 가능함
- 학습 리마인더 (7일, 14일) 기능으로 반복 학습 유도

## 📁 프로젝트 구조

```
project/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── news/              # 뉴스 페이지
│   ├── quiz/              # 퀴즈 페이지
│   ├── writing/           # 작문 피드백 페이지
│   ├── review/            # 복습 리스트 페이지
│   └── about/             # 소개 페이지
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수
├── types/                 # TypeScript 타입 정의
└── public/                # 정적 파일
```

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (optional)

## 🚀 배포하기

### GitHub에 코드 업로드

1. **GitHub 저장소 생성**
   - [GitHub](https://github.com)에 로그인
   - 새 저장소 생성 (예: `nels-english-learning`)

2. **로컬에서 Git 초기화 및 푸시**
   ```bash
   # Git 초기화 (이미 되어있다면 생략)
   git init
   
   # 모든 파일 추가
   git add .
   
   # 첫 커밋
   git commit -m "Initial commit: NELS project"
   
   # GitHub 저장소 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 메인 브랜치로 푸시
   git branch -M main
   git push -u origin main
   ```

### Vercel에 배포 (권장)

Vercel은 Next.js 프로젝트에 최적화된 배포 플랫폼입니다.

1. **Vercel 계정 생성**
   - [Vercel](https://vercel.com)에 가입 (GitHub 계정으로 간편 가입 가능)

2. **프로젝트 배포**
   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정:
     - Framework Preset: Next.js (자동 감지)
     - Root Directory: `./` (기본값)
     - Build Command: `npm run build` (기본값)
     - Output Directory: `.next` (기본값)

3. **환경 변수 설정**
   - Vercel 프로젝트 설정 → Environment Variables
   - 다음 변수들을 추가:
     ```
     GOOGLE_API_KEY=your_google_api_key
     OPENAI_API_KEY=your_openai_api_key (선택)
     NEWS_API_KEY=your_news_api_key (선택)
     ```
   - 각 환경(Production, Preview, Development)에 적용

4. **배포 완료**
   - 배포가 완료되면 자동으로 URL이 생성됩니다 (예: `https://nels-xxx.vercel.app`)
   - 이후 GitHub에 푸시할 때마다 자동으로 재배포됩니다

### 다른 배포 옵션

#### Netlify
- [Netlify](https://www.netlify.com)에서도 동일하게 배포 가능
- GitHub 저장소 연결 후 자동 배포 설정

#### 자체 서버
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔒 보안 주의사항

- **절대 `.env.local` 파일을 Git에 커밋하지 마세요**
- `.gitignore`에 이미 `.env*.local`이 포함되어 있습니다
- API 키는 배포 플랫폼의 환경 변수 설정에서만 관리하세요

## 📝 라이센스

이 프로젝트는 교육 목적으로 만들어졌습니다.
