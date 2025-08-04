// Vercel 전용 데이터베이스 설정
import type { DbAdapter } from './db-adapter';

// Vercel에서는 반드시 Supabase 사용
function getDbAdapter(): DbAdapter {
  // Supabase 환경 변수 확인
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Vercel 배포에는 Supabase 환경 변수가 필요합니다.');
  }
  
  console.log('Vercel 환경: Supabase 데이터베이스 사용');
  const { db } = require('./db-supabase');
  return db;
}

// 싱글톤 인스턴스
export const db = getDbAdapter();

// 타입 재정의
export type User = import('./db-adapter').User;
export type Animal = import('./db-adapter').Animal;
export type Character = import('./db-adapter').Character;
export type Battle = import('./db-adapter').Battle;
export type AdminSetting = import('./db-adapter').AdminSetting;