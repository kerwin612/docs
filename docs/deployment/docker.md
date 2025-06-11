# Docker部署

## 镜像说明

MCP Gateway 提供两种部署方式：
1. All-in-One 部署：所有服务打包在一个容器中，适合单机部署或本机使用
2. 多容器部署：各个服务独立部署，适合生产环境或集群部署

### 镜像仓库

镜像发布到以下三个仓库：
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/amoylab/unla/*`
- 阿里云容器镜像服务: `registry.ap-southeast-1.aliyuncs.com/amoylab/unla-*`

*ghcr支持多层目录，所以组织形式会更清晰，Docker和阿里云的仓库只能一层目录，因此后面镜像名用-拼接*

### 镜像标签

- `latest`: 最新版本
- `vX.Y.Z`: 特定版本号

> ⚡ **注意**: 目前 MCP Gateway 正在快速迭代中！因此建议通过版本号部署会更可靠一点

### 可用镜像

```bash
# All-in-One 版本
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/amoylab/unla/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# API Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/amoylab/unla/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/amoylab/unla/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/mcp-gateway-mock-server:latest
docker pull ghcr.io/amoylab/unla/mock-server:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mock-server:latest

# Web 前端
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/amoylab/unla/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-web:latest
```

## 部署

### All-in-One 部署

All-in-One 部署将所有服务打包在一个容器中，适合单机部署或本机使用。包含以下服务：
- **API Server**: 管理平台后端，可理解为控制面
- **MCP Gateway**: 核心服务，负责实际的网关服务，可理解为数据面
- **Mock User Service**: 模拟用户服务，提供测试用的用户服务（你的存量API服务可能就是类似这样的）
- **Web 前端**: 管理平台前端，提供可视化的管理界面
- **Nginx**: 反向代理其他几个服务

使用 Supervisor 管理服务进程。日志会全部图吐到 stdout 里

#### 端口说明

- `8080`: Web 界面端口
- `5234`: API Server 端口
- `5235`: MCP Gateway 端口
- `5335`: MCP Gateway 管理端口（承载诸如reload的内部接口，生产环境切勿对外）
- `5236`: Mock User Service 端口

#### 数据持久化

建议挂载以下目录：
- `/app/configs`: 配置文件目录
- `/app/data`: 数据目录
- `/app/.env`: 环境变量文件

#### 示例命令


1. 创建必要的目录并下载配置文件：

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

> LLMs可以按需更换，如换成千问（需要兼容OpenAI）
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. 使用 Docker 运行 MCP Gateway：

```bash
# 使用阿里云容器镜像服务镜像（建议在中国境内的服务器或设备使用）
docker run -d \
           --name mcp-gateway \
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

# 使用 GitHub Container Registry 镜像
docker run -d \
           --name mcp-gateway \
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

#### 注意事项

1. 确保配置文件和环境变量文件正确配置
2. 建议使用版本号标签而不是 latest
3. 生产环境建议配置适当的资源限制
4. 确保挂载的目录有正确的权限

### 多容器部署
多个服务独立部署，适合生产环境或集群部署。包含以下服务：
- **mcp-gateway**: 核心服务，负责实际的网关服务，可理解为数据面
- **web(包含apiserver)**: 管理平台及后端，可理解为控制面
- **mock-server**: 模拟服务，提供测试用的服务

适合在生产环境使用，可以按需部署，尤其针对`mcp-gateway`可以多副本部署，实现高可用

以下展示使用Docker Compose 部署的示例，该示例：
1. 使用的是postgres作为数据库存储session、代理配置等信息
2. 采用multi即每个服务单独容器部署
3. 使用redis用于配置更新通知、OAuth存储等用途

大体步骤：
1. 配置[docker-compose.yaml](https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/deploy/docker/multi/docker-compose.yml)
2. 从[.env.example](https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example)拷贝并配置.env
3. 运行`docker compose up -d`
4. 按需配置`Nginx`等LB层

#### docker-compose.yaml
注意事项
1. 修改里面的db, redis相关的账号密码
2. 按需修改暴露的端口，需要留意目前配置方式可能会让相应端口暴露到公网

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
以下只是示例配置，一定要根据你的环节和需求去调整配置！
1. 修改相关db, redis相关的账号密码

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
APISERVER_LOGGER_COLOR=false
APISERVER_LOGGER_STACKTRACE=true

# Logger configuration for mcp-gateway
LOGGER_LEVEL=info
LOGGER_FORMAT=json
LOGGER_OUTPUT=stdout
LOGGER_FILE_PATH=/var/log/mcp-gateway/mcp-gateway.log
LOGGER_MAX_SIZE=100
LOGGER_MAX_BACKUPS=3
LOGGER_MAX_AGE=7
LOGGER_COMPRESS=true
LOGGER_COLOR=false
LOGGER_STACKTRACE=true

# Database Configuration
APISERVER_DB_TYPE=postgres
APISERVER_DB_HOST=postgres
APISERVER_DB_PORT=5432
APISERVER_DB_USER=unla
APISERVER_DB_PASSWORD=**********
APISERVER_DB_NAME=unla
APISERVER_DB_SSL_MODE=disable

# Gateway Configurations Storage Configuration
GATEWAY_STORAGE_TYPE=db
GATEWAY_DB_TYPE=postgres
GATEWAY_DB_HOST=postgres
GATEWAY_DB_PORT=5432
GATEWAY_DB_USER=unla
GATEWAY_DB_PASSWORD=**********
GATEWAY_DB_NAME=unla
GATEWAY_DB_SSL_MODE=disable
GATEWAY_STORAGE_DISK_PATH=
GATEWAY_STORAGE_API_URL=
GATEWAY_STORAGE_API_CONFIG_JSON_PATH=
GATEWAY_STORAGE_API_TIMEOUT=5s
GATEWAY_STORAGE_REVISION_HISTORY_LIMIT=10

# Notifier Configuration
APISERVER_NOTIFIER_ROLE=sender
APISERVER_NOTIFIER_TYPE=redis
## Signal Notifier Settings
APISERVER_NOTIFIER_SIGNAL=SIGHUP
APISERVER_NOTIFIER_SIGNAL_PID=/var/run/mcp-gateway.pid
## API Notifier Settings
APISERVER_NOTIFIER_API_PORT=5335
APISERVER_NOTIFIER_API_TARGET_URL=http://mcp-gateway:5335/_reload
## Redis Notifier Settings
APISERVER_NOTIFIER_REDIS_ADDR=redis:6379
APISERVER_NOTIFIER_REDIS_PASSWORD=**********
APISERVER_NOTIFIER_REDIS_DB=0
APISERVER_NOTIFIER_REDIS_TOPIC=mcp-gateway:reload

# Notifier Configuration
NOTIFIER_ROLE=receiver
NOTIFIER_TYPE=redis
## Signal Notifier Settings
NOTIFIER_SIGNAL=SIGHUP
NOTIFIER_SIGNAL_PID=/var/run/mcp-gateway.pid
## API Notifier Settings
NOTIFIER_API_PORT=5335
NOTIFIER_API_TARGET_URL=http://mcp-gateway:5335/_reload
## Redis Notifier Settings
NOTIFIER_REDIS_ADDR=redis:6379
NOTIFIER_REDIS_USERNAME=
NOTIFIER_REDIS_PASSWORD=**********
NOTIFIER_REDIS_DB=0
NOTIFIER_REDIS_TOPIC=mcp-gateway:reload

# Session storage type: memory or redis
SESSION_STORAGE_TYPE=redis
SESSION_REDIS_ADDR=redis:6379
SESSION_REDIS_USERNAME=
SESSION_REDIS_PASSWORD=**********
SESSION_REDIS_DB=0
SESSION_REDIS_TOPIC=mcp-gateway:session
SESSION_REDIS_PREFIX=
SESSION_REDIS_TTL=24h

OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
OPENAI_API_KEY=sk-**********
OPENAI_MODEL=qwen-turbo-2025-04-28

MCP_GATEWAY_PID=/var/run/mcp-gateway.pid
MCP_GATEWAY_PORT=5235
MCP_GATEWAY_RELOAD_INTERVAL=600s
MCP_GATEWAY_RELOAD_SWITCH=true

VITE_API_BASE_URL=/api
VITE_WS_BASE_URL=/ws
VITE_MCP_GATEWAY_BASE_URL=/mcp
VITE_BASE_URL=/

APISERVER_JWT_SECRET_KEY=**********
APISERVER_JWT_DURATION=72h

TZ=Asia/Shanghai

SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=**********

APISERVER_I18N_PATH=./configs/i18n

OAUTH2_ISSUER=https://github.com/amoylab/unla
OAUTH2_STORAGE_TYPE=redis
OAUTH2_REDIS_ADDR=redis:6379
OAUTH2_REDIS_PASSWORD=**********
OAUTH2_REDIS_DB=1
```

#### nginx
这边只提供vhosts的配置方式举例：
1. 按需调整你的域名
2. 按需调整服务到反代到上游服务器的地址

```nginx
server {
    server_name example.docs.unla.amoylab.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5234/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:5234/api/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /gateway/ {
        proxy_pass http://127.0.0.1:5235/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    location /mock/ {
        proxy_pass http://127.0.0.1:5236/;
        proxy_set_header Host $host;
    }
}
```

#### 重要访问URL
1. Web: [https://example.docs.unla.amoylab.com/](https://example.docs.unla.amoylab.com/)
2. MCP Gateway: [https://example.docs.unla.amoylab.com/gateway/*](https://example.docs.unla.amoylab.com/gateway/*)，比如[https://example.docs.unla.amoylab.com/gateway/mcp/user/mcp](https://example.docs.unla.amoylab.com/gateway/mcp/user/mcp)
