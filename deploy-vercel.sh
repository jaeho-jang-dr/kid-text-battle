#!/bin/bash

# Vercel 자동 배포 스크립트
# Kid Text Battle 앱을 Vercel에 자동으로 배포합니다.

echo "🚀 Kid Text Battle Vercel 배포 시작..."

# Vercel CLI 설치 확인
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI 설치 중..."
    npm i -g vercel
fi

# 환경변수 설정 파일 생성
cat > .env.production << EOL
NEXT_PUBLIC_SUPABASE_URL=https://uolhwhuhuiqjyhlwqsjm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbGh3aHVodWlxanlobHdxc2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTI1MjMsImV4cCI6MjA2OTg4ODUyM30.1EnagPSnyDA_DxM5UKlhaX7FWhHT1fzPoGzQk4maaZQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbGh3aHVodWlxanlobHdxc2ptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMxMjUyMywiZXhwIjoyMDY5ODg4NTIzfQ.opAjKDYfeKHfoMNb0zew3YXWiZeBgw93rMt7ZFu7pok
JWT_SECRET=z3QQprKHHAVLV/WsosXSmViMnkTJTUpxFAS/Xh5az70=
EOL

echo "✅ 환경변수 설정 완료"

# Vercel 배포
echo "🌐 Vercel에 배포 중..."
vercel --prod --yes

echo "✨ 배포 완료!"
echo ""
echo "💡 다음 단계:"
echo "1. Vercel 대시보드에서 프로젝트 확인: https://vercel.com/dashboard"
echo "2. 환경변수 설정 확인 (Settings > Environment Variables)"
echo "3. 도메인 설정 (Settings > Domains)"