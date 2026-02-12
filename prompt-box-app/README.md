# お題ボックス (Prompt Box App)

お題を共有して、みんなで回答を楽しむシンプルなWebアプリケーションです。

## 機能

- **お題の追加**: 参加者が自由にお題を投稿できます
- **回答の投稿**: 各お題に対して複数の回答を投稿できます
- **リアルタイム表示**: お題と回答をリアルタイムで確認できます
- **ローカルストレージ**: ブラウザのローカルストレージにデータを保存します
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップに対応
- **ダークモード対応**: システムの設定に応じて自動的に切り替わります

## 技術スタック

このアプリは最新のフロントエンドベストプラクティスに基づいて構築されています：

- **[Next.js 14](https://nextjs.org/)** - React ベースのフルスタックフレームワーク（App Router使用）
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全性を提供
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストのCSSフレームワーク
- **React Server Components** - 最新のReactアーキテクチャパターン
- **ESLint** - コード品質の維持

## セットアップ

### 前提条件

- Node.js 18.17以降
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを確認できます。

## 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# 本番用ビルド
npm run build

# 本番サーバーの起動
npm start

# リントチェック
npm run lint
```

## Vercelへのデプロイ

このアプリはVercelへのデプロイに最適化されています：

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com/new)にアクセス
3. リポジトリをインポート
4. デプロイボタンをクリック

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/prompt-box-app)

## プロジェクト構造

```
prompt-box-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── PromptForm.tsx    # お題追加フォーム
│   ├── PromptCard.tsx    # お題カード
│   └── PromptList.tsx    # お題リスト
├── lib/                   # ユーティリティ
│   ├── types.ts          # TypeScript型定義
│   └── storage.ts        # ローカルストレージ管理
└── public/               # 静的ファイル
```

## 使い方

1. **お題を追加**: フォームにお題と名前を入力して「お題を追加」ボタンをクリック
2. **回答する**: お題カードの「回答する」ボタンをクリックして回答を投稿
3. **回答を見る**: 「回答を見る」ボタンで他の人の回答を確認
4. **削除**: 不要なお題は削除アイコンで削除できます

## Claude Code ベストプラクティス

このプロジェクトは[Claude Codeのベストプラクティス](https://code.claude.com/docs/en/best-practices)に基づいて構築されています：

- ✅ TypeScriptによる型安全性
- ✅ ESモジュール構文の使用
- ✅ コンポーネントの責任分離
- ✅ レスポンシブデザイン
- ✅ アクセシビリティ対応
- ✅ モダンなReactパターン（Hooks、Server Components）

## ライセンス

MIT

## 作成者

Claude Code で作成
