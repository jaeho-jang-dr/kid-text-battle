#!/bin/bash
echo "🔍 Replit 디버깅 스크립트 시작..."

# 환경 변수 확인
echo -e "\n📋 환경 변수 확인:"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_PATH: $DATABASE_PATH"

# 프로세스 확인
echo -e "\n🔄 실행 중인 Node 프로세스:"
ps aux | grep node | grep -v grep

# 포트 사용 확인
echo -e "\n🌐 포트 사용 상태:"
netstat -tulpn 2>/dev/null | grep :3000 || lsof -i :3000 2>/dev/null

# 데이터베이스 파일 확인
echo -e "\n💾 데이터베이스 파일:"
ls -la *.db 2>/dev/null || echo "데이터베이스 파일 없음"

# 빌드 상태 확인
echo -e "\n📦 빌드 상태:"
ls -la .next 2>/dev/null | head -5 || echo ".next 폴더 없음"

# 서버 테스트
echo -e "\n🧪 로컬 서버 테스트:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "서버 응답 없음"

echo -e "\n✅ 디버깅 완료!"