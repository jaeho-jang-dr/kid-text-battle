import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';
import { filterContent } from '../../../lib/filters/content-filter';

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        error: '인증이 필요합니다'
      }, { status: 401 });
    }

    // 사용자 정보 조회 (민감한 정보 제외)
    const user = await db.prepare(`
      SELECT 
        id,
        username,
        email,
        created_at,
        warning_count,
        is_suspended,
        suspended_until,
        suspension_reason,
        (SELECT COUNT(*) FROM characters WHERE user_id = users.id) as character_count,
        (SELECT COUNT(*) FROM battles WHERE attacker_id IN (SELECT id FROM characters WHERE user_id = users.id) OR defender_id IN (SELECT id FROM characters WHERE user_id = users.id)) as total_battles,
        (SELECT COUNT(*) FROM battles WHERE winner_id IN (SELECT id FROM characters WHERE user_id = users.id)) as total_wins
      FROM users
      WHERE id = ?
    `).get(authResult.user.id);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '사용자를 찾을 수 없습니다'
      }, { status: 404 });
    }

    // 캐릭터 목록 조회
    const characters = await db.prepare(`
      SELECT 
        c.id,
        c.character_name,
        c.animal_id,
        c.base_score as battle_score,
        c.wins as win_count,
        c.losses as loss_count,
        (c.wins + c.losses) as battle_count,
        c.elo_score,
        a.emoji,
        a.name as animal_name
      FROM characters c
      JOIN animals a ON c.animal_id = a.id
      WHERE c.user_id = ? AND (c.is_deleted IS NULL OR c.is_deleted = 0)
      ORDER BY c.created_at DESC
    `).all(authResult.user.id);

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          statistics: {
            character_count: user.character_count,
            total_battles: user.total_battles,
            total_wins: user.total_wins,
            win_rate: user.total_battles > 0 ? Math.round((user.total_wins / user.total_battles) * 100) : 0
          },
          status: {
            warning_count: user.warning_count,
            is_suspended: user.is_suspended === 1,
            suspended_until: user.suspended_until,
            suspension_reason: user.suspension_reason
          }
        },
        characters: characters.map(char => ({
          id: char.id,
          name: char.character_name,
          animal: {
            id: char.animal_id,
            name: char.animal_name,
            emoji: char.emoji
          },
          stats: {
            battle_score: char.battle_score,
            elo_score: char.elo_score,
            win_count: char.win_count,
            loss_count: char.loss_count,
            battle_count: char.battle_count,
            win_rate: char.battle_count > 0 ? Math.round((char.win_count / char.battle_count) * 100) : 0
          }
        }))
      }
    });

  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '프로필을 불러오는 중 오류가 발생했습니다'
    }, { status: 500 });
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        error: '인증이 필요합니다'
      }, { status: 401 });
    }

    const { username, email, currentPassword, newPassword } = await request.json();

    // 현재 사용자 정보 조회
    const currentUser = await db.prepare(`
      SELECT * FROM users WHERE id = ?
    `).get(authResult.user.id);

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        error: '사용자를 찾을 수 없습니다'
      }, { status: 404 });
    }

    // 업데이트할 필드 준비
    const updates = [];
    const values = [];

    // 사용자명 변경
    if (username && username !== currentUser.username) {
      // 사용자명 검증
      if (username.length < 2 || username.length > 20) {
        return NextResponse.json({
          success: false,
          error: '사용자명은 2-20자 사이여야 합니다'
        }, { status: 400 });
      }

      // 콘텐츠 필터링
      const filterResult = filterContent(username);
      if (!filterResult.isClean) {
        return NextResponse.json({
          success: false,
          error: '사용자명에 부적절한 내용이 포함되어 있습니다'
        }, { status: 400 });
      }

      // 중복 확인
      const existingUser = await db.prepare(`
        SELECT id FROM users WHERE username = ? AND id != ?
      `).get(username, authResult.user.id);

      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: '이미 사용 중인 사용자명입니다'
        }, { status: 400 });
      }

      updates.push('username = ?');
      values.push(username);
    }

    // 이메일 변경
    if (email && email !== currentUser.email) {
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({
          success: false,
          error: '올바른 이메일 형식이 아닙니다'
        }, { status: 400 });
      }

      // 중복 확인
      const existingEmail = await db.prepare(`
        SELECT id FROM users WHERE email = ? AND id != ?
      `).get(email, authResult.user.id);

      if (existingEmail) {
        return NextResponse.json({
          success: false,
          error: '이미 사용 중인 이메일입니다'
        }, { status: 400 });
      }

      updates.push('email = ?');
      values.push(email);
    }

    // 비밀번호 변경
    if (newPassword) {
      // 현재 비밀번호 확인 필요
      if (!currentPassword) {
        return NextResponse.json({
          success: false,
          error: '현재 비밀번호를 입력해주세요'
        }, { status: 400 });
      }

      // 현재 비밀번호 검증
      if (currentUser.password !== currentPassword) {
        return NextResponse.json({
          success: false,
          error: '현재 비밀번호가 일치하지 않습니다'
        }, { status: 400 });
      }

      // 새 비밀번호 검증
      if (newPassword.length < 4 || newPassword.length > 20) {
        return NextResponse.json({
          success: false,
          error: '비밀번호는 4-20자 사이여야 합니다'
        }, { status: 400 });
      }

      updates.push('password = ?');
      values.push(newPassword);
    }

    // 변경사항이 없는 경우
    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        error: '변경할 내용이 없습니다'
      }, { status: 400 });
    }

    // 업데이트 실행
    updates.push('updated_at = datetime(\'now\')');
    values.push(authResult.user.id);

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    await db.prepare(updateQuery).run(...values);

    // 업데이트된 사용자 정보 조회
    const updatedUser = await db.prepare(`
      SELECT id, username, email, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(authResult.user.id);

    return NextResponse.json({
      success: true,
      data: {
        user: updatedUser,
        message: '프로필이 성공적으로 업데이트되었습니다'
      }
    });

  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return NextResponse.json({
      success: false,
      error: '프로필을 업데이트하는 중 오류가 발생했습니다'
    }, { status: 500 });
  }
}

// DELETE /api/profile - Delete user account (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        error: '인증이 필요합니다'
      }, { status: 401 });
    }

    const { password, confirmDelete } = await request.json();

    // 삭제 확인
    if (!confirmDelete) {
      return NextResponse.json({
        success: false,
        error: '계정 삭제를 확인해주세요'
      }, { status: 400 });
    }

    // 비밀번호 확인
    const user = await db.prepare(`
      SELECT password FROM users WHERE id = ?
    `).get(authResult.user.id);

    if (!user || user.password !== password) {
      return NextResponse.json({
        success: false,
        error: '비밀번호가 일치하지 않습니다'
      }, { status: 400 });
    }

    // 트랜잭션으로 계정 삭제 처리
    await db.transaction(() => {
      // 캐릭터 삭제 표시
      db.prepare(`
        UPDATE characters 
        SET is_deleted = 1, deleted_at = datetime('now')
        WHERE user_id = ?
      `).run(authResult.user.id);

      // 사용자 삭제 표시 (soft delete)
      db.prepare(`
        UPDATE users 
        SET 
          is_deleted = 1,
          deleted_at = datetime('now'),
          login_token = NULL,
          token_expires_at = NULL,
          username = username || '_deleted_' || strftime('%s', 'now'),
          email = email || '_deleted_' || strftime('%s', 'now')
        WHERE id = ?
      `).run(authResult.user.id);
    })();

    return NextResponse.json({
      success: true,
      data: {
        message: '계정이 성공적으로 삭제되었습니다. 안녕히 가세요!'
      }
    });

  } catch (error) {
    console.error('계정 삭제 오류:', error);
    return NextResponse.json({
      success: false,
      error: '계정을 삭제하는 중 오류가 발생했습니다'
    }, { status: 500 });
  }
}