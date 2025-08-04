#!/bin/bash

echo "🔧 Kid Text Battle Replit 문제 해결 스크립트"
echo "============================================"
echo ""

# 1. node_modules 정리
fix_modules() {
  echo "📦 node_modules 문제 해결 중..."
  rm -rf node_modules package-lock.json
  npm cache clean --force
  npm install --legacy-peer-deps
  echo "✅ 모듈 재설치 완료!"
}

# 2. 빌드 에러 해결
fix_build() {
  echo "🏗️ 빌드 에러 해결 중..."
  rm -rf .next
  export NODE_OPTIONS='--max-old-space-size=512'
  npm run build:force
  echo "✅ 빌드 완료!"
}

# 3. 포트 충돌 해결
fix_port() {
  echo "🔌 포트 충돌 해결 중..."
  # 기존 프로세스 종료
  pkill -f "node.*server.js" || true
  pkill -f "next" || true
  echo "✅ 포트 정리 완료!"
}

# 4. 데이터베이스 권한 문제
fix_permissions() {
  echo "🔐 권한 문제 해결 중..."
  # 데이터베이스 파일 권한 설정
  if [ -f "kid-text-battle.db" ]; then
    chmod 666 kid-text-battle.db
  fi
  # 실행 파일 권한 설정
  chmod +x replit-start.sh
  chmod +x server.js
  echo "✅ 권한 설정 완료!"
}

# 5. 환경 변수 체크
check_env() {
  echo "🌍 환경 변수 확인 중..."
  
  # 필수 환경 변수 설정
  export NODE_ENV=production
  export USE_SQLITE=true
  export DATABASE_PATH=kid-text-battle.db
  export PORT=3000
  export JWT_SECRET=${JWT_SECRET:-"kid-text-battle-replit-2024"}
  export ADMIN_DEFAULT_PASSWORD=${ADMIN_DEFAULT_PASSWORD:-"1234"}
  
  echo "NODE_ENV: $NODE_ENV"
  echo "USE_SQLITE: $USE_SQLITE"
  echo "DATABASE_PATH: $DATABASE_PATH"
  echo "PORT: $PORT"
  echo "JWT_SECRET: [설정됨]"
  echo "ADMIN_DEFAULT_PASSWORD: [설정됨]"
  echo "✅ 환경 변수 확인 완료!"
}

# 6. 전체 리셋
full_reset() {
  echo "🔄 전체 시스템 리셋 중..."
  fix_port
  fix_modules
  fix_permissions
  check_env
  fix_build
  echo "✅ 전체 리셋 완료!"
}

# 메뉴 표시
echo "어떤 문제를 해결하시겠습니까?"
echo ""
echo "1) 모듈 설치 에러 (Cannot find module)"
echo "2) 빌드 에러 (Next.js build failed)"
echo "3) 포트 충돌 (Port already in use)"
echo "4) 권한 문제 (Permission denied)"
echo "5) 환경 변수 확인"
echo "6) 전체 리셋 (모든 문제 해결)"
echo ""
read -p "선택 (1-6): " choice

case $choice in
  1) fix_modules ;;
  2) fix_build ;;
  3) fix_port ;;
  4) fix_permissions ;;
  5) check_env ;;
  6) full_reset ;;
  *) echo "잘못된 선택입니다." ;;
esac

echo ""
echo "🎯 문제가 해결되었다면 'npm run replit'으로 서버를 시작하세요!"