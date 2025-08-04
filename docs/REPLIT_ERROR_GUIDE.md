# Replit Kid Text Battle 에러 해결 가이드

## 🚨 일반적인 에러와 해결 방법

### 1. 모듈 설치 에러
```
Error: Cannot find module 'better-sqlite3'
```

**해결 방법:**
```bash
# 방법 1: 문제 해결 스크립트 실행
chmod +x replit-troubleshoot.sh
./replit-troubleshoot.sh
# 옵션 1 선택

# 방법 2: 수동 해결
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 2. 빌드 에러 (메모리 부족)
```
Error: JavaScript heap out of memory
```

**해결 방법:**
```bash
# 메모리 최적화 빌드
export NODE_OPTIONS='--max-old-space-size=512'
npm run build:force

# 또는 문제 해결 스크립트
./replit-troubleshoot.sh
# 옵션 2 선택
```

### 3. 포트 충돌
```
Error: Port 3000 is already in use
```

**해결 방법:**
```bash
# 프로세스 종료 및 재시작
pkill -f node
npm run replit

# 또는 문제 해결 스크립트
./replit-troubleshoot.sh
# 옵션 3 선택
```

### 4. 권한 문제
```
Error: Permission denied
```

**해결 방법:**
```bash
# 실행 권한 설정
chmod +x replit-start.sh
chmod +x server.js
chmod 666 kid-text-battle.db

# 또는 문제 해결 스크립트
./replit-troubleshoot.sh
# 옵션 4 선택
```

### 5. 데이터베이스 에러
```
Error: SQLITE_CANTOPEN
```

**해결 방법:**
```bash
# 데이터베이스 재생성
rm -f kid-text-battle.db
npm run replit  # 자동으로 재생성됨
```

## 🔧 빠른 수정 방법

### 전체 리셋 (모든 문제 해결)
```bash
# 1. 빠른 수정 스크립트 실행
node replit-quick-fix.js

# 2. 문제 해결 스크립트로 전체 리셋
./replit-troubleshoot.sh
# 옵션 6 선택

# 3. 서버 재시작
npm run replit
```

### 환경 변수 확인
```bash
./replit-troubleshoot.sh
# 옵션 5 선택
```

## 🚀 대안 배포 방법

### 방법 1: Shell 탭에서 직접 실행
```bash
# Replit Shell에서
npm install --legacy-peer-deps
npm run build:force
npm run start
```

### 방법 2: 개발 모드로 실행
```bash
# .replit 파일 수정
run = "npm run dev"

# 그 후 Replit Run 버튼 클릭
```

### 방법 3: 수동 서버 실행
```bash
# Shell에서 직접 실행
export NODE_ENV=production
export PORT=3000
node server.js
```

## 📋 체크리스트

문제 해결 전 확인사항:
- [ ] node_modules 폴더가 존재하는가?
- [ ] .next 폴더가 존재하는가?
- [ ] kid-text-battle.db 파일이 존재하는가?
- [ ] 포트 3000이 사용 가능한가?
- [ ] 메모리가 충분한가? (512MB 이상)

## 🆘 추가 도움말

### Replit 콘솔에서 로그 확인
```bash
# 에러 로그 확인
cat ~/.npm/_logs/*.log

# 프로세스 확인
ps aux | grep node

# 포트 사용 확인
netstat -tlnp | grep 3000
```

### 캐시 정리
```bash
# npm 캐시 정리
npm cache clean --force

# Replit 캐시 정리 (Shell에서)
rm -rf ~/.cache/*
```

## 💡 팁

1. **메모리 절약**: 빌드 시 브라우저 탭을 최소화하세요
2. **빠른 재시작**: Ctrl+C로 중지 후 위쪽 화살표로 이전 명령 재실행
3. **자동 재시작**: Replit이 자동으로 재시작하는 경우 1-2분 기다리세요

## 🎯 문제가 계속되면

1. Replit 프로젝트를 Fork하여 새로 시작
2. 로컬에서 빌드 후 .next 폴더를 업로드
3. GitHub에서 최신 버전을 다시 Import

---

마지막 업데이트: 2025-08-04