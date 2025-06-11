# 二进制部署

目前支持的linux/amd64, linux/arm64

可以到 https://github.com/amoylab/unla/releases 查看下载二进制

## 运行
1. 创建必要的目录并下载配置文件和二进制：

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env
```

### mcp-gateway

MacOS下/var/run/mcp-gateway.pid可能没权限，可以直接替换成`./data/mcp-gateway.pid`

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

3. 使用二进制运行 MCP Gateway：

```bash
./mcp-gateway
```


