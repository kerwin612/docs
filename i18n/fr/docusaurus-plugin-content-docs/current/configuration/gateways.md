# Configuration du Service de Passerelle

## Exemple de Configuration

Voici un exemple complet de configuration, incluant le routage, CORS, le traitement des réponses et d'autres paramètres :

```yaml
name: "mock-server"             # Nom du service proxy, unique globalement

# Configuration du Routeur
routers:
  - server: "mock-server"       # Nom du service
    prefix: "/mcp/user"         # Préfixe de route, unique globalement, ne peut pas être répété, recommandé de distinguer par service ou domaine+module

    # Configuration CORS
    cors:
      allowOrigins:             # Pour les environnements de développement et de test, tout peut être ouvert ; pour la production, il est préférable d'ouvrir selon les besoins. (La plupart des Clients MCP n'ont pas besoin de CORS)
        - "*"
      allowMethods:             # Méthodes de requête autorisées, à ouvrir selon les besoins. Pour MCP (SSE et Streamable), généralement seules ces 3 méthodes sont nécessaires
        - "GET"
        - "POST"
        - "OPTIONS"
      allowHeaders:
        - "Content-Type"        # Doit être autorisé
        - "Authorization"       # Besoin de supporter cette clé dans la requête pour les besoins d'authentification
        - "Mcp-Session-Id"      # Pour MCP, il est nécessaire de supporter cette clé dans la requête, sinon Streamable HTTP ne peut pas être utilisé normalement
      exposeHeaders:
        - "Mcp-Session-Id"      # Pour MCP, cette clé doit être exposée lorsque CORS est activé, sinon Streamable HTTP ne peut pas être utilisé normalement
      allowCredentials: true    # Si l'en-tête Access-Control-Allow-Credentials: true doit être ajouté

# Configuration du Serveur
servers:
  - name: "mock-server"               # Nom du service, doit être cohérent avec le serveur dans routers
    # Le champ namespace a été supprimé dans la version v0.4.7
    description: "Mock User Service"  # Description du service
    allowedTools:                     # Liste des outils autorisés (sous-ensemble d'outils)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Configuration au niveau du service, peut être référencée dans les outils via {{.Config}}
      Cookie: 123                                     # Configuration codée en dur
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration à partir des variables d'environnement, usage : '{{ env "ENV_VAR_NAME" }}'

# Configuration d'Outils
tools:
  - name: "register_user"                                   # Nom de l'outil
    description: "Register a new user"                      # Description de l'outil
    method: "POST"                                          # Méthode HTTP pour le service cible (amont, backend)
    endpoint: "http://localhost:5236/users"                 # Adresse du service cible
    headers:                                                # Configuration d'en-tête de requête, utilisée pour les en-têtes transportés lors de la demande au service cible
      Content-Type: "application/json"                      # En-tête de requête codé en dur
      Authorization: "{{.Request.Headers.Authorization}}"   # Utilisation de l'en-tête Authorization extrait de la requête client (pour les scénarios de transfert)
      Cookie: "{{.Config.Cookie}}"                          # Utilisation de la valeur de la configuration du service
    args:                         # Configuration des paramètres
      - name: "username"          # Nom du paramètre
        position: "body"          # Position du paramètre : header, query, path, body, form-data
        required: true            # Si le paramètre est requis
        type: "string"            # Type de paramètre
        description: "Username"   # Description du paramètre
        default: ""               # Valeur par défaut
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Modèle de corps de requête, utilisé pour générer dynamiquement le corps de la requête, ex: valeurs extraites des paramètres (arguments de requête MCP)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Modèle de corps de réponse, utilisé pour générer dynamiquement le corps de la réponse, ex: valeurs extraites de la réponse
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

## Détails de Configuration

### 1. Configuration de Base

- `name` : Nom du service proxy, unique globalement, utilisé pour identifier différents services proxy
- `routers` : Liste de configuration de routeur, définit les règles de transfert de requêtes
- `servers` : Liste de configuration de serveur, définit les métadonnées de service et les outils autorisés
- `tools` : Liste de configuration d'outils, définit des règles d'appel API spécifiques

Vous pouvez traiter une configuration comme un espace de noms, recommandé pour distinguer par service ou domaine. Un service contient de nombreuses interfaces API, chaque interface API correspond à un outil.

### 2. Configuration du Routeur

La configuration du routeur est utilisée pour définir les règles de transfert de requêtes :

```yaml
routers:
  - server: "mock-server"       # Nom du service, doit être cohérent avec le nom dans servers
    prefix: "/mcp/user"         # Préfixe de route, unique globalement, ne peut pas être répété
```

Par défaut, trois points d'accès sont dérivés du `prefix` :
- SSE : `${prefix}/sse`, ex : `/mcp/user/sse`
- SSE : `${prefix}/message`, ex : `/mcp/user/message`
- StreamableHTTP : `${prefix}/mcp`, ex : `/mcp/user/mcp`


### 3. Configuration CORS

La configuration Cross-Origin Resource Sharing (CORS) est utilisée pour contrôler l'accès aux requêtes cross-origin :

```yaml
cors:
  allowOrigins:             # Pour les environnements de développement et de test, tout peut être ouvert ; pour la production, il est préférable d'ouvrir selon les besoins. (La plupart des Clients MCP n'ont pas besoin de CORS)
    - "*"
  allowMethods:             # Méthodes de requête autorisées, à ouvrir selon les besoins. Pour MCP (SSE et Streamable), généralement seules ces 3 méthodes sont nécessaires
    - "GET"
    - "POST"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"        # Doit être autorisé
    - "Authorization"       # Besoin de supporter cette clé dans la requête pour les besoins d'authentification
    - "Mcp-Session-Id"      # Pour MCP, il est nécessaire de supporter cette clé dans la requête, sinon Streamable HTTP ne peut pas être utilisé normalement
  exposeHeaders:
    - "Mcp-Session-Id"      # Pour MCP, cette clé doit être exposée lorsque CORS est activé, sinon Streamable HTTP ne peut pas être utilisé normalement
  allowCredentials: true    # Si l'en-tête Access-Control-Allow-Credentials: true doit être ajouté
```

> **Dans la plupart des cas, le Client MCP n'a pas besoin de CORS**

### 4. Configuration du Serveur

La configuration du serveur est utilisée pour définir les métadonnées du service, la liste des outils associés et la configuration au niveau du service :

```yaml
servers:
  - name: "mock-server"               # Nom du service, doit être cohérent avec le serveur dans routers
    # Le champ namespace a été supprimé dans la version v0.4.7
    description: "Mock User Service"  # Description du service
    allowedTools:                     # Liste des outils autorisés (sous-ensemble d'outils)
      - "register_user"
      - "get_user_by_email"
      - "update_user_preferences"
    config:                                           # Configuration au niveau du service, peut être référencée dans les outils via {{.Config}}
      Cookie: 123                                     # Configuration codée en dur
      Authorization: 'Bearer {{ env "AUTH_TOKEN" }}'  # Configuration à partir des variables d'environnement, usage : '{{ env "ENV_VAR_NAME" }}'
```

La configuration au niveau du service peut être référencée dans les outils via `{{.Config}}`. Cela peut être codé en dur dans le fichier de configuration ou obtenu à partir de variables d'environnement. Lors de l'injection via des variables d'environnement, il doit être référencé via `{{ env "ENV_VAR_NAME" }}`.

### 5. Configuration d'Outils

La configuration d'outils est utilisée pour définir des règles d'appel API spécifiques :

```yaml
tools:
  - name: "register_user"                                   # Nom de l'outil
    description: "Register a new user"                      # Description de l'outil
    method: "POST"                                          # Méthode HTTP pour le service cible (amont, backend)
    endpoint: "http://localhost:5236/users"                 # Adresse du service cible
    headers:                                                # Configuration d'en-tête de requête, utilisée pour les en-têtes transportés lors de la demande au service cible
      Content-Type: "application/json"                      # En-tête de requête codé en dur
      Authorization: "{{.Request.Headers.Authorization}}"   # Utilisation de l'en-tête Authorization extrait de la requête client (pour les scénarios de transfert)
      Cookie: "{{.Config.Cookie}}"                          # Utilisation de la valeur de la configuration du service
    args:                         # Configuration des paramètres
      - name: "username"          # Nom du paramètre
        position: "body"          # Position du paramètre : header, query, path, body, form-data
        required: true            # Si le paramètre est requis
        type: "string"            # Type de paramètre
        description: "Username"   # Description du paramètre
        default: ""               # Valeur par défaut
      - name: "email"
        position: "body"
        required: true
        type: "string"
        description: "Email"
        default: ""
    requestBody: |-                       # Modèle de corps de requête, utilisé pour générer dynamiquement le corps de la requête, ex: valeurs extraites des paramètres (arguments de requête MCP)
      {
        "username": "{{.Args.username}}",
        "email": "{{.Args.email}}"
      }
    responseBody: |-                      # Modèle de corps de réponse, utilisé pour générer dynamiquement le corps de la réponse, ex: valeurs extraites de la réponse
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

#### 5.1 Assemblage des Paramètres de Requête

Lors de la demande au service cible, il existe plusieurs sources pour l'assemblage des paramètres :
1. `.Config` : Extraire des valeurs de la configuration au niveau du service
2. `.Args` : Extraire des valeurs directement à partir des paramètres de requête
3. `.Request` : Extraire des valeurs de la requête, y compris les en-têtes de requête `.Request.Headers`, le corps de la requête `.Request.Body`, etc.

Les positions de paramètres (position) prennent en charge les types suivants :
- `header` : Le paramètre sera placé dans l'en-tête de la requête
- `query` : Le paramètre sera placé dans la chaîne de requête URL
- `path` : Le paramètre sera placé dans le chemin URL
- `body` : Le paramètre sera placé dans le corps de la requête au format JSON
- `form-data` : Le paramètre sera placé dans le corps de la requête au format multipart/form-data, utilisé pour les téléchargements de fichiers et autres scénarios

Chaque paramètre peut avoir une valeur par défaut. Lorsqu'un paramètre n'est pas fourni dans la requête MCP, la valeur par défaut sera automatiquement utilisée. Même si la valeur par défaut est une chaîne vide (""), elle sera utilisée. Par exemple:

```yaml
args:
  - name: "theme"
    position: "body"
    required: true
    type: "string"
    description: "User interface theme"
    default: "light"    # Lorsque le paramètre theme n'est pas fourni dans la requête, "light" sera utilisé comme valeur par défaut
```

Lorsque vous utilisez `form-data` comme position de paramètre, vous n'avez pas besoin de spécifier `requestBody`, le système assemblera automatiquement les paramètres au format multipart/form-data. Par exemple:

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

Pour les corps de requête au format JSON, ils doivent être assemblés dans `requestBody`, par exemple :

```yaml
    requestBody: |-
      {
        "isPublic": {{.Args.isPublic}},
        "showEmail": {{.Args.showEmail}},
        "theme": "{{.Args.theme}}",
        "tags": {{.Args.tags}}
      }
```

Le `endpoint` (adresse cible) peut également utiliser les sources ci-dessus pour extraire des valeurs, par exemple `http://localhost:5236/users/{{.Args.email}}/preferences` extrait des valeurs des paramètres de requête.

#### 5.2 Assemblage des Paramètres de Réponse

L'assemblage du corps de réponse est similaire à l'assemblage du corps de requête :
1. `.Response.Data` : Extraire des valeurs de la réponse, la réponse doit être au format JSON pour extraire
2. `.Response.Body` : Transférer directement l'ensemble du corps de réponse, en ignorant le format du contenu de la réponse et en le transmettant directement au client

Les deux utilisent `.Response` pour extraire des valeurs, par exemple :
```yaml
    responseBody: |-
      {
        "id": "{{.Response.Data.id}}",
        "username": "{{.Response.Data.username}}",
        "email": "{{.Response.Data.email}}",
        "createdAt": "{{.Response.Data.createdAt}}"
      }
```

## Stockage de Configuration

La configuration du proxy de passerelle peut être stockée de deux manières suivantes :

1. Stockage en base de données (recommandé) :
    - Prend en charge SQLite3, PostgreSQL, MySQL
    - Chaque configuration est stockée comme un enregistrement
    - Prend en charge les mises à jour dynamiques et le rechargement à chaud

2. Stockage de fichiers :
    - Chaque configuration est stockée séparément en tant que fichier YAML
    - Similaire à la configuration vhost de Nginx
    - Le nom de fichier est recommandé d'utiliser le nom du service, tel que `mock-server.yaml`

## Configuration du Proxy de Service MCP

En plus de proxifier les services HTTP, MCP Gateway prend également en charge la proxification des services MCP, prenant actuellement en charge trois protocoles de transport : stdio, SSE et streamable-http.

### Exemple de Configuration

Voici un exemple complet de configuration de proxy de service MCP :

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

### Détails de Configuration

#### 1. Types de Services MCP

MCP Gateway prend en charge les trois types suivants de proxys de service MCP :

1. **Type stdio** :
   - Communique avec le processus de service MCP via l'entrée et la sortie standard
   - Convient aux services MCP qui doivent être démarrés localement, tels que les SDK tiers
   - Les paramètres de configuration incluent `command`, `args` et `env`

2. **Type SSE** :
   - Transfère les requêtes client MCP vers des services en amont qui prennent en charge SSE
   - Convient aux services MCP existants qui prennent en charge le protocole SSE
   - Nécessite uniquement le paramètre `url` pointant vers l'adresse du service SSE en amont

3. **Type streamable-http** :
   - Transfère les requêtes client MCP vers des services en amont qui prennent en charge HTTP diffusable
   - Convient aux services en amont existants qui prennent en charge le protocole MCP
   - Nécessite uniquement le paramètre `url` pointant vers l'adresse du service MCP en amont

#### 2. Configuration de Type stdio

Exemple de configuration pour le service MCP de type stdio :

```yaml
mcpServers:
  - type: "stdio"
    name: "amap-maps"                                   # Nom du service
    command: "npx"                                      # Commande à exécuter
    args:                                               # Arguments de commande
      - "-y"
      - "@amap/amap-maps-mcp-server"
    env:                                                # Variables d'environnement
      AMAP_MAPS_API_KEY: "{{.Request.Headers.Apikey}}"  # Extraire la valeur de l'en-tête de requête
```

Les variables d'environnement peuvent être définies via le champ `env`, et les valeurs peuvent être extraites de la requête, par exemple `{{.Request.Headers.Apikey}}` extrait la valeur de Apikey de l'en-tête de requête.

#### 3. Configuration de Type SSE

Exemple de configuration pour le service MCP de type SSE :

```yaml
mcpServers:
  - type: "sse"
    name: "mock-user-sse"                       # Nom du service
    url: "http://localhost:3000/mcp/user/sse"   # Adresse du service SSE en amont, se terminant généralement par /sse, selon le service en amont
```

#### 4. Configuration de Type streamable-http

Exemple de configuration pour le service MCP de type streamable-http :

```yaml
mcpServers:
  - type: "streamable-http"
    name: "mock-user-mcp"                       # Nom du service
    url: "http://localhost:3000/mcp/user/mcp"   # Adresse du service MCP en amont, se terminant généralement par /mcp, selon le service en amont
```

#### 5. Configuration du Routeur

Pour les proxys de service MCP, la configuration du routeur est similaire aux proxys de service HTTP, avec CORS configuré selon les besoins réels (généralement CORS n'est pas activé dans les environnements de production) :

```yaml
routers:
  - server: "amap-maps"           # Nom du service, doit être cohérent avec le nom dans mcpServers
    prefix: "/mcp/stdio-proxy"    # Préfixe de route, unique globalement
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
        - "Mcp-Session-Id"        # Le service MCP doit inclure cet en-tête
      exposeHeaders:
        - "Mcp-Session-Id"        # Le service MCP doit exposer cet en-tête
      allowCredentials: true
```

Pour les services MCP, `Mcp-Session-Id` dans les en-têtes de requête et de réponse doit être pris en charge, sinon le client ne peut pas l'utiliser normalement.  