// 사용자 타입
export interface User {
  id: string;
  email?: string;
  isGuest: boolean;
  displayName?: string;
  warningCount: number;
  isSuspended: boolean;
  suspendedReason?: string;
  createdAt: Date;
  lastLogin: Date;
  loginToken?: string;
  tokenExpiresAt?: Date;
}

// 동물 타입
export interface Animal {
  id: number;
  name: string;
  koreanName: string;
  category: 'current' | 'mythical' | 'prehistoric' | 'legend';
  description: string;
  abilities?: string;
  emoji: string;
  imageUrl?: string;
  detailedInfo?: {
    habitat: string;
    food: string;
    speciality: string;
    funFact?: string;
  };
  stats?: {
    power?: number;
    defense?: number;
    speed?: number;
    special?: number;
    hp?: number;
  };
  battleCry?: string;
}

// 캐릭터 타입
export interface Character {
  id: string;
  userId: string;
  animalId: number;
  characterName: string;
  battleText?: string;
  baseScore: number;
  eloScore: number;
  activeBattlesToday: number;
  passiveBattlesToday: number;
  totalActiveBattles: number;
  totalPassiveBattles: number;
  wins: number;
  losses: number;
  isActive: boolean;
  isBot?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastBattleReset: Date;
  // 조인된 데이터
  animal?: Animal;
  user?: User;
}

// 배틀 타입
export interface Battle {
  id: string;
  attackerId: string;
  defenderId: string;
  battleType: 'active' | 'passive';
  winnerId?: string;
  attackerScoreChange: number;
  defenderScoreChange: number;
  attackerEloChange: number;
  defenderEloChange: number;
  aiJudgment?: string;
  aiReasoning?: string;
  createdAt: Date;
  // 조인된 데이터
  attacker?: Character;
  defender?: Character;
  winner?: Character;
}

// 리더보드 엔트리 타입
export interface LeaderboardEntry {
  id: string;
  characterName: string;
  baseScore: number;
  eloScore: number;
  wins: number;
  losses: number;
  totalBattles: number;
  winRate: number;
  animalName: string;
  animalKoreanName: string;
  animalEmoji: string;
  playerName?: string;
  rank: number;
}

// 경고 타입
export interface Warning {
  id: string;
  userId: string;
  warningType: string;
  content: string;
  characterId?: string;
  createdAt: Date;
}

// 관리자 설정 타입
export interface AdminSetting {
  id: number;
  settingKey: string;
  settingValue?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 관리자 로그 타입
export interface AdminLog {
  id: string;
  adminId?: string;
  actionType: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  createdAt: Date;
}

// 배틀 상대 타입 (리더보드에서 사용)
export interface BattleOpponent {
  rank: number;
  id: string;
  characterName: string;
  animalName: string;
  animalIcon: string;
  animalCategory: string;
  playerName: string;
  isGuest: boolean;
  isBot?: boolean;
  baseScore: number;
  eloScore: number;
  wins: number;
  losses: number;
  totalBattles: number;
  winRate: number;
  // Character 타입과 호환성을 위한 추가 필드
  animal?: Animal;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 배틀 요청 타입
export interface BattleRequest {
  attackerId: string;
  defenderId: string;
  battleType: 'active' | 'passive';
}

// AI 판정 결과 타입
export interface AIJudgmentResult {
  winnerId: string;
  judgment: string;
  reasoning: string;
  attackerScoreChange: number;
  defenderScoreChange: number;
  attackerEloChange: number;
  defenderEloChange: number;
}

// 필터 결과 타입
export interface FilterResult {
  isClean: boolean;
  violations: string[];
  warningType?: string;
}
