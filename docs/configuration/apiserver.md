# apiserver.yaml

配置文件支持使用 `${VAR:default}` 语法进行环境变量注入。如果环境变量未设置，将使用默认值。

常见的做法是通过不同的`.env`, `.env.development`, `.env.prod`进行注入，当然也可以直接修改配置写死一个值

## 聊天消息数据库配置

该配置主要针对后台的聊天消息存储的配置（当然这里是可以和代理配置存放在同一个数据库），就是下图这个位置的信息：

![聊天会话和消息](/img/chat_histories.png)

目前支持3种数据库：
- SQLite3
- PostgreSQL
- MySQL

若有需要增加数据库支持可以到[Issue](https://github.com/amoylab/unla/issues)里请求支持，或者可以直接实现对应的impl并提交PR :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # 数据库类型（sqlite,postgres, mysql）
  host: "${APISERVER_DB_HOST:localhost}"            # 数据库主机地址
  port: ${APISERVER_DB_PORT:5432}                   # 数据库端口
  user: "${APISERVER_DB_USER:postgres}"             # 数据库用户名
  password: "${APISERVER_DB_PASSWORD:example}"      # 数据库密码
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # 数据库名称或文件路径
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # 数据库连接的 SSL 模式
```

## 网关代理存储配置

这里是用来存放网关代理配置的，也就是对应的从MCP到API映射的那个配置，就是下图这个位置的数据：

![网关代理配置](/img/gateway_proxies.png)

目前支持2种:
- disk: 配置会以文件的形式存放在磁盘里，每个配置单独一个文件，可以理解跟nginx的vhost一个道理，比如 `svc-a.yaml`, `svc-b.yaml`
- db: 存到数据库，每个配置是一条记录。目前支持三种数据库：
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # 存储类型：db, disk
  
  # 数据库配置（当 type 为 'db' 时使用）
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # 数据库类型（sqlite,postgres, mysql）
    host: "${GATEWAY_DB_HOST:localhost}"                # 数据库主机地址
    port: ${GATEWAY_DB_PORT:5432}                       # 数据库端口
    user: "${GATEWAY_DB_USER:postgres}"                 # 数据库用户名
    password: "${GATEWAY_DB_PASSWORD:example}"          # 数据库密码
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # 数据库名称或文件路径
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # 数据库连接的 SSL 模式
  
  # 磁盘配置（当 type 为 'disk' 时使用）
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # 数据文件存储路径
```

## 通知配置

通知配置模块主要是用来当配置更新的时候如何让`mcp-gateway`感知到更新并进行热重载而无需重启服务。

目前支持4种通知方式：
- signal: 通过发送操作系统信号量来通知，类似`kill -SIGHUP <pid>`或者`nginx -s reload`这种方式，可通过`mcp-gateway reload`命令调用，适合单机部署时使用
- api: 通过调用一个api的方式通知，`mcp-gateway`会监听一个独立的端口，当收到请求时会进行热重载，可通过`curl http://localhost:5235/_reload`直接调用，适合单机和集群部署时使用
- redis: 通过redis的发布/订阅功能通知，适合单机或集群部署时使用
- composite: 组合通知，通过多种方式组合，默认`signal`和`api`一定会开启，可以在配合其他方式。适合单机和集群部署时使用，也是推荐的默认的方式

通知区分角色：
- sender: 发送者，负责发送通知，`apiserver`只能走这个模式
- receiver: 接收者，负责接收通知，单机的`mcp-gateway`建议只走这个模式
- both: 既是发送者又是接收者，集群部署的`mcp-gateway`可以走这个方式

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"  # 角色：'sender'（发送者）或 'receiver'（接收者）
  type: "${APISERVER_NOTIFIER_TYPE:signal}"  # 类型：'signal'（信号）、'api'、'redis' 或 'composite'（组合）

  # 信号配置（当 type 为 'signal' 时使用）
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # 要发送的信号
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PID 文件路径

  # API 配置（当 type 为 'api' 时使用）
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # API 端口
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # 重载端点

  # Redis 配置（当 type 为 'redis' 时使用）
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redis 地址
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redis 密码
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redis 数据库编号
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redis 发布/订阅主题
```

## OpenAI API配置

OpenAI 配置块定义了 OpenAI API 集成的设置：

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI API 密钥（必需）
  model: "${OPENAI_MODEL:gpt-4.1}"                              # 使用的模型
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # API 基础 URL
```

目前仅集成了OpenAI API兼容的LLMs调用

## 超级管理员配置

超级管理员配置用于设置系统初始管理员账户，每次启动 `apiserver` 会自动检测是否存在，若不存在会自动创建

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # 超级管理员用户名
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # 超级管理员密码（生产环境请修改）
```

**强烈建议生产环境或者公网环境使用强密码！**

## JWT配置

JWT配置用于设置web认证相关的参数：

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # JWT密钥（生产环境请修改）
  duration: "${APISERVER_JWT_DURATION:24h}"                  # Token有效期
```

**强烈建议生产环境或者公网环境使用强密码！**
