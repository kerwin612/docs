# Docker

## Image-Übersicht

MCP Gateway bietet zwei Bereitstellungsmethoden:
1. **All-in-One-Bereitstellung**: Alle Dienste werden in einem einzelnen Container gepackt, geeignet für lokale oder Einzelknoten-Bereitstellungen.
2. **Multi-Container-Bereitstellung**: Jeder Dienst wird separat bereitgestellt, geeignet für Produktions- oder Cluster-Umgebungen.

### Image-Registrys

Die Images werden in folgenden Registrys veröffentlicht:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*Die GitHub Container Registry unterstützt mehrstufige Verzeichnisse für eine klarere Organisation, während Docker Hub und Alibaba Cloud Registrys flache Benennung mit Bindestrichen verwenden.*

### Image-Tags

- `latest`: Neueste Version
- `vX.Y.Z`: Spezifische Version

> ⚡ **Hinweis**: MCP Gateway befindet sich in rascher Entwicklung! Es wird empfohlen, spezifische Versions-Tags für zuverlässigere Bereitstellungen zu verwenden.

### Verfügbare Images

```bash
# All-in-One-Version
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# API Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/mcp-gateway-mock-server:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/mock-server:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-mock-server:latest

# Web Frontend
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/mcp-ecosystem/mcp-gateway/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-web:latest
```

## Bereitstellung

### All-in-One-Bereitstellung

Die All-in-One-Bereitstellung packt alle Dienste in einen einzelnen Container, ideal für Einzelknoten- oder lokale Bereitstellungen. Sie umfasst folgende Dienste:
- **API Server**: Verwaltungs-Backend (Control Plane)
- **MCP Gateway**: Kerndienst für die Gateway-Verkehrsverarbeitung (Data Plane)
- **Mock User Service**: Simulierter Benutzerdienst für Tests (kann durch Ihren tatsächlichen API-Dienst ersetzt werden)
- **Web Frontend**: Web-basierte Verwaltungsoberfläche
- **Nginx**: Reverse-Proxy für interne Dienste

Die Prozesse werden mit Supervisor verwaltet, und alle Logs werden auf stdout ausgegeben.

#### Ports

- `8080`: Web UI
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (interne Endpunkte wie reload; NICHT in Produktionsumgebungen freigeben)
- `5236`: Mock User Service

#### Datenpersistenz

Es wird empfohlen, folgende Verzeichnisse einzubinden:
- `/app/configs`: Konfigurationsdateien
- `/app/data`: Datenspeicher
- `/app/.env`: Umgebungsvariablendatei

#### Beispielbefehle

1. Erstellen Sie die notwendigen Verzeichnisse und laden Sie die Konfigurationsdateien herunter:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Sie können das Standard-LLM bei Bedarf ersetzen (muss OpenAI-kompatibel sein), z.B. Qwen verwenden:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Führen Sie MCP Gateway mit Docker aus:

```bash
# Alibaba Cloud Registry verwenden (empfohlen für Server/Geräte in China)
docker run -d \
           --name mcp-gateway \
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
           registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-allinone:latest

# GitHub Container Registry verwenden
docker run -d \
           --name mcp-gateway \
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
           ghcr.io/mcp-ecosystem/mcp-gateway/allinone:latest
```

#### Hinweise

1. Stellen Sie sicher, dass die Konfigurationsdateien und die Umgebungsdatei korrekt eingerichtet sind.
2. Es wird empfohlen, einen spezifischen Versions-Tag anstelle von `latest` zu verwenden.
3. Setzen Sie angemessene Ressourcenlimits für Produktionsbereitstellungen.
4. Stellen Sie sicher, dass die eingebundenen Verzeichnisse die richtigen Berechtigungen haben. 