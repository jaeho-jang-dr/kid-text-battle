#!/bin/bash

# Netlify 자동 배포 스크립트
# Kid Text Battle 앱을 Netlify에 자동으로 배포합니다.

echo "🚀 Kid Text Battle Netlify 배포 시작..."

# Netlify CLI 설치 확인
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI 설치 중..."
    npm i -g netlify-cli
fi

# 빌드
echo "🔨 프로젝트 빌드 중..."
npm run build

# Netlify 배포
echo "🌐 Netlify에 배포 중..."
netlify deploy --prod --dir=.next

echo "✨ 배포 완료!"
echo ""
echo "💡 다음 단계:"
echo "1. Netlify 대시보드에서 프로젝트 확인: https://app.netlify.com"
echo "2. 환경변수 설정 (Site settings > Environment variables)"
echo "3. 커스텀 도메인 설정 (Domain management)"