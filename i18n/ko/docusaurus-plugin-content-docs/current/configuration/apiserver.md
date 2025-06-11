# apiserver.yaml

설정 파일은 `${VAR:default}` 구문을 사용하여 환경 변수 주입을 지원합니다. 환경 변수가 설정되지 않은 경우 기본값이 사용됩니다.

일반적인 방법은 다른 `.env`, `.env.development`, `.env.prod` 파일을 통해 값을 주입하거나, 설정을 직접 수정하여 고정 값을 설정하는 것입니다.

## 채팅 메시지 데이터베이스 설정

이 설정은 백엔드의 채팅 메시지 저장을 위한 설정입니다(물론 프록시 설정과 동일한 데이터베이스에 저장할 수 있습니다). 아래 이미지에 표시된 정보에 해당합니다:

![채팅 세션 및 메시지](/img/chat_histories.png)

현재 3가지 유형의 데이터베이스를 지원합니다:
- SQLite3
- PostgreSQL
- MySQL

추가 데이터베이스 지원이 필요한 경우 [Issue](https://github.com/amoylab/unla/issues)에서 요청하거나, 해당 구현을 직접 만들어 PR을 제출할 수 있습니다 :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # 데이터베이스 유형 (sqlite, postgres, mysql)
  host: "${APISERVER_DB_HOST:localhost}"            # 데이터베이스 호스트 주소
  port: ${APISERVER_DB_PORT:5432}                   # 데이터베이스 포트
  user: "${APISERVER_DB_USER:postgres}"             # 데이터베이스 사용자 이름
  password: "${APISERVER_DB_PASSWORD:example}"      # 데이터베이스 비밀번호
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # 데이터베이스 이름 또는 파일 경로
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # 데이터베이스 연결의 SSL 모드
```

## 게이트웨이 프록시 스토리지 설정

이는 게이트웨이 프록시 설정을 저장하는 데 사용됩니다. 구체적으로는 MCP에서 API로의 매핑 설정으로, 아래 이미지에 표시된 데이터에 해당합니다:

![게이트웨이 프록시 설정](/img/gateway_proxies.png)

현재 2가지 유형을 지원합니다:
- disk: 설정은 디스크의 파일로 저장되며, 각 설정은 별도의 파일로 저장됩니다. nginx의 vhost와 유사한 개념으로, 예를 들어 `svc-a.yaml`, `svc-b.yaml`과 같이 저장됩니다
- db: 데이터베이스에 저장하며, 각 설정은 하나의 레코드로 저장됩니다. 현재 3가지 유형의 데이터베이스를 지원합니다:
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # 스토리지 유형: db, disk
  
  # 데이터베이스 설정 (type이 'db'일 때 사용)
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # 데이터베이스 유형 (sqlite, postgres, mysql)
    host: "${GATEWAY_DB_HOST:localhost}"                # 데이터베이스 호스트 주소
    port: ${GATEWAY_DB_PORT:5432}                       # 데이터베이스 포트
    user: "${GATEWAY_DB_USER:postgres}"                 # 데이터베이스 사용자 이름
    password: "${GATEWAY_DB_PASSWORD:example}"          # 데이터베이스 비밀번호
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # 데이터베이스 이름 또는 파일 경로
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # 데이터베이스 연결의 SSL 모드
  
  # 디스크 설정 (type이 'disk'일 때 사용)
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # 데이터 파일 저장 경로
```

## 알림 설정

알림 설정 모듈은 주로 설정이 업데이트되었을 때 `mcp-gateway`에 알리고, 서비스를 재시작하지 않고도 핫 리로드를 실행하기 위해 사용됩니다.

현재 4가지 알림 방법을 지원합니다:
- signal: 운영 체제 신호를 통해 알립니다. `kill -SIGHUP <pid>` 또는 `nginx -s reload`와 유사한 방식으로, `mcp-gateway reload` 명령으로 호출할 수 있습니다. 단일 머신 배포에 적합합니다
- api: API 호출을 통해 알립니다. `mcp-gateway`는 독립된 포트에서 리스닝하며, 요청을 수신하면 핫 리로드를 실행합니다. `curl http://localhost:5235/_reload`로 직접 호출할 수 있으며, 단일 머신과 클러스터 배포 모두에 적합합니다
- redis: Redis의 발행/구독 기능을 통해 알립니다. 단일 머신과 클러스터 배포 모두에 적합합니다
- composite: 여러 방법을 조합한 알림입니다. 기본적으로 `signal`과 `api`가 항상 활성화되어 있으며, 다른 방법과 조합할 수 있습니다. 단일 머신과 클러스터 배포 모두에 적합하며, 권장되는 기본 방법입니다

알림 역할:
- sender: 발신자 역할로, 알림을 보내는 책임이 있습니다. `apiserver`는 이 모드만 사용할 수 있습니다
- receiver: 수신자 역할로, 알림을 받는 책임이 있습니다. 단일 머신의 `mcp-gateway`는 이 모드만 사용하는 것을 권장합니다
- both: 발신자와 수신자 모두의 역할입니다. 클러스터 배포된 `mcp-gateway`는 이 모드를 사용할 수 있습니다

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # 역할: sender, receiver, 또는 both
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # 유형: signal, api, redis, 또는 composite

  # 신호 설정 (type이 'signal'일 때 사용)
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # 보낼 신호
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PID 파일 경로

  # API 설정 (type이 'api'일 때 사용)
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # API 포트
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # 리로드 엔드포인트

  # Redis 설정 (type이 'redis'일 때 사용)
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redis 주소
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redis 비밀번호
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redis 데이터베이스 번호
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redis 발행/구독 토픽
```

## OpenAI API 설정

OpenAI 설정 블록은 OpenAI API 통합을 위한 설정을 정의합니다:

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI API 키 (필수)
  model: "${OPENAI_MODEL:gpt-4.1}"                              # 사용할 모델
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # API 기본 URL
```

현재는 OpenAI API 호환 LLMs 호출만 통합되어 있습니다

## 슈퍼 관리자 설정

슈퍼 관리자 설정은 시스템의 초기 관리자 계정을 설정하는 데 사용됩니다. `apiserver`가 시작될 때마다 존재 여부를 확인하고, 존재하지 않는 경우 자동으로 생성됩니다

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # 슈퍼 관리자 사용자 이름
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # 슈퍼 관리자 비밀번호 (프로덕션 환경에서는 변경하세요)
```

**프로덕션 환경 또는 공개 네트워크 환경에서는 강력한 비밀번호를 사용하는 것을 강력히 권장합니다!**

## JWT 설정

JWT 설정은 웹 인증 관련 매개변수를 설정하는 데 사용됩니다:

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # JWT 키 (프로덕션 환경에서는 변경하세요)
  duration: "${APISERVER_JWT_DURATION:24h}"                  # 토큰 유효 기간
```

**프로덕션 환경 또는 공개 네트워크 환경에서는 강력한 비밀번호를 사용하는 것을 강력히 권장합니다!** 