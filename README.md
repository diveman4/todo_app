# Todo App

TODO管理アプリケーションです。フロントエンド（Next.js）とバックエンド（Hono + Prisma）で構成されたフルスタックアプリケーションです。

## プロジェクト概要

このアプリは、ブラウザ上でタスク管理ができるシンプルなTODOアプリケーションです。

### 主な機能
- タスクの追加（タイトル・説明文・期限日・優先度）
- タスクの一覧表示（カード形式）
- 完了・未完了の切り替え
- タイトルの編集
- タスクの削除（確認ダイアログ付き）
- キーワード検索

### 技術スタック

**フロントエンド**
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- MUI (Material-UI)

**バックエンド**
- Hono (v4.11.4)
- Prisma (v6.19.2)
- TypeScript 5
- PostgreSQL

**インフラ・ツール**
- Docker / Docker Compose
- GitHub Actions (CI/CD)

## クイックスタート

### 前提条件
- Docker と Docker Compose がインストールされていること

### セットアップ手順

1. **プロジェクトのルートディレクトリに移動**
   ```bash
   cd todo_app
   ```

2. **Docker Composeでサービスを起動**
   ```bash
   docker compose up -d
   ```
   このコマンドで、データベース・フロントエンド・バックエンドAPIサーバーが自動的に起動します。

3. **データベースのマイグレーション実行**
   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```
   または、初回セットアップの場合：
   ```bash
   docker compose exec backend npx prisma migrate dev
   ```

4. **アプリケーションにアクセス**
   - フロントエンド: http://localhost:3000
   - バックエンドAPI: http://localhost:3001

## プロジェクト構造

```
todo_app/
├── frontend/          # Next.js フロントエンドアプリケーション
│   ├── app/          # Next.js App Router
│   ├── components/   # Reactコンポーネント
│   ├── lib/          # ユーティリティ・APIクライアント
│   └── test/         # テストファイル
├── backend/          # Hono バックエンドAPI
│   ├── src/          # ソースコード
│   └── prisma/       # Prismaスキーマ・マイグレーション
├── docs/             # ドキュメント（ER図、テスト設計書など）
└── docker-compose.yml # Docker Compose設定
```

## 詳細ドキュメント

各ディレクトリの詳細情報は、以下のREADMEを参照してください：

- [フロントエンド詳細](./frontend/README.md) - フロントエンドの機能、使用技術、工夫した点
- [バックエンド詳細](./backend/README.md) - APIエンドポイント、使用技術、工夫した点

## 開発時の注意事項

### Prismaスキーマ変更時

`schema.prisma`を変更した場合、以下のコマンドを実行する必要があります：

1. **型定義の再生成**
   ```bash
   docker compose exec backend npx prisma generate
   ```

2. **スキーマ変更をDBに反映**
   ```bash
   docker compose exec backend npx prisma migrate dev
   ```
   または
   ```bash
   docker compose exec backend npx prisma db push
   ```

## CI/CD

このプロジェクトにはGitHub Actionsを使用したCI/CDパイプラインを設定しています。

### 実行されるジョブ
- **Frontend Lint**: ESLintによるコード品質チェック
- **Frontend Build**: Next.jsアプリケーションのビルド検証
- **Frontend Unit Tests**: Vitestによるユニットテストの実行
- **Frontend E2E Tests**: PlaywrightによるE2Eテストの実行
- **Backend Build**: TypeScriptのビルド検証

### トリガー
- `main`ブランチへのpush
- `main`ブランチへのプルリクエスト

### ローカルでの実行
CI/CDパイプラインは、GitHubリポジトリにpushするだけで自動的に実行されます。