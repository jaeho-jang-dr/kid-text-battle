# Lovable 배포 빠른 복사 가이드

이 가이드는 복사/붙여넣기만으로 Kid Text Battle을 Lovable에 배포할 수 있도록 만들어졌습니다.

## 🚀 빠른 시작 (5분 소요)

### 1️⃣ Supabase 설정 (3분)

1. **Supabase 프로젝트 생성**
   - https://supabase.com/dashboard 접속
   - "New project" 클릭
   - 프로젝트 이름: `kid-text-battle`
   - 비밀번호 설정 후 "Create new project" 클릭

2. **SQL Editor 실행**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭
   - "New query" 클릭
   - 아래 전체 SQL을 복사하여 붙여넣기
   - "Run" 클릭 (약 10초 소요)

```sql
-- 전체 복사하여 실행하세요 (1/3)
-- Supabase 마이그레이션 스크립트
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS warnings CASCADE;
DROP TABLE IF EXISTS battles CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS animals CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE animals (
  id SERIAL PRIMARY KEY,
  emoji VARCHAR(10) NOT NULL,
  name VARCHAR(50) NOT NULL,
  english_name VARCHAR(50),
  type VARCHAR(20) NOT NULL CHECK (type IN ('current', 'mythical', 'prehistoric')),
  description TEXT,
  strength INTEGER DEFAULT 50,
  speed INTEGER DEFAULT 50,
  intelligence INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  is_guest BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  suspended_at TIMESTAMP WITH TIME ZONE,
  warning_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  animal_id INTEGER NOT NULL REFERENCES animals(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  score INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  is_bot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_score ON characters(score DESC);
CREATE INDEX idx_characters_is_bot ON characters(is_bot);

CREATE TABLE battles (
  id SERIAL PRIMARY KEY,
  attacker_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  defender_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  attacker_text TEXT NOT NULL,
  defender_text TEXT NOT NULL,
  winner_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  attacker_score_change INTEGER DEFAULT 0,
  defender_score_change INTEGER DEFAULT 0,
  judgment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_battles_attacker_id ON battles(attacker_id);
CREATE INDEX idx_battles_defender_id ON battles(defender_id);
CREATE INDEX idx_battles_created_at ON battles(created_at DESC);

CREATE TABLE warnings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  permissions TEXT DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

CREATE OR REPLACE FUNCTION delete_user_cascade(user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  DELETE FROM users WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_daily_battle_count(character_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  battle_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO battle_count
  FROM battles
  WHERE attacker_id = character_id
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day';
  
  RETURN battle_count;
END;
$$ LANGUAGE plpgsql;

INSERT INTO admin_settings (key, value) VALUES
  ('daily_battle_limit', '10'),
  ('max_characters_per_user', '3'),
  ('min_battle_text_length', '10'),
  ('max_battle_text_length', '500')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$rBOxMV6CqBY6T.pjAGqXCOqUyJvLTt9QnJvmKqUvAqxlvUkmBx.Mi')
ON CONFLICT (username) DO NOTHING;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything" ON users FOR ALL USING (true);
CREATE POLICY "Service role can do anything" ON characters FOR ALL USING (true);
CREATE POLICY "Service role can do anything" ON battles FOR ALL USING (true);
CREATE POLICY "Service role can do anything" ON warnings FOR ALL USING (true);
```

3. **동물 데이터 추가**
   - "New query" 클릭
   - 아래 SQL 복사하여 붙여넣기
   - "Run" 클릭

```sql
-- 전체 복사하여 실행하세요 (2/3)
-- 동물 데이터 시드
INSERT INTO animals (emoji, name, english_name, type, description, strength, speed, intelligence) VALUES
  ('🦁', '사자', 'Lion', 'current', '용맹한 백수의 왕', 90, 70, 60),
  ('🐘', '코끼리', 'Elephant', 'current', '지혜로운 거대한 포유류', 95, 30, 80),
  ('🐧', '펭귄', 'Penguin', 'current', '귀여운 남극의 신사', 20, 40, 50),
  ('🐬', '돌고래', 'Dolphin', 'current', '영리한 바다의 친구', 60, 85, 90),
  ('🐅', '호랑이', 'Tiger', 'current', '용맹한 정글의 왕', 85, 75, 65),
  ('🐼', '판다', 'Panda', 'current', '귀여운 대나무 애호가', 70, 30, 55),
  ('🦅', '독수리', 'Eagle', 'current', '하늘의 제왕', 75, 90, 70),
  ('🦒', '기린', 'Giraffe', 'current', '목이 긴 초원의 거인', 60, 65, 50),
  ('🦓', '얼룩말', 'Zebra', 'current', '줄무늬 패션의 달인', 50, 80, 55),
  ('🦘', '캥거루', 'Kangaroo', 'current', '주머니를 가진 점프 선수', 75, 85, 45),
  ('🐵', '원숭이', 'Monkey', 'current', '재빠른 나무 타기 선수', 55, 80, 75),
  ('🐻', '곰', 'Bear', 'current', '힘센 숲의 왕', 90, 50, 60),
  ('🐺', '늑대', 'Wolf', 'current', '무리를 이루는 사냥꾼', 70, 85, 70),
  ('🦊', '여우', 'Fox', 'current', '영리한 숲의 요정', 45, 75, 85),
  ('🐰', '토끼', 'Rabbit', 'current', '귀여운 점프 선수', 20, 85, 40),
  ('🐢', '거북이', 'Turtle', 'current', '느리지만 단단한 친구', 30, 10, 65),
  ('🐙', '문어', 'Octopus', 'current', '8개의 팔을 가진 천재', 60, 70, 95),
  ('🐋', '고래', 'Whale', 'current', '바다의 거인', 100, 60, 70),
  ('🦈', '상어', 'Shark', 'current', '바다의 포식자', 85, 90, 50),
  ('🐊', '악어', 'Crocodile', 'current', '강력한 턱을 가진 포식자', 80, 60, 45),
  ('🦛', '하마', 'Hippo', 'current', '물을 좋아하는 거구', 85, 40, 40),
  ('🦏', '코뿔소', 'Rhino', 'current', '뿔을 가진 전차', 90, 65, 35),
  ('🐪', '낙타', 'Camel', 'current', '사막의 배', 60, 55, 60),
  ('🦙', '라마', 'Llama', 'current', '침을 뱉는 귀요미', 40, 60, 50),
  ('🐨', '코알라', 'Koala', 'current', '유칼립투스를 좋아하는 나무늘보', 30, 20, 40),
  ('🦥', '나무늘보', 'Sloth', 'current', '세상에서 가장 느린 동물', 25, 5, 50),
  ('🦦', '수달', 'Otter', 'current', '물놀이를 좋아하는 장난꾸러기', 40, 70, 80),
  ('🦫', '비버', 'Beaver', 'current', '댐을 짓는 건축가', 50, 50, 85),
  ('🦔', '고슴도치', 'Hedgehog', 'current', '가시를 가진 귀요미', 30, 60, 65),
  ('🦇', '박쥐', 'Bat', 'current', '밤하늘의 비행사', 35, 85, 70),
  ('🦝', '너구리', 'Raccoon', 'current', '손재주가 좋은 도둑', 40, 65, 80),
  ('🦨', '스컹크', 'Skunk', 'current', '냄새로 무장한 동물', 35, 55, 60),
  ('🦡', '오소리', 'Badger', 'current', '땅굴을 파는 전문가', 60, 50, 65),
  ('🦢', '백조', 'Swan', 'current', '우아한 물의 여왕', 40, 70, 55),
  ('🦚', '공작', 'Peacock', 'current', '화려한 깃털의 소유자', 35, 50, 60),
  ('🦜', '앵무새', 'Parrot', 'current', '말하는 새', 25, 75, 85),
  ('🦩', '홍학', 'Flamingo', 'current', '분홍빛 다리의 소유자', 30, 60, 50),
  ('🦃', '칠면조', 'Turkey', 'current', '큰 몸집의 새', 45, 40, 35),
  ('🦆', '오리', 'Duck', 'current', '물에서 노는 새', 25, 65, 45),
  ('🦉', '올빼미', 'Owl', 'current', '밤의 현자', 50, 80, 90),
  ('🐔', '닭', 'Chicken', 'current', '알을 낳는 새', 20, 45, 30),
  ('🐷', '돼지', 'Pig', 'current', '똑똑한 농장 동물', 50, 35, 75),
  ('🐮', '소', 'Cow', 'current', '우유를 주는 친구', 70, 30, 40),
  ('🐐', '염소', 'Goat', 'current', '뭐든지 먹는 동물', 45, 70, 60),
  ('🐑', '양', 'Sheep', 'current', '양털을 주는 친구', 35, 50, 35),
  ('🐴', '말', 'Horse', 'current', '빠른 달리기 선수', 75, 95, 55),
  ('🐕', '개', 'Dog', 'current', '인간의 가장 친한 친구', 60, 75, 70),
  ('🐈', '고양이', 'Cat', 'current', '도도한 애교쟁이', 40, 85, 75),
  ('🐭', '쥐', 'Mouse', 'current', '작고 빠른 동물', 10, 90, 65),
  ('🐹', '햄스터', 'Hamster', 'current', '볼주머니가 귀여운 친구', 15, 70, 50),
  ('🦄', '유니콘', 'Unicorn', 'mythical', '뿔을 가진 신비한 말', 80, 90, 85),
  ('🐉', '드래곤', 'Dragon', 'mythical', '불을 뿜는 전설의 용', 100, 85, 90),
  ('🔥', '불사조', 'Phoenix', 'mythical', '불에서 다시 태어나는 새', 85, 95, 95),
  ('🐴', '페가수스', 'Pegasus', 'mythical', '날개 달린 천마', 75, 100, 80),
  ('🦅', '그리핀', 'Griffin', 'mythical', '독수리와 사자의 결합', 90, 95, 85),
  ('🧜‍♀️', '인어', 'Mermaid', 'mythical', '반은 사람 반은 물고기', 50, 80, 90),
  ('🏹', '켄타우로스', 'Centaur', 'mythical', '반인반마의 궁수', 80, 85, 85),
  ('🐂', '미노타우로스', 'Minotaur', 'mythical', '소머리를 가진 괴물', 95, 60, 50),
  ('🦁', '스핑크스', 'Sphinx', 'mythical', '수수께끼를 내는 괴물', 85, 70, 100),
  ('🐍', '히드라', 'Hydra', 'mythical', '머리가 여러 개인 뱀', 90, 70, 75),
  ('🐕', '케르베로스', 'Cerberus', 'mythical', '지옥의 문지기', 95, 80, 70),
  ('🐙', '크라켄', 'Kraken', 'mythical', '거대한 바다 괴물', 100, 75, 85),
  ('🦎', '바실리스크', 'Basilisk', 'mythical', '독을 가진 도마뱀 왕', 85, 75, 80),
  ('🐐', '키메라', 'Chimera', 'mythical', '여러 동물이 합쳐진 괴물', 90, 80, 75),
  ('🍀', '레프러콘', 'Leprechaun', 'mythical', '행운을 가져다주는 요정', 30, 85, 95),
  ('🦖', '티라노사우루스', 'Tyrannosaurus', 'prehistoric', '공룡의 제왕', 100, 60, 55),
  ('🦏', '트리케라톱스', 'Triceratops', 'prehistoric', '세 개의 뿔을 가진 공룡', 85, 45, 50),
  ('🦅', '프테라노돈', 'Pteranodon', 'prehistoric', '하늘을 나는 파충류', 60, 95, 60),
  ('🦎', '디메트로돈', 'Dimetrodon', 'prehistoric', '돛을 가진 파충류', 75, 55, 45),
  ('🦐', '아노말로카리스', 'Anomalocaris', 'prehistoric', '캄브리아기의 포식자', 70, 80, 40),
  ('🪲', '삼엽충', 'Trilobite', 'prehistoric', '고대의 절지동물', 30, 40, 35),
  ('🐟', '둔클레오스테우스', 'Dunkleosteus', 'prehistoric', '갑옷을 입은 물고기', 90, 70, 45),
  ('🦟', '메가네우라', 'Meganeura', 'prehistoric', '거대한 잠자리', 40, 100, 50),
  ('🐛', '아스로플레우라', 'Arthropleura', 'prehistoric', '거대한 노래기', 60, 50, 30),
  ('🦖', '에다포사우루스', 'Edaphosaurus', 'prehistoric', '초식성 돛도마뱀', 65, 45, 40),
  ('🐛', '할루키게니아', 'Hallucigenia', 'prehistoric', '기묘한 캄브리아 생물', 20, 30, 25),
  ('🦑', '오파비니아', 'Opabinia', 'prehistoric', '다섯 개의 눈을 가진 생물', 45, 60, 55),
  ('🦂', '바다전갈', 'Eurypterid', 'prehistoric', '거대한 바다 전갈', 80, 70, 50),
  ('🦒', '브라키오사우루스', 'Brachiosaurus', 'prehistoric', '목이 긴 거대 공룡', 90, 35, 45),
  ('🦔', '스테고사우루스', 'Stegosaurus', 'prehistoric', '등에 골판을 가진 공룡', 80, 40, 40);

INSERT INTO users (email, username, is_guest) VALUES
  ('bot1@kidtextbattle.com', '봇_황금갈기', false),
  ('bot2@kidtextbattle.com', '봇_무지개뿔', false),
  ('bot3@kidtextbattle.com', '봇_다이노킹', false),
  ('bot4@kidtextbattle.com', '봇_불꽃날개', false),
  ('bot5@kidtextbattle.com', '봇_파도타기', false)
ON CONFLICT (email) DO NOTHING;
```

4. **봇 캐릭터 생성**
   - "New query" 클릭
   - 아래 SQL 복사하여 붙여넣기
   - "Run" 클릭

```sql
-- 전체 복사하여 실행하세요 (3/3)
-- 봇 캐릭터 생성
DO $$
DECLARE
  bot_user_id INTEGER;
  bot_users CURSOR FOR 
    SELECT id FROM users WHERE email LIKE 'bot%@kidtextbattle.com';
BEGIN
  FOR bot_user IN bot_users LOOP
    bot_user_id := bot_user.id;
    
    IF bot_user_id = (SELECT id FROM users WHERE email = 'bot1@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🦁' LIMIT 1), 
              '황금갈기', 
              '용맹한 사바나의 왕! 강력한 포효로 상대를 압도한다.', 
              1200, 50, 30, true);
    
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot2@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🦄' LIMIT 1), 
              '무지개뿔', 
              '신비로운 마법의 힘을 가진 전설의 유니콘!', 
              1150, 45, 35, true);
    
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot3@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🦖' LIMIT 1), 
              '다이노킹', 
              '쥬라기 시대의 최강 포식자! 무시무시한 이빨의 소유자.', 
              1100, 40, 40, true);
    
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot4@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🔥' LIMIT 1), 
              '불꽃날개', 
              '불멸의 화염을 다스리는 전설의 불사조!', 
              1050, 35, 45, true);
    
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot5@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🐬' LIMIT 1), 
              '파도타기', 
              '바다의 지혜로운 수호자! 빠른 속도와 높은 지능의 소유자.', 
              1000, 30, 50, true);
    END IF;
  END LOOP;
END $$;
```

5. **API 키 복사**
   - Settings > API 클릭
   - 아래 3개 값을 메모장에 복사:
     - `Project URL` (https://로 시작)
     - `anon public` 키
     - `service_role` 키 (secret)

### 2️⃣ Lovable 설정 (2분)

1. **프로젝트 생성**
   - https://lovable.dev 접속 후 로그인
   - "New Project" 클릭
   - GitHub 리포지토리 연결

2. **환경 변수 설정**
   - Settings > Environment Variables 클릭
   - 아래 전체를 복사하여 붙여넣기 (값 수정 필요):

```bash
# Supabase 설정 (위에서 복사한 값으로 교체)
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_키_붙여넣기
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_키_붙여넣기

# JWT 비밀키 (아래 생성된 값 사용)
JWT_SECRET=여기에_생성된_JWT_SECRET_붙여넣기

# 관리자 설정
ADMIN_DEFAULT_PASSWORD=1234

# OpenAI API 키
OPENAI_API_KEY=여기에_OpenAI_API_키_붙여넣기

# 환경 설정
NODE_ENV=production
PORT=3000
```

3. **JWT_SECRET 생성**
   - 온라인 도구 사용: https://www.uuidgenerator.net/version4
   - 또는 터미널에서: `openssl rand -hex 32`
   - 생성된 값을 위의 JWT_SECRET에 붙여넣기

4. **OpenAI API 키**
   - https://platform.openai.com/api-keys 접속
   - "Create new secret key" 클릭
   - 키 복사하여 위의 OPENAI_API_KEY에 붙여넣기

5. **배포**
   - 모든 환경 변수 저장
   - "Deploy" 버튼 클릭
   - 약 2-3분 대기

### 3️⃣ 확인사항

배포 완료 후:
- 🏠 홈페이지: `https://your-app.lovable.app`
- 👤 관리자: 우측 하단 🦄 클릭 → ID: admin, PW: 1234
- 🤖 봇 대전: 캐릭터 생성 후 봇과 무제한 배틀

## ⚡ 트러블슈팅

### 환경 변수 문제
- 값 앞뒤 공백 제거
- https:// 포함 확인
- 따옴표 없이 입력

### 빌드 실패
- lovable.json의 nodeVersion: "20" 확인
- package.json의 의존성 확인

### 데이터베이스 오류
- Supabase Dashboard에서 테이블 생성 확인
- RLS 정책 활성화 확인

---
완료! 🎉 Kid Text Battle이 온라인에 있습니다.