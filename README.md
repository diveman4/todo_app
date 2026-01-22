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
- **Backend Build**: TypeScriptのビルド検証（Prisma Client生成含む）

### トリガー
- `main`、`develop`、`master`ブランチへのpush
- 上記ブランチへのプルリクエスト
- 手動実行（GitHubのActionsタブから）

### 実行方法

#### 自動実行
コードをGitHubリポジトリにpushするだけで自動的に実行されます：

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

#### 手動実行
1. GitHubリポジトリの「**Actions**」タブを開く
2. 左側メニューから「**CI**」を選択
3. 右側の「**Run workflow**」ボタンをクリック
4. ブランチを選択して実行

### 実行結果の確認
- GitHubリポジトリの「**Actions**」タブで実行履歴を確認
- 各ジョブのログをクリックして詳細を確認
- 失敗した場合はエラーメッセージを確認

### トラブルシューティング

**ワークフローが実行されない場合:**

1. **ブランチ名を確認**
   ```bash
   git branch  # 現在のブランチ名を確認
   ```
   - ワークフローは`main`、`develop`、`master`ブランチでのみ実行されます
   - 他のブランチで実行したい場合は、ワークフローファイルを修正

2. **ワークフローファイルがpushされているか確認**
   ```bash
   ls -la .github/workflows/ci.yml
   git status  # ファイルがコミットされているか確認
   ```

3. **GitHub Actionsが有効になっているか確認**
   - リポジトリの「Settings」→「Actions」→「General」を確認
   - 「Allow all actions and reusable workflows」が選択されているか確認

4. **手動実行を試す**
   - GitHubのActionsタブから手動で実行してみる
   - エラーメッセージが表示される場合は、それを確認

**詳細な使用方法は以下を参照:**
- [GitHub Actions 詳細ガイド](./docs/GITHUB_ACTIONS_GUIDE.md) - セットアップからトラブルシューティングまで
- [CI/CD トラブルシューティング クイックガイド](./docs/CI_CD_TROUBLESHOOTING.md) - よくある問題の解決方法