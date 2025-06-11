# apiserver.yaml

設定ファイルは`${VAR:default}`構文を使用した環境変数の注入をサポートしています。環境変数が設定されていない場合は、デフォルト値が使用されます。

一般的な方法は、異なる`.env`、`.env.development`、`.env.prod`ファイルを通じて値を注入するか、設定を直接変更して固定値を設定することです。

## チャットメッセージデータベース設定

この設定は、バックエンドのチャットメッセージ保存用の設定です（もちろん、プロキシ設定と同じデータベースに保存することもできます）。以下の画像に示す情報に対応しています：

![チャットセッションとメッセージ](/img/chat_histories.png)

現在3種類のデータベースをサポートしています：
- SQLite3
- PostgreSQL
- MySQL

追加のデータベースサポートが必要な場合は、[Issue](https://github.com/amoylab/unla/issues)でリクエストするか、対応する実装を作成してPRを提出することができます :)

```yaml
database:
  type: "${APISERVER_DB_TYPE:sqlite}"               # データベースタイプ（sqlite, postgres, mysql）
  host: "${APISERVER_DB_HOST:localhost}"            # データベースホストアドレス
  port: ${APISERVER_DB_PORT:5432}                   # データベースポート
  user: "${APISERVER_DB_USER:postgres}"             # データベースユーザー名
  password: "${APISERVER_DB_PASSWORD:example}"      # データベースパスワード
  dbname: "${APISERVER_DB_NAME:./mcp-gateway.db}"   # データベース名またはファイルパス
  sslmode: "${APISERVER_DB_SSL_MODE:disable}"       # データベース接続のSSLモード
```

## ゲートウェイプロキシストレージ設定

これはゲートウェイプロキシ設定を保存するために使用されます。具体的には、MCPからAPIへのマッピングの設定で、以下の画像に示すデータに対応しています：

![ゲートウェイプロキシ設定](/img/gateway_proxies.png)

現在2種類をサポートしています：
- disk: 設定はディスク上のファイルとして保存され、各設定は個別のファイルに保存されます。nginxのvhostと同様の概念で、例えば`svc-a.yaml`、`svc-b.yaml`のように保存されます
- db: データベースに保存し、各設定は1つのレコードとして保存されます。現在3種類のデータベースをサポートしています：
    - SQLite3
    - PostgreSQL
    - MySQL

```yaml
storage:
  type: "${GATEWAY_STORAGE_TYPE:db}"                    # ストレージタイプ：db, disk
  
  # データベース設定（typeが'db'の場合に使用）
  database:
    type: "${GATEWAY_DB_TYPE:sqlite}"                   # データベースタイプ（sqlite, postgres, mysql）
    host: "${GATEWAY_DB_HOST:localhost}"                # データベースホストアドレス
    port: ${GATEWAY_DB_PORT:5432}                       # データベースポート
    user: "${GATEWAY_DB_USER:postgres}"                 # データベースユーザー名
    password: "${GATEWAY_DB_PASSWORD:example}"          # データベースパスワード
    dbname: "${GATEWAY_DB_NAME:./data/mcp-gateway.db}"  # データベース名またはファイルパス
    sslmode: "${GATEWAY_DB_SSL_MODE:disable}"           # データベース接続のSSLモード
  
  # ディスク設定（typeが'disk'の場合に使用）
  disk:
    path: "${GATEWAY_STORAGE_DISK_PATH:}"               # データファイルの保存パス
```

## 通知設定

通知設定モジュールは主に設定が更新されたときに`mcp-gateway`に通知し、サービスを再起動することなくホットリロードを実行するために使用されます。

現在4種類の通知方法をサポートしています：
- signal: オペレーティングシステムのシグナルを通じて通知します。`kill -SIGHUP <pid>`や`nginx -s reload`と同様の方法で、`mcp-gateway reload`コマンドで呼び出すことができます。単一マシンデプロイメントに適しています
- api: API呼び出しを通じて通知します。`mcp-gateway`は独立したポートでリッスンし、リクエストを受信するとホットリロードを実行します。`curl http://localhost:5235/_reload`で直接呼び出すことができ、単一マシンとクラスターデプロイメントの両方に適しています
- redis: Redisのパブリッシュ/サブスクライブ機能を通じて通知します。単一マシンとクラスターデプロイメントの両方に適しています
- composite: 複数の方法を組み合わせた通知です。デフォルトでは`signal`と`api`が常に有効で、他の方法と組み合わせることができます。単一マシンとクラスターデプロイメントの両方に適しており、推奨されるデフォルトの方法です

通知の役割：
- sender: 送信者役割で、通知を送信する責任があります。`apiserver`はこのモードのみ使用できます
- receiver: 受信者役割で、通知を受信する責任があります。単一マシンの`mcp-gateway`はこのモードのみ使用することを推奨します
- both: 送信者と受信者の両方の役割です。クラスターデプロイされた`mcp-gateway`はこのモードを使用できます

```yaml
notifier:
  role: "${APISERVER_NOTIFIER_ROLE:sender}"              # 役割：sender, receiver, またはboth
  type: "${APISERVER_NOTIFIER_TYPE:signal}"              # タイプ：signal, api, redis, またはcomposite

  # シグナル設定（typeが'signal'の場合に使用）
  signal:
    signal: "${APISERVER_NOTIFIER_SIGNAL:SIGHUP}"                       # 送信するシグナル
    pid: "${APISERVER_NOTIFIER_SIGNAL_PID:/var/run/mcp-gateway.pid}"    # PIDファイルパス

  # API設定（typeが'api'の場合に使用）
  api:
    port: ${APISERVER_NOTIFIER_API_PORT:5235}                                           # APIポート
    target_url: "${APISERVER_NOTIFIER_API_TARGET_URL:http://localhost:5235/_reload}"    # リロードエンドポイント

  # Redis設定（typeが'redis'の場合に使用）
  redis:
    addr: "${APISERVER_NOTIFIER_REDIS_ADDR:localhost:6379}"                             # Redisアドレス
    password: "${APISERVER_NOTIFIER_REDIS_PASSWORD:UseStrongPasswordIsAGoodPractice}"   # Redisパスワード
    db: ${APISERVER_NOTIFIER_REDIS_DB:0}                                                # Redisデータベース番号
    topic: "${APISERVER_NOTIFIER_REDIS_TOPIC:mcp-gateway:reload}"                       # Redisパブリッシュ/サブスクライブトピック
```

## OpenAI API設定

OpenAI設定ブロックはOpenAI API統合の設定を定義します：

```yaml
openai:
  api_key: "${OPENAI_API_KEY}"                                  # OpenAI APIキー（必須）
  model: "${OPENAI_MODEL:gpt-4.1}"                              # 使用するモデル
  base_url: "${OPENAI_BASE_URL:https://api.openai.com/v1/}"     # APIベースURL
```

現在はOpenAI API互換のLLMs呼び出しのみを統合しています

## スーパー管理者設定

スーパー管理者設定はシステムの初期管理者アカウントを設定するために使用されます。`apiserver`が起動するたびに存在を確認し、存在しない場合は自動的に作成されます

```yaml
super_admin:
  username: "${SUPER_ADMIN_USERNAME:admin}"     # スーパー管理者ユーザー名
  password: "${SUPER_ADMIN_PASSWORD:admin}"     # スーパー管理者パスワード（本番環境では変更してください）
```

**本番環境または公衆ネットワーク環境では強力なパスワードを使用することを強く推奨します！**

## JWT設定

JWT設定はWeb認証関連のパラメータを設定するために使用されます：

```yaml
jwt:
  secret_key: "${APISERVER_JWT_SECRET_KEY:Pls-Change-Me!}"  # JWTキー（本番環境では変更してください）
  duration: "${APISERVER_JWT_DURATION:24h}"                  # トークン有効期間
```

**本番環境または公衆ネットワーク環境では強力なパスワードを使用することを強く推奨します！** 