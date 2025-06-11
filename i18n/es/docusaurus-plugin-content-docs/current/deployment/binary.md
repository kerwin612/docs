# Despliegue binario

Actualmente se admiten linux/amd64, linux/arm64

Puede visitar https://github.com/amoylab/unla/releases para descargar los binarios

## Ejecución
1. Crear los directorios necesarios y descargar los archivos de configuración y binarios:

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env
```

### mcp-gateway

En MacOS, es posible que no tenga permisos para /var/run/mcp-gateway.pid, puede reemplazarlo directamente con `./data/mcp-gateway.pid`

> ```bash
> sed -i 's|/var/run/mcp-gateway.pid|./data/mcp-gateway.pid|g' .env
> ```

linux/amd64
```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/amoylab/unla/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
curl -sL "https://github.com/amoylab/unla/releases/download/${LATEST_VERSION}/mcp-gateway-linux-amd64" -o mcp-gateway
chmod +x mcp-gateway
```

linux/arm64
```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/amoylab/unla/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
curl -sL "https://github.com/amoylab/unla/releases/download/${LATEST_VERSION}/mcp-gateway-linux-arm64" -o mcp-gateway
chmod +x mcp-gateway
```

https://github.com/amoylab/unla/releases/download/v0.2.6/mcp-gateway-linux-arm64

3. Ejecutar MCP Gateway usando el binario:

```bash
./mcp-gateway
``` 