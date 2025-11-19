# Maple Idle Coupon Auto Bot - Monorepo

메이플 아이들 쿠폰 자동 배포 시스템의 모노레포입니다.

## 프로젝트 구조

```
monorepo/
├── packages/
│   ├── server/          # NestJS 백엔드 API
│   └── client/          # React 프론트엔드
├── package.json         # 모노레포 루트 설정
└── pnpm-workspace.yaml  # 워크스페이스 설정
```

## 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
PORT=3000

# 카카오 OAuth 설정 (서버용)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=http://localhost:3000/auth/callback/kakao

# 카카오 OAuth 설정 (클라이언트용)
VITE_KAKAO_APP_KEY=your-kakao-app-key
```

**참고**: 서버는 루트의 `.env` 파일과 `packages/server/.env` 파일을 모두 참조합니다. 루트 파일이 우선 적용됩니다.

### 3. 개발 서버 실행

#### 백엔드와 프론트엔드를 동시에 실행:

```bash
pnpm dev
```

#### 개별 실행:

```bash
# 백엔드만 실행 (포트 3000)
pnpm dev:server

# 프론트엔드만 실행 (포트 3001)
pnpm dev:client
```

## API 문서

백엔드 실행 후 [http://localhost:3000/api](http://localhost:3000/api)에서 Swagger 문서를 확인할 수 있습니다.

## 프로젝트 목적

메이플 키우기(메이플스토리 키우기) 게임에서 쿠폰 적용 과정을 자동화하여 사용자 편의성을 향상시키는 서비스입니다.

### 주요 문제 해결

- **번거로운 쿠폰 적용 과정**: 인게임에서 UUID 복사 → 웹사이트 접속 → 쿠폰 코드 입력의 반복적인 작업
- **일괄 처리 필요성**: 다수의 계정에 대한 쿠폰 적용을 효율적으로 처리

### 해결 방안

- **쿠폰 코드 중앙 관리**: 서버에서 쿠폰 코드를 관리하고 자동으로 배포
- **UUID 일괄 등록**: 사용자가 UUID를 등록하면 자동으로 쿠폰 적용
- **API 자동화**: 메이플 서버 API를 활용한 자동 쿠폰 적용 시스템

### 미래 확장성

넥슨의 메이플 키우기 오픈 API 제공 시점에 대비하여 다음과 같은 기능을 추가할 수 있습니다:

- 커뮤니티 기능 (친구 목록, 길드 관리 등)
- 게임 데이터 분석 및 통계
- 자동화된 게임 관리 기능

## 주요 기능

### 백엔드 (packages/server)

- **NestJS** 기반 REST API
- **Supabase** 데이터베이스 연동
- 유저 및 쿠폰 관리
- 메이플 서버 API 연동
- Swagger API 문서 자동 생성

### 프론트엔드 (packages/client)

- **React + TypeScript + Vite**
- UUID 등록 및 관리 인터페이스
- 쿠폰 배포 현황 모니터링
- 모던 웹 애플리케이션
- 대화형 UUID 확인 가이드

## UUID 가이드 이미지 설정

UUID 확인 방법을 안내하는 이미지를 추가하려면 다음 경로에 파일을 넣어주세요:

```
packages/client/public/images/
├── uuid-guide-1.png  # 게임 접속 화면
├── uuid-guide-2.png  # 설정 메뉴
└── uuid-guide-3.png  # UUID 복사 화면
```

이미지를 추가하지 않으면 자동으로 플레이스홀더가 표시됩니다.

## Docker 배포

### 분리된 클라이언트/서버 배포 (권장)

클라이언트와 서버를 독립적으로 배포할 수 있습니다:

#### 로컬 개발 환경
```bash
# 로컬 환경 전체 빌드 및 실행
./build-local.sh

# 로컬 환경 정지
./stop-local.sh

# 로컬 환경 재시작 (변경사항 적용)
./restart-local.sh
```

#### 프로덕션 빌드 및 푸시
```bash
# 프로덕션 이미지 빌드 및 Docker Hub 푸시
./build-prod.sh

# 환경변수 설정 (선택사항)
export DOCKER_REGISTRY="developercdd"  # 기본값: developercdd
export DOCKER_TAG="v1.0.0"            # 기본값: latest
```

#### 개별 배포 예시
```bash
# 클라이언트만 빌드
export BUILD_TYPE="client"
./build-and-push.sh

# 서버만 빌드
export BUILD_TYPE="server"
./build-and-push.sh

# 둘 다 빌드
export BUILD_TYPE="both"  # 기본값
./build-and-push.sh
```

### 서버 배포

#### 통합 배포 (권장)
```bash
# 서버에서 (클라이언트 + 서버 모두)
cd /path/to/makis-project
docker-compose --profile full up -d

# 결과:
# - localhost:4000 에서 프론트엔드 접근
# - localhost:4010 에서 API 접근
```

#### 개별 배포
```bash
# 클라이언트만 배포
docker-compose --profile client up -d

# 서버만 배포
docker-compose --profile server up -d

# 기존 통합 방식 (단일 컨테이너)
docker-compose --profile legacy up -d
```

### Docker Compose 설정

서버의 `docker-compose.yml`에서 이미지 경로를 실제 레지스트리로 변경하세요:

```yaml
services:
  makis-app:
    image: your-registry/makis-app:latest  # 실제 레지스트리 주소로 변경
```

### Nginx 설정

이미 nginx가 설치된 서버에서는 다음 설정을 사용하세요:

```bash
# nginx.conf를 /etc/nginx/sites-available/makis에 복사
sudo cp nginx.conf /etc/nginx/sites-available/makis

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/makis /etc/nginx/sites-enabled/

# nginx 재시작
sudo systemctl restart nginx
```

### 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
# 서버 설정
NODE_ENV=production
SERVER_PORT=5000

# Supabase 설정
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 카카오 로그인 설정
KAKAO_APP_KEY=your_kakao_app_key
VITE_KAKAO_APP_KEY=your_kakao_app_key
```

## 개발 명령어

```bash
# 모든 패키지 빌드
pnpm build

# 모든 패키지 린트
pnpm lint

# 모든 패키지 테스트
pnpm test

# 모든 패키지 클린
pnpm clean
```

## 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 UNLICENSED입니다.
