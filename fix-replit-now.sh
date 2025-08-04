#!/bin/bash

echo "🔧 Kid Text Battle - Replit 긴급 수정 스크립트"
echo "=============================================="
echo ""

# 1. Git 충돌 해결
echo "1️⃣ Git 충돌 해결 중..."
git stash
git pull origin main --force
echo "✅ Git 업데이트 완료"
echo ""

# 2. 캐시 및 빌드 파일 삭제
echo "2️⃣ 캐시 정리 중..."
rm -rf .next node_modules/.cache
echo "✅ 캐시 정리 완료"
echo ""

# 3. 개발 모드로 실행
echo "3️⃣ 개발 서버 시작..."
echo ""
echo "🎮 Kid Text Battle이 곧 시작됩니다!"
echo "🌐 URL: https://kid-text-battle.{username}.repl.co"
echo "👤 관리자: admin / 1234"
echo "=============================================="
echo ""

# 개발 모드로 실행
npm run dev