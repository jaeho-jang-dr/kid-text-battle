import type { DbAdapter } from './db-adapter';

// 환경에 따라 적절한 데이터베이스 어댑터 선택
function getDbAdapter(): DbAdapter {
  // Supabase 환경 변수가 있으면 Supabase 사용
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('Using Supabase database adapter');
    const { db } = require('./db-supabase');
    return db;
  }
  
  // 그렇지 않으면 SQLite 사용 (로컬 개발용)
  console.log('Using SQLite database adapter');
  const { db } = require('./db-sqlite');
  return db;
}

// 싱글톤 인스턴스
export const db = getDbAdapter();

// 타입 재정의 (기존 코드와의 호환성을 위해)
export type User = import('./db-adapter').User;
export type Animal = import('./db-adapter').Animal;
export type Character = import('./db-adapter').Character;
export type Battle = import('./db-adapter').Battle;
export type AdminSetting = import('./db-adapter').AdminSetting;