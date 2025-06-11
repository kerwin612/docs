# Docker

## 이미지 개요

MCP Gateway는 두 가지 배포 방법을 제공합니다:
1. **All-in-One 배포**: 모든 서비스를 단일 컨테이너에 패키징하여 로컬 또는 단일 노드 배포에 적합합니다.
2. **멀티 컨테이너 배포**: 각 서비스를 개별적으로 배포하여 프로덕션 또는 클러스터 환경에 적합합니다.

### 이미지 저장소

이미지는 다음 레지스트리에 게시됩니다:
- Docker Hub: `docker.io/ifuryst/unla-*`
- GitHub Container Registry: `ghcr.io/amoylab/unla/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/amoylab/unla-*`

*GitHub Container Registry는 더 명확한 구성을 위해 다중 레벨 디렉토리를 지원하지만, Docker Hub와 Alibaba Cloud 레지스트리는 하이픈을 사용한 플랫한 명명 규칙을 사용합니다.*

### 이미지 태그

- `latest`: 최신 버전
- `vX.Y.Z`: 특정 버전

> ⚡ **참고**: MCP Gateway는 빠르게 개발 중입니다! 더 안정적인 배포를 위해 특정 버전 태그를 사용하는 것이 좋습니다.

### 사용 가능한 이미지

```bash
# All-in-One 버전
docker pull docker.io/ifuryst/unla-allinone:latest
docker pull ghcr.io/amoylab/unla/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# API Server
docker pull docker.io/ifuryst/unla-apiserver:latest
docker pull ghcr.io/amoylab/unla/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/unla-mcp-gateway:latest
docker pull ghcr.io/amoylab/unla/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/unla-mock-server:latest
docker pull ghcr.io/amoylab/unla/mock-server:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mock-server:latest

# Web Frontend
docker pull docker.io/ifuryst/unla-web:latest
docker pull ghcr.io/amoylab/unla/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-web:latest
```

## 배포

### All-in-One 배포

All-in-One 배포는 모든 서비스를 단일 컨테이너에 패키징하여 단일 노드 또는 로컬 배포에 이상적입니다. 다음 서비스가 포함됩니다:
- **API Server**: 관리 백엔드 (컨트롤 플레인)
- **MCP Gateway**: 게이트웨이 트래픽을 처리하는 핵심 서비스 (데이터 플레인)
- **Mock User Service**: 테스트를 위한 시뮬레이션된 사용자 서비스 (실제 기존 API 서비스로 대체 가능)
- **Web Frontend**: 웹 기반 관리 인터페이스
- **Nginx**: 내부 서비스용 리버스 프록시

프로세스는 Supervisor로 관리되며, 모든 로그는 stdout으로 출력됩니다.

#### 포트

- `8080`: Web UI
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (reload 등의 내부 엔드포인트, 프로덕션 환경에서는 노출하지 마세요)
- `5236`: Mock User Service

#### 데이터 지속성

다음 디렉토리를 마운트하는 것이 좋습니다:
- `/app/configs`: 설정 파일
- `/app/data`: 데이터 저장소
- `/app/.env`: 환경 변수 파일

#### 명령어 예시

1. 필요한 디렉토리를 생성하고 설정 파일을 다운로드:

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

> 필요에 따라 기본 LLM을 교체할 수 있습니다 (OpenAI 호환 필요), 예: Qwen 사용:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Docker로 MCP Gateway 실행:

```bash
# Alibaba Cloud 레지스트리 사용 (중국 내 서버/장치에 권장)
docker run -d \
           --name unla \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# GitHub Container Registry 사용
docker run -d \
           --name unla \
           -p 8080:80 \
           -p 5234:5234 \
           -p 5235:5235 \
           -p 5335:5335 \
           -p 5236:5236 \
           -e ENV=production \
           -v $(pwd)/configs:/app/configs \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/.env.allinone:/app/.env \
           --restart unless-stopped \
           ghcr.io/amoylab/unla/allinone:latest
```

#### 주의사항

1. 설정 파일과 환경 파일이 올바르게 설정되어 있는지 확인하세요.
2. `latest` 대신 특정 버전 태그를 사용하는 것이 좋습니다.
3. 프로덕션 배포에는 적절한 리소스 제한을 설정하세요.
4. 마운트된 디렉토리에 적절한 권한이 있는지 확인하세요 