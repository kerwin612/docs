# Docker Deployment

## Image Overview

MCP Gateway offers two deployment methods:
1. **All-in-One Deployment**: All services are packaged into a single container, suitable for local or single-node deployments.
2. **Multi-Container Deployment**: Each service is deployed separately, suitable for production or cluster environments.

### Image Repositories

Images are published to the following registries:
- Docker Hub: `docker.io/ifuryst/unla-*`
- GitHub Container Registry: `ghcr.io/amoylab/unla/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/amoylab/unla-*`

*GitHub Container Registry supports multi-level directories for clearer organization, while Docker Hub and Alibaba Cloud registries use flat naming with hyphens.*

### Image Tags

- `latest`: Latest version
- `vX.Y.Z`: Specific version

> ⚡ **Note**: MCP Gateway is under rapid development! It is recommended to use specific version tags for more reliable deployments.

### Available Images

```bash
# All-in-One version
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

## Deployment

### All-in-One Deployment

The All-in-One deployment packages all services into a single container, ideal for single-node or local deployments. It includes the following services:
- **API Server**: Management backend (Control Plane)
- **MCP Gateway**: Core service handling gateway traffic (Data Plane)
- **Mock User Service**: Simulated user service for testing (you can replace it with your actual existing API service)
- **Web Frontend**: Web-based management interface
- **Nginx**: Reverse proxy for internal services

Processes are managed using Supervisor, and all logs are output to stdout.

#### Ports

- `8080`: Web UI
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (internal endpoints like reload; DO NOT expose in production)
- `5236`: Mock User Service

#### Data Persistence

It is recommended to mount the following directories:
- `/app/configs`: Configuration files
- `/app/data`: Data storage
- `/app/.env`: Environment variable file

#### Example Commands

1. Create necessary directories and download configuration files:

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

> You can replace the default LLM if needed (must be OpenAI compatible), e.g., use Qwen:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Run MCP Gateway with Docker:

```bash
# Using Alibaba Cloud registry (recommended for servers/devices in China)
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

# Using GitHub Container Registry
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

#### Notes

1. Ensure the configuration files and environment file are correctly set up.
2. It is recommended to use a specific version tag instead of `latest`.
3. Set appropriate resource limits for production deployments.
4. Ensure mounted directories have proper permissions.

### Multi-Container Deployment

Multiple services deployed independently, suitable for production or cluster environments. Includes the following services:
- **mcp-gateway**: Core service handling gateway traffic (Data Plane)
- **web (includes apiserver)**: Management platform and backend (Control Plane)
- **mock-server**: Mock service for testing

Ideal for production environments, allowing flexible deployment, especially for `mcp-gateway` which can be deployed with multiple replicas for high availability.

The following example demonstrates deployment using Docker Compose, which:
1. Uses PostgreSQL for storing sessions, proxy configurations, and other information
2. Implements multi-container deployment with each service in a separate container
3. Uses Redis for configuration update notifications, OAuth storage, and other purposes

General steps:
1. Configure [docker-compose.yaml](https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/deploy/docker/multi/docker-compose.yml)
2. Copy and configure .env from [.env.example](https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example)
3. Run `docker compose up -d`
4. Configure `Nginx` or other load balancers as needed

#### docker-compose.yaml
Notes:
1. Modify the database and Redis credentials
2. Adjust exposed ports as needed, noting that the current configuration may expose ports to the public network

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: "**********"
      POSTGRES_DB: mcp-gateway
    volumes:
      - ./db:/var/lib/postgresql/data
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
    restart: always

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - ./redis:/data
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
    command: redis-server --appendonly yes --save "900 1" --save "300 10" --save "60 10000" --requirepass "**********"
    restart: always

  web:
    image: ghcr.io/amoylab/unla/web:latest
    ports:
      - "8080:80"
      - "5234:5234"
    environment:
      - ENV=production
      - TZ=Asia/Shanghai
    volumes:
      - ./.env:/app/.env
      - ./data:/app/data
    depends_on:
      - postgres
      - mcp-gateway
      - mock-server
    restart: always

  mcp-gateway:
    image: ghcr.io/amoylab/unla/mcp-gateway:latest
    ports:
      - "5235:5235"
    environment:
      - ENV=production
      - TZ=Asia/Shanghai
    volumes:
      - ./.env:/app/.env
      - ./data:/app/data
    depends_on:
      - postgres
    restart: always

  mock-server:
    image: ghcr.io/amoylab/unla/mock-server:latest
    ports:
      - "5236:5236"
    environment:
      - ENV=production
      - TZ=Asia/Shanghai
    volumes:
      - ./.env:/app/.env
    depends_on:
      - postgres
    restart: always
```

#### .env
The following is just an example configuration. You must adjust the configuration according to your environment and requirements!
1. Modify the database and Redis credentials

```bash
# Logger configuration for apiserver
APISERVER_LOGGER_LEVEL=info
APISERVER_LOGGER_FORMAT=json
APISERVER_LOGGER_OUTPUT=stdout
APISERVER_LOGGER_FILE_PATH=/var/log/mcp-gateway/apiserver.log
APISERVER_LOGGER_MAX_SIZE=100
APISERVER_LOGGER_MAX_BACKUPS=3
APISERVER_LOGGER_MAX_AGE=7
APISERVER_LOGGER_COMPRESS=true
```
