# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは、AIコーディングツールの学習と実践を目的とした教育用プロジェクトです。主にClaude CodeとModel Context Protocol（MCP）の習得に焦点を当てています。

## 基本的なコマンド

### Claude Code操作
```bash
# Claude Codeの対話モードを開始
claude

# バージョン確認
claude-code --version

# 設定初期化
/init
```

### PHP実行
```bash
# サンプルコードの実行
php claude-code/sample/hello.php
```

### Git操作
```bash
# 現在のブランチ: init/claude-code
# メインブランチ: main
git status
git log --oneline
```

## アーキテクチャ構造

### ディレクトリ構成の特徴
- **`claude-code/`**: Claude Codeの学習教材とサンプルコード
  - 詳細なセットアップガイド（スクリーンショット付き）
  - PHPでのFizzBuzz実装例（if文からswitch文への段階的リファクタリング）
  - 3つのモード（標準、auto-accept、plan mode）の実用例
- **`mcp/`**: Model Context Protocolの学習教材
- **学習主導設計**: 実践的な例とビジュアルガイドを重視

### Claude Codeのモード理解
1. **標準モード**: 手動承認が必要な基本モード
2. **Auto-acceptモード** (`shift + tab` 1回): 自動でコード変更を承認
3. **Plan Mode** (`shift + tab` 2回): 変更前に詳細な実行計画を表示

### コードの品質パターン
- **段階的リファクタリング**: `hello.php`でif文からswitch文への進化を実演
- **定数の活用**: `FIZZ_DIVISOR`、`BUZZ_DIVISOR`などの意味のある定数名
- **関数の責任分離**: 単一責任の原則に従った関数設計

## 開発環境設定

### システム要件（ドキュメント化済み）
- **OS**: macOS Sonoma 14.5
- **Node.js**: v22.2.0
- **npm**: 10.7.0
- **Claude Code**: v1.0.25

### メモリ管理システム
Claude Codeの3つのメモリタイプに対応：
- **Project Memory**: `./CLAUDE.md`（このファイル）
- **User Memory**: `~/.claude/CLAUDE.md`（個人設定）
- **Project Memory Local**: `./CLAUDE.local.md`（個人的なプロジェクト設定）

## 学習目標とコーディング方針

### 教育重視のアプローチ
- **ドキュメント駆動開発**: 詳細なセットアップガイドとビジュアル教材
- **実践的サンプル**: 段階的な改善を示すコード例
- **AIツール統合**: 実際のワークフローでのAI活用方法

### セキュリティ考慮事項
- AIが生成したコードは必ず確認してから実行
- プロンプトインジェクションリスクのため、信頼できるコードでのみ使用
- 参考: [Claude Code Security](https://docs.anthropic.com/s/claude-code-security)

## 言語・フレームワーク固有の注意点

### PHP開発
- モダンなPHP実践（定数の使用、switch文の活用）
- `php` コマンドでサンプルコードを直接実行可能
- エラーハンドリングとコードの可読性を重視

### ドキュメント作成
- 日本語を主言語とした技術文書
- ステップバイステップのセットアップガイド
- スクリーンショットを含むビジュアル説明

## このプロジェクトでの作業方針

- **学習を優先**: 本番環境よりも教育的価値を重視
- **段階的改善**: 基本的な実装から高度な技術への発展を示す
- **ドキュメント維持**: 既存の詳細なガイドラインを保持
- **バイリンガル対応**: 日本語主体で英語も併記
- **ビジュアル重視**: セットアップ過程のスクリーンショットを活用