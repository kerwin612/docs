# Docker

## イメージ概要

MCP Gatewayは2つのデプロイ方法を提供しています：
1. **All-in-Oneデプロイ**: すべてのサービスを1つのコンテナにパッケージ化し、ローカルまたはシングルノードデプロイに適しています。
2. **マルチコンテナデプロイ**: 各サービスを個別にデプロイし、本番環境やクラスター環境に適しています。

### イメージリポジトリ

イメージは以下のレジストリに公開されています：
- Docker Hub: `docker.io/ifuryst/unla-*`
- GitHub Container Registry: `ghcr.io/amoylab/unla/*`
- 阿里云容器镜像服务: `registry.ap-southeast-1.aliyuncs.com/amoylab/unla-*`

*GitHub Container Registryは複数レベルのディレクトリをサポートしており、より明確な組織化が可能です。一方、Docker Hubと阿里云のレジストリはハイフンを使用したフラットな命名規則を使用しています。*

### イメージタグ

- `latest`: 最新バージョン
- `vX.Y.Z`: 特定のバージョン

> ⚡ **注意**: MCP Gatewayは急速に開発が進んでいます！より信頼性の高いデプロイのために、特定のバージョンタグを使用することをお勧めします。

### 利用可能なイメージ

```bash
# All-in-Oneバージョン
docker pull docker.io/ifuryst/unla-allinone:latest
docker pull ghcr.io/amoylab/unla/allinone:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# API Server
docker pull docker.io/ifuryst/unla-apiserver:latest
docker pull ghcr.io/amoylab/unla/apiserver:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-apiserver:latest

# MCP Gateway
docker pull docker.io/ifuryst/unla-mcp-gateway:latest
docker pull ghcr.io/amoylab/unla/mcp-gateway:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mcp-gateway:latest

# Mock User Service
docker pull docker.io/ifuryst/unla-mock-server:latest
docker pull ghcr.io/amoylab/unla/mock-server:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-mock-server:latest

# Web Frontend
docker pull docker.io/ifuryst/unla-web:latest
docker pull ghcr.io/amoylab/unla/web:latest
docker pull registry.ap-southeast-1.aliyuncs.com/amoylab/unla-web:latest
```

## デプロイ

### All-in-Oneデプロイ

All-in-Oneデプロイはすべてのサービスを1つのコンテナにパッケージ化し、シングルノードまたはローカルデプロイに最適です。以下のサービスが含まれています：
- **API Server**: 管理バックエンド（コントロールプレーン）
- **MCP Gateway**: ゲートウェイトラフィックを処理するコアサービス（データプレーン）
- **Mock User Service**: テスト用のシミュレートされたユーザーサービス（実際の既存APIサービスに置き換えることができます）
- **Web Frontend**: Webベースの管理インターフェース
- **Nginx**: 内部サービスのリバースプロキシ

プロセスはSupervisorで管理され、すべてのログはstdoutに出力されます。

#### ポート

- `8080`: Web UI
- `5234`: API Server
- `5235`: MCP Gateway
- `5335`: MCP Gateway Admin（reloadなどの内部エンドポイント、本番環境では公開しないでください）
- `5236`: Mock User Service

#### データ永続化

以下のディレクトリをマウントすることをお勧めします：
- `/app/configs`: 設定ファイル
- `/app/data`: データストレージ
- `/app/.env`: 環境変数ファイル

#### コマンド例

1. 必要なディレクトリを作成し、設定ファイルをダウンロード：

```bash
mkdir -p unla/{configs,data}
cd unla/
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/apiserver.yaml -o configs/apiserver.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/configs/mcp-gateway.yaml -o configs/mcp-gateway.yaml
curl -sL https://raw.githubusercontent.com/amoylab/unla/refs/heads/main/.env.example -o .env.allinone
```

> 必要に応じてデフォルトのLLMを置き換えることができます（OpenAI互換である必要があります）、例：千问を使用：
> ```bash
> OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/
> OPENAI_API_KEY=sk-yourkeyhere
> OPENAI_MODEL=qwen-turbo
> ```

2. DockerでMCP Gatewayを実行：

```bash
# 阿里云レジストリを使用（中国内のサーバー/デバイスに推奨）
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
           registry.ap-southeast-1.aliyuncs.com/amoylab/unla-allinone:latest

# GitHub Container Registryを使用
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

#### 注意事項

1. 設定ファイルと環境ファイルが正しく設定されていることを確認してください。
2. `latest`の代わりに特定のバージョンタグを使用することをお勧めします。
3. 本番環境デプロイでは適切なリソース制限を設定してください。
4. マウントされたディレクトリに適切な権限があることを確認してください。 