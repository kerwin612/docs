# बाइनरी डिप्लॉयमेंट

वर्तमान में linux/amd64, linux/arm64 का समर्थन है

बाइनरी डाउनलोड करने के लिए https://github.com/amoylab/unla/releases देखें

## चलाना
1. आवश्यक निर्देशिकाएँ बनाएँ और कॉन्फ़िगरेशन फ़ाइलें और बाइनरी डाउनलोड करें:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env
```

### mcp-gateway

MacOS में /var/run/mcp-gateway.pid के लिए अनुमति नहीं हो सकती है, इसे सीधे `./data/mcp-gateway.pid` से बदला जा सकता है

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

3. बाइनरी का उपयोग करके MCP Gateway चलाएँ:

```bash
./mcp-gateway
``` 