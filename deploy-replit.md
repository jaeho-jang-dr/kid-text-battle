# Replit 배포 가이드

## 1. Replit 계정 생성
1. https://replit.com 접속
2. 계정 생성 또는 로그인

## 2. 새 Repl 생성
1. "Create Repl" 버튼 클릭
2. "Import from GitHub" 선택
3. GitHub URL 입력: `https://github.com/jaeho-jang-dr/kid-text-battle`
4. Language: Node.js 선택
5. "Import from GitHub" 클릭

## 3. 환경 변수 설정
1. 왼쪽 패널에서 "Secrets" (자물쇠 아이콘) 클릭
2. 다음 환경 변수 추가:
   - `OPENAI_API_KEY`: OpenAI API 키 입력
   - `NODE_ENV`: production
   - `USE_SQLITE`: true
   - `DATABASE_PATH`: /home/runner/kid-text-battle/kid-text-battle.db
   - `JWT_SECRET`: kid-text-battle-replit-secret-2024
   - `ADMIN_DEFAULT_PASSWORD`: 1234

## 4. 프로젝트 설정 파일 추가
Shell에서 다음 명령어 실행:

```bash
# .replit 파일 생성
cat > .replit << 'EOF'
run = "npm run start"
entrypoint = "server.js"

[deployment]
run = ["sh", "-c", "npm run build && npm run start"]

[languages]
[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx}"

[nix]
channel = "stable-22_11"

[[ports]]
localPort = 3000
externalPort = 80
EOF

# replit.nix 파일 생성
cat > replit.nix << 'EOF'
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.npm
  ];
}
EOF
```

## 5. 실행
1. "Run" 버튼 클릭
2. 자동으로 다음 작업 수행:
   - npm install
   - npm run build
   - npm run start
3. 웹뷰에서 앱 확인

## 6. 도메인 확인
- Replit URL: `https://kid-text-battle.YOUR-USERNAME.repl.co`

## 7. 관리자 로그인
1. 오른쪽 하단 유니콘(🦄) 아이콘 클릭
2. 이메일: admin
3. 비밀번호: 1234

## 주의사항
- 무료 계정은 일정 시간 후 슬립 모드로 전환됨
- 첫 접속 시 약간의 로딩 시간 필요
- SQLite 데이터베이스는 Repl 내부에 저장됨