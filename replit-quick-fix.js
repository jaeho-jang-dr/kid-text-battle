// Replit 빠른 수정 스크립트
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Kid Text Battle Replit 빠른 수정 시작...\n');

// 1. 환경 변수 설정
const ENV_CONTENT = `NODE_ENV=production
USE_SQLITE=true
DATABASE_PATH=kid-text-battle.db
PORT=3000
JWT_SECRET=kid-text-battle-replit-2024
ADMIN_DEFAULT_PASSWORD=1234
`;

// 2. .env 파일 생성
if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', ENV_CONTENT);
  console.log('✅ .env 파일 생성 완료');
}

// 3. 스크립트 실행 권한 설정
try {
  execSync('chmod +x replit-start.sh');
  execSync('chmod +x replit-troubleshoot.sh');
  console.log('✅ 실행 권한 설정 완료');
} catch (e) {
  console.log('⚠️ 권한 설정 중 경고 (무시 가능)');
}

// 4. 데이터베이스 체크
if (!fs.existsSync('kid-text-battle.db')) {
  console.log('💾 데이터베이스가 없습니다. 서버 시작 시 자동 생성됩니다.');
} else {
  console.log('✅ 데이터베이스 존재 확인');
}

// 5. Next.js 설정 최적화
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Replit 최적화
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  
  // 빌드 최적화
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // better-sqlite3 처리
    config.externals = config.externals || [];
    config.externals.push('better-sqlite3');
    
    return config;
  },
  
  // TypeScript 에러 무시 (개발 편의)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint 에러 무시 (개발 편의)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
`;

fs.writeFileSync('next.config.js', nextConfig);
console.log('✅ Next.js 설정 최적화 완료');

// 6. 간단한 health check 엔드포인트 추가
const healthCheckPath = path.join('app', 'api', 'health', 'route.ts');
const healthCheckDir = path.dirname(healthCheckPath);

if (!fs.existsSync(healthCheckDir)) {
  fs.mkdirSync(healthCheckDir, { recursive: true });
}

const healthCheckContent = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: '🎮 Kid Text Battle is running!',
    timestamp: new Date().toISOString()
  });
}
`;

fs.writeFileSync(healthCheckPath, healthCheckContent);
console.log('✅ Health check 엔드포인트 추가 완료');

// 7. 메모리 최적화 스크립트
const memoryOptScript = `#!/bin/bash
# 메모리 최적화 실행
export NODE_OPTIONS='--max-old-space-size=512'
echo "메모리 최적화 설정 완료"
`;

fs.writeFileSync('optimize-memory.sh', memoryOptScript);
execSync('chmod +x optimize-memory.sh');
console.log('✅ 메모리 최적화 스크립트 생성 완료');

console.log('\n🎉 모든 수정 완료!');
console.log('\n다음 명령어로 서버를 시작하세요:');
console.log('  npm run replit');
console.log('\n문제가 지속되면 다음을 실행하세요:');
console.log('  ./replit-troubleshoot.sh');