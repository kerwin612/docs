# Démarrage rapide

## Déploiement en un clic de MCP Gateway

D'abord, configurez les variables d'environnement nécessaires :

```bash
export OPENAI_API_KEY="sk-eed837fb0b4a62ee69abc29a983492b7PlsChangeMe"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="fec6d38f73d4211318e7c85617f0e333PlsChangeMe"
export SUPER_ADMIN_USERNAME="admin"
export SUPER_ADMIN_PASSWORD="297df52fbc321ebf7198d497fe1c9206PlsChangeMe"
```

Déploiement en un clic :

```bash
docker run -d \
  --name unla \
  -p 8080:80 \
  -p 5234:5234 \
  -p 5235:5235 \
  -p 5335:5335 \
  -p 5236:5236 \
  -e ENV=production \
  -e TZ=Asia/Shanghai \
  -e OPENAI_API_KEY=${OPENAI_API_KEY} \
  -e OPENAI_MODEL=${OPENAI_MODEL} \
  -e APISERVER_JWT_SECRET_KEY=${APISERVER_JWT_SECRET_KEY} \
  -e SUPER_ADMIN_USERNAME=${SUPER_ADMIN_USERNAME} \
  -e SUPER_ADMIN_PASSWORD=${SUPER_ADMIN_PASSWORD} \
  --restart unless-stopped \
  ghcr.io/amoylab/unla/allinone:latest
```

Pour les utilisateurs en Chine continentale, vous pouvez utiliser le registre Alibaba Cloud et personnaliser le modèle (exemple avec Qwen) :

```bash
export OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1/"
export OPENAI_API_KEY="sk-eed837fb0b4a62ee69abc29a983492b7PlsChangeMe"
export OPENAI_MODEL="qwen-turbo"
export APISERVER_JWT_SECRET_KEY="fec6d38f73d4211318e7c85617f0e333PlsChangeMe"
export SUPER_ADMIN_USERNAME="admin"
export SUPER_ADMIN_PASSWORD="297df52fbc321ebf7198d497fe1c9206PlsChangeMe"
```

Déploiement en un clic :

```bash
docker run -d \
  --name unla \
  -p 8080:80 \
  -p 5234:5234 \
  -p 5235:5235 \
  -p 5335:5335 \
  -p 5236:5236 \
  -e ENV=production \
  -e TZ=Asia/Shanghai \
  -e OPENAI_BASE_URL=${OPENAI_BASE_URL} \
  -e OPENAI_API_KEY=${OPENAI_API_KEY} \
  -e OPENAI_MODEL=${OPENAI_MODEL} \
  -e APISERVER_JWT_SECRET_KEY=${APISERVER_JWT_SECRET_KEY} \
  -e SUPER_ADMIN_USERNAME=${SUPER_ADMIN_USERNAME} \
  -e SUPER_ADMIN_PASSWORD=${SUPER_ADMIN_PASSWORD} \
  --restart unless-stopped \
  registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest
```

## Accès et Configuration

1. Accéder à l'interface Web :
   - Ouvrez http://localhost:8080/ dans votre navigateur
   - Connectez-vous avec les identifiants administrateur configurés

2. Ajouter un nouveau serveur MCP :
   - Copiez le fichier de configuration : https://github.com/amoylab/unla/blob/main/configs/mock-server.yaml
   - Cliquez sur "Add MCP Server" dans l'interface Web
   - Collez la configuration et enregistrez

   ![Exemple d'ajout de serveur MCP](/img/add_mcp_server.png)

## Points de terminaison disponibles

Une fois configuré, les services seront disponibles aux points de terminaison suivants :

- MCP SSE : http://localhost:5235/mcp/user/sse
- MCP SSE Message : http://localhost:5235/mcp/user/message
- MCP Streamable HTTP : http://localhost:5235/mcp/user/mcp

Configurez le client MCP avec une URL se terminant par `/sse` ou `/mcp` pour commencer à utiliser le service.

## Test

Vous pouvez tester le service de deux manières :

1. Utiliser la page MCP Chat dans l'interface Web
2. Utiliser votre propre client MCP (**recommandé**)

## Configuration avancée (Optionnel)

Si vous avez besoin d'un contrôle plus précis de la configuration, vous pouvez démarrer le service en montant les fichiers de configuration :

1. Créez les répertoires nécessaires et téléchargez les fichiers de configuration :

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

2. Exécutez MCP Gateway avec Docker :

```bash
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