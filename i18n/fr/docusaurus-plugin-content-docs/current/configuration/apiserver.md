# apiserver.yaml

Le fichier de configuration prend en charge l'injection de variables d'environnement en utilisant la syntaxe `${VAR:default}`. Si la variable d'environnement n'est pas définie, la valeur par défaut sera utilisée.

La pratique courante est d'injecter des valeurs via différents fichiers `.env`, `.env.development`, `.env.prod`, ou vous pouvez modifier directement la configuration avec des valeurs fixes.

## Configuration de la Base de Données des Messages de Chat

Cette configuration est spécifiquement pour le stockage des messages de chat dans le backend (bien qu'elle puisse partager la même base de données avec les configurations de proxy). Elle correspond aux informations montrées dans l'image ci-dessous :

![Sessions et Messages de Chat](/img/chat_histories.png)

Actuellement, 3 types de bases de données sont pris en charge :
- SQLite3
- PostgreSQL
- MySQL

Si vous avez besoin d'ajouter la prise en charge de bases de données supplémentaires, vous pouvez le demander dans la section [Issues](https://github.com/amoylab/unla/issues), ou vous pouvez implémenter l'implémentation correspondante et soumettre une PR :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # Type de base de données (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # Adresse de l'hôte de la base de données
  port: ${APISERVER_DB_PORT:5432}                   # Port de la base de données
  user: "${APISERVER_DB_USER:postgres}"             # Nom d'utilisateur de la base de données
  password: "${APISERVER_DB_PASSWORD:example}"      # Mot de passe de la base de données
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # Nom de la base de données ou chemin du fichier
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # Mode SSL pour la connexion à la base de données
```

## Configuration du Stockage du Proxy Gateway

Ceci est utilisé pour stocker les configurations du proxy gateway, spécifiquement les mappages de MCP vers API, comme montré dans l'image ci-dessous :

![Configuration du Proxy Gateway](/img/gateway_proxies.png)

Actuellement, 2 types sont pris en charge :
- disk : Les configurations sont stockées sous forme de fichiers sur le disque, chaque configuration dans un fichier séparé, similaire au concept de vhost de nginx, par exemple `svc-a.yaml`, `svc-b.yaml`
- db : Stockage dans la base de données, chaque configuration est un enregistrement. Actuellement, trois types de bases de données sont pris en charge :
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # Type de stockage : db, disk
  
  # Configuration de la base de données (utilisé lorsque type est 'db')
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # Type de base de données (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # Adresse de l'hôte de la base de données
    port: ${GATEWAY_DB_PORT:5432}                       # Port de la base de données
    user: "${GATEWAY_DB_USER:postgres}"                 # Nom d'utilisateur de la base de données
    password: "${GATEWAY_DB_PASSWORD:example}"          # Mot de passe de la base de données
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # Nom de la base de données ou chemin du fichier
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # Mode SSL pour la connexion à la base de données
  
  # Configuration du disque (utilisé lorsque type est 'disk')
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # Chemin de stockage des fichiers de données
```

## Configuration des Notifications

Le module de notification est principalement utilisé pour notifier `mcp-gateway` des mises à jour de configuration et déclencher des rechargements à chaud sans nécessiter le redémarrage du service.

Actuellement, 4 méthodes de notification sont prises en charge :
- signal : Notification via des signaux du système d'exploitation, similaire à `kill -SIGHUP <pid>` ou `nginx -s reload`. Peut être déclenché via la commande `mcp-gateway reload`, adapté aux déploiements sur machine unique
- api : Notification via un appel API. `mcp-gateway` écoute sur un port indépendant et effectue des rechargements à chaud lorsqu'il reçoit des requêtes. Peut être déclenché via `curl http://localhost:5235/_reload`, adapté aux déploiements sur machine unique et en cluster
- redis : Notification via la fonctionnalité de publication/abonnement de Redis, adaptée aux déploiements sur machine unique et en cluster
- composite : Notification combinée, utilisant plusieurs méthodes. Par défaut, `signal` et `api` sont toujours activés et peuvent être combinés avec d'autres méthodes. Adapté aux déploiements sur machine unique et en cluster, et c'est la méthode par défaut recommandée

Rôles de notification :
- sender : Rôle d'expéditeur, responsable de l'envoi des notifications. `apiserver` ne peut utiliser que ce mode
- receiver : Rôle de récepteur, responsable de la réception des notifications. `mcp-gateway` sur machine unique devrait utiliser uniquement ce mode
- both : À la fois rôle d'expéditeur et de récepteur. `mcp-gateway` déployé en cluster peut utiliser ce mode

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # Rôle : sender, receiver, ou both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # Type : signal, api, redis, ou composite

  # Configuration du signal (utilisé lorsque type est 'signal')
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # Signal à envoyer
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # Chemin du fichier PID

  # Configuration de l'API (utilisé lorsque type est 'api')
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # Port de l'API
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # Point de terminaison de rechargement

  # Configuration de Redis (utilisé lorsque type est 'redis')
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Adresse Redis
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Mot de passe Redis
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Numéro de base de données Redis
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Sujet de publication/abonnement Redis
```

## Configuration de l'API OpenAI

Le bloc de configuration OpenAI définit les paramètres pour l'intégration de l'API OpenAI :

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # Clé API OpenAI (requise)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # Modèle à utiliser
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # URL de base de l'API
```

Actuellement, seuls les appels LLMs compatibles avec l'API OpenAI sont intégrés

## Configuration du Super Administrateur

La configuration du super administrateur est utilisée pour configurer le compte administrateur initial du système. Chaque fois que `apiserver` démarre, il vérifie s'il existe et le crée automatiquement s'il n'existe pas

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # Nom d'utilisateur du super administrateur
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # Mot de passe du super administrateur (à changer en production)
```

**Il est fortement recommandé d'utiliser des mots de passe forts dans les environnements de production ou les réseaux publics !**

## Configuration JWT

La configuration JWT est utilisée pour configurer les paramètres d'authentification web :

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # Clé JWT (à changer en production)
  duration: "${APISERVER_JWT_DURATION:24h}"                  # Durée de validité du token
```

**Il est fortement recommandé d'utiliser des mots de passe forts dans les environnements de production ou les réseaux publics !** 