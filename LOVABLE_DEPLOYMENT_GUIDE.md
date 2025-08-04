# Lovable 배포 가이드

## 개요
Kid Text Battle 앱을 Lovable 플랫폼에 배포하기 위한 완전한 가이드입니다.

## 사전 준비사항

### 1. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트 생성
2. 프로젝트 설정에서 다음 정보 수집:
   - Project URL: `https://[프로젝트ID].supabase.co`
   - Anon Key: 대시보드 Settings > API에서 확인
   - Service Role Key: 대시보드 Settings > API에서 확인

### 2. Supabase 데이터베이스 설정

1. Supabase SQL Editor 열기
2. 다음 파일들을 순서대로 실행:
   ```sql
   -- 1. 스키마 생성
   database/supabase-migration.sql
   
   -- 2. 동물 데이터 추가
   database/supabase-seed-animals.sql
   ```

### 3. 봇 캐릭터 생성 (선택사항)
SQL Editor에서 실행:
```sql
-- 봇 사용자 ID 확인
SELECT id, username FROM users WHERE username LIKE '봇_%';

-- 봇 캐릭터 생성 (user_id를 실제 ID로 변경)
INSERT INTO characters (user_id, animal_id, name, description, score, is_bot) VALUES
  (1, 1, '황금갈기', '용맹한 사자 봇', 2960, true),
  (2, 5, '무지개뿔', '강력한 독수리 봇', 2795, true),
  (3, 66, '다이노킹', '고대의 티라노사우루스 봇', 2550, true),
  (4, 52, '불꽃날개', '전설의 불사조 봇', 2285, true),
  (5, 4, '파도타기', '영리한 돌고래 봇', 2100, true);
```

## Lovable 배포 단계

### 1. 리포지토리 준비

1. GitHub에 리포지토리가 있는지 확인
2. 최신 변경사항 커밋 및 푸시:
   ```bash
   git add .
   git commit -m "Lovable 배포 준비 완료"
   git push origin main
   ```

### 2. Lovable 프로젝트 생성

1. [Lovable](https://lovable.app)에 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 연결
4. `kid-text-battle` 리포지토리 선택

### 3. 환경 변수 설정

Lovable 대시보드에서 다음 환경 변수 추가:

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://[프로젝트ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 앱 설정 (필수)
JWT_SECRET=your-secure-jwt-secret-here
ADMIN_DEFAULT_PASSWORD=your-secure-admin-password

# OpenAI (선택사항 - AI 배틀 판정용)
OPENAI_API_KEY=your-openai-api-key
```

### 4. 빌드 설정 확인

Lovable 대시보드에서:
- Framework: Next.js
- Node Version: 20
- Build Command: `npm run build`
- Output Directory: `.next`

### 5. 배포 실행

1. "Deploy" 버튼 클릭
2. 빌드 로그 모니터링
3. 배포 완료 대기

## 배포 후 확인사항

### 1. 앱 접속 테스트
- 홈페이지 로드 확인
- 로그인 기능 테스트 (이메일/게스트)
- 캐릭터 생성 테스트

### 2. 관리자 접속
- 홈페이지 우측 하단 유니콘(🦄) 클릭
- 설정한 관리자 계정으로 로그인
- 관리 기능 확인

### 3. 주요 기능 테스트
- [ ] 동물 도감 페이지
- [ ] 리더보드 페이지
- [ ] 배틀 시스템
- [ ] 봇과의 대전

## 트러블슈팅

### 데이터베이스 연결 오류
- Supabase URL과 키가 정확한지 확인
- Service Role Key가 아닌 Anon Key를 사용했는지 확인

### 빌드 실패
- Node.js 버전이 20인지 확인
- 모든 의존성이 package.json에 포함되어 있는지 확인

### 페이지 라우팅 문제
- 모든 링크가 Next.js Link 컴포넌트를 사용하는지 확인
- 동적 임포트 오류가 있는지 로그 확인

## 추가 최적화

### 1. 성능 최적화
- 이미지 최적화 (Next.js Image 컴포넌트 사용)
- 정적 페이지 생성 (getStaticProps 활용)

### 2. SEO 개선
- 메타 태그 추가
- 구조화된 데이터 추가

### 3. 모니터링
- Vercel Analytics 통합
- Sentry 에러 추적 설정

## 지원 및 문의

문제가 발생하면:
1. Lovable 대시보드의 로그 확인
2. Supabase 대시보드의 로그 확인
3. 브라우저 개발자 도구 콘솔 확인

---

이 가이드를 따라 Kid Text Battle을 성공적으로 Lovable에 배포하세요!