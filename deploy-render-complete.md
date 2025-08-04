# Render 완전 배포 가이드 (즉시 작동 보장)

## 전제 조건
- GitHub 계정
- OpenAI API 키 (필수!)

## 1단계: GitHub에 코드 푸시

```bash
cd /home/drjang00/DevEnvironments/kid-text-battle
git add .
git commit -m "fix: Render 배포 준비 완료"
git push origin main
```

## 2단계: Render 계정 생성 및 배포

1. https://render.com 접속
2. GitHub으로 로그인
3. "New +" → "Web Service" 클릭

## 3단계: 서비스 설정

1. **GitHub 저장소 연결**
   - "Connect GitHub" 클릭
   - `kid-text-battle` 저장소 선택

2. **기본 설정**
   - Name: `kid-text-battle`
   - Region: `Singapore (Southeast Asia)`
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

3. **환경 변수 추가** (이미 render.yaml에 설정되어 있지만 OPENAI_API_KEY 추가 필요)
   - "Environment" 섹션에서 "Add Environment Variable" 클릭
   - Key: `OPENAI_API_KEY`
   - Value: `당신의 OpenAI API 키`

4. **디스크 추가** (SQLite 데이터 영구 저장)
   - "Add Disk" 클릭
   - Name: `kid-text-battle-data`
   - Mount Path: `/var/data`
   - Size: `1 GB` (무료)

5. **Create Web Service** 클릭

## 4단계: 배포 완료 대기
- 5-10분 소요
- 빌드 로그에서 진행 상황 확인
- "Live" 상태가 되면 배포 완료

## 5단계: 앱 접속
- URL: `https://kid-text-battle.onrender.com`
- 첫 접속 시 30초 정도 로딩 (무료 플랜)

## 6단계: 관리자 설정
1. 오른쪽 하단 유니콘(🦄) 아이콘 클릭
2. 이메일: `admin`
3. 비밀번호: `1234`

## 문제 해결

### "OpenAI API error" 오류
- Render 대시보드 → Environment → OPENAI_API_KEY 확인
- 올바른 API 키가 설정되어 있는지 확인

### 데이터베이스 오류
- Render 대시보드 → Disks → 디스크가 마운트되어 있는지 확인
- Mount path가 `/var/data`인지 확인

### 빌드 실패
```bash
# package.json 확인
cat package.json | grep scripts

# 다음 스크립트가 있어야 함:
# "build": "next build"
# "start": "node server.js"
```

## 특징
- ✅ SQLite 영구 저장
- ✅ 자동 HTTPS
- ✅ 봇 전투 무제한
- ✅ 관리자 페이지
- ✅ 실시간 전투 판정

## 비용
- 무료 플랜: 750시간/월
- 15분 비활성 시 슬립 모드 (첫 접속 시 30초 대기)
- 유료 플랜($7/월): 24/7 가동, 슬립 모드 없음