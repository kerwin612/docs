# apiserver.yaml

Die Konfigurationsdatei unterstützt die Injektion von Umgebungsvariablen mit der Syntax `${VAR:default}`. Wenn die Umgebungsvariable nicht gesetzt ist, wird der Standardwert verwendet.

Die übliche Praxis ist, Werte über verschiedene `.env`, `.env.development`, `.env.prod` Dateien zu injizieren, oder die Konfiguration direkt mit festen Werten zu ändern.

## Chat-Nachrichten-Datenbank-Konfiguration

Diese Konfiguration ist speziell für die Speicherung von Chat-Nachrichten im Backend (obwohl sie die gleiche Datenbank mit Proxy-Konfigurationen teilen kann). Sie entspricht den Informationen, die im folgenden Bild gezeigt werden:

![Chat-Sitzungen und Nachrichten](/img/chat_histories.png)

Derzeit werden 3 Arten von Datenbanken unterstützt:
- SQLite3
- PostgreSQL
- MySQL

Wenn Sie Unterstützung für zusätzliche Datenbanken benötigen, können Sie dies im [Issue](https://github.com/amoylab/unla/issues) Bereich anfordern oder die entsprechende Implementierung selbst erstellen und einen PR einreichen :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # Datenbanktyp (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # Datenbank-Host-Adresse
  port: ${APISERVER_DB_PORT:5432}                   # Datenbank-Port
  user: "${APISERVER_DB_USER:postgres}"             # Datenbank-Benutzername
  password: "${APISERVER_DB_PASSWORD:example}"      # Datenbank-Passwort
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # Datenbankname oder Dateipfad
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # SSL-Modus für die Datenbankverbindung
```

## Gateway-Proxy-Speicher-Konfiguration

Dies wird verwendet, um Gateway-Proxy-Konfigurationen zu speichern, insbesondere die Mappings von MCP zu API, wie im folgenden Bild gezeigt:

![Gateway-Proxy-Konfiguration](/img/gateway_proxies.png)

Derzeit werden 2 Arten unterstützt:
- disk: Konfigurationen werden als Dateien auf der Festplatte gespeichert, wobei jede Konfiguration in einer separaten Datei gespeichert wird, ähnlich dem vhost-Konzept von nginx, z.B. `svc-a.yaml`, `svc-b.yaml`
- db: Speicherung in der Datenbank, jede Konfiguration ist ein Datensatz. Derzeit werden drei Arten von Datenbanken unterstützt:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Speichertyp: db, disk
  
  # Datenbank-Konfiguration (wird verwendet, wenn type 'db' ist)
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Datenbanktyp (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # Datenbank-Host-Adresse
    port: ${GATEWAY_DB_PORT:5432}                       # Datenbank-Port
    user: "${GATEWAY_DB_USER:postgres}"                 # Datenbank-Benutzername
    password: "${GATEWAY_DB_PASSWORD:example}"          # Datenbank-Passwort
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Datenbankname oder Dateipfad
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # SSL-Modus für die Datenbankverbindung
  
  # Festplatten-Konfiguration (wird verwendet, wenn type 'disk' ist)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Datendatei-Speicherpfad
```

## Benachrichtigungs-Konfiguration

Das Benachrichtigungs-Modul wird hauptsächlich verwendet, um `mcp-gateway` über Konfigurationsaktualisierungen zu informieren und Hot-Reloads ohne Neustart des Dienstes auszulösen.

Derzeit werden 4 Benachrichtigungsmethoden unterstützt:
- signal: Benachrichtigung über Betriebssystem-Signale, ähnlich wie `kill -SIGHUP <pid>` oder `nginx -s reload`. Kann über den Befehl `mcp-gateway reload` ausgelöst werden, geeignet für Einzelmaschinen-Bereitstellungen
- api: Benachrichtigung über einen API-Aufruf. `mcp-gateway` hört auf einem unabhängigen Port und führt Hot-Reloads durch, wenn Anfragen empfangen werden. Kann über `curl http://localhost:5235/_reload` direkt ausgelöst werden, geeignet für Einzelmaschinen- und Cluster-Bereitstellungen
- redis: Benachrichtigung über die Redis Pub/Sub-Funktionalität, geeignet für Einzelmaschinen- und Cluster-Bereitstellungen
- composite: Kombinierte Benachrichtigung, die mehrere Methoden verwendet. Standardmäßig sind `signal` und `api` immer aktiviert und können mit anderen Methoden kombiniert werden. Geeignet für Einzelmaschinen- und Cluster-Bereitstellungen und die empfohlene Standardmethode

Benachrichtigungs-Rollen:
- sender: Absender-Rolle, verantwortlich für das Senden von Benachrichtigungen. `apiserver` kann nur diesen Modus verwenden
- receiver: Empfänger-Rolle, verantwortlich für das Empfangen von Benachrichtigungen. Einzelmaschinen-`mcp-gateway` sollte nur diesen Modus verwenden
- both: Sowohl Absender- als auch Empfänger-Rolle. Cluster-bereitgestellter `mcp-gateway` kann diesen Modus verwenden

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # Rolle: sender, receiver, oder both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # Typ: signal, api, redis, oder composite

  # Signal-Konfiguration (wird verwendet, wenn type 'signal' ist)
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # Zu sendendes Signal
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PID-Dateipfad

  # API-Konfiguration (wird verwendet, wenn type 'api' ist)
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # API-Port
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # Reload-Endpunkt

  # Redis-Konfiguration (wird verwendet, wenn type 'redis' ist)
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redis-Adresse
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redis-Passwort
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redis-Datenbanknummer
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redis Pub/Sub-Thema
```

## OpenAI API-Konfiguration

Der OpenAI-Konfigurationsblock definiert die Einstellungen für die OpenAI API-Integration:

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI API-Schlüssel (erforderlich)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # Zu verwendendes Modell
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # API-Basis-URL
```

Derzeit werden nur OpenAI API-kompatible LLMs-Aufrufe integriert

## Super-Administrator-Konfiguration

Die Super-Administrator-Konfiguration wird verwendet, um das initiale Administrator-Konto des Systems einzurichten. Jedes Mal, wenn `apiserver` gestartet wird, prüft es, ob es existiert, und erstellt es automatisch, wenn es nicht existiert

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # Super-Administrator-Benutzername
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # Super-Administrator-Passwort (in Produktion ändern)
```

**Es wird dringend empfohlen, in Produktionsumgebungen oder öffentlichen Netzwerken starke Passwörter zu verwenden!**

## JWT-Konfiguration

Die JWT-Konfiguration wird verwendet, um die Web-Authentifizierungsparameter einzurichten:

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # JWT-Schlüssel (in Produktion ändern)
  duration: "${APISERVER_JWT_DURATION:24h}"                  # Token-Gültigkeitsdauer
```

**Es wird dringend empfohlen, in Produktionsumgebungen oder öffentlichen Netzwerken starke Passwörter zu verwenden!** 