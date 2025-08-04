# Kid Text Battle 배포 가이드

## 🚀 Replit 배포 (권장)

### 1. Replit에서 프로젝트 가져오기
1. [Replit](https://replit.com)에 로그인
2. "Create Repl" 클릭
3. "Import from GitHub" 선택
4. 이 저장소 URL 입력

### 2. 환경 설정
Replit Secrets에 다음 추가 (선택사항):
- `OPENAI_API_KEY`: OpenAI API 키 (AI 배틀 판정용)

### 3. 실행
```bash
npm run replit
```

### 4. 접속 정보
- 메인 페이지: `https://[your-repl-name].repl.co`
- 관리자 페이지: `https://[your-repl-name].repl.co/admin`
- 관리자 로그인: `admin` / `1234`

## 🎯 Render 배포 (대안)

### 1. Render에서 Web Service 생성
1. [Render](https://render.com) 로그인
2. "New +" → "Web Service" 클릭
3. GitHub 저장소 연결

### 2. 설정
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment**: Node

### 3. 환경 변수 추가
- `NODE_ENV`: production
- `USE_SQLITE`: true
- `DATABASE_PATH`: /var/data/kid-text-battle.db
- `JWT_SECRET`: [임의의 시크릿 키]
- `OPENAI_API_KEY`: [OpenAI API 키] (선택사항)

### 4. Persistent Disk 추가
- Mount Path: `/var/data`
- Size: 1GB (무료)

## 📱 로컬 개발

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd kid-text-battle
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일 생성:
```env
NODE_ENV=development
USE_SQLITE=true
DATABASE_PATH=kid-text-battle.db
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key (선택사항)
```

### 4. 데이터베이스 초기화
```bash
npm run setup:db
```

### 5. 개발 서버 실행
```bash
npm run dev
```

## 🔧 문제 해결

### Replit 빌드 오류
```bash
# 캐시 정리 후 재빌드
rm -rf .next node_modules/.cache
npm run build:force
```

### 데이터베이스 초기화 실패
```bash
# 수동으로 초기화
node add-all-animals.js
node setup-admin.js
```

### 포트 충돌
환경 변수에서 `PORT` 변경:
```env
PORT=3001
```

## 📊 모니터링

### 데이터베이스 상태 확인
```bash
node check-db.js
```

### API 테스트
```bash
node test-api.js
```

## 🔒 보안 권장사항

1. **프로덕션 환경에서는 반드시 변경하세요:**
   - 관리자 비밀번호
   - JWT Secret
   - 데이터베이스 경로

2. **HTTPS 사용**
   - Replit과 Render는 자동으로 HTTPS 제공

3. **정기 백업**
   - SQLite 데이터베이스 파일 백업

## 📞 지원

문제가 있으신가요?
- GitHub Issues에 문의
- 관리자 페이지에서 로그 확인