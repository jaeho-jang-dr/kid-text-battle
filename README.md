# 🦁 Kid Text Battle - 동물 텍스트 배틀 게임

초등학생(7-10세)을 위한 재미있고 교육적인 온라인 텍스트 배틀 게임입니다.

## 🎮 주요 기능

- **80종의 다양한 동물**: 현존 동물, 전설의 동물, 고생대 동물
- **창의적인 텍스트 배틀**: 상상력을 발휘해 배틀 텍스트 작성
- **안전한 환경**: 부적절한 내용 자동 필터링
- **ELO 점수 시스템**: 실력 기반 공정한 매칭
- **봇 대전**: 연습용 무제한 봇 배틀
- **일일 배틀 제한**: 캐릭터당 하루 10회 (봇 제외)

## 🚀 빠른 시작

### Replit에서 바로 시작하기 (가장 쉬움)

1. [이 링크](https://replit.com/@your-username/kid-text-battle)를 클릭하여 Replit으로 이동
2. "Fork" 버튼 클릭
3. "Run" 버튼을 눌러 서버 시작
4. 자동으로 열리는 웹뷰에서 게임 시작!

### 로컬에서 실행하기

```bash
# 프로젝트 클론
git clone https://github.com/your-username/kid-text-battle.git
cd kid-text-battle

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

## 📱 사용 방법

1. **홈페이지**: 게스트 또는 이메일로 로그인
2. **동물 도감**: 80종의 동물 확인 및 능력치 보기
3. **캐릭터 생성**: 마음에 드는 동물로 캐릭터 만들기
4. **배틀**: 다른 플레이어와 텍스트 배틀
5. **리더보드**: 최강의 캐릭터 확인

## 🦄 관리자 기능

- 홈페이지 우측 하단 유니콘(🦄) 버튼 클릭
- 로그인: `admin` / `1234`
- 사용자 관리, 배틀 로그, 통계 확인 가능

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (개발/Replit), PostgreSQL (프로덕션 옵션)
- **Animation**: Framer Motion
- **Deployment**: Replit, Render

## 📋 환경 변수

```env
NODE_ENV=production
USE_SQLITE=true
DATABASE_PATH=kid-text-battle.db
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key (선택사항)
```

## 🔧 주요 명령어

```bash
npm run dev          # 개발 서버 (포트 3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run replit       # Replit 전용 시작
npm run setup:db     # 데이터베이스 초기화
node check-db.js     # 데이터베이스 상태 확인
```

## 📁 프로젝트 구조

```
kid-text-battle/
├── app/                    # Next.js 13 App Router
│   ├── api/               # API 엔드포인트
│   ├── (pages)/           # 페이지 컴포넌트
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── db.ts             # 데이터베이스 어댑터
│   └── filters/          # 콘텐츠 필터
├── data/                  # 정적 데이터
│   └── animals.json      # 동물 데이터
└── public/               # 정적 파일
```

## 🎯 게임 규칙

1. **캐릭터 생성**: 계정당 최대 3개
2. **배틀 텍스트**: 10-500자 제한
3. **일일 배틀**: 캐릭터당 10회 (봇 제외)
4. **점수 시스템**: ELO 기반 (기본 1200점)
5. **경고 시스템**: 부적절한 내용 3회 경고시 정지

## 🔒 보안 및 안전

- 모든 텍스트 자동 필터링
- 십계명 위반 감지
- 한국어/영어 욕설 차단
- 3회 경고시 자동 계정 정지
- 아동 친화적 메시지만 표시

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이센스

MIT License - 자유롭게 사용하세요!

## 🙏 감사의 말

- 모든 테스터와 피드백 제공자
- 오픈소스 커뮤니티

---

**문제가 있나요?** GitHub Issues에 알려주세요!
**즐거운 배틀 되세요!** 🦁⚔️🦄