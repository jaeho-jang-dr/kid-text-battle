#!/bin/bash

echo "🚀 Kid Text Battle 자동 배포 시작..."
echo ""
echo "배포 옵션을 선택하세요:"
echo "1) Vercel (추천 - 가장 빠름)"
echo "2) Netlify"
echo "3) Railway (PostgreSQL 포함)"
echo "4) Render (무료 PostgreSQL)"
echo ""
read -p "선택 (1-4): " choice

case $choice in
  1)
    echo "🌐 Vercel에 배포 중..."
    npx vercel --prod --yes \
      --env NEXT_PUBLIC_SUPABASE_URL=https://uolhwhuhuiqjyhlwqsjm.supabase.co \
      --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbGh3aHVodWlxanlobHdxc2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTI1MjMsImV4cCI6MjA2OTg4ODUyM30.1EnagPSnyDA_DxM5UKlhaX7FWhHT1fzPoGzQk4maaZQ \
      --env SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbGh3aHVodWlxanlobHdxc2ptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMxMjUyMywiZXhwIjoyMDY5ODg4NTIzfQ.opAjKDYfeKHfoMNb0zew3YXWiZeBgw93rMt7ZFu7pok \
      --env JWT_SECRET=z3QQprKHHAVLV/WsosXSmViMnkTJTUpxFAS/Xh5az70=
    ;;
  2)
    echo "🌐 Netlify에 배포 중..."
    echo "먼저 빌드를 진행합니다..."
    npm run build
    netlify deploy --prod --dir=.next
    ;;
  3)
    echo "🚂 Railway 배포 준비..."
    echo "Railway 웹사이트에서 GitHub 연동을 진행해주세요:"
    echo "https://railway.app/new/github"
    ;;
  4)
    echo "🎨 Render 배포 준비..."
    echo "Render 웹사이트에서 GitHub 연동을 진행해주세요:"
    echo "https://dashboard.render.com/new/web"
    ;;
  *)
    echo "잘못된 선택입니다."
    exit 1
    ;;
esac

echo ""
echo "✨ 배포 프로세스 완료!"