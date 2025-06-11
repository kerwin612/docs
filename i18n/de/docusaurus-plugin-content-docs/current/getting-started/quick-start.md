# Schnellstart

## Ein-Klick-Bereitstellung von MCP Gateway

Zuerst die erforderlichen Umgebungsvariablen einrichten:

```bash
export OPENAI_API_KEY="sk-eed837fb0b4a62ee69abc29a983492b7PlsChangeMe"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="fec6d38f73d4211318e7c85617f0e333PlsChangeMe"
export SUPER_ADMIN_USERNAME="admin"
export SUPER_ADMIN_PASSWORD="297df52fbc321ebf7198d497fe1c9206PlsChangeMe"
```

Ein-Klick-Bereitstellung:

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

Für Benutzer in China können Sie das Alibaba Cloud Registry verwenden und das Modell anpassen (Beispiel mit Qwen):

```bash
export OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1/"
export OPENAI_API_KEY="sk-eed837fb0b4a62ee69abc29a983492b7PlsChangeMe"
export OPENAI_MODEL="qwen-turbo"
export APISERVER_JWT_SECRET_KEY="fec6d38f73d4211318e7c85617f0e333PlsChangeMe"
export SUPER_ADMIN_USERNAME="admin"
export SUPER_ADMIN_PASSWORD="297df52fbc321ebf7198d497fe1c9206PlsChangeMe"
```

Ein-Klick-Bereitstellung:

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

## Zugriff und Konfiguration

1. Web-UI aufrufen:
   - Öffnen Sie http://localhost:8080/ in Ihrem Browser
   - Melden Sie sich mit den konfigurierten Administrator-Anmeldedaten an

2. Neuen MCP-Server hinzufügen:
   - Konfigurationsdatei kopieren: https://github.com/amoylab/unla/blob/main/configs/mock-server.yaml
   - In der Web-UI auf "Add MCP Server" klicken
   - Konfiguration einfügen und speichern

   ![MCP-Server hinzufügen Beispiel](/img/add_mcp_server.png)

## Verfügbare Endpunkte

Nach der Konfiguration sind die Dienste an folgenden Endpunkten verfügbar:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP SSE Message: http://localhost:5235/mcp/user/message
- MCP Streamable HTTP: http://localhost:5235/mcp/user/mcp

Konfigurieren Sie den MCP-Client mit einer URL, die auf `/sse` oder `/mcp` endet, um den Dienst zu nutzen.

## Testen

Sie können den Dienst auf zwei Arten testen:

1. Verwenden Sie die MCP Chat-Seite in der Web-UI
2. Verwenden Sie Ihren eigenen MCP-Client (**empfohlen**)

## Erweiterte Konfiguration (Optional)

Wenn Sie eine feinere Kontrolle über die Konfiguration benötigen, können Sie den Dienst durch Einbinden von Konfigurationsdateien starten:

1. Erstellen Sie die erforderlichen Verzeichnisse und laden Sie die Konfigurationsdateien herunter:

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

2. MCP Gateway mit Docker ausführen:

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