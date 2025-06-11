# त्वरित प्रारंभ

## MCP Gateway का एक-क्लिक डिप्लॉयमेंट

सबसे पहले, आवश्यक पर्यावरण वेरिएबल्स सेट करें:

```bash
export OPENAI_API_KEY="sk-eed837fb0b4a62ee69abc29a983492b7PlsChangeMe"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="fec6d38f73d4211318e7c85617f0e333PlsChangeMe"
export SUPER_ADMIN_USERNAME="admin"
export SUPER_ADMIN_PASSWORD="297df52fbc321ebf7198d497fe1c9206PlsChangeMe"
```

एक-क्लिक डिप्लॉयमेंट:

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

मुख्यभूमि चीन के उपयोगकर्ताओं के लिए, आप अलीबाबा क्लाउड रजिस्ट्री का उपयोग कर सकते हैं और मॉडल को कस्टमाइज़ कर सकते हैं (उदाहरण के लिए Qwen):

```bash
export OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1/"
export OPENAI_API_KEY="sk-eed837fb0b4a62ee69abc29a983492b7PlsChangeMe"
export OPENAI_MODEL="qwen-turbo"
export APISERVER_JWT_SECRET_KEY="fec6d38f73d4211318e7c85617f0e333PlsChangeMe"
export SUPER_ADMIN_USERNAME="admin"
export SUPER_ADMIN_PASSWORD="297df52fbc321ebf7198d497fe1c9206PlsChangeMe"
```

एक-क्लिक डिप्लॉयमेंट:

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

## पहुंच और कॉन्फ़िगरेशन

1. वेब UI तक पहुंच:
   - अपने ब्राउज़र में http://localhost:8080/ खोलें
   - कॉन्फ़िगर किए गए एडमिन क्रेडेंशियल्स से लॉगिन करें

2. नया MCP सर्वर जोड़ें:
   - कॉन्फ़िगरेशन फ़ाइल कॉपी करें: https://github.com/amoylab/unla/blob/main/configs/mock-server.yaml
   - वेब UI में "Add MCP Server" पर क्लिक करें
   - कॉन्फ़िगरेशन पेस्ट करें और सेव करें

   ![MCP सर्वर जोड़ने का उदाहरण](/img/add_mcp_server.png)

## उपलब्ध एंडपॉइंट्स

कॉन्फ़िगरेशन के बाद, सेवाएं निम्नलिखित एंडपॉइंट्स पर उपलब्ध होंगी:

- MCP SSE: http://localhost:5235/mcp/user/sse
- MCP SSE Message: http://localhost:5235/mcp/user/message
- MCP Streamable HTTP: http://localhost:5235/mcp/user/mcp

MCP क्लाइंट में `/sse` या `/mcp` से समाप्त होने वाले URL को कॉन्फ़िगर करें और सेवा का उपयोग शुरू करें।

## परीक्षण

आप सेवा को दो तरीकों से परीक्षण कर सकते हैं:

1. वेब UI में MCP Chat पेज का उपयोग करें
2. अपने स्वयं के MCP क्लाइंट का उपयोग करें (**अनुशंसित**)

## उन्नत कॉन्फ़िगरेशन (वैकल्पिक)

यदि आपको कॉन्फ़िगरेशन पर अधिक नियंत्रण की आवश्यकता है, तो आप कॉन्फ़िगरेशन फ़ाइलें को माउंट करके सेवा शुरू कर सकते हैं:

1. आवश्यक डायरेक्टरीज़ बनाएं और कॉन्फ़िगरेशन फ़ाइलें डाउनलोड करें:

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

2. Docker के साथ MCP Gateway चलाएं:

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