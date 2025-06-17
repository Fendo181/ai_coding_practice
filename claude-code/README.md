### はじめに

ClaudeCodeを使うにあたって、自分用にセットアップ方法をまとめます。
注意として、この記事は`2025/06/17`時点の情報を参考にして執筆しています。
ここに書いている内容がアップデートされている可能性がある為、更新の最新の記事を参考にしてください。

実行環境について以下に乗せておきます。

| 項目 | 内容 |
| ---- | ---- |
| OS | macOS Sonoma 14.5 |
| node | v22.2.0 |
| npm | 10.7.0 |


### Claude Codeとは

>Claude Codeは、ターミナル上で動作し、コードベースを理解し、自然言語コマンドを通じてより速くコーディングできるようサポートするエージェント型コーディングツールです。開発環境に直接統合することで、追加のサーバーや複雑なセットアップを必要とせずにワークフローを効率化します
ref: [Claude Code](https://claude.ai/claude-code)

特徴としては以下があげられます。

- **コード生成**: 自然言語の指示からコードを生成する能力があります。例えば、特定の機能を実装するためのコードを自動的に生成できます。
- **コードの理解**: 既存のコードを解析し、コメントやドキュメントを生成することができます。これにより、コードの可読性と保守性が向上します。
- **デバッグ支援**: コードのバグを検出し、修正案を提案することができます。これにより、開発者は迅速に問題を解決できます。


### セットアップ方法について

作業用フォルダを作成します。

```bash
mkdir claude-code
cd claude-code
```



### 参考

- [Claude Code 概要 - Anthropic](https://docs.anthropic.com/ja/docs/claude-code/overview)
- [Claude Codeを徹底解説してみた（前編） | DevelopersIO](https://dev.classmethod.jp/articles/get-started-claude-code-1/)
- [Claude Codeを徹底解説してみた（後編） | DevelopersIO](https://dev.classmethod.jp/articles/get-started-claude-code-2nd/)
- [Claude Code の settings.json は設定した方がいい - じゃあ、おうちで学べる](https://syu-m-5151.hatenablog.com/entry/2025/06/05/134147)
- [Claude Code の CLAUDE.mdは設定した方がいい - じゃあ、おうちで学べる](https://syu-m-5151.hatenablog.com/entry/2025/06/06/190847)