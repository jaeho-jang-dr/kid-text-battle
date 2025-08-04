#!/bin/bash

echo "🚨 Kid Text Battle - 긴급 완전 수정"
echo "========================================"
echo ""

# 1. 모든 프로세스 중지
echo "1️⃣ 기존 프로세스 중지..."
pkill -f node || true
echo "✅ 완료"
echo ""

# 2. 완전 초기화
echo "2️⃣ 완전 초기화 중..."
rm -rf .next node_modules package-lock.json
rm -rf .cache .next/cache
echo "✅ 완료"
echo ""

# 3. Git 최신 코드 가져오기
echo "3️⃣ 최신 코드 가져오기..."
git fetch origin
git reset --hard origin/main
echo "✅ 완료"
echo ""

# 4. CSS 파일 완전 재작성
echo "4️⃣ CSS 파일 수정..."
cat > app/globals.css << 'EOF'
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
}

/* Basic styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Flexbox */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* Text */
.text-center { text-align: center; }
.font-bold { font-weight: bold; }

/* Colors */
.bg-white { background: white; }
.bg-gray-100 { background: #f5f5f5; }
.text-white { color: white; }
.text-gray-700 { color: #333; }

/* Button */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Card */
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Grid */
.grid {
  display: grid;
  gap: 20px;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Spacing */
.p-2 { padding: 8px; }
.p-4 { padding: 16px; }
.m-2 { margin: 8px; }
.m-4 { margin: 16px; }
.gap-4 { gap: 16px; }

/* Responsive */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}
EOF
echo "✅ 완료"
echo ""

# 5. 패키지 재설치
echo "5️⃣ 패키지 설치..."
npm install --legacy-peer-deps
echo "✅ 완료"
echo ""

# 6. 개발 서버 시작
echo "6️⃣ 서버 시작..."
echo ""
echo "🎮 Kid Text Battle 시작!"
echo "🌐 URL: https://kid-text-battle.{username}.repl.co"
echo "👤 관리자: admin / 1234"
echo "========================================"
echo ""

# 개발 모드로 실행
npm run dev