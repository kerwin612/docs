# 网关代理服务配置

## 配置示例

以下是一个完整的配置示例，包含了路由、CORS、响应处理等配置：

```yaml
name: "mock-server"              # 代理服务名称，全局唯一

# 路由配置
routers:
  - server: "mock-server"       # 服务名称
    prefix: "/mcp/user"         # 路由前缀，全局唯一，不可重复，建议按照服务或者领域+模块来区分前缀

    # CORS 配置
    cors:
      allowOrigins:             # 开发测试环境可全部开放，线上最好按需开放。（大部分MCP Client是不需要开放跨域的）
        - "*"
      allowMethods:             # 允许的请求方法，按需开放，对于MCP（SSE和Streamable）来说通常只需要这3个方法即可
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # 必须允许的
        - "Authorization"       # 有鉴权需求的需要支持请求里携带此Key
        - "Mcp-Session-Id"      # 对于MCP来说，必须支持请求里携带这个Key，否则Streamable HTTP无法正常使用
      exposeHeaders:
        - "Mcp-Session-Id"      # 对于MCP来说，开启跨域的时候必须要暴露这个Key，否则Streamable HTTP无法正常使用
      allowCredentials: true    # 是否增加 Access-Control-Allow-Credentials: true 这个Header

# 服务配置
servers:
  - name: "mock-server"               # 服务名称，需要与routers中的server保持一致
    # namespace字段已在v0.4.7版本中移除
    description: "Mock User Service"  # 服务描述
    allowedTools:                     # 允许使用的工具列表（为tools的子集）
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # 服务级别的配置，可以在tools中通过{{.Config}}引用
      Cookie: 123                                     # 写死的配置
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 从环境变量中获取的配置，用法是'{{ env "ENV_VAR_NAME" }}'

# 工具配置
tools:
  - name: "register_user"                                   # 工具名称
    description: "Register a new user"                      # 工具描述
    method: "POST"                                          # 请求目标（上游、后端）服务的HTTP方法
    endpoint: "http://localhost:5236/users"                 # 目标服务地址
    headers:                                                # 请求头配置，用于在请求目标服务时携带的请求头
      Content-Type: "application/json"                      # 写死的请求头
      Authorization: "{{.Request.Headers.Authorization}}"   # 使用从客户端请求里提取的Authorization头（用于透传的场景）
      Cookie: "{{.Config.Cookie}}"                          # 使用服务配置中的值
    args:                         # 参数配置
      - name: "username"          # 参数名称
        position: "body"          # 参数位置：header, query, path, body, form-data
        required: true            # 参数是否必填
        type: "string"            # 参数类型
        description: "Username"   # 参数描述
        default: ""               # 默认值
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # 请求体模板，用于动态生成请求体，如：从参数（MCP的请求arguments）中提取的值
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # 响应体模板，用于动态生成响应体，如：从响应中提取的值
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "get_user_by_email"
    description: "Get user by email"
    method: "GET"
    endpoint: "http://localhost:5236/users/email/{{.Args.email}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "update_user_preferences"
    description: "Update user preferences"
    method: "PUT"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
    headers:
      Content-Type: "application/json"
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
      - name: "isPublic"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether the user profile is public"
        default: "false"
      - name: "showEmail"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether to show email in profile"
        default: "true"
      - name: "theme"
        position: "body"
        required: true
        type: "string"
        description: "User interface theme"
        default: "light"
      - name: "tags"
        position: "body"
        required: true
        type: "array"
        items:
           type: "string"
           enum: ["developer", "designer", "manager", "tester"]
        description: "User role tags"
        default: "[]"
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}",
        "preferences": {
          "isPublic": {{.Response.Data.preferences.isPublic}},
          "showEmail": {{.Response.Data.preferences.showEmail}},
          "theme": "{{.Response.Data.preferences.theme}}",
          "tags": {{.Response.Data.preferences.tags}}
        }
      }

  - name: "update_user_avatar"
    description: "Update user avatar using a URL via multipart form"
    method: "POST"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/avatar"
    headers:
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email of the user"
        default: ""
      - name: "url"
        position: "form-data"
        required: true
        type: "string"
        description: "The avatar image URL"
        default: ""
    responseBody: |-
      {
        "message": "{{.Response.Data.message}}",
        "avatarUrl": "{{.Response.Data.avatarUrl}}"
      }
```

## 配置说明

### 1. 基础配置

- `name`: 代理服务名称，全局唯一，用于标识不同的代理服务
- `routers`: 路由配置列表，定义请求的转发规则
- `servers`: 服务配置列表，定义服务的元数据和允许使用的工具
- `tools`: 工具配置列表，定义具体的API调用规则

可以把一份配置当作一个命名空间，建议按照服务或者领域来区分，某个服务里包含很多API接口，每个API接口对应一个Tool

### 2. 路由配置

路由配置用于定义请求的转发规则：

```yaml
routers:
  - server: "mock-server"       # 服务名称，需要与servers中的name保持一致
    prefix: "/mcp/user"         # 路由前缀，全局唯一，不可重复
```

目前默认情况下会在`prefix`的基础之上衍生出3个接入点：
- SSE: `${prefix}/sse`，如：`/mcp/user/sse`
- SSE: `${prefix}/message`，如：`/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`，如：`/mcp/user/mcp`


### 3. CORS配置

跨域资源共享（CORS）配置用于控制跨域请求的访问权限：

```yaml
cors:
  allowOrigins:             # 开发测试环境可全部开放，线上最好按需开放。（大部分MCP Client是不需要开放跨域的）
    - "*"
  allowMethods:             # 允许的请求方法，按需开放，对于MCP（SSE和Streamable）来说通常只需要这3个方法即可
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # 必须允许的
    - "Authorization"       # 有鉴权需求的需要支持请求里携带此Key
    - "Mcp-Session-Id"      # 对于MCP来说，必须支持请求里携带这个Key，否则Streamable HTTP无法正常使用
  exposeHeaders:
    - "Mcp-Session-Id"      # 对于MCP来说，开启跨域的时候必须要暴露这个Key，否则Streamable HTTP无法正常使用
  allowCredentials: true    # 是否增加 Access-Control-Allow-Credentials: true 这个Header
```

> **通常情况下，MCP Client是不需要开放跨域的**

### 4. 服务配置

服务配置用于定义服务元信息、关联的工具列表，以及服务级别的配置

```yaml
servers:
  - name: "mock-server"               # 服务名称，需要与routers中的server保持一致
    # namespace字段已在v0.4.7版本中移除
    description: "Mock User Service"  # 服务描述
    allowedTools:                     # 允许使用的工具列表（为tools的子集）
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # 服务级别的配置，可以在tools中通过{{.Config}}引用
      Cookie: 123                                     # 写死的配置
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # 从环境变量中获取的配置，用法是'{{ env "ENV_VAR_NAME" }}'
```

服务级别的配置，可以在tools中通过 `{{.Config}}` 引用。此处可以通过写死在配置文件里的方式，也可以通过从环境变量中获取的方式。通过环境变量注入的话，需要通过`{{ env "ENV_VAR_NAME" }}`的方式引用

### 5. 工具配置

工具配置用于定义具体的API调用规则：

```yaml
tools:
  - name: "register_user"                                   # 工具名称
    description: "Register a new user"                      # 工具描述
    method: "POST"                                          # 请求目标（上游、后端）服务的HTTP方法
    endpoint: "http://localhost:5236/users"                 # 目标服务地址
    headers:                                                # 请求头配置，用于在请求目标服务时携带的请求头
      Content-Type: "application/json"                      # 写死的请求头
      Authorization: "{{.Request.Headers.Authorization}}"   # 使用从客户端请求里提取的Authorization头（用于透传的场景）
      Cookie: "{{.Config.Cookie}}"                          # 使用服务配置中的值
    args:                         # 参数配置
      - name: "username"          # 参数名称
        position: "body"          # 参数位置：header, query, path, body, form-data
        required: true            # 参数是否必填
        type: "string"            # 参数类型
        description: "Username"   # 参数描述
        default: ""               # 默认值
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # 请求体模板，用于动态生成请求体，如：从参数（MCP的请求arguments）中提取的值
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # 响应体模板，用于动态生成响应体，如：从响应中提取的值
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "get_user_by_email"
    description: "Get user by email"
    method: "GET"
    endpoint: "http://localhost:5236/users/email/{{.Args.email}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }

  - name: "update_user_preferences"
    description: "Update user preferences"
    method: "PUT"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/preferences"
    headers:
      Content-Type: "application/json"
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email"
        default: ""
      - name: "isPublic"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether the user profile is public"
        default: "false"
      - name: "showEmail"
        position: "body"
        required: true
        type: "boolean"
        description: "Whether to show email in profile"
        default: "true"
      - name: "theme"
        position: "body"
        required: true
        type: "string"
        description: "User interface theme"
        default: "light"
      - name: "tags"
        position: "body"
        required: true
        type: "array"
        items:
           type: "string"
           enum: ["developer", "designer", "manager", "tester"]
        description: "User role tags"
        default: "[]"
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}",
        "preferences": {
          "isPublic": {{.Response.Data.preferences.isPublic}},
          "showEmail": {{.Response.Data.preferences.showEmail}},
          "theme": "{{.Response.Data.preferences.theme}}",
          "tags": {{.Response.Data.preferences.tags}}
        }
      }

  - name: "update_user_avatar"
    description: "Update user avatar using a URL via multipart form"
    method: "POST"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/avatar"
    headers:
      Authorization: "{{.Request.Headers.Authorization}}"
      Cookie: "{{.Config.Cookie}}"
    args:
      - name: "email"
        position: "path"
        required: true
        type: "string"
        description: "Email of the user"
        default: ""
      - name: "url"
        position: "form-data"
        required: true
        type: "string"
        description: "The avatar image URL"
        default: ""
    responseBody: |-
      {
        "message": "{{.Response.Data.message}}",
        "avatarUrl": "{{.Response.Data.avatarUrl}}"
      }
```

#### 5.1 请求参数组装

请求目标服务的时候会涉及组装参数的动作，目前有几个来源：
1. `.Config`: 从服务级别的配置中提取值
2. `.Args`: 直接从请求参数中提取值
3. `.Request`: 从请求中提取的值，包括请求头`.Request.Headers`、请求体`.Request.Body`等

参数位置（position）支持以下几种：
- `header`: 参数将被放置在请求头中
- `query`: 参数将被放置在URL查询字符串中
- `path`: 参数将被放置在URL路径中
- `body`: 参数将被放置在JSON格式的请求体中
- `form-data`: 参数将被放置在multipart/form-data格式的请求体中，用于文件上传等场景

每个参数都可以设置默认值（default），当MCP请求中没有提供该参数时，将自动使用默认值。即使默认值为空字符串（""），也会被使用。例如：

```yaml
args:
  - name: "theme"
    position: "body"
    required: true
    type: "string"
    description: "User interface theme"
    default: "light"    # 当请求中没有提供theme参数时，将使用"light"作为默认值
```

当使用 `form-data` 作为参数位置时，不需要指定 `requestBody`，系统会自动将参数组装成 multipart/form-data 格式。例如：

```yaml
  - name: "update_user_avatar"
    method: "POST"
    endpoint: "http://localhost:5236/users/{{.Args.email}}/avatar"
    args:
      - name: "url"
        position: "form-data"
        required: true
        type: "string"
        description: "The avatar image URL"
```

对于JSON格式的请求体，需要在 `requestBody` 中组装，比如：

```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

包括 `endpoint` 即目标地址也可以使用以上的来源去提取值，比如 `http://localhost:5236/users/{{.Args.email}}/preferences` 就是从请求参数中提取的值

#### 5.2 响应参数组装

响应体的组装和请求体的组装类似：
1. `.Response.Data`: 从响应中提取的值，响应必须是JSON的格式才可以提取
2. `.Response.Body`: 直接透传整个响应体，会忽略响应内容格式，直接传递给客户端

都是通过 `.Response` 来提取值，比如：
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## 配置存储

网关代理配置可以通过以下两种方式存储：

1. 数据库存储（推荐）：
    - 支持 SQLite3、PostgreSQL、MySQL
    - 每个配置作为一条记录存储
    - 支持动态更新和热重载

2. 文件存储：
    - 每个配置单独存储为一个 YAML 文件
    - 类似 Nginx 的 vhost 配置方式
    - 文件名建议使用服务名称，如 `mock-server.yaml`

## MCP 服务代理配置

除了代理 HTTP 服务外，MCP Gateway 还支持代理 MCP 服务，目前 stdio、SSE 和 streamable-http 三种传输协议都已支持

### 配置示例

以下是一个完整的 MCP 服务代理配置示例：

```yaml
name: "proxy-mcp-exp"
tenant: "default"

routers:
  - server: "amap-maps"
    prefix: "/mcp/stdio-proxy"
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"
      exposeHeaders:
        - "Mcp-Session-Id"
      allowCredentials: true
  - server: "mock-user-sse"
    prefix: "/mcp/sse-proxy"
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"
      exposeHeaders:
        - "Mcp-Session-Id"
      allowCredentials: true
  - server: "mock-user-mcp"
    prefix: "/mcp/streamable-http-proxy"
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"
      exposeHeaders:
        - "Mcp-Session-Id"
      allowCredentials: true

mcpServers:
  - type: "stdio"
    name: "amap-maps"
    command: "npx"
    args:
      - "-y"
      - "@amap/amap-maps-mcp-server"
    env:
      AMAP_MAPS_API_KEY: "{{.Request.Headers.Apikey}}"

  - type: "sse"
    name: "mock-user-sse"
    url: "http://localhost:3000/mcp/user/sse"

  - type: "streamable-http"
    name: "mock-user-mcp"
    url: "http://localhost:3000/mcp/user/mcp"
```

### 配置说明

#### 1. MCP 服务类型

MCP Gateway 支持以下三种类型的 MCP 服务代理：

1. **stdio 类型**：
   - 通过标准输入输出与 MCP 服务进程通信
   - 适用于需要本地启动的 MCP 服务，如第三方 SDK
   - 配置参数包括 `command`、`args` 和 `env`

2. **SSE 类型**：
   - 将 MCP 客户端的请求转发到支持 SSE 的上游服务
   - 适用于已有的支持 SSE 协议的 MCP 服务
   - 仅需配置 `url` 参数指向上游 SSE 服务地址

3. **streamable-http 类型**：
   - 将 MCP 客户端的请求转发到支持可流式 HTTP 的上游服务
   - 适用于已有的支持 MCP 协议的上游服务
   - 仅需配置 `url` 参数指向上游 MCP 服务地址

#### 2. stdio 类型配置

stdio 类型的 MCP 服务配置示例：

```yaml
mcpServers:
  - type: "stdio"
    name: "amap-maps"                                   # 服务名称
    command: "npx"                                      # 要执行的命令
    args:                                               # 命令参数
      - "-y"
      - "@amap/amap-maps-mcp-server"
    env:                                                # 环境变量
      AMAP_MAPS_API_KEY: "{{.Request.Headers.Apikey}}"  # 从请求头中提取值
```

通过 `env` 字段可以设置环境变量，支持从请求中提取值，例如 `{{.Request.Headers.Apikey}}` 表示从请求头中提取 Apikey 的值

#### 3. SSE 类型配置

SSE 类型的 MCP 服务配置示例：

```yaml
mcpServers:
  - type: "sse"
    name: "mock-user-sse"                       # 服务名称
    url: "http://localhost:3000/mcp/user/sse"   # 上游 SSE 服务地址，通常以/sse结尾，实际根据上游服务而定
```

#### 4. streamable-http 类型配置

streamable-http 类型的 MCP 服务配置示例：

```yaml
mcpServers:
  - type: "streamable-http"
    name: "mock-user-mcp"                       # 服务名称
    url: "http://localhost:3000/mcp/user/mcp"   # 上游 MCP 服务地址，通常以/mcp结尾，实际根据上游服务而定
```

#### 5. 路由配置

对于 MCP 服务代理，路由配置与 HTTP 服务代理类似，CORS 则根据实际情况配置（通常生产环境一般是不会开启跨域的）：

```yaml
routers:
  - server: "amap-maps"           # 服务名称，需要与 mcpServers 中的 name 保持一致
    prefix: "/mcp/stdio-proxy"    # 路由前缀，全局唯一
    cors:
      allowOrigins:
        - "*"
      allowMethods:
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"
        - "Authorization"
        - "Mcp-Session-Id"        # MCP 服务必须包含此头
      exposeHeaders:
        - "Mcp-Session-Id"        # MCP 服务必须暴露此头
      allowCredentials: true
```

对于 MCP 服务，请求头和响应头中的 `Mcp-Session-Id` 是必须要支持的，否则客户端无法正常使用。
