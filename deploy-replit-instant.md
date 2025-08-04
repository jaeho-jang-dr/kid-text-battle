# Replit 즉시 배포 가이드 (5분 내 완료)

## 가장 빠른 방법 (복사-붙여넣기)

### 1. Replit 계정 생성
- https://replit.com 접속
- Google/GitHub으로 간편 로그인

### 2. 새 Repl 생성
1. "Create Repl" 클릭
2. Template: "Node.js" 선택
3. Title: "kid-text-battle"
4. "Create Repl" 클릭

### 3. 코드 업로드
1. 왼쪽 Files 패널에서 모든 기본 파일 삭제
2. "Upload folder" 클릭
3. 로컬 `kid-text-battle` 폴더 전체 업로드

### 4. 설정 파일 생성
Shell 탭에서 다음 명령어 실행:

```bash
# .replit 파일 생성
echo 'run = "npm run start"
entrypoint = "server.js"

[deployment]
run = ["sh", "-c", "npm run build && npm run start"]

[[ports]]
localPort = 3000
externalPort = 80' > .replit

# replit.nix 파일 생성
echo '{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
  ];
}' > replit.nix
```

### 5. 환경 변수 설정 (필수!)
1. 왼쪽 패널 "Secrets" (자물쇠 아이콘) 클릭
2. 다음 추가:
   - `OPENAI_API_KEY` = `당신의 OpenAI API 키` ⚠️ 필수!
   - `NODE_ENV` = `production`
   - `USE_SQLITE` = `true`
   - `DATABASE_PATH` = `kid-text-battle.db`
   - `JWT_SECRET` = `kid-text-battle-secret-2024`
   - `ADMIN_DEFAULT_PASSWORD` = `1234`

### 6. 실행
1. "Run" 버튼 클릭
2. 첫 실행 시 자동으로:
   - npm install (2-3분)
   - npm run build (1-2분)
   - npm run start

### 7. 완료!
- URL: `https://kid-text-battle.[your-username].repl.co`
- 웹뷰에서 바로 테스트 가능

## 관리자 접속
1. 오른쪽 하단 유니콘(🦄) 클릭
2. 이메일: `admin`
3. 비밀번호: `1234`

## 장점
- ✅ 5분 내 배포 완료
- ✅ 복잡한 설정 불필요
- ✅ SQLite 자동 지원
- ✅ 무료 HTTPS
- ✅ 코드 편집기 내장

## 단점
- ⚠️ 무료: 1시간 비활성 시 슬립
- ⚠️ 첫 접속 시 10-20초 로딩

## OpenAI API 키 받는 방법
1. https://platform.openai.com 접속
2. 로그인 → API Keys
3. "Create new secret key"
4. 복사하여 Replit Secrets에 붙여넣기

## 에러 해결
- "Cannot find module": Run 버튼 다시 클릭
- "OpenAI API error": Secrets에서 OPENAI_API_KEY 확인
- 빌드 실패: Shell에서 `npm install` 수동 실행