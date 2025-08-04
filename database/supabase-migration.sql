-- Supabase 마이그레이션 스크립트
-- Kid Text Battle 앱을 위한 데이터베이스 스키마

-- 기존 테이블 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS warnings CASCADE;
DROP TABLE IF EXISTS battles CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS animals CASCADE;

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 동물 테이블
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

-- 사용자 테이블
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

-- 사용자 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 캐릭터 테이블
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

-- 캐릭터 인덱스
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_score ON characters(score DESC);
CREATE INDEX idx_characters_is_bot ON characters(is_bot);

-- 배틀 테이블
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

-- 배틀 인덱스
CREATE INDEX idx_battles_attacker_id ON battles(attacker_id);
CREATE INDEX idx_battles_defender_id ON battles(defender_id);
CREATE INDEX idx_battles_created_at ON battles(created_at DESC);

-- 경고 테이블
CREATE TABLE warnings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 설정 테이블
CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 사용자 테이블
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  permissions TEXT DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 로그 테이블
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 로그 인덱스
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- RPC 함수: 사용자 캐스케이드 삭제
CREATE OR REPLACE FUNCTION delete_user_cascade(user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  DELETE FROM users WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- RPC 함수: 오늘의 배틀 수 계산
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

-- 기본 관리자 설정 추가
INSERT INTO admin_settings (key, value) VALUES
  ('daily_battle_limit', '10'),
  ('max_characters_per_user', '3'),
  ('min_battle_text_length', '10'),
  ('max_battle_text_length', '500')
ON CONFLICT (key) DO NOTHING;

-- 기본 관리자 계정 추가 (비밀번호: 1234)
-- bcrypt 해시: $2a$10$rBOxMV6CqBY6T.pjAGqXCOqUyJvLTt9QnJvmKqUvAqxlvUkmBx.Mi
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$rBOxMV6CqBY6T.pjAGqXCOqUyJvLTt9QnJvmKqUvAqxlvUkmBx.Mi')
ON CONFLICT (username) DO NOTHING;

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성 (서비스 역할은 모든 접근 가능)
CREATE POLICY "Service role can do anything" ON users FOR ALL USING (true);
CREATE POLICY "Service role can do anything" ON characters FOR ALL USING (true);
CREATE POLICY "Service role can do anything" ON battles FOR ALL USING (true);
CREATE POLICY "Service role can do anything" ON warnings FOR ALL USING (true);