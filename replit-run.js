#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Kid Text Battle - Replit 자동 실행 스크립트');
console.log('===========================================\n');

// 1. Git 최신 코드 가져오기
try {
  console.log('📥 최신 코드 가져오는 중...');
  execSync('git fetch --all', { stdio: 'inherit' });
  execSync('git reset --hard origin/main', { stdio: 'inherit' });
  console.log('✅ 최신 코드 업데이트 완료\n');
} catch (error) {
  console.log('⚠️  Git 업데이트 실패 (무시하고 진행)\n');
}

// 2. 캐시 삭제
console.log('🧹 캐시 정리 중...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('node_modules/.cache')) {
    fs.rmSync('node_modules/.cache', { recursive: true, force: true });
  }
  console.log('✅ 캐시 정리 완료\n');
} catch (error) {
  console.log('⚠️  캐시 정리 실패 (무시하고 진행)\n');
}

// 3. 패키지 설치
console.log('📦 패키지 설치 중...');
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ 패키지 설치 완료\n');
} catch (error) {
  console.log('❌ 패키지 설치 실패');
  process.exit(1);
}

// 4. 데이터베이스 초기화
console.log('🗄️  데이터베이스 확인 중...');
const dbPath = path.join(__dirname, 'kid-text-battle.db');
if (!fs.existsSync(dbPath)) {
  console.log('📝 새 데이터베이스 생성됩니다...');
}

// 5. 개발 서버 실행
console.log('🎮 Kid Text Battle 시작합니다!\n');
console.log('===========================================');
console.log('🌐 접속 주소: https://kid-text-battle.{username}.repl.co');
console.log('👤 관리자: admin / 1234');
console.log('===========================================\n');

// 환경변수 설정
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = 'production';
process.env.USE_SQLITE = 'true';

// 개발 모드로 실행 (빌드 시간 단축)
require('child_process').spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});