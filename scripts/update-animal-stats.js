const Database = require('better-sqlite3');
const path = require('path');

// 데이터베이스 연결
const db = new Database(path.join(__dirname, '..', 'kid-text-battle.db'));

// 동물별 특성에 맞는 수치 설정
// strength(힘), speed(속도), intelligence(지능) - 합계가 200 정도로 균형 맞춤
const animalStats = {
  // 현재 동물들 (Current Animals)
  '사자': { strength: 90, speed: 70, intelligence: 60 },
  '코끼리': { strength: 95, speed: 30, intelligence: 80 },
  '펭귄': { strength: 20, speed: 40, intelligence: 50 },
  '돌고래': { strength: 60, speed: 85, intelligence: 90 },
  '호랑이': { strength: 85, speed: 75, intelligence: 65 },
  '판다': { strength: 70, speed: 30, intelligence: 55 },
  '독수리': { strength: 75, speed: 90, intelligence: 70 },
  '기린': { strength: 60, speed: 65, intelligence: 50 },
  '얼룩말': { strength: 50, speed: 80, intelligence: 55 },
  '캥거루': { strength: 75, speed: 85, intelligence: 45 },
  '원숭이': { strength: 55, speed: 80, intelligence: 75 },
  '곰': { strength: 90, speed: 50, intelligence: 60 },
  '늑대': { strength: 70, speed: 85, intelligence: 70 },
  '여우': { strength: 45, speed: 75, intelligence: 85 },
  '토끼': { strength: 20, speed: 85, intelligence: 40 },
  '거북이': { strength: 30, speed: 10, intelligence: 65 },
  '문어': { strength: 60, speed: 70, intelligence: 95 },
  '고래': { strength: 100, speed: 60, intelligence: 70 },
  '상어': { strength: 85, speed: 90, intelligence: 50 },
  '악어': { strength: 80, speed: 60, intelligence: 45 },
  '하마': { strength: 85, speed: 40, intelligence: 40 },
  '코뿔소': { strength: 90, speed: 65, intelligence: 35 },
  '낙타': { strength: 60, speed: 55, intelligence: 60 },
  '라마': { strength: 40, speed: 60, intelligence: 50 },
  '코알라': { strength: 30, speed: 20, intelligence: 40 },
  '나무늘보': { strength: 25, speed: 5, intelligence: 50 },
  '수달': { strength: 40, speed: 70, intelligence: 80 },
  '비버': { strength: 50, speed: 50, intelligence: 85 },
  '고슴도치': { strength: 30, speed: 60, intelligence: 65 },
  '박쥐': { strength: 35, speed: 85, intelligence: 70 },
  '너구리': { strength: 40, speed: 65, intelligence: 80 },
  '스컹크': { strength: 35, speed: 55, intelligence: 60 },
  '오소리': { strength: 60, speed: 50, intelligence: 65 },
  '백조': { strength: 40, speed: 70, intelligence: 55 },
  '공작': { strength: 35, speed: 50, intelligence: 60 },
  '앵무새': { strength: 25, speed: 75, intelligence: 85 },
  '홍학': { strength: 30, speed: 60, intelligence: 50 },
  '칠면조': { strength: 45, speed: 40, intelligence: 35 },
  '오리': { strength: 25, speed: 65, intelligence: 45 },
  '올빼미': { strength: 50, speed: 80, intelligence: 90 },
  '닭': { strength: 20, speed: 45, intelligence: 30 },
  '돼지': { strength: 50, speed: 35, intelligence: 75 },
  '소': { strength: 70, speed: 30, intelligence: 40 },
  '염소': { strength: 45, speed: 70, intelligence: 60 },
  '양': { strength: 35, speed: 50, intelligence: 35 },
  '말': { strength: 75, speed: 95, intelligence: 55 },
  '개': { strength: 60, speed: 75, intelligence: 70 },
  '고양이': { strength: 40, speed: 85, intelligence: 75 },
  '쥐': { strength: 10, speed: 90, intelligence: 65 },
  '햄스터': { strength: 15, speed: 70, intelligence: 50 },
  
  // 신화적 동물들 (Mythical Animals) - 전체적으로 강력함
  '유니콘': { strength: 80, speed: 90, intelligence: 85 },
  '드래곤': { strength: 100, speed: 85, intelligence: 90 },
  '불사조': { strength: 85, speed: 95, intelligence: 95 },
  '페가수스': { strength: 75, speed: 100, intelligence: 80 },
  '그리핀': { strength: 90, speed: 95, intelligence: 85 },
  '인어': { strength: 50, speed: 80, intelligence: 90 },
  '켄타우로스': { strength: 80, speed: 85, intelligence: 85 },
  '미노타우로스': { strength: 95, speed: 60, intelligence: 50 },
  '스핑크스': { strength: 85, speed: 70, intelligence: 100 },
  '히드라': { strength: 90, speed: 70, intelligence: 75 },
  '케르베로스': { strength: 95, speed: 80, intelligence: 70 },
  '크라켄': { strength: 100, speed: 75, intelligence: 85 },
  '바실리스크': { strength: 85, speed: 75, intelligence: 80 },
  '키메라': { strength: 90, speed: 80, intelligence: 75 },
  '레프러콘': { strength: 30, speed: 85, intelligence: 95 },
  
  // 선사시대 동물들 (Prehistoric Animals)
  '티라노사우루스': { strength: 100, speed: 60, intelligence: 55 },
  '트리케라톱스': { strength: 85, speed: 45, intelligence: 50 },
  '프테라노돈': { strength: 60, speed: 95, intelligence: 60 },
  '디메트로돈': { strength: 75, speed: 55, intelligence: 45 },
  '아노말로카리스': { strength: 70, speed: 80, intelligence: 40 },
  '삼엽충': { strength: 30, speed: 40, intelligence: 35 },
  '둔클레오스테우스': { strength: 90, speed: 70, intelligence: 45 },
  '메가네우라': { strength: 40, speed: 100, intelligence: 50 },
  '아스로플레우라': { strength: 60, speed: 50, intelligence: 30 },
  '에다포사우루스': { strength: 65, speed: 45, intelligence: 40 },
  '할루키게니아': { strength: 20, speed: 30, intelligence: 25 },
  '오파비니아': { strength: 45, speed: 60, intelligence: 55 },
  '바다전갈': { strength: 80, speed: 70, intelligence: 50 },
  '브라키오사우루스': { strength: 90, speed: 35, intelligence: 45 },
  '스테고사우루스': { strength: 80, speed: 40, intelligence: 40 }
};

console.log('동물 능력치 업데이트 시작...\n');

// 업데이트 실행
const updateStmt = db.prepare(`
  UPDATE animals 
  SET strength = ?, speed = ?, intelligence = ?
  WHERE korean_name = ?
`);

let updateCount = 0;
let notFoundAnimals = [];

for (const [animalName, stats] of Object.entries(animalStats)) {
  try {
    const result = updateStmt.run(stats.strength, stats.speed, stats.intelligence, animalName);
    if (result.changes > 0) {
      updateCount++;
      console.log(`✓ ${animalName}: 힘 ${stats.strength}, 속도 ${stats.speed}, 지능 ${stats.intelligence}`);
    } else {
      notFoundAnimals.push(animalName);
    }
  } catch (error) {
    console.error(`✗ ${animalName} 업데이트 실패:`, error.message);
  }
}

console.log(`\n업데이트 완료!`);
console.log(`- 성공: ${updateCount}개`);
console.log(`- 실패: ${notFoundAnimals.length}개`);

if (notFoundAnimals.length > 0) {
  console.log(`\n데이터베이스에 없는 동물들:`);
  notFoundAnimals.forEach(name => console.log(`  - ${name}`));
}

// 업데이트 결과 확인
console.log('\n=== 업데이트된 동물 능력치 샘플 ===');
const animals = db.prepare('SELECT emoji, korean_name, strength, speed, intelligence FROM animals ORDER BY category, id LIMIT 10').all();
animals.forEach(animal => {
  const total = animal.strength + animal.speed + animal.intelligence;
  console.log(`${animal.emoji} ${animal.korean_name}: 힘 ${animal.strength}, 속도 ${animal.speed}, 지능 ${animal.intelligence} (합계: ${total})`);
});

db.close();
console.log('\n동물 능력치 업데이트가 완료되었습니다!');