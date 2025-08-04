# Lovable 배포 가이드 - Kid Text Battle

이 가이드는 Kid Text Battle 앱을 Lovable 플랫폼에 배포하는 완전한 단계별 안내서입니다.

## 📋 사전 준비사항

### 1. Lovable 계정
- [Lovable](https://lovable.dev)에 가입 및 로그인
- 새 프로젝트 생성 준비

### 2. Supabase 계정
- [Supabase](https://supabase.com)에 가입 및 로그인
- 새 프로젝트 생성 준비

### 3. OpenAI API 키
- [OpenAI Platform](https://platform.openai.com)에서 API 키 발급
- 배틀 심사 기능에 필요

## 🚀 배포 단계

### 1단계: Supabase 프로젝트 설정

1. **Supabase 프로젝트 생성**
   - [Supabase Dashboard](https://supabase.com/dashboard)에서 "New project" 클릭
   - 프로젝트 이름: `kid-text-battle`
   - 데이터베이스 비밀번호 설정 (안전한 곳에 저장)
   - 지역: 가장 가까운 지역 선택 (예: Northeast Asia - Seoul)

2. **데이터베이스 스키마 생성**
   - Supabase Dashboard > SQL Editor로 이동
   - 새 쿼리 생성 후 아래 내용 복사/붙여넣기:

```sql
-- 아래 전체 내용을 복사하여 실행하세요
-- /database/supabase-migration.sql 파일 내용
```

   복사할 파일: `/database/supabase-migration.sql`의 전체 내용

3. **동물 데이터 추가**
   - SQL Editor에서 새 쿼리 생성
   - 아래 내용 복사/붙여넣기:

```sql
-- 아래 전체 내용을 복사하여 실행하세요
-- /database/supabase-seed-animals.sql 파일 내용
```

   복사할 파일: `/database/supabase-seed-animals.sql`의 전체 내용

4. **봇 캐릭터 생성 스크립트 실행**
   - SQL Editor에서 새 쿼리 생성
   - 아래 스크립트 실행:

```sql
-- 봇 캐릭터 생성
DO $$
DECLARE
  bot_user_id INTEGER;
  bot_users CURSOR FOR 
    SELECT id FROM users WHERE email LIKE 'bot%@kidtextbattle.com';
BEGIN
  -- 각 봇 사용자에 대해 캐릭터 생성
  FOR bot_user IN bot_users LOOP
    bot_user_id := bot_user.id;
    
    -- 봇1: 황금갈기 (사자)
    IF bot_user_id = (SELECT id FROM users WHERE email = 'bot1@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🦁' LIMIT 1), 
              '황금갈기', 
              '용맹한 사바나의 왕! 강력한 포효로 상대를 압도한다.', 
              1200, 50, 30, true);
    
    -- 봇2: 무지개뿔 (유니콘)
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot2@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🦄' LIMIT 1), 
              '무지개뿔', 
              '신비로운 마법의 힘을 가진 전설의 유니콘!', 
              1150, 45, 35, true);
    
    -- 봇3: 다이노킹 (티라노사우루스)
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot3@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🦖' LIMIT 1), 
              '다이노킹', 
              '쥬라기 시대의 최강 포식자! 무시무시한 이빨의 소유자.', 
              1100, 40, 40, true);
    
    -- 봇4: 불꽃날개 (불사조)
    ELSIF bot_user_id = (SELECT id FROM users WHERE email = 'bot4@kidtextbattle.com') THEN
      INSERT INTO characters (user_id, animal_id, name, description, score, wins, losses, is_bot)
      VALUES (bot_user_id, 
              (SELECT id FROM animals WHERE emoji = '🔥' LIMIT 1), 
              '불꽃날개', 
              '불멸의 화염을 다스리는 전설의 불사조!', 
              1050, 35, 45, true);
    
    -- 봇5: 파도타기 (돌고래)
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

5. **Supabase 키 복사**
   - Settings > API로 이동
   - 다음 값들을 메모장에 복사:
     - `Project URL` (예: https://xxxxx.supabase.co)
     - `anon public` 키
     - `service_role` 키 (secret)

### 2단계: Lovable 프로젝트 생성

1. **GitHub 리포지토리 연결**
   - Lovable Dashboard에서 "New Project" 클릭
   - GitHub 리포지토리 선택 또는 새로 생성
   - 리포지토리 이름: `kid-text-battle`

2. **프로젝트 설정**
   - Framework: Next.js
   - Node Version: 20
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Start Command: `npm run start`

3. **환경 변수 설정**
   Lovable Dashboard > Settings > Environment Variables에서 다음 변수들 추가:

   ```bash
   # Supabase 설정 (위에서 복사한 값 사용)
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=당신의_anon_public_키
   SUPABASE_SERVICE_ROLE_KEY=당신의_service_role_키

   # JWT 비밀키 (아래 명령으로 생성)
   JWT_SECRET=당신의_JWT_비밀키

   # 관리자 기본 비밀번호
   ADMIN_DEFAULT_PASSWORD=1234

   # OpenAI API 키
   OPENAI_API_KEY=당신의_OpenAI_API_키

   # 환경 설정
   NODE_ENV=production
   PORT=3000
   ```

   **JWT_SECRET 생성 방법:**
   ```bash
   # 터미널에서 실행
   openssl rand -hex 32
   ```

### 3단계: 코드 배포

1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "feat: Lovable 배포 준비 완료"
   git push origin main
   ```

2. **Lovable에서 배포 트리거**
   - Lovable Dashboard에서 "Deploy" 버튼 클릭
   - 빌드 로그 확인
   - 성공적으로 배포될 때까지 대기

### 4단계: 배포 확인

1. **앱 접속**
   - Lovable에서 제공하는 URL로 접속
   - 예: `https://your-app.lovable.app`

2. **기능 테스트**
   - [ ] 홈페이지 로딩 확인
   - [ ] 게스트 로그인 테스트
   - [ ] 캐릭터 생성 테스트
   - [ ] 봇과의 배틀 테스트
   - [ ] 리더보드 확인
   - [ ] 관리자 패널 접속 (우측 하단 🦄 클릭)

3. **관리자 로그인**
   - 아이디: `admin`
   - 비밀번호: `1234`

### 5단계: 도메인 설정 (선택사항)

1. **커스텀 도메인 연결**
   - Lovable Dashboard > Settings > Domains
   - "Add Domain" 클릭
   - 도메인 입력 (예: kidtextbattle.com)

2. **DNS 설정**
   - 도메인 제공업체에서 DNS 설정
   - Lovable에서 제공하는 CNAME 레코드 추가

## 🔧 문제 해결

### 빌드 실패 시
1. **환경 변수 확인**
   - 모든 필수 환경 변수가 설정되었는지 확인
   - 값에 공백이나 특수문자가 없는지 확인

2. **Node 버전 확인**
   - lovable.json에 "nodeVersion": "20" 설정 확인

### 데이터베이스 연결 실패 시
1. **Supabase URL 확인**
   - https:// 포함되어 있는지 확인
   - 마지막에 슬래시(/) 없는지 확인

2. **API 키 확인**
   - anon key와 service role key 구분
   - 복사/붙여넣기 시 공백 없는지 확인

### 배틀 기능 오류 시
1. **OpenAI API 키 확인**
   - 유효한 API 키인지 확인
   - 충분한 크레딧이 있는지 확인

## 📱 배포 후 관리

### 데이터베이스 백업
- Supabase Dashboard > Backups에서 자동 백업 설정
- 주기적으로 수동 백업 수행

### 모니터링
- Lovable Dashboard에서 로그 확인
- Supabase Dashboard에서 데이터베이스 사용량 확인

### 업데이트
1. 로컬에서 코드 수정
2. Git push로 자동 배포
3. Lovable Dashboard에서 배포 상태 확인

## 🎉 축하합니다!

Kid Text Battle이 성공적으로 배포되었습니다! 
아이들이 안전하고 재미있게 텍스트 배틀을 즐길 수 있습니다.

### 지원 및 문의
- Lovable 지원: support@lovable.dev
- Supabase 지원: support@supabase.com
- 프로젝트 관련: 프로젝트 관리자에게 문의

---

**참고**: 이 가이드는 Kid Text Battle v1.0.0 기준으로 작성되었습니다.