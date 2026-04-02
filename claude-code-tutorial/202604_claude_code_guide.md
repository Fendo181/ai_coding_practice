# Claude CodeによるAI駆動開発入門

> 最終更新: 2026年4月  
> 対象バージョン: Claude Code 最新版（claude-sonnet-4-6 / claude-opus-4-6）

---

## 目次

1. [Claude Codeとは](#1-claude-codeとは)
2. [3つのモード](#2-3つのモード)
3. [スラッシュコマンド](#3-スラッシュコマンド)
4. [キーボードショートカット](#4-キーボードショートカット)
5. [メモリ管理](#5-メモリ管理)
6. [MCP（Model Context Protocol）連携](#6-mcpmodel-context-protocol連携)
7. [Hooks機能](#7-hooks機能)
8. [サブエージェント・並列処理](#8-サブエージェント並列処理)
9. [カスタムスキル（Skillsシステム）](#9-カスタムスキルskillsシステム)
10. [便利なCLIフラグ](#10-便利なcliフラグ)

---

## 1. Claude Codeとは

Anthropicが開発した**AIコーディングCLIツール**。ターミナルから直接Claude AIと会話しながらコーディング・リファクタリング・デバッグ・ドキュメント作成が行える。

```bash
# インストール
npm install -g @anthropic-ai/claude-code

# 起動
claude
```

---

## 2. 3つのモード

Claude Codeには3つの動作モードがあり、`Shift+Tab` で切り替える。

| モード | 説明 | 切り替え |
|---|---|---|
| **標準モード** | 各操作で手動承認が必要（デフォルト）| デフォルト |
| **Auto-acceptモード** | 全変更を自動承認。スピード重視 | `Shift+Tab` 1回 |
| **Planモード** | 読み取り専用。変更前に計画を表示してから承認 | `Shift+Tab` 2回 |

> **Tip**: 慣れるまでは標準モードで確認しながら、作業に慣れたらAuto-acceptで効率化するのがおすすめ。

---

## 3. スラッシュコマンド

### ビルトインコマンド

| コマンド | 説明 |
|---|---|
| `/help` | 利用可能なコマンド一覧を表示 |
| `/clear` | 会話履歴をクリア（コンテキストをリセット） |
| `/compact` | 会話履歴を要約してコンテキストを節約 |
| `/init` | プロジェクト解析してCLAUDE.mdを自動生成 |
| `/model` | 使用するClaudeモデルを切り替え |
| `/plan` | Planモードへ切り替え |
| `/memory` | Auto-memoryの閲覧・管理 |
| `/hooks` | 設定済みHooksの確認 |
| `/review` | コードレビューを実行 |
| `/commit` | コミットメッセージを生成してコミット |
| `/rewind` | 会話を巻き戻してコード変更を取り消し |
| `/usage` | トークン使用量・プラン制限を確認 |
| `/batch` | 複数ワークツリーで大規模変更を並列実行 |
| `/effort` | モデルの思考コスト（トークン消費）を調整 |
| `/fast` | Fast mode（Claude Opus 4.6高速出力）をトグル |

### カスタムコマンドの作成

`.claude/commands/` ディレクトリにMarkdownファイルを置くだけ！

```bash
# 例: /deploy コマンドを作成
mkdir -p .claude/commands
cat > .claude/commands/deploy.md << 'EOF'
本番環境へのデプロイ前チェックリストを実行してください：
1. テストがすべてパスしているか確認
2. 環境変数が正しく設定されているか確認
3. マイグレーションが必要かどうか確認
EOF
```

---

## 4. キーボードショートカット

### モード切り替え

| ショートカット | 機能 |
|---|---|
| `Shift+Tab`（1回） | Auto-acceptモードへ |
| `Shift+Tab`（2回） | Planモードへ |
| `Shift+Tab`（3回） | 標準モードへ戻る |

### 操作系

| ショートカット | 機能 |
|---|---|
| `Ctrl+C` | 処理をキャンセル |
| `Esc Esc`（2回） | 直前の変更をRewind（取り消し） |
| `Ctrl+R` | 入力履歴を検索 |
| `Ctrl+G` | 外部エディタを開く |
| `Option+Enter` / `Shift+Enter` | 改行挿入（送信しない） |

### モデル・思考系

| ショートカット | 機能 |
|---|---|
| `Tab` | Thinking（思考）モードのトグル |
| `Alt+T` / `Option+T` | Extended Thinkingモードのトグル |
| `Option+P` / `Alt+P` | モデル切り替え |
| `Alt+M` | パーミッションモードのトグル |

### 入力支援

| ショートカット | 機能 |
|---|---|
| `@パス` | ファイルパスのオートコンプリート |
| `#テキスト` | クイックメモリ保存 |
| `!コマンド` | Bashコマンドを直接実行 |

### カスタマイズ方法

```bash
# ~/.claude/keybindings.json で自由にキーバインドを変更可能
{
  "submit": "ctrl+enter",
  "newline": "enter"
}
```

---

## 5. メモリ管理

Claude Codeは**3層のメモリシステム**を持つ。

### メモリの種類

| 種類 | ファイル | 説明 |
|---|---|---|
| **Project Memory** | `./CLAUDE.md` | プロジェクト全体に適用されるルール（Git管理） |
| **User Memory** | `~/.claude/CLAUDE.md` | 全プロジェクト共通の個人設定 |
| **Project Local** | `./CLAUDE.local.md` | 個人的なプロジェクト設定（Git管理外） |
| **Auto-Memory** | `~/.claude/projects/.../memory/` | Claudeが自動で学習・記録する永続メモリ |

### CLAUDE.mdの書き方

```markdown
# プロジェクトの基本方針

## 技術スタック
- 言語: TypeScript
- フレームワーク: Next.js 15
- DB: PostgreSQL

## コーディング規約
- コミットメッセージは日本語で1行
- テストは必ずintegrationテストで書く（モックなし）

## 禁止事項
- console.log を本番コードに残さない
```

### Auto-Memory（MEMORY.md）

Claude が自動的にセッション間を跨いで重要情報を記録する機能。

```
~/.claude/projects/<プロジェクト>/memory/
  ├── MEMORY.md         # インデックス（200行まで自動ロード）
  ├── user_role.md      # ユーザー情報
  ├── feedback_test.md  # 過去のフィードバック
  └── project_goal.md   # プロジェクト目標
```

---

## 6. MCP（Model Context Protocol）連携

Claudeに外部ツール・サービスへのアクセスを追加する仕組み。

### 基本コマンド

```bash
# MCPサーバーを追加
claude mcp add <名前> <コマンド>

# 例: GitHub MCPサーバーを追加
claude mcp add github npx @modelcontextprotocol/server-github

# 一覧表示
claude mcp list

# 削除
claude mcp remove <名前>

# 設定確認
claude mcp get <名前>
```

### 設定ファイルで管理（~/.claude.json）

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    },
    "voicevox": {
      "command": "uvx",
      "args": ["voicevox-mcp"]
    }
  }
}
```

### トランスポート種別

| 種別 | 用途 |
|---|---|
| `stdio` | ローカルプロセス（直接システムアクセス向け） |
| `HTTP` | リモートサーバー（クラウドサービス推奨） |
| ~~`SSE`~~ | 旧方式、現在は非推奨 |

### 人気MCPサーバー

| サーバー | 用途 |
|---|---|
| `@modelcontextprotocol/server-github` | GitHub操作 |
| `context7` | ライブラリの最新ドキュメント参照 |
| `sequential-thinking` | 複雑な推論の強化 |
| `voicevox-mcp` | 音声読み上げ通知 |
| Supabase MCP | データベース操作 |
| Google Calendar MCP | カレンダー操作 |

---

## 7. Hooks機能

ライフサイクルイベントに合わせてスクリプトを自動実行できる。

### イベント一覧

| イベント | タイミング |
|---|---|
| `SessionStart` | セッション開始時 |
| `PreToolUse` | ツール呼び出し前 |
| `PostToolUse` | ツール呼び出し後 |
| `Stop` | Claude停止時 |
| `Notification` | 通知発生時 |
| `UserPromptSubmit` | ユーザー入力送信時 |
| `SubagentStop` | サブエージェント完了時 |

### 設定例（settings.json）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --fix"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'タスク完了！'"
          }
        ]
      }
    ]
  }
}
```

---

## 8. サブエージェント・並列処理

### サブエージェントの活用

Claude Codeはタスクを**専門エージェントに委任**できる。各エージェントが独立した200kコンテキストを持つ。

```
メインエージェント
  ├── 調査エージェント（リサーチ専門）
  ├── コードエージェント（実装専門）
  └── テストエージェント（テスト専門）
```

**メリット**:
- メインのコンテキストを節約
- 複数タスクを並列実行
- 専門化されたエージェントで精度向上

### /batch コマンド（並列変更）

複数のGitワークツリーで同時に変更を適用：

```bash
/batch 「全ファイルのconsole.logをlogger.infoに置換して」
```

### Git Worktrees連携

独立したワークツリーで機能ブランチ開発を並列化：

```bash
# ワークツリーを作成して独立した環境で作業
git worktree add ../feature-branch feature/new-feature
claude  # この環境では feature ブランチのみ影響
```

---

## 9. カスタムスキル（Skillsシステム）

カスタムスラッシュコマンドの拡張版。Markdownファイルに自動呼び出し条件を設定できる。

### スキルの作成

```bash
# ~/.claude/skills/ または .claude/skills/ に配置
cat > ~/.claude/skills/deploy-check.md << 'EOF'
---
name: deploy-check
description: デプロイ前の安全チェック
triggers:
  - "デプロイ"
  - "本番リリース"
---

以下の順番でデプロイ前チェックを実施してください：
1. `npm test` を実行してすべてのテストがパスすることを確認
2. `npm run build` でビルドエラーがないことを確認
3. 環境変数の設定を確認
4. データベースマイグレーションが必要か確認
EOF
```

---

## 10. 便利なCLIフラグ

```bash
# Planモードで起動（変更なし・計画のみ）
claude --permission-mode plan

# 特定モデルを指定して起動
claude --model claude-opus-4-6

# 非対話モードで1回だけ実行
claude -p "このファイルのバグを修正して" src/app.ts

# 出力形式をJSONに（CI/CD向け）
claude -p "テスト実行して" --output-format json

# コンテキストとしてファイルを渡す
claude --context src/auth.ts "この認証処理をレビューして"

# デバッグモード
claude --debug
```

---

## まとめ：AI駆動開発のベストプラクティス

1. **CLAUDE.mdを整備する** — プロジェクトのルール・禁止事項・技術スタックを明記することでClaude の出力品質が劇的に向上
2. **Planモードを活用する** — 大きな変更前は必ずPlanモードで計画を確認してから実行
3. **サブエージェントで調査を分離する** — 調査タスクはサブエージェントに委任してメインコンテキストを節約
4. **Hooksで自動化する** — lintやテストの自動実行をHooksに設定してケアレスミスを防ぐ
5. **MCPで外部ツール連携** — GitHubやNotionなどのMCPサーバーを追加してClaude の能力を拡張
6. `/compact` を定期的に使う — 長いセッションではコンテキストを圧縮してコスト最適化

---

*参考: [Claude Code公式ドキュメント](https://docs.anthropic.com/ja/docs/claude-code)*
