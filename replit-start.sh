#!/bin/bash

echo "🚀 Kid Text Battle 시작 중..."
echo "📍 환경: Replit Production"
echo ""

# 환경 변수 설정
export NODE_ENV=production
export USE_SQLITE=true
export DATABASE_PATH=kid-text-battle.db
export JWT_SECRET=kid-text-battle-replit-2024
export ADMIN_DEFAULT_PASSWORD=1234

# 데이터베이스 체크
if [ ! -f "kid-text-battle.db" ]; then
  echo "💾 데이터베이스를 초기화합니다..."
  
  # 동물 데이터 추가
  if [ -f "add-all-animals.js" ]; then
    node add-all-animals.js
  fi
  
  # 관리자 계정 설정
  if [ -f "setup-admin.js" ]; then
    node setup-admin.js
  fi
  
  echo "✅ 데이터베이스 초기화 완료!"
fi

# 서버 시작
echo ""
echo "🌟 서버를 시작합니다..."
echo "📱 접속 주소: https://$REPL_SLUG.$REPL_OWNER.repl.co"
echo "🦄 관리자 페이지: /admin (admin/1234)"
echo ""

# 프로덕션 서버 실행
exec node server.js