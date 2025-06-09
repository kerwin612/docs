# Docker

## Descripción general de imágenes

MCP Gateway ofrece dos métodos de implementación:
1. **Implementación All-in-One**: Todos los servicios se empaquetan en un solo contenedor, adecuado para implementaciones locales o de nodo único.
2. **Implementación multi-contenedor**: Cada servicio se implementa por separado, adecuado para entornos de producción o clúster.

### Registros de imágenes

Las imágenes se publican en los siguientes registros:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/mcp-ecosystem/mcp-gateway/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/mcp-ecosystem/mcp-gateway-*`

*GitHub Container Registry admite directorios multinivel para una organización más clara, mientras que Docker Hub y Alibaba Cloud utilizan una nomenclatura plana con guiones.*

### Etiquetas de imágenes

- `latest`: Última versión
- `vX.Y.Z`: Versión específica

> ⚡ **Nota**: ¡MCP Gateway está en desarrollo rápido! Se recomienda usar etiquetas de versión específicas para implementaciones más confiables.

### Imágenes disponibles

```bash
# Versión All-in-One
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

## Implementación

### Implementación All-in-One

La implementación All-in-One empaqueta todos los servicios en un solo contenedor, ideal para implementaciones de nodo único o locales. Incluye los siguientes servicios:
- **API Server**: Backend de gestión (Plano de control)
- **MCP Gateway**: Servicio principal que maneja el tráfico de la puerta de enlace (Plano de datos)
- **Mock User Service**: Servicio de usuario simulado para pruebas (puede ser reemplazado por su servicio API existente)
- **Web Frontend**: Interfaz de gestión basada en web
- **Nginx**: Proxy inverso para servicios internos

Los procesos se gestionan con Supervisor, y todos los registros se envían a stdout.

#### Puertos

- `8080`: Interfaz web
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (puntos finales internos como reload; NO exponer en producción)
- `5236`: Mock User Service

#### Persistencia de datos

Se recomienda montar los siguientes directorios:
- `/app/configs`: Archivos de configuración
- `/app/data`: Almacenamiento de datos
- `/app/.env`: Archivo de variables de entorno

#### Ejemplos de comandos

1. Cree los directorios necesarios y descargue los archivos de configuración:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/mcp-ecosystem/mcp-gateway/refs/heads/main/.env.example -o .env.allinone
```

> Puede reemplazar el LLM predeterminado si es necesario (debe ser compatible con OpenAI), por ejemplo, usar Qwen:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Ejecute MCP Gateway con Docker:

```bash
# Usar el registro de Alibaba Cloud (recomendado para servidores/dispositivos en China)
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

# Usar GitHub Container Registry
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

#### Notas

1. Asegúrese de que los archivos de configuración y el archivo de entorno estén configurados correctamente.
2. Se recomienda usar una etiqueta de versión específica en lugar de `latest`.
3. Establezca límites de recursos apropiados para implementaciones en producción.
4. Asegúrese de que los directorios montados tengan los permisos adecuados. 