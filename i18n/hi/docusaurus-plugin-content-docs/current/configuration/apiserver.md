# apiserver.yaml

## बेसिक कॉन्फ़िगरेशन

```yaml
server:
  port: 8080
  host: "0.0.0.0"
  timeout: 30s
  readTimeout: 10s
  writeTimeout: 10s
  idleTimeout: 120s
  maxHeaderBytes: 1048576
  tls:
    enabled: false
    certFile: ""
    keyFile: ""
```

## लॉगिंग कॉन्फ़िगरेशन

```yaml
log:
  level: "info"
  format: "json"
  output: "stdout"
  file:
    enabled: false
    path: ""
    maxSize: 100
    maxBackups: 3
    maxAge: 7
    compress: true
```

## मेट्रिक्स कॉन्फ़िगरेशन

```yaml
metrics:
  enabled: true
  path: "/metrics"
  port: 9090
  host: "0.0.0.0"
```

## स्वास्थ्य जांच कॉन्फ़िगरेशन

```yaml
health:
  enabled: true
  path: "/health"
  port: 8081
  host: "0.0.0.0"
```

## CORS कॉन्फ़िगरेशन

```yaml
cors:
  enabled: true
  allowOrigins:
    - "*"
  allowMethods:
    - "GET"
    - "POST"
    - "PUT"
    - "DELETE"
    - "OPTIONS"
  allowHeaders:
    - "Content-Type"
    - "Authorization"
  exposeHeaders:
    - "Content-Length"
  allowCredentials: true
  maxAge: 86400
```

## रेट लिमिटिंग कॉन्फ़िगरेशन

```yaml
rateLimit:
  enabled: true
  rate: 100
  burst: 200
  period: "1m"
```

## कैश कॉन्फ़िगरेशन

```yaml
cache:
  enabled: true
  type: "memory"
  ttl: "5m"
  maxSize: 1000
  redis:
    enabled: false
    addr: "localhost:6379"
    password: ""
    db: 0
    poolSize: 10
    minIdleConns: 5
```

## JWT कॉन्फ़िगरेशन

```yaml
jwt:
  enabled: true
  secret: "your-secret-key"
  issuer: "mcp"
  audience: "mcp-client"
  expiresIn: "24h"
  refreshExpiresIn: "168h"
```

## डेटाबेस कॉन्फ़िगरेशन

```yaml
database:
  type: "sqlite"
  dsn: "file:mcp.db?cache=shared&_fk=1"
  maxOpenConns: 10
  maxIdleConns: 5
  connMaxLifetime: "1h"
  connMaxIdleTime: "30m"
```

## रेडिस कॉन्फ़िगरेशन

```yaml
redis:
  enabled: false
  addr: "localhost:6379"
  password: ""
  db: 0
  poolSize: 10
  minIdleConns: 5
  maxRetries: 3
  dialTimeout: "5s"
  readTimeout: "3s"
  writeTimeout: "3s"
```

## क्लस्टर कॉन्फ़िगरेशन

```yaml
cluster:
  enabled: false
  name: "mcp"
  addr: "localhost:7946"
  bindAddr: "0.0.0.0:7946"
  advertiseAddr: ""
  join: []
  leaveTimeout: "5s"
  updateInterval: "1s"
  pushPullInterval: "30s"
  gossipInterval: "200ms"
  probeInterval: "1s"
  probeTimeout: "500ms"
  suspicionMult: 4
  retransmitMult: 4
  reconnectInterval: "1s"
  reconnectTimeout: "5s"
  tombstoneTimeout: "24h"
```

## सर्विस डिस्कवरी कॉन्फ़िगरेशन

```yaml
discovery:
  enabled: false
  type: "consul"
  consul:
    addr: "localhost:8500"
    scheme: "http"
    datacenter: "dc1"
    token: ""
    serviceName: "mcp"
    serviceId: "mcp-1"
    serviceAddress: ""
    servicePort: 8080
    serviceTags: []
    serviceMeta: {}
    checkInterval: "10s"
    checkTimeout: "5s"
    checkDeregisterCriticalServiceAfter: "30s"
```

## ट्रेसिंग कॉन्फ़िगरेशन

```yaml
tracing:
  enabled: false
  type: "jaeger"
  jaeger:
    serviceName: "mcp"
    sampler:
      type: "const"
      param: 1
    reporter:
      localAgentHostPort: "localhost:6831"
      logSpans: true
    headers:
      jaegerDebugHeader: "jaeger-debug-id"
      jaegerBaggageHeader: "jaeger-baggage"
      traceBaggageHeaderPrefix: "uberctx-"
    baggageRestrictions:
      denyBaggageOnInitializationFailure: false
      hostPort: ""
```

## प्रोमेथियस कॉन्फ़िगरेशन

```yaml
prometheus:
  enabled: true
  path: "/metrics"
  port: 9090
  host: "0.0.0.0"
  namespace: "mcp"
  subsystem: "api"
  labels:
    app: "mcp"
    env: "prod"
```

## स्टैकड्राइवर कॉन्फ़िगरेशन

```yaml
stackdriver:
  enabled: false
  projectId: ""
  credentialsFile: ""
  logLevel: "info"
  metricPrefix: "custom.googleapis.com/mcp"
  labels:
    app: "mcp"
    env: "prod"
```

## सेंट्री कॉन्फ़िगरेशन

```yaml
sentry:
  enabled: false
  dsn: ""
  environment: "production"
  release: ""
  debug: false
  sampleRate: 1.0
  tracesSampleRate: 1.0
  attachStacktrace: true
  maxBreadcrumbs: 100
  beforeSend: ""
  beforeBreadcrumb: ""
  integrations: []
  ignoreErrors: []
  includeLocalVariables: true
  inAppInclude: []
  inAppExclude: []
  contextLines: 5
  maxSpans: 1000
  transport: "http"
  httpProxy: ""
  httpsProxy: ""
  caCerts: ""
  serverName: ""
  dist: ""
  enableTracing: true
  tracesSampler: ""
  profilesSampleRate: 1.0
  autoSessionTracking: true
  sessionTrackingIntervalMillis: 30000
  attachServerName: true
  sendDefaultPii: false
  serverName: ""
  dist: ""
  environment: "production"
  release: ""
  debug: false
  sampleRate: 1.0
  tracesSampleRate: 1.0
  attachStacktrace: true
  maxBreadcrumbs: 100
  beforeSend: ""
  beforeBreadcrumb: ""
  integrations: []
  ignoreErrors: []
  includeLocalVariables: true
  inAppInclude: []
  inAppExclude: []
  contextLines: 5
  maxSpans: 1000
  transport: "http"
  httpProxy: ""
  httpsProxy: ""
  caCerts: ""
  serverName: ""
  dist: ""
  enableTracing: true
  tracesSampler: ""
  profilesSampleRate: 1.0
  autoSessionTracking: true
  sessionTrackingIntervalMillis: 30000
  attachServerName: true
  sendDefaultPii: false
```

# apiserver.yaml

कॉन्फ़िगरेशन फ़ाइल `${VAR:default}` सिंटैक्स का उपयोग करके पर्यावरण वेरिएबल इंजेक्शन का समर्थन करती है। यदि पर्यावरण वेरिएबल सेट नहीं है, तो डिफ़ॉल्ट मान का उपयोग किया जाएगा।

सामान्य अभ्यास विभिन्न `.env`, `.env.development`, `.env.prod` फ़ाइलों के माध्यम से मान इंजेक्ट करना है, या आप सीधे कॉन्फ़िगरेशन को निश्चित मानों के साथ संशोधित कर सकते हैं।

## चैट संदेश डेटाबेस कॉन्फ़िगरेशन

यह कॉन्फ़िगरेशन बैकएंड में चैट संदेशों के भंडारण के लिए विशेष रूप से है (हालांकि यह प्रॉक्सी कॉन्फ़िगरेशन के साथ एक ही डेटाबेस साझा कर सकता है)। यह नीचे दिए गए चित्र में दिखाई गई जानकारी से मेल खाता है:

![चैट सत्र और संदेश](/img/chat_histories.png)

वर्तमान में 3 प्रकार के डेटाबेस समर्थित हैं:
- SQLite3
- PostgreSQL
- MySQL

यदि आपको अतिरिक्त डेटाबेस के लिए समर्थन जोड़ने की आवश्यकता है, तो आप इसे [Issue](https://github.com/amoylab/unla/issues) खंड में अनुरोध कर सकते हैं, या आप संबंधित कार्यान्वयन को स्वयं बना सकते हैं और एक PR जमा कर सकते हैं :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # डेटाबेस प्रकार (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # डेटाबेस होस्ट पता
  port: ${APISERVER_DB_PORT:5432}                   # डेटाबेस पोर्ट
  user: "${APISERVER_DB_USER:postgres}"             # डेटाबेस उपयोगकर्ता नाम
  password: "${APISERVER_DB_PASSWORD:example}"      # डेटाबेस पासवर्ड
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # डेटाबेस नाम या फ़ाइल पथ
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # डेटाबेस कनेक्शन के लिए SSL मोड
```

## गेटवे प्रॉक्सी स्टोरेज कॉन्फ़िगरेशन

यह गेटवे प्रॉक्सी कॉन्फ़िगरेशन को संग्रहीत करने के लिए उपयोग किया जाता है, विशेष रूप से MCP से API के मैपिंग, जैसा कि नीचे दिए गए चित्र में दिखाया गया है:

![गेटवे प्रॉक्सी कॉन्फ़िगरेशन](/img/gateway_proxies.png)

वर्तमान में 2 प्रकार समर्थित हैं:
- disk: कॉन्फ़िगरेशन डिस्क पर फ़ाइलों के रूप में संग्रहीत किए जाते हैं, प्रत्येक कॉन्फ़िगरेशन एक अलग फ़ाइल में, nginx के vhost अवधारणा के समान, उदाहरण के लिए `svc-a.yaml`, `svc-b.yaml`
- db: डेटाबेस में संग्रहीत करें, प्रत्येक कॉन्फ़िगरेशन एक रिकॉर्ड है। वर्तमान में तीन प्रकार के डेटाबेस समर्थित हैं:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # स्टोरेज प्रकार: db, disk
  
  # डेटाबेस कॉन्फ़िगरेशन (जब type 'db' है तब उपयोग किया जाता है)
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # डेटाबेस प्रकार (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # डेटाबेस होस्ट पता
    port: ${GATEWAY_DB_PORT:5432}                       # डेटाबेस पोर्ट
    user: "${GATEWAY_DB_USER:postgres}"                 # डेटाबेस उपयोगकर्ता नाम
    password: "${GATEWAY_DB_PASSWORD:example}"          # डेटाबेस पासवर्ड
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # डेटाबेस नाम या फ़ाइल पथ
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # डेटाबेस कनेक्शन के लिए SSL मोड
  
  # डिस्क कॉन्फ़िगरेशन (जब type 'disk' है तब उपयोग किया जाता है)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # डेटा फ़ाइल संग्रहण पथ
```

## सूचना कॉन्फ़िगरेशन

सूचना मॉड्यूल मुख्य रूप से `mcp-gateway` को कॉन्फ़िगरेशन अपडेट के बारे में सूचित करने और सेवा को पुनः आरंभ किए बिना हॉट रीलोड को ट्रिगर करने के लिए उपयोग किया जाता है।

वर्तमान में 4 सूचना विधियां समर्थित हैं:
- signal: ऑपरेटिंग सिस्टम सिग्नल के माध्यम से सूचित करें, `kill -SIGHUP <pid>` या `nginx -s reload` के समान। `mcp-gateway reload` कमांड के माध्यम से ट्रिगर किया जा सकता है, एकल मशीन तैनाती के लिए उपयुक्त
- api: API कॉल के माध्यम से सूचित करें। `mcp-gateway` एक स्वतंत्र पोर्ट पर सुनता है और अनुरोध प्राप्त होने पर हॉट रीलोड करता है। `curl http://localhost:5235/_reload` के माध्यम से सीधे ट्रिगर किया जा सकता है, एकल मशीन और क्लस्टर तैनाती दोनों के लिए उपयुक्त
- redis: Redis के प्रकाशन/सदस्यता कार्यक्षमता के माध्यम से सूचित करें, एकल मशीन और क्लस्टर तैनाती दोनों के लिए उपयुक्त
- composite: संयुक्त सूचना, कई विधियों का उपयोग करके। डिफ़ॉल्ट रूप से, `signal` और `api` हमेशा सक्षम होते हैं और अन्य विधियों के साथ संयोजित किए जा सकते हैं। एकल मशीन और क्लस्टर तैनाती दोनों के लिए उपयुक्त, और यह अनुशंसित डिफ़ॉल्ट विधि है

सूचना भूमिकाएं:
- sender: प्रेषक भूमिका, सूचनाएं भेजने के लिए जिम्मेदार। `apiserver` केवल इस मोड का उपयोग कर सकता है
- receiver: प्राप्तकर्ता भूमिका, सूचनाएं प्राप्त करने के लिए जिम्मेदार। एकल मशीन `mcp-gateway` को केवल इस मोड का उपयोग करना चाहिए
- both: प्रेषक और प्राप्तकर्ता दोनों की भूमिका। क्लस्टर-तैनात `mcp-gateway` इस मोड का उपयोग कर सकता है

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # भूमिका: sender, receiver, या both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # प्रकार: signal, api, redis, या composite

  # सिग्नल कॉन्फ़िगरेशन (जब type 'signal' है तब उपयोग किया जाता है)
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # भेजने के लिए सिग्नल
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PID फ़ाइल पथ

  # API कॉन्फ़िगरेशन (जब type 'api' है तब उपयोग किया जाता है)
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # API पोर्ट
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # रीलोड एंडपॉइंट

  # Redis कॉन्फ़िगरेशन (जब type 'redis' है तब उपयोग किया जाता है)
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redis पता
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redis पासवर्ड
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redis डेटाबेस संख्या
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redis प्रकाशन/सदस्यता विषय
```

## OpenAI API कॉन्फ़िगरेशन

OpenAI कॉन्फ़िगरेशन ब्लॉक OpenAI API एकीकरण के लिए सेटिंग्स को परिभाषित करता है:

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI API कुंजी (आवश्यक)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # उपयोग करने के लिए मॉडल
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # API आधार URL
```

वर्तमान में केवल OpenAI API-संगत LLMs कॉल एकीकृत हैं

## सुपर एडमिनिस्ट्रेटर कॉन्फ़िगरेशन

सुपर एडमिनिस्ट्रेटर कॉन्फ़िगरेशन का उपयोग सिस्टम के प्रारंभिक एडमिनिस्ट्रेटर खाते को कॉन्फ़िगर करने के लिए किया जाता है। हर बार जब `apiserver` शुरू होता है, तो यह जांचता है कि क्या यह मौजूद है और यदि नहीं है तो इसे स्वचालित रूप से बनाता है

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # सुपर एडमिनिस्ट्रेटर उपयोगकर्ता नाम
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # सुपर एडमिनिस्ट्रेटर पासवर्ड (प्रोडक्शन में बदलें)
```

**प्रोडक्शन वातावरण या सार्वजनिक नेटवर्क में मजबूत पासवर्ड का उपयोग करने की दृढ़ता से अनुशंसा की जाती है!**

## JWT कॉन्फ़िगरेशन

JWT कॉन्फ़िगरेशन का उपयोग वेब प्रमाणीकरण पैरामीटर को कॉन्फ़िगर करने के लिए किया जाता है:

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # JWT कुंजी (प्रोडक्शन में बदलें)
  duration: "${APISERVER_JWT_DURATION:24h}"                  # टोकन वैधता अवधि
```

**प्रोडक्शन वातावरण या सार्वजनिक नेटवर्क में मजबूत पासवर्ड का उपयोग करने की दृढ़ता से अनुशंसा की जाती है!**
