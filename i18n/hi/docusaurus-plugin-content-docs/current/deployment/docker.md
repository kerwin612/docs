# Docker

## इमेज अवलोकन

MCP Gateway दो तैनाती विधियां प्रदान करता है:
1. **All-in-One तैनाती**: सभी सेवाएं एक ही कंटेनर में पैकेज की जाती हैं, स्थानीय या एकल-नोड तैनाती के लिए उपयुक्त।
2. **मल्टी-कंटेनर तैनाती**: प्रत्येक सेवा अलग से तैनात की जाती है, उत्पादन या क्लस्टर वातावरण के लिए उपयुक्त।

### इमेज रजिस्ट्री

इमेज निम्नलिखित रजिस्ट्री में प्रकाशित की जाती हैं:
- Docker Hub: `docker.io/ifuryst/mcp-gateway-*`
- GitHub Container Registry: `ghcr.io/amoylab/unla/*`
- Alibaba Cloud Container Registry: `registry.ap-southeast-1.aliyuncs.com/amoylab/unla-*`

*GitHub Container Registry अधिक स्पष्ट संगठन के लिए बहु-स्तरीय निर्देशिकाओं का समर्थन करता है, जबकि Docker Hub और Alibaba Cloud हाइफन के साथ फ्लैट नामकरण का उपयोग करते हैं।*

### इमेज टैग

- `latest`: नवीनतम संस्करण
- `vX.Y.Z`: विशिष्ट संस्करण

> ⚡ **नोट**: MCP Gateway तेजी से विकास में है! अधिक विश्वसनीय तैनाती के लिए विशिष्ट संस्करण टैग का उपयोग करने की अनुशंसा की जाती है।

### उपलब्ध इमेज

```bash
# All-in-One संस्करण
docker pull docker.io/ifuryst/mcp-gateway-allinone:latest
docker pull ghcr.io/amoylab/unla/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# API Server
docker pull docker.io/ifuryst/mcp-gateway-apiserver:latest
docker pull ghcr.io/amoylab/unla/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/mcp-gateway-mcp-gateway:latest
docker pull ghcr.io/amoylab/unla/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/mcp-gateway-mock-server:latest
docker pull ghcr.io/amoylab/unla/mock-server:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mock-server:latest

# Web Frontend
docker pull docker.io/ifuryst/mcp-gateway-web:latest
docker pull ghcr.io/amoylab/unla/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-web:latest
```

## तैनाती

### All-in-One तैनाती

All-in-One तैनाती सभी सेवाओं को एक ही कंटेनर में पैकेज करती है, एकल-नोड या स्थानीय तैनाती के लिए आदर्श। इसमें निम्नलिखित सेवाएं शामिल हैं:
- **API Server**: प्रबंधन बैकएंड (कंट्रोल प्लेन)
- **MCP Gateway**: गेटवे ट्रैफिक को संभालने वाली मुख्य सेवा (डेटा प्लेन)
- **Mock User Service**: परीक्षण के लिए सिमुलेटेड उपयोगकर्ता सेवा (आपकी मौजूदा API सेवा से प्रतिस्थापित किया जा सकता है)
- **Web Frontend**: वेब-आधारित प्रबंधन इंटरफेस
- **Nginx**: आंतरिक सेवाओं के लिए रिवर्स प्रॉक्सी

प्रक्रियाओं को Supervisor द्वारा प्रबंधित किया जाता है, और सभी लॉग stdout पर आउटपुट होते हैं।

#### पोर्ट

- `8080`: वेब UI
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin (reload जैसे आंतरिक एंडपॉइंट, उत्पादन में एक्सपोज न करें)
- `5236`: Mock User Service

#### डेटा पर्सिस्टेंस

निम्नलिखित निर्देशिकाओं को माउंट करने की अनुशंसा की जाती है:
- `/app/configs`: कॉन्फ़िगरेशन फ़ाइलें
- `/app/data`: डेटा स्टोरेज
- `/app/.env`: पर्यावरण वेरिएबल फ़ाइल

#### कमांड उदाहरण

1. आवश्यक निर्देशिकाएं बनाएं और कॉन्फ़िगरेशन फ़ाइलें डाउनलोड करें:

```bash
mkdir -p mcp-gateway/{configs,data}
cd mcp-gateway/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

> आवश्यकतानुसार डिफ़ॉल्ट LLM को बदला जा सकता है (OpenAI संगत होना चाहिए), उदाहरण के लिए Qwen का उपयोग:
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. Docker के साथ MCP Gateway चलाएं:

```bash
# Alibaba Cloud रजिस्ट्री का उपयोग करें (चीन में सर्वर/डिवाइस के लिए अनुशंसित)
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
           registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# GitHub Container Registry का उपयोग करें
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
           ghcr.io/amoylab/unla/allinone:latest
```

#### नोट्स

1. सुनिश्चित करें कि कॉन्फ़िगरेशन फ़ाइलें और पर्यावरण फ़ाइल सही ढंग से सेट हैं।
2. `latest` के बजाय विशिष्ट संस्करण टैग का उपयोग करने की अनुशंसा की जाती है।
3. उत्पादन तैनाती के लिए उचित संसाधन सीमाएं सेट करें।
4. सुनिश्चित करें कि माउंट की गई निर्देशिकाओं में उचित अनुमति हैं। 