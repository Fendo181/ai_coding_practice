# DDDブログアプリケーション

ドメイン駆動設計（DDD）の学習を目的とした、Laravelベースのシンプルなブログアプリケーションです。

## 特徴

- **ドメイン駆動設計（DDD）**: 4層アーキテクチャ（Domain, Application, Infrastructure, Presentation）
- **REST API**: 記事のCRUD操作を提供
- **依存性の逆転原則**: インターフェースを通じた疎結合な設計
- **バリューオブジェクト**: 不変性とビジネスルールの徹底
- **学習重視**: コメント付きの分かりやすいコード

## アーキテクチャ

```
app/
├── Domain/              # ビジネスロジックの中核
│   └── Blog/
│       ├── Entities/           # Article
│       ├── ValueObjects/       # ArticleId, ArticleTitle, ArticleContent
│       └── Repositories/       # ArticleRepositoryInterface
├── Application/         # ユースケース
│   └── Blog/
│       └── UseCases/           # Create, Get, List, Update, Delete
├── Infrastructure/      # 技術的実装
│   └── Blog/
│       ├── Eloquent/           # ArticleModel
│       └── Repositories/       # EloquentArticleRepository
└── Presentation/        # ユーザーインターフェース
    └── Blog/
        └── Controllers/        # ArticleController
```

## セットアップ

### 必要環境

- PHP 8.1以上
- Composer
- SQLite または MySQL

### インストール手順

```bash
# 依存関係のインストール
composer install

# 環境ファイルのコピー
cp .env.example .env

# データベース設定（SQLiteの場合）
touch database/database.sqlite
# .envファイルで DB_CONNECTION=sqlite に変更

# アプリケーションキーの生成
php artisan key:generate

# マイグレーション実行
php artisan migrate

# 開発サーバー起動
php artisan serve
```

## API仕様

### エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/v1/articles` | 記事一覧取得 |
| GET | `/api/v1/articles/{id}` | 記事詳細取得 |
| POST | `/api/v1/articles` | 記事作成 |
| PUT | `/api/v1/articles/{id}` | 記事更新 |
| DELETE | `/api/v1/articles/{id}` | 記事削除 |

### 使用例

#### 記事作成

```bash
curl -X POST http://localhost:8000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "DDDの基礎",
    "content": "ドメイン駆動設計について..."
  }'
```

#### 記事一覧取得

```bash
curl http://localhost:8000/api/v1/articles
```

## プロジェクトドキュメント

詳細なドキュメントは以下を参照してください：

- **CLAUDE.md**: プロジェクト全体のガイドライン
- **.claude/architecture.md**: アーキテクチャ詳細
- **.claude/api-guide.md**: API設計ドキュメント
- **.claude/ui-patterns.md**: UIパターンガイド

## DDDの主要概念

### バリューオブジェクト

不変の値を表現し、ビジネスルールを含みます。

```php
final class ArticleTitle
{
    private string $value;

    public function __construct(string $value)
    {
        if (mb_strlen($value) < 1 || mb_strlen($value) > 100) {
            throw new InvalidArgumentException('タイトルは1-100文字');
        }
        $this->value = $value;
    }
}
```

### エンティティ

一意の識別子を持ち、ライフサイクルを通じて同一性を保持します。

```php
final class Article
{
    public function changeTitle(ArticleTitle $newTitle): self
    {
        return new self($this->id, $newTitle, $this->content, ...);
    }
}
```

### リポジトリパターン

データアクセスを抽象化し、ドメイン層を技術的詳細から保護します。

```php
// Domain層: インターフェース
interface ArticleRepositoryInterface {
    public function save(Article $article): Article;
}

// Infrastructure層: 実装
class EloquentArticleRepository implements ArticleRepositoryInterface {
    public function save(Article $article): Article { /* ... */ }
}
```

## 学習ポイント

このプロジェクトで学べること：

1. **層の責任分離**: 各層の役割を明確に理解
2. **依存性の逆転**: インターフェースを活用した設計
3. **ドメインモデリング**: ビジネスロジックのモデル化
4. **不変性**: バリューオブジェクトによる安全な設計
5. **クリーンアーキテクチャ**: フレームワークに依存しないビジネスロジック

## 技術スタック

- Laravel 10.49.1
- PHP 8.1.5
- SQLite / MySQL
- Composer 2.4.1

## ライセンス

MIT License

## 参考資料

- [エリック・エヴァンス『ドメイン駆動設計』](https://www.amazon.co.jp/dp/4798121967)
- [Laravel 10.x 公式ドキュメント](https://laravel.com/docs/10.x)
- [Claude Code 公式サイト](https://claude.com/code)
