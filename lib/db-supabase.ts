import { createClient } from '@supabase/supabase-js';
import type { DbAdapter, User, Animal, Character, Battle, AdminSetting } from './db-adapter';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export class SupabaseAdapter implements DbAdapter {
  async close(): Promise<void> {
    // Supabase는 연결을 자동으로 관리하므로 close 불필요
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async createUser(email: string, username: string, isGuest: boolean): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        username,
        is_guest: isGuest,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !data) {
      throw new Error(`Failed to create user: ${error?.message}`);
    }
    
    return data;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id: number): Promise<void> {
    // 트랜잭션으로 관련 데이터 모두 삭제
    const { error } = await supabase.rpc('delete_user_cascade', { user_id: id });
    
    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Animals
  async getAllAnimals(): Promise<Animal[]> {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .order('id');
    
    if (error) {
      throw new Error(`Failed to get animals: ${error.message}`);
    }
    
    return data || [];
  }

  async getAnimal(id: number): Promise<Animal | undefined> {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  // Characters
  async getCharacter(id: number): Promise<Character | undefined> {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        animal:animals(*)
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async getCharactersByUserId(userId: number): Promise<Character[]> {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        animal:animals(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to get characters: ${error.message}`);
    }
    
    return data || [];
  }

  async createCharacter(
    userId: number,
    animalId: number,
    name: string,
    description: string
  ): Promise<Character> {
    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: userId,
        animal_id: animalId,
        name,
        description,
        score: 1000,
        wins: 0,
        losses: 0,
        is_bot: false,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        animal:animals(*)
      `)
      .single();
    
    if (error || !data) {
      throw new Error(`Failed to create character: ${error?.message}`);
    }
    
    return data;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<void> {
    const { error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to update character: ${error.message}`);
    }
  }

  async deleteCharacter(id: number): Promise<void> {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete character: ${error.message}`);
    }
  }

  async getLeaderboard(limit: number = 100): Promise<Character[]> {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        animal:animals(*)
      `)
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
    
    return data || [];
  }

  // Battles
  async createBattle(
    attackerId: number,
    defenderId: number,
    attackerText: string,
    defenderText: string,
    winnerId: number,
    attackerScoreChange: number,
    defenderScoreChange: number,
    judgment: string
  ): Promise<Battle> {
    const { data, error } = await supabase
      .from('battles')
      .insert({
        attacker_id: attackerId,
        defender_id: defenderId,
        attacker_text: attackerText,
        defender_text: defenderText,
        winner_id: winnerId,
        attacker_score_change: attackerScoreChange,
        defender_score_change: defenderScoreChange,
        judgment,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !data) {
      throw new Error(`Failed to create battle: ${error?.message}`);
    }
    
    return data;
  }

  async getBattlesByCharacterId(characterId: number, limit: number = 50): Promise<Battle[]> {
    const { data, error } = await supabase
      .from('battles')
      .select('*')
      .or(`attacker_id.eq.${characterId},defender_id.eq.${characterId}`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to get battles: ${error.message}`);
    }
    
    return data || [];
  }

  async getDailyBattleCount(characterId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('battles')
      .select('*', { count: 'exact', head: true })
      .eq('attacker_id', characterId)
      .gte('created_at', today.toISOString());
    
    if (error) {
      throw new Error(`Failed to get battle count: ${error.message}`);
    }
    
    return count || 0;
  }

  // Admin
  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  async updateAdminSetting(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      throw new Error(`Failed to update admin setting: ${error.message}`);
    }
  }

  // Warnings
  async incrementWarningCount(userId: number): Promise<number> {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('warning_count')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      throw new Error(`Failed to get user: ${userError?.message}`);
    }
    
    const newCount = (user.warning_count || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ warning_count: newCount })
      .eq('id', userId);
    
    if (updateError) {
      throw new Error(`Failed to update warning count: ${updateError.message}`);
    }
    
    // 경고 기록 추가
    const { error: warningError } = await supabase
      .from('warnings')
      .insert({
        user_id: userId,
        created_at: new Date().toISOString()
      });
    
    if (warningError) {
      console.error('Failed to create warning record:', warningError);
    }
    
    return newCount;
  }

  // Admin Users
  async getAdminByUsername(username: string): Promise<any> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data;
  }

  // Bot Characters
  async getBotCharacters(): Promise<Character[]> {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        animal:animals(*)
      `)
      .eq('is_bot', true)
      .order('score', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to get bot characters: ${error.message}`);
    }
    
    return data || [];
  }

  // Utility method for running raw queries (주의: Supabase에서는 RPC 함수로 대체해야 함)
  async run(query: string, params: any[] = []): Promise<any> {
    console.warn('Raw SQL queries are not directly supported in Supabase. Use RPC functions instead.');
    throw new Error('Raw SQL not supported. Use Supabase RPC functions.');
  }

  async get(query: string, params: any[] = []): Promise<any> {
    console.warn('Raw SQL queries are not directly supported in Supabase. Use RPC functions instead.');
    throw new Error('Raw SQL not supported. Use Supabase RPC functions.');
  }

  async all(query: string, params: any[] = []): Promise<any[]> {
    console.warn('Raw SQL queries are not directly supported in Supabase. Use RPC functions instead.');
    throw new Error('Raw SQL not supported. Use Supabase RPC functions.');
  }
}

// 싱글톤 인스턴스
export const db = new SupabaseAdapter();