# ローカル開発環境セットアップガイド

このドキュメントでは、すべての必要なサービスコンポーネントを含む、完全なMCP Gateway開発環境をローカルにセットアップして起動する方法について説明します。

## 前提条件

開始する前に、システムに以下のソフトウェアがインストールされていることを確認してください：

- Git
- Go 1.24.1以上
- Node.js v20.18.0以上
- npm

## プロジェクトアーキテクチャの概要

MCP Gatewayプロジェクトは、以下の主要コンポーネントで構成されています：

1. **apiserver** - 設定管理、ユーザーインターフェース、その他のAPIサービスを提供
2. **mcp-gateway** - コアゲートウェイサービス、MCPプロトコル変換を処理
3. **mock-server** - 開発テスト用のユーザーサービスをシミュレート
4. **web** - 管理インターフェースフロントエンド

## 開発環境の起動

### 1. プロジェクトのクローン

[MCP Gatewayコードリポジトリ](https://github.com/amoylab/unla)にアクセスし、`Fork`ボタンをクリックして、プロジェクトをあなたのGitHubアカウントにフォークします。

### 2. ローカルにクローン

フォークしたリポジトリをローカルにクローンします：

```bash
git clone https://github.com/あなたのgithubユーザー名/mcp-gateway.git
```

### 3. 環境依存関係の初期化

プロジェクトディレクトリに入ります：
```bash
cd unla
```

依存関係をインストールします：

```bash
go mod tidy
cd web
npm i
```

### 4. 開発環境の起動

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**注意**：何も変更せずにデフォルト設定で開発を開始できますが、Disk、DBなどの切り替えなど、あなたの環境や開発ニーズに合わせて設定ファイルを変更することもできます。

**注意**：すべてのサービスを実行するには、4つのターミナルウィンドウが必要になる場合があります。ホストマシン上で複数のサービスを実行するこの方法は、開発中の再起動やデバッグを容易にします。

#### 4.1 mcp-gatewayの起動

```bash
go run cmd/gateway/main.go
```

mcp-gatewayはデフォルトで `http://localhost:5235` で起動し、MCPプロトコルリクエストを処理します。

#### 4.2 apiserverの起動 

```bash
go run cmd/apiserver/main.go
```

apiserverはデフォルトで `http://localhost:5234` で起動します。

#### 4.3 mock-serverの起動

```bash
go run cmd/mock-server/main.go
```

mock-serverはデフォルトで `http://localhost:5235` で起動します。

#### 4.4 Webフロントエンドの起動

```bash
npm run dev
```

Webフロントエンドはデフォルトで `http://localhost:5236` で起動します。

これでブラウザで http://localhost:5236 にアクセスして管理インターフェースを使用できます。デフォルトのユーザー名とパスワードは環境変数（ルートディレクトリの.envファイル）によって決定され、具体的には`SUPER_ADMIN_USERNAME`と`SUPER_ADMIN_PASSWORD`です。ログイン後、管理インターフェースでユーザー名とパスワードを変更できます。

## よくある問題

### 環境変数の設定

一部のサービスは、正常に動作するために特定の環境変数が必要な場合があります。`.env`ファイルを作成するか、コマンドを開始する前にこれらの変数を設定できます：

```bash
# 例
export OPENAI_API_KEY="あなたのapi_key"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="あなたのシークレットキー"
```

## 次のステップ

ローカル開発環境を正常に起動した後、以下のことができます：

- [アーキテクチャドキュメント](./architecture)を確認して、システムコンポーネントを詳しく理解する
- [設定ガイド](../configuration/gateways)を読んで、ゲートウェイの設定方法を学ぶ 

## コード貢献のワークフロー

新機能の開発やバグ修正を始める前に、以下の手順で開発環境をセットアップしてください：

1. フォークしたリポジトリをローカルにクローン：
```bash
git clone https://github.com/your-github-username/unla.git
```

2. アップストリームリポジトリの追加：
```bash
git remote add upstream git@github.com:amoylab/unla.git
```

3. アップストリームコードとの同期：
```bash
git pull upstream main
```

4. フォークリポジトリへの更新のプッシュ（オプション）：
```bash
git push origin main
```

5. 新機能ブランチの作成：
```bash
git switch -c feat/your-feature-name
```

6. 開発完了後、ブランチをフォークリポジトリにプッシュ：
```bash
git push origin feat/your-feature-name
```

7. GitHubでプルリクエストを作成し、ブランチをメインリポジトリのmainブランチにマージします。

**ヒント**：
- ブランチ命名規則：新機能には`feat/`プレフィックス、バグ修正には`fix/`プレフィックスを使用
- PRを提出する前に、コードがすべてのテストをパスすることを確認してください
- コードの競合を避けるため、フォークリポジトリをアップストリームリポジトリと同期させておくことをお勧めします 