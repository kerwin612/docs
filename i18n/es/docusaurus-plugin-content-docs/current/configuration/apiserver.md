# apiserver.yaml

El archivo de configuración admite la inyección de variables de entorno utilizando la sintaxis `${VAR:default}`. Si la variable de entorno no está configurada, se utilizará el valor predeterminado.

La práctica común es inyectar valores a través de diferentes archivos `.env`, `.env.development`, `.env.prod`, o puede modificar directamente la configuración con valores fijos.

## Configuración de la Base de Datos de Mensajes de Chat

Esta configuración es específicamente para almacenar mensajes de chat en el backend (aunque puede compartir la misma base de datos con las configuraciones de proxy). Corresponde a la información mostrada en la imagen a continuación:

![Sesiones y Mensajes de Chat](/img/chat_histories.png)

Actualmente admite 3 tipos de bases de datos:
- SQLite3
- PostgreSQL
- MySQL

Si necesita agregar soporte para bases de datos adicionales, puede solicitarlo en la sección de [Issues](https://github.com/amoylab/unla/issues), o puede implementar la implementación correspondiente y enviar un PR :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # Tipo de base de datos (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # Dirección del host de la base de datos
  port: ${APISERVER_DB_PORT:5432}                   # Puerto de la base de datos
  user: "${APISERVER_DB_USER:postgres}"             # Nombre de usuario de la base de datos
  password: "${APISERVER_DB_PASSWORD:example}"      # Contraseña de la base de datos
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # Nombre de la base de datos o ruta del archivo
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # Modo SSL para la conexión a la base de datos
```

## Configuración de Almacenamiento del Proxy de Gateway

Esto se utiliza para almacenar configuraciones de proxy de gateway, específicamente las asignaciones de MCP a API, como se muestra en la imagen a continuación:

![Configuración del Proxy de Gateway](/img/gateway_proxies.png)

Actualmente admite 2 tipos:
- disk: Las configuraciones se almacenan como archivos en el disco, con cada configuración en un archivo separado, similar al concepto de vhost de nginx, por ejemplo, `svc-a.yaml`, `svc-b.yaml`
- db: Almacenar en la base de datos, cada configuración es un registro. Actualmente admite tres tipos de bases de datos:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Tipo de almacenamiento: db, disk
  
  # Configuración de la base de datos (usado cuando type es 'db')
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Tipo de base de datos (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # Dirección del host de la base de datos
    port: ${GATEWAY_DB_PORT:5432}                       # Puerto de la base de datos
    user: "${GATEWAY_DB_USER:postgres}"                 # Nombre de usuario de la base de datos
    password: "${GATEWAY_DB_PASSWORD:example}"          # Contraseña de la base de datos
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Nombre de la base de datos o ruta del archivo
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Modo SSL para la conexión a la base de datos
  
  # Configuración del disco (usado cuando type es 'disk')
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Ruta de almacenamiento de archivos de datos
```

## Configuración de Notificaciones

El módulo de notificaciones se utiliza principalmente para notificar a `mcp-gateway` sobre actualizaciones de configuración y activar recargas en caliente sin requerir reinicio del servicio.

Actualmente admite 4 métodos de notificación:
- signal: Notificar a través de señales del sistema operativo, similar a `kill -SIGHUP <pid>` o `nginx -s reload`. Se puede activar a través del comando `mcp-gateway reload`, adecuado para despliegues de máquina única
- api: Notificar a través de una llamada API. `mcp-gateway` escucha en un puerto independiente y realiza recargas en caliente cuando recibe solicitudes. Se puede activar a través de `curl http://localhost:5235/_reload`, adecuado tanto para despliegues de máquina única como de clúster
- redis: Notificar a través de la funcionalidad de publicación/suscripción de Redis, adecuado tanto para despliegues de máquina única como de clúster
- composite: Notificación combinada, utilizando múltiples métodos. Por defecto, `signal` y `api` siempre están habilitados y se pueden combinar con otros métodos. Adecuado tanto para despliegues de máquina única como de clúster, y es el método predeterminado recomendado

Roles de notificación:
- sender: Rol de remitente, responsable de enviar notificaciones. `apiserver` solo puede usar este modo
- receiver: Rol de receptor, responsable de recibir notificaciones. Se recomienda que `mcp-gateway` de máquina única use solo este modo
- both: Tanto rol de remitente como de receptor. `mcp-gateway` desplegado en clúster puede usar este modo

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # Rol: sender, receiver, o both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # Tipo: signal, api, redis, o composite

  # Configuración de señal (usado cuando type es 'signal')
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # Señal a enviar
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # Ruta del archivo PID

  # Configuración de API (usado cuando type es 'api')
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # Puerto de la API
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # Punto final de recarga

  # Configuración de Redis (usado cuando type es 'redis')
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Dirección de Redis
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Contraseña de Redis
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Número de base de datos de Redis
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Tema de publicación/suscripción de Redis
```

## Configuración de la API de OpenAI

El bloque de configuración de OpenAI define la configuración para la integración con la API de OpenAI:

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # Clave de API de OpenAI (requerida)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # Modelo a utilizar
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # URL base de la API
```

Actualmente solo integra llamadas LLMs compatibles con la API de OpenAI

## Configuración del Super Administrador

La configuración del super administrador se utiliza para configurar la cuenta de administrador inicial del sistema. Cada vez que se inicia `apiserver`, verifica si existe y, si no existe, la crea automáticamente

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # Nombre de usuario del super administrador
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # Contraseña del super administrador (cambiar en producción)
```

**¡Se recomienda encarecidamente usar contraseñas fuertes en entornos de producción o redes públicas!**

## Configuración de JWT

La configuración de JWT se utiliza para configurar los parámetros relacionados con la autenticación web:

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # Clave JWT (cambiar en producción)
  duration: "${APISERVER_JWT_DURATION:24h}"                  # Duración del token
```

**¡Se recomienda encarecidamente usar contraseñas fuertes en entornos de producción o redes públicas!**
