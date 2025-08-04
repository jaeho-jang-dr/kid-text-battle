import { NextRequest } from 'next/server';
import { db } from './db';

export interface AuthResult {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  error?: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return {
        success: false,
        error: '인증 헤더가 없습니다'
      };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return {
        success: false,
        error: '유효하지 않은 토큰 형식입니다'
      };
    }

    // 데이터베이스에서 토큰 확인
    const user = await db.prepare(`
      SELECT id, username, email, is_suspended, suspended_until
      FROM users 
      WHERE login_token = ? 
        AND token_expires_at > datetime('now')
        AND (is_deleted IS NULL OR is_deleted = 0)
    `).get(token);

    if (!user) {
      return {
        success: false,
        error: '유효하지 않은 토큰입니다'
      };
    }

    // 정지 상태 확인
    if (user.is_suspended === 1) {
      const suspendedUntil = user.suspended_until ? new Date(user.suspended_until) : null;
      const now = new Date();
      
      if (!suspendedUntil || suspendedUntil > now) {
        return {
          success: false,
          error: '계정이 정지되었습니다'
        };
      } else {
        // 정지 기간이 끝났으면 정지 해제
        await db.prepare(`
          UPDATE users 
          SET is_suspended = 0, suspended_until = NULL, suspension_reason = NULL
          WHERE id = ?
        `).run(user.id);
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    console.error('인증 확인 오류:', error);
    return {
      success: false,
      error: '인증을 확인하는 중 오류가 발생했습니다'
    };
  }
}