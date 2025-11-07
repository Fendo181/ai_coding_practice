# 【初心者向け】Claude CodeとModel Context Protocol（MCP）の実践ガイド

## はじめに

この記事では、Claude CodeとModel Context Protocol（MCP）を使った実践的な開発手法について、初心者にもわかりやすく解説します。

## 目次

1. [MCPとは何か？](#mcpとは何か)
2. [セットアップ手順](#セットアップ手順)
3. [基本的な使い方](#基本的な使い方)
4. [実践的な活用例](#実践的な活用例)
5. [トラブルシューティング](#トラブルシューティング)
6. [まとめ](#まとめ)

## MCPとは何か？

Model Context Protocol（MCP）は、AIアシスタントが外部のツールやシステムと連携するためのオープンスタンダードです。

### MCPの主な特徴

- **統一されたインターフェース**: 異なるツールとの連携を統一的に行える
- **セキュリティ**: 安全にツールやリソースにアクセス可能
- **拡張性**: 新しいツールやサービスを簡単に追加できる

### AI Agentとの違い

| 項目 | MCP | AI Agent |
|------|-----|----------|
| 役割 | プロトコル・インターフェース | 自律的なタスク実行システム |
| 目的 | ツール連携の標準化 | 特定タスクの自動化 |
| 実装 | 通信規約 | 完全なアプリケーション |

## セットアップ手順

### 1. 必要な環境

```bash
# システム要件の確認
node --version  # v18以上推奨
npm --version   # 8以上推奨
```

### 2. Claude Codeのインストール

```bash
# Claude Codeをインストール
npm install -g @anthropic-ai/claude-code

# バージョン確認
claude-code --version
```

### 3. 初期設定

```bash
# 対話モードで初期設定
claude

# プロジェクト初期化
/init
```

### 4. MCPサーバーの設定

Claude Codeの設定ファイル（`~/.claude/claude_desktop_config.json`）にMCPサーバーを追加：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/your/project"]
    },
    "git": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-git", "--repository", "/path/to/your/repo"]
    }
  }
}
```

## 基本的な使い方

### 1. ファイルシステム操作

MCPを使ってファイル操作を行う基本例：

```bash
# ファイル一覧の取得
ls ./src

# ファイル内容の読み取り
cat ./src/main.js

# ファイルの編集
# Claude Codeが自動的にMCPを通じてファイルを編集
```

### 2. Git操作

```bash
# Git状態の確認
git status

# コミット履歴の確認
git log --oneline

# ブランチ作成
git checkout -b feature/new-feature
```

### 3. Claude Codeの3つのモード

#### 標準モード（デフォルト）
- 各操作に対して手動承認が必要
- 安全性重視の開発に適している

#### Auto-acceptモード（`Shift + Tab` 1回）
- 自動的にコード変更を承認
- 高速な開発サイクルに適している

#### Plan Mode（`Shift + Tab` 2回）
- 実行前に詳細な計画を表示
- 複雑な変更を事前に確認したい場合に便利

## 実践的な活用例

### 例1: プロジェクトのリファクタリング

```markdown
**シナリオ**: 既存のJavaScriptコードをTypeScriptに移行

1. **現状分析**
   - MCPを使って既存ファイル構造を把握
   - 依存関係の確認

2. **段階的移行**
   - `.js`ファイルを`.ts`に変更
   - 型定義の追加
   - エラーの修正

3. **品質確保**
   - TypeScriptコンパイラによるチェック
   - テストの実行
```

### 例2: ドキュメント生成の自動化

```markdown
**シナリオ**: コードからAPIドキュメントを自動生成

1. **コード分析**
   - MCPでソースコードを読み取り
   - 関数とクラスの抽出

2. **ドキュメント生成**
   - JSDocコメントの自動生成
   - READMEファイルの更新

3. **継続的更新**
   - Gitフックを使った自動更新
   - CI/CDパイプラインとの連携
```

### 例3: バグ修正とテスト

```markdown
**シナリオ**: 報告されたバグの修正

1. **問題の特定**
   - ログファイルの分析
   - 関連コードの確認

2. **修正の実装**
   - 段階的なコード変更
   - エラーハンドリングの追加

3. **テストと検証**
   - 単体テストの作成
   - 統合テストの実行
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. MCPサーバーが起動しない

```bash
# ログの確認
tail -f ~/.claude/logs/mcp.log

# サーバーの手動起動でテスト
npx @modelcontextprotocol/server-filesystem /path/to/project
```

#### 2. ファイルアクセス権限の問題

```bash
# 権限の確認
ls -la /path/to/file

# 権限の修正
chmod 644 /path/to/file
```

#### 3. 設定ファイルの問題

```json
// 正しい設定例
{
  "mcpServers": {
    "server-name": {
      "command": "command-path",
      "args": ["arg1", "arg2"],
      "env": {
        "VARIABLE": "value"
      }
    }
  }
}
```

### デバッグのコツ

1. **ログの活用**
   - MCPサーバーのログを確認
   - Claude Codeのデバッグモードを使用

2. **段階的なテスト**
   - 小さな操作から始める
   - 一つずつ機能を確認

3. **設定の見直し**
   - JSON構文の確認
   - パスの正確性をチェック

## 実際の開発ワークフロー

### 1. プロジェクト開始時

```bash
# プロジェクト設定
claude
/init

# Git初期化
git init
git add .
git commit -m "Initial commit"
```

### 2. 開発フェーズ

```bash
# 機能開発ブランチの作成
git checkout -b feature/user-authentication

# Claude Codeでの開発
# - ファイル編集
# - テスト実行
# - デバッグ
```

### 3. レビューとデプロイ

```bash
# コードレビュー準備
git add .
git commit -m "Add user authentication feature"

# マージとデプロイ
git checkout main
git merge feature/user-authentication
```

## 最適化のヒント

### パフォーマンス向上

1. **キャッシュの活用**
   - MCPサーバーのキャッシュ設定
   - 頻繁にアクセスするファイルの最適化

2. **並列処理**
   - 複数のMCPサーバーの並列実行
   - 非同期処理の活用

### セキュリティ強化

1. **アクセス制御**
   - ファイルパスの制限
   - 実行可能コマンドの限定

2. **監査ログ**
   - すべての操作を記録
   - 定期的な監査の実施

## まとめ

Claude CodeとMCPの組み合わせにより、以下のメリットが得られます：

### 開発効率の向上
- **自動化**: 繰り返し作業の自動化
- **一貫性**: 統一されたツールインターフェース
- **速度**: 高速な開発サイクル

### コード品質の向上
- **リファクタリング**: 安全で確実なコード改善
- **テスト**: 自動テスト生成と実行
- **ドキュメント**: 常に最新のドキュメント

### 学習効果
- **ベストプラクティス**: AIによる最適なコード提案
- **理解促進**: コードの動作原理の説明
- **技術習得**: 新しい技術の実践的な学習

## 次のステップ

1. **実践練習**
   - 小さなプロジェクトで練習
   - 様々なMCPサーバーを試す

2. **コミュニティ参加**
   - MCPコミュニティへの参加
   - 事例共有と学習

3. **カスタマイズ**
   - 独自のMCPサーバー開発
   - ワークフローの最適化

---

この記事が、Claude CodeとMCPを使った効率的な開発の第一歩になれば幸いです。実際に手を動かしながら学習することで、より深い理解が得られるでしょう。

## 参考資料

- [Model Context Protocol公式ドキュメント](https://modelcontextprotocol.io/)
- [Claude Code公式ガイド](https://docs.anthropic.com/en/docs/claude-code)
- [MCPサーバー一覧](https://github.com/modelcontextprotocol/servers)
- [実践例とサンプルコード](https://github.com/anthropics/mcp-examples)