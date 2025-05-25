# Gateway Service Configuration

## Configuration Example

Below is a complete configuration example, including routing, CORS, response handling, and other settings:

```yaml
name: "mock-server"             # Proxy service name, globally unique

# Router Configuration
routers:
  - server: "mock-server"       # Service name
    prefix: "/mcp/user"         # Route prefix, globally unique, cannot be repeated, recommended to distinguish by service or domain+module

    # CORS Configuration
    cors:
      allowOrigins:             # For development and testing environments, everything can be opened; for production, it's best to open as needed. (Most MCP Clients don't need CORS)
        - "*"
      allowMethods:             # Allowed request methods, open as needed. For MCP (SSE and Streamable), usually only these 3 methods are required
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Must be allowed
        - "Authorization"       # Need to support carrying this key in the request for authentication needs
        - "Mcp-Session-Id"      # For MCP, it's necessary to support carrying this key in the request, otherwise Streamable HTTP cannot be used normally
      exposeHeaders:
        - "Mcp-Session-Id"      # For MCP, this key must be exposed when CORS is enabled, otherwise Streamable HTTP cannot be used normally
      allowCredentials: true    # Whether to add the Access-Control-Allow-Credentials: true header

# Server Configuration
servers:
  - name: "mock-server"               # Service name, must be consistent with the server in routers
    # namespace field has been removed in v0.4.7
    description: "Mock User Service"  # Service description
    allowedTools:                     # List of allowed tools (subset of tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Service-level configuration, can be referenced in tools through {{.Config}}
      Cookie: 123                                     # Hardcoded configuration
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration from environment variables, usage: '{{ env "ENV_VAR_NAME" }}'

# Tool Configuration
tools:
  - name: "register_user"                                   # Tool name
    description: "Register a new user"                      # Tool description
    method: "POST"                                          # HTTP method for the target (upstream, backend) service
    endpoint: "http://localhost:5236/users"                 # Target service address
    headers:                                                # Request header configuration, used for headers carried when requesting the target service
      Content-Type: "application/json"                      # Hardcoded request header
      Authorization: "{{.Request.Headers.Authorization}}"   # Using the Authorization header extracted from the client request (for passthrough scenarios)
      Cookie: "{{.Config.Cookie}}"                          # Using the value from service configuration
    args:                         # Parameter configuration
      - name: "username"          # Parameter name
        position: "body"          # Parameter position: header, query, path, body, form-data
        required: true            # Whether the parameter is required
        type: "string"            # Parameter type
        description: "Username"   # Parameter description
        default: ""               # Default value
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Request body template, used to dynamically generate the request body, e.g., values extracted from parameters (MCP request arguments)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Response body template, used to dynamically generate the response body, e.g., values extracted from the response
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

## Configuration Details

### 1. Basic Configuration

- `name`: Proxy service name, globally unique, used to identify different proxy services
- `routers`: Router configuration list, defines request forwarding rules
- `servers`: Server configuration list, defines service metadata and allowed tools
- `tools`: Tool configuration list, defines specific API call rules

You can treat a configuration as a namespace, recommended to distinguish by service or domain. A service contains many API interfaces, each API interface corresponds to a Tool.

### 2. Router Configuration

Router configuration is used to define request forwarding rules:

```yaml
routers:
  - server: "mock-server"       # Service name, must be consistent with the name in servers
    prefix: "/mcp/user"         # Route prefix, globally unique, cannot be repeated
```

By default, three access points are derived from the `prefix`:
- SSE: `${prefix}/sse`, e.g., `/mcp/user/sse`
- SSE: `${prefix}/message`, e.g., `/mcp/user/message`
- StreamableHTTP: `${prefix}/mcp`, e.g., `/mcp/user/mcp`


### 3. CORS Configuration

Cross-Origin Resource Sharing (CORS) configuration is used to control cross-origin request access:

```yaml
cors:
  allowOrigins:             # For development and testing environments, everything can be opened; for production, it's best to open as needed. (Most MCP Clients don't need CORS)
    - "*"
  allowMethods:             # Allowed request methods, open as needed. For MCP (SSE and Streamable), usually only these 3 methods are required
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # Must be allowed
    - "Authorization"       # Need to support carrying this key in the request for authentication needs
    - "Mcp-Session-Id"      # For MCP, it's necessary to support carrying this key in the request, otherwise Streamable HTTP cannot be used normally
  exposeHeaders:
    - "Mcp-Session-Id"      # For MCP, this key must be exposed when CORS is enabled, otherwise Streamable HTTP cannot be used normally
  allowCredentials: true    # Whether to add the Access-Control-Allow-Credentials: true header
```

> **In most cases, MCP Client does not need CORS**

### 4. Server Configuration

Server configuration is used to define service metadata, associated tool list, and service-level configuration:

```yaml
servers:
  - name: "mock-server"               # Service name, must be consistent with the server in routers
    # namespace field has been removed in v0.4.7
    description: "Mock User Service"  # Service description
    allowedTools:                     # List of allowed tools (subset of tools)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Service-level configuration, can be referenced in tools through {{.Config}}
      Cookie: 123                                     # Hardcoded configuration
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration from environment variables, usage: '{{ env "ENV_VAR_NAME" }}'
```

Service-level configuration can be referenced in tools through `{{.Config}}`. This can be hardcoded in the configuration file or obtained from environment variables. When injecting through environment variables, it needs to be referenced through `{{ env "ENV_VAR_NAME" }}`.

### 5. Tool Configuration

Tool configuration is used to define specific API call rules:

```yaml
tools:
  - name: "register_user"                                   # Tool name
    description: "Register a new user"                      # Tool description
    method: "POST"                                          # HTTP method for the target (upstream, backend) service
    endpoint: "http://localhost:5236/users"                 # Target service address
    headers:                                                # Request header configuration, used for headers carried when requesting the target service
      Content-Type: "application/json"                      # Hardcoded request header
      Authorization: "{{.Request.Headers.Authorization}}"   # Using the Authorization header extracted from the client request (for passthrough scenarios)
      Cookie: "{{.Config.Cookie}}"                          # Using the value from service configuration
    args:                         # Parameter configuration
      - name: "username"          # Parameter name
        position: "body"          # Parameter position: header, query, path, body, form-data
        required: true            # Whether the parameter is required
        type: "string"            # Parameter type
        description: "Username"   # Parameter description
        default: ""               # Default value
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Request body template, used to dynamically generate the request body, e.g., values extracted from parameters (MCP request arguments)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Response body template, used to dynamically generate the response body, e.g., values extracted from the response
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

#### 5.1 Request Parameter Assembly

When requesting the target service, there are several sources for parameter assembly:
1. `.Config`: Extract values from service-level configuration
2. `.Args`: Extract values directly from request parameters
3. `.Request`: Extract values from the request, including request headers `.Request.Headers`, request body `.Request.Body`, etc.

Parameter positions (position) support the following types:
- `header`: The parameter will be placed in the request header
- `query`: The parameter will be placed in the URL query string
- `path`: The parameter will be placed in the URL path
- `body`: The parameter will be placed in the JSON format request body
- `form-data`: The parameter will be placed in multipart/form-data format request body, used for file uploads and other scenarios

Each parameter can have a default value. When a parameter is not provided in the MCP request, the default value will be automatically used. Even if the default value is an empty string (""), it will still be used. For example:

```yaml
args:
  - name: "theme"
    position: "body"
    required: true
    type: "string"
    description: "User interface theme"
    default: "light"    # When theme parameter is not provided in the request, "light" will be used as the default value
```

When using `form-data` as the parameter position, you don't need to specify `requestBody`, the system will automatically assemble the parameters into multipart/form-data format. For example:

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

For JSON format request bodies, they need to be assembled in `requestBody`, for example:

```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

The `endpoint` (target address) can also use the above sources to extract values, for example `http://localhost:5236/users/{{.Args.email}}/preferences` extracts values from request parameters.

#### 5.2 Response Parameter Assembly

Response body assembly is similar to request body assembly:
1. `.Response.Data`: Extract values from the response, the response must be in JSON format to extract
2. `.Response.Body`: Directly pass through the entire response body, ignoring the response content format and directly passing it to the client

Both use `.Response` to extract values, for example:
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## Configuration Storage

Gateway proxy configuration can be stored in the following two ways:

1. Database storage (recommended):
    - Supports SQLite3, PostgreSQL, MySQL
    - Each configuration is stored as a record
    - Supports dynamic updates and hot reloading

2. File storage:
    - Each configuration is stored separately as a YAML file
    - Similar to Nginx's vhost configuration
    - The file name is recommended to use the service name, such as `mock-server.yaml`

## MCP Service Proxy Configuration

In addition to proxying HTTP services, MCP Gateway also supports proxying MCP services, currently supporting three transport protocols: stdio, SSE, and streamable-http.

### Configuration Example

Below is a complete MCP service proxy configuration example:

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

### Configuration Details

#### 1. MCP Service Types

MCP Gateway supports the following three types of MCP service proxies:

1. **stdio type**:
   - Communicates with the MCP service process through standard input and output
   - Suitable for MCP services that need to be started locally, such as third-party SDKs
   - Configuration parameters include `command`, `args`, and `env`

2. **SSE type**:
   - Forwards MCP client requests to upstream services that support SSE
   - Suitable for existing MCP services that support the SSE protocol
   - Only requires the `url` parameter pointing to the upstream SSE service address

3. **streamable-http type**:
   - Forwards MCP client requests to upstream services that support streamable HTTP
   - Suitable for existing upstream services that support the MCP protocol
   - Only requires the `url` parameter pointing to the upstream MCP service address

#### 2. stdio Type Configuration

Configuration example for stdio type MCP service:

```yaml
mcpServers:
  - type: "stdio"
    name: "amap-maps"                                   # Service name
    command: "npx"                                      # Command to execute
    args:                                               # Command arguments
      - "-y"
      - "@amap/amap-maps-mcp-server"
    env:                                                # Environment variables
      AMAP_MAPS_API_KEY: "{{.Request.Headers.Apikey}}"  # Extract value from request header
```

Environment variables can be set through the `env` field, and values can be extracted from the request, for example `{{.Request.Headers.Apikey}}` extracts the value of Apikey from the request header.

#### 3. SSE Type Configuration

Configuration example for SSE type MCP service:

```yaml
mcpServers:
  - type: "sse"
    name: "mock-user-sse"                       # Service name
    url: "http://localhost:3000/mcp/user/sse"   # Upstream SSE service address, usually ending with /sse, depending on the upstream service
```

#### 4. streamable-http Type Configuration

Configuration example for streamable-http type MCP service:

```yaml
mcpServers:
  - type: "streamable-http"
    name: "mock-user-mcp"                       # Service name
    url: "http://localhost:3000/mcp/user/mcp"   # Upstream MCP service address, usually ending with /mcp, depending on the upstream service
```

#### 5. Router Configuration

For MCP service proxies, the router configuration is similar to HTTP service proxies, with CORS configured according to actual needs (typically CORS is not enabled in production environments):

```yaml
routers:
  - server: "amap-maps"           # Service name, must be consistent with the name in mcpServers
    prefix: "/mcp/stdio-proxy"    # Route prefix, globally unique
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
        - "Mcp-Session-Id"        # MCP service must include this header
      exposeHeaders:
        - "Mcp-Session-Id"        # MCP service must expose this header
      allowCredentials: true
```

For MCP services, `Mcp-Session-Id` in request and response headers must be supported, otherwise the client cannot use it normally.  