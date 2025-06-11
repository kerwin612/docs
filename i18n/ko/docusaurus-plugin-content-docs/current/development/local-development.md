# 로컬 개발 환경 설정 가이드

이 문서에서는 모든 필요한 서비스 구성 요소를 포함하여 로컬에서 완전한 MCP Gateway 개발 환경을 설정하고 시작하는 방법을 설명합니다.

## 전제 조건

시작하기 전에 시스템에 다음 소프트웨어가 설치되어 있는지 확인하세요:

- Git
- Go 1.24.1 이상
- Node.js v20.18.0 이상
- npm

## 프로젝트 아키텍처 개요

MCP Gateway 프로젝트는 다음과 같은 핵심 구성 요소로 이루어져 있습니다:

1. **apiserver** - 구성 관리, 사용자 인터페이스 및 기타 API 서비스 제공
2. **mcp-gateway** - 코어 게이트웨이 서비스, MCP 프로토콜 변환 처리
3. **mock-server** - 개발 테스트를 위한 사용자 서비스 시뮬레이션
4. **web** - 관리 인터페이스 프론트엔드

## 개발 환경 시작하기

### 1. 프로젝트 복제

[MCP Gateway 코드 저장소](https://github.com/amoylab/unla)를 방문하여 `Fork` 버튼을 클릭하여 프로젝트를 자신의 GitHub 계정으로 포크합니다.

### 2. 로컬로 복제

포크된 저장소를 로컬로 복제합니다:

```bash
git clone https://github.com/당신의-github-사용자-이름/mcp-gateway.git
```

### 3. 환경 의존성 초기화

프로젝트 디렉토리로 이동합니다:
```bash
cd unla
```

의존성을 설치합니다:

```bash
go mod tidy
cd web
npm i
```

### 4. 개발 환경 시작

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**참고**: 아무것도 수정하지 않고 기본 구성으로 개발을 시작할 수 있지만, Disk, DB 등을 전환하는 등의 환경이나 개발 요구 사항에 맞게 구성 파일을 수정할 수도 있습니다.

**참고**: 모든 서비스를 실행하려면 4개의 터미널 창이 필요할 수 있습니다. 호스트 머신에서 여러 서비스를 실행하는 이 방식은 개발 중에 재시작 및 디버깅을 쉽게 할 수 있습니다.

#### 4.1 mcp-gateway 시작

```bash
go run cmd/gateway/main.go
```

mcp-gateway는 기본적으로 `http://localhost:5235`에서 시작되어 MCP 프로토콜 요청을 처리합니다.

#### 4.2 apiserver 시작 

```bash
go run cmd/apiserver/main.go
```

apiserver는 기본적으로 `http://localhost:5234`에서 시작됩니다.

#### 4.3 mock-server 시작

```bash
go run cmd/mock-server/main.go
```

mock-server는 기본적으로 `http://localhost:5235`에서 시작됩니다.

#### 4.4 웹 프론트엔드 시작

```bash
npm run dev
```

웹 프론트엔드는 기본적으로 `http://localhost:5236`에서 시작됩니다.

이제 브라우저에서 http://localhost:5236 접속하여 관리 인터페이스를 이용할 수 있습니다. 기본 사용자 이름과 비밀번호는 환경 변수(루트 디렉토리의 .env 파일)에 의해 결정되며, 구체적으로는 `SUPER_ADMIN_USERNAME`과 `SUPER_ADMIN_PASSWORD`입니다. 로그인 후 관리 인터페이스에서 사용자 이름과 비밀번호를 변경할 수 있습니다.

## 일반적인 문제

### 환경 변수 설정

일부 서비스는 제대로 작동하기 위해 특정 환경 변수가 필요할 수 있습니다. `.env` 파일을 만들거나 명령을 시작하기 전에 이러한 변수를 설정할 수 있습니다:

```bash
# 예시
export OPENAI_API_KEY="당신의_api_key"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="당신의_비밀_키"
```

## 다음 단계

로컬 개발 환경을 성공적으로 시작한 후, 다음을 수행할 수 있습니다:

- [아키텍처 문서](./architecture)를 확인하여 시스템 구성 요소를 깊이 이해하기
- [구성 가이드](../configuration/gateways)를 읽고 게이트웨이 구성 방법 학습하기

## 코드 기여 워크플로우

새로운 기능 개발이나 버그 수정을 시작하기 전에 다음 단계에 따라 개발 환경을 설정하세요:

1. 포크한 저장소를 로컬에 클론:
```bash
git clone https://github.com/your-github-username/unla.git
```

2. 업스트림 저장소 추가:
```bash
git remote add upstream git@github.com:amoylab/unla.git
```

3. 업스트림 코드와 동기화:
```bash
git pull upstream main
```

4. 포크 저장소에 업데이트 푸시 (선택사항):
```bash
git push origin main
```

5. 새로운 기능 브랜치 생성:
```bash
git switch -c feat/your-feature-name
```

6. 개발 완료 후, 브랜치를 포크 저장소에 푸시:
```bash
git push origin feat/your-feature-name
```

7. GitHub에서 Pull Request를 생성하여 브랜치를 메인 저장소의 main 브랜치에 병합합니다.

**팁**:
- 브랜치 명명 규칙: 새 기능은 `feat/` 접두사, 버그 수정은 `fix/` 접두사 사용
- PR을 제출하기 전에 코드가 모든 테스트를 통과하는지 확인하세요
- 코드 충돌을 피하기 위해 포크 저장소를 업스트림 저장소와 동기화 상태로 유지하세요 