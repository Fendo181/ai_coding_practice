# Claude Code ベストプラクティスガイド

このドキュメントは、Claude Codeを効率的に活用するためのベストプラクティス、ショートカット、推奨ワークフローをまとめたものです。

## 🎯 主要なキーボードショートカット

### 基本操作

| ショートカット | 機能 |
|--------------|------|
| `Ctrl+C` | 入力/実行を中止 |
| `Ctrl+D` | セッション終了 |
| `Ctrl+L` | 画面クリア（履歴は保持） |
| `Ctrl+O` | 詳細出力表示切替 |
| `Ctrl+R` | コマンド履歴を逆検索 |
| `Ctrl+B` | バックグラウンド実行 |
| `Esc+Esc` | 前の状態に巻き戻し |
| `Tab` | 拡張思考モード切替 |
| `?` | ショートカット一覧表示 |

### 複数行入力

| ショートカット | 環境 |
|--------------|------|
| `\ + Enter` | 全環境（クイック改行） |
| `Option+Enter` | macOSデフォルト |
| `Shift+Enter` | ターミナル設定後 |
| `Ctrl+J` | ラインフィード |

### クイックコマンド（行頭の文字）

| 文字 | 機能 |
|-----|------|
| `#` | メモ機能（CLAUDE.mdに追加） |
| `/` | スラッシュコマンド実行 |
| `!` | Bashコマンド直接実行 |
| `@` | ファイルパス自動補完 |

### モード切替

| コマンド/操作 | 説明 |
|-------------|------|
| `Shift+Tab` 1回 | Auto-acceptモード（自動承認） |
| `Shift+Tab` 2回 | Plan Mode（実行計画表示） |
| `/vim` | Vimエディタモード有効化 |

## 📋 よく使うスラッシュコマンド

### 基本コマンド

```bash
/help          # ヘルプ表示
/clear         # 会話履歴クリア
/exit          # REPLを終了
/cost          # トークン使用統計
/context       # コンテキスト使用状況
/memory        # CLAUDE.mdを編集
/model         # AIモデル変更
```

### カスタムコマンド作成

**プロジェクト用（チーム共有）：**
```
.claude/commands/your-command.md
```

**個人用：**
```
~/.claude/commands/your-command.md
```

#### カスタムコマンドの例

```markdown
---
description: "コードレビューを実行"
---

以下の変更をレビューしてください：
$ARGUMENTS

チェック項目：
- セキュリティ
- パフォーマンス
- 可読性
```

## 🚀 推奨ワークフロー

### 1. コードベース理解（新規プロジェクト参加時）

**段階的アプローチ：**

```
1. "give me an overview of this codebase"
2. "explain the main architecture patterns"
3. "show me how [specific feature] works"
```

### 2. バグ修正

**手順：**

```
1. エラーメッセージを共有
2. "suggest a few ways to fix" で複数案を検討
3. 最適な解決策を選択して適用
```

### 3. コード改善

**レガシーコード対応：**

```
1. 非推奨APIを特定
2. 現代的なパターンへの移行計画
3. 段階的にリファクタリング
```

### 4. 複雑な変更（Plan Mode活用）

**安全な変更手順：**

```bash
# Plan Modeで実行計画を確認
Shift+Tab を2回押す

# プロンプト例
"Refactor the authentication system to use JWT"

# 実行計画を確認してから承認
```

## 💡 ベストプラクティス

### 1. 段階的質問

❌ **悪い例：**
```
「アプリ全体を最適化して」
```

✅ **良い例：**
```
1. "Show me performance bottlenecks"
2. "Optimize the database queries in UserRepository"
3. "Add caching to the most accessed endpoints"
```

### 2. 計画モードの活用

複雑な変更は必ずPlan Modeで確認：

```
Shift+Tab を2回 → 変更計画確認 → 承認
```

### 3. 拡張思考モード

複雑な設計判断時に使用：

```
"think about the best architecture for this feature"
"think hard about potential security issues"
```

### 4. Git worktree で並列作業

```bash
git worktree add ../feature-branch feature-branch
cd ../feature-branch
claude
```

### 5. ファイル単位での作業指示

❌ **悪い例：**
```
「コードを修正して」
```

✅ **良い例：**
```
"Edit app/Domain/Blog/Entities/Article.php:
Add a new method to validate article status"
```

### 6. コミットメッセージの明確化

各実装単位で意味のあるコミットを作成：

```
feat: Domain層のバリューオブジェクトを実装
feat: Application層のユースケースを実装
docs: プロジェクトドキュメントを追加
```

### 7. トークン使用量の最適化

- 必要最小限のコード生成
- 長い出力は避ける
- `/cost`で定期的に確認

## 📝 メモリ機能の活用

### プロジェクトメモリ（チーム共有）

```
./CLAUDE.md
./.claude/commands/
./.claude/*.md
```

### 個人メモリ

```
~/.claude/CLAUDE.md
```

### メモリ追加方法

```bash
# 対話中にメモ追加
"add this to memory: Use PostgreSQL for production"

# または
/memory
```

## 🔒 セキュリティベストプラクティス

### 1. 機密情報の扱い

- `.env`ファイルは必ずGitignore
- APIキーは環境変数で管理
- 生成されたコードは必ずレビュー

### 2. コード生成時の注意

- SQLインジェクション対策を確認
- XSS対策を確認
- 認証・認可の実装を検証

### 3. Auto-acceptモードの使い分け

- 信頼できる操作のみ使用
- 本番環境への変更は手動確認

## 🎨 効率的な使い方のTips

### 1. 並列ツール実行

複数の独立したツール呼び出しは並列で：

```
"Read all files in src/ and summarize each"
→ Claudeが自動的に並列実行
```

### 2. コンテキスト管理

```bash
/context  # 現在のコンテキスト使用状況を確認
/cost     # トークン使用量を確認
```

### 3. 長時間実行コマンド

```bash
Ctrl+B    # バックグラウンド実行
/bashes   # 実行中のプロセス確認
```

### 4. 画像の活用

```
Ctrl+V (Mac/Linux) または Alt+V (Windows)
# スクリーンショットを貼り付けてUI相談
```

### 5. ファイル検索の最適化

```bash
# 特定のファイルを探す
"Find all files matching pattern *.tsx"

# コード内検索
"Search for function definitions containing 'authenticate'"
```

## 📚 プロジェクト構成のベストプラクティス

### 推奨ディレクトリ構造

```
your-project/
├── CLAUDE.md                    # プロジェクトメモリ
├── .claude/
│   ├── commands/               # カスタムコマンド
│   │   ├── review.md
│   │   └── test.md
│   ├── architecture.md         # アーキテクチャドキュメント
│   ├── api-guide.md           # API設計
│   └── conventions.md         # コーディング規約
└── README.md
```

### CLAUDE.mdの推奨構成

```markdown
# プロジェクト名

## プロジェクト概要
- 目的と背景
- 主要な技術スタック

## アーキテクチャ
- 設計パターン
- ディレクトリ構造

## 開発環境
- セットアップ手順
- 必要なツール

## コーディング規約
- 言語固有のルール
- チーム内のベストプラクティス

## このプロジェクトでの作業方針
- Claude Codeへの具体的な指示
- 避けるべきパターン
```

## 🌟 実践例：DDDブログアプリ開発

このプロジェクトで実践したベストプラクティス：

### 1. プロジェクトメモリの活用

```
✅ CLAUDE.mdで方針明示
✅ .claude/にアーキテクチャドキュメント
✅ API設計とUIパターンを文書化
```

### 2. 段階的実装

```
Domain層（ビジネスロジック）
↓
Infrastructure層（技術実装）
↓
Application層（ユースケース）
↓
Presentation層（API）
```

### 3. 意味のあるコミット

```bash
feat: Domain層のバリューオブジェクトを実装
feat: Domain層のArticleエンティティを実装
feat: Infrastructure層のEloquentモデルとリポジトリ実装
feat: Application層のユースケースを実装
feat: Presentation層のコントローラーとAPIルーティング
docs: プロジェクトドキュメントを追加
```

### 4. トークン節約

- 必要最小限のコード生成
- コメントは最小限に
- 冗長な説明を避ける

## 🎓 学習リソース

### 公式ドキュメント

- [Common Workflows](https://code.claude.com/docs/en/common-workflows.md)
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode.md)
- [Slash Commands](https://code.claude.com/docs/en/slash-commands.md)
- [Memory](https://code.claude.com/docs/en/memory.md)
- [Security](https://code.claude.com/docs/en/security.md)

### よくある質問

**Q: Auto-acceptモードはいつ使うべき？**
A: 信頼できる小さな変更（フォーマット、簡単なリファクタリング）のみ。本番環境への変更は必ず手動確認。

**Q: Plan Modeとの使い分けは？**
A: 複雑な変更、複数ファイルに跨る変更、重要な機能追加はPlan Modeで計画確認後に実行。

**Q: トークン使用量を抑えるには？**
A:
- 段階的に質問する
- 必要なファイルのみを指定
- 長い出力を避ける
- `/cost`で定期確認

**Q: カスタムコマンドの活用例は？**
A:
- コードレビュー自動化
- テストケース生成
- ドキュメント更新
- プロジェクト固有のチェック

## 💼 チーム開発でのTips

### 1. カスタムコマンドの共有

```bash
# プロジェクトリポジトリに含める
.claude/commands/review-pr.md
.claude/commands/generate-test.md
```

### 2. CLAUDE.mdでチーム規約を明示

```markdown
## チーム開発ルール

- コミットメッセージは日本語
- PRには必ずテストを含める
- セキュリティチェックは必須
```

### 3. 統一されたプロンプトスタイル

チーム内で統一されたプロンプトスタイルを使用：

```
"Implement [feature] following our DDD architecture"
"Review this code for security issues"
"Generate tests for [component]"
```

## 🔄 継続的な改善

### 定期的な見直し

- トークン使用量の分析（`/cost`）
- よく使うパターンをカスタムコマンド化
- CLAUDE.mdの更新

### フィードバックループ

```
1. Claude Codeで開発
2. 問題点や改善点を記録
3. CLAUDE.mdに反映
4. チームで共有
```

---

## 📌 クイックリファレンス

### 最も使うコマンド

```bash
Shift+Tab (2回)  # Plan Mode
Ctrl+C           # 中止
/cost            # トークン確認
/context         # コンテキスト確認
/clear           # 履歴クリア
@filename        # ファイル指定
```

### よくあるプロンプト

```
"Explain this codebase"
"Fix this error: [error message]"
"Refactor [file] to improve readability"
"Generate tests for [component]"
"Review this code for security issues"
"think about the best approach for [problem]"
```

---

**最終更新**: 2025-11-07
**バージョン**: 1.0
