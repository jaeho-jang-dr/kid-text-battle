#!/bin/bash
echo "🚀 Replit 빠른 수정 스크립트"
echo "================================"

# 1. 기존 프로세스 종료
echo "1️⃣ 기존 프로세스 종료 중..."
pkill -f node
sleep 2

# 2. 환경 변수 설정
echo "2️⃣ 환경 변수 설정 중..."
export PORT=3000
export NODE_ENV=production
export USE_SQLITE=true
export DATABASE_PATH=kid-text-battle.db
export JWT_SECRET=kid-text-battle-secret-2024
export ADMIN_DEFAULT_PASSWORD=1234

# 3. 데이터베이스 권한 설정
echo "3️⃣ 데이터베이스 권한 설정 중..."
if [ -f "kid-text-battle.db" ]; then
  chmod 666 kid-text-battle.db
  echo "✅ 데이터베이스 권한 설정 완료"
else
  echo "⚠️  데이터베이스 파일이 없습니다. 첫 실행 시 자동 생성됩니다."
fi

# 4. 종속성 확인
echo "4️⃣ 종속성 확인 중..."
if [ ! -d "node_modules" ]; then
  echo "📦 종속성 설치 중... (2-3분 소요)"
  npm install
fi

# 5. 빌드 확인
echo "5️⃣ 빌드 상태 확인 중..."
if [ ! -d ".next" ]; then
  echo "🔨 빌드 중... (1-2분 소요)"
  npm run build
fi

# 6. 서버 시작
echo "6️⃣ 서버 시작 중..."
echo "🌐 포트 3000에서 실행됩니다."
echo "📍 URL: https://kid-text-battle-1.drjang000.repl.co"
echo "================================"
npm run start