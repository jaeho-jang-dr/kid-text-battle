const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// 환경 변수 로드
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Next.js 앱 생성
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// 데이터베이스 초기화 함수
async function initializeDatabase() {
  const dbPath = process.env.DATABASE_PATH || 'kid-text-battle.db';
  
  // 데이터베이스가 없으면 생성
  if (!fs.existsSync(dbPath)) {
    console.log('데이터베이스가 없습니다. 새로 생성합니다...');
    
    try {
      // db-sqlite 모듈 로드하여 초기화
      const { db } = require('./lib/db-sqlite');
      
      // 동물 데이터 추가
      const animals = require('./data/animals.json');
      console.log(`${animals.length}개의 동물 데이터를 추가합니다...`);
      
      // 관리자 계정 생성
      const { v4: uuidv4 } = require('uuid');
      const adminId = uuidv4();
      db.prepare(`
        INSERT OR IGNORE INTO admin_users (id, username, password_hash, display_name, permissions, is_active, created_at)
        VALUES (?, 'admin', '1234', '시스템 관리자', 'all', 1, datetime('now'))
      `).run(adminId);
      console.log('관리자 계정이 생성되었습니다 (admin/1234)');
      
      // 샘플 봇 캐릭터 생성
      console.log('샘플 봇 캐릭터를 생성합니다...');
      const botUserIds = [];
      for (let i = 1; i <= 5; i++) {
        const userId = uuidv4();
        botUserIds.push(userId);
        db.prepare(`
          INSERT INTO users (id, email, is_guest, display_name, created_at)
          VALUES (?, ?, 0, ?, datetime('now'))
        `).run(userId, `bot${i}@kidtextbattle.com`, `봇 플레이어 ${i}`);
      }
      
      // 각 봇 유저에게 캐릭터 생성
      const sampleBattleTexts = [
        '나는 정글의 왕! 용감하고 강력한 사자다. 모든 동물들이 나를 존경한다. 내 포효 소리는 온 초원을 울린다!',
        '마법의 숲에서 온 신비로운 유니콘! 내 뿔은 무지개빛으로 빛나고 치유의 힘을 가지고 있어. 순수한 마음만이 나를 볼 수 있지!',
        '백악기 최강의 포식자! 거대한 이빨과 강력한 턱으로 모든 것을 부순다. 나는 공룡의 왕이다! 라오오오어!',
        '깊은 바다의 지배자! 여덟 개의 다리로 무엇이든 잡을 수 있어. 먹물을 뿜어서 적을 혼란스럽게 만들지!',
        '하늘의 전설! 불을 뿜고 날개로 폭풍을 일으킨다. 보물을 지키는 용감한 수호자다. 누구도 나를 이길 수 없어!'
      ];
      
      const characterNames = ['황금갈기', '무지개뿔', '다이노킹', '심해의제왕', '불꽃날개'];
      const animalIds = [1, 7, 12, 18, 25]; // 사자, 유니콘, 티라노사우루스, 문어, 드래곤
      
      botUserIds.forEach((userId, index) => {
        const charId = uuidv4();
        const animalId = animalIds[index % animalIds.length];
        
        db.prepare(`
          INSERT INTO characters (
            id, user_id, animal_id, character_name, battle_text,
            base_score, elo_score, wins, losses, is_bot, is_active, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'))
        `).run(
          charId, userId, animalId, characterNames[index],
          sampleBattleTexts[index], 
          2500 + Math.floor(Math.random() * 500),
          1500 + Math.floor(Math.random() * 200),
          Math.floor(Math.random() * 50),
          Math.floor(Math.random() * 20)
        );
      });
      
      console.log('봇 캐릭터가 생성되었습니다!');
      console.log('데이터베이스 초기화 완료!');
      
    } catch (error) {
      console.error('데이터베이스 초기화 중 오류:', error);
    }
  } else {
    console.log('기존 데이터베이스를 사용합니다.');
  }
}

app.prepare().then(() => {
  // 데이터베이스 초기화
  initializeDatabase().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`🚀 서버가 시작되었습니다!`);
      console.log(`📍 주소: http://${hostname}:${port}`);
      console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 데이터베이스: ${process.env.DATABASE_PATH || 'kid-text-battle.db'}`);
      console.log(`🔐 관리자 로그인: admin / 1234`);
      console.log(`🦄 관리자 페이지: /admin (홈페이지 우측 하단 유니콘 버튼)`);
    });
  });
});