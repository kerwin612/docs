# Docker

## Vue d'ensemble des images

MCP Gateway propose deux méthodes de déploiement :
1. **Déploiement All-in-One** : Tous les services sont empaquetés dans un seul conteneur, adapté aux déploiements locaux ou à nœud unique.
2. **Déploiement multi-conteneurs** : Chaque service est déployé séparément, adapté aux environnements de production ou en cluster.

### Registres d'images

Les images sont publiées dans les registres suivants :
- Docker Hub : `docker.io/ifuryst/unla-*`
- GitHub Container Registry : `ghcr.io/amoylab/unla/*`
- Alibaba Cloud Container Registry : `registry.ap-southeast-1.aliyuncs.com/amoylab/unla-*`

*GitHub Container Registry prend en charge les répertoires multi-niveaux pour une organisation plus claire, tandis que Docker Hub et Alibaba Cloud utilisent une nomenclature plate avec des tirets.*

### Tags d'images

- `latest` : Dernière version
- `vX.Y.Z` : Version spécifique

> ⚡ **Note** : MCP Gateway est en développement rapide ! Il est recommandé d'utiliser des tags de version spécifiques pour des déploiements plus fiables.

### Images disponibles

```bash
# Version All-in-One
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

## Déploiement

### Déploiement All-in-One

Le déploiement All-in-One empaquette tous les services dans un seul conteneur, idéal pour les déploiements à nœud unique ou locaux. Il comprend les services suivants :
- **API Server** : Backend de gestion (Plan de contrôle)
- **MCP Gateway** : Service principal gérant le trafic de la passerelle (Plan de données)
- **Mock User Service** : Service utilisateur simulé pour les tests (peut être remplacé par votre service API existant)
- **Web Frontend** : Interface de gestion basée sur le web
- **Nginx** : Proxy inverse pour les services internes

Les processus sont gérés par Supervisor, et tous les logs sont envoyés vers stdout.

#### Ports

- `8080` : Interface Web
- `5234` : API Server
- `5235` : MCP Gateway
- `5335` : MCP Gateway Admin (points de terminaison internes comme reload ; NE PAS exposer en production)
- `5236` : Mock User Service

#### Persistance des données

Il est recommandé de monter les répertoires suivants :
- `/app/configs` : Fichiers de configuration
- `/app/data` : Stockage des données
- `/app/.env` : Fichier de variables d'environnement

#### Exemples de commandes

1. Créez les répertoires nécessaires et téléchargez les fichiers de configuration :

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

> Vous pouvez remplacer le LLM par défaut si nécessaire (doit être compatible OpenAI), par exemple utiliser Qwen :
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Exécutez MCP Gateway avec Docker :

```bash
# Utiliser le registre Alibaba Cloud (recommandé pour les serveurs/appareils en Chine)
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

# Utiliser GitHub Container Registry
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

1. Assurez-vous que les fichiers de configuration et le fichier d'environnement sont correctement configurés.
2. Il est recommandé d'utiliser un tag de version spécifique au lieu de `latest`.
3. Définissez des limites de ressources appropriées pour les déploiements en production.
4. Assurez-vous que les répertoires montés ont les permissions appropriées. 