# アーキテクチャガイド

このドキュメントは、ブログアプリケーションのアーキテクチャ設計の詳細を説明します。

## アーキテクチャ概要

このアプリケーションは**ドメイン駆動設計（DDD）**の原則に基づいた**レイヤードアーキテクチャ**を採用しています。

```
┌─────────────────────────────────────────┐
│       Presentation Layer                │  ← ユーザーインターフェース
│  (Controllers, Requests, Resources)     │
└─────────────────┬───────────────────────┘
                  │ 依存
┌─────────────────▼───────────────────────┐
│       Application Layer                 │  ← ユースケース
│       (UseCases, DTOs)                  │
└─────────────────┬───────────────────────┘
                  │ 依存
┌─────────────────▼───────────────────────┐
│       Domain Layer                      │  ← ビジネスロジック
│  (Entities, ValueObjects, Repositories) │  ← 他の層に依存しない
└─────────────────▲───────────────────────┘
                  │ 実装
┌─────────────────┴───────────────────────┐
│       Infrastructure Layer              │  ← 技術的実装
│  (Eloquent, Repositories, External)     │
└─────────────────────────────────────────┘
```

## 依存関係のルール

### 依存の方向（Dependency Rule）

**外側の層は内側の層に依存できるが、内側の層は外側の層に依存してはいけない**

```
Presentation → Application → Domain ← Infrastructure
                                ↑
                        (インターフェースのみ)
```

### 依存性の逆転原則（DIP）

- Domain層は**インターフェース**のみを定義
- Infrastructure層がそのインターフェースを**実装**
- DIコンテナで依存を注入

```php
// Domain層: インターフェース定義
interface ArticleRepositoryInterface {
    public function save(Article $article): void;
}

// Infrastructure層: 実装
class EloquentArticleRepository implements ArticleRepositoryInterface {
    public function save(Article $article): void { /* ... */ }
}

// AppServiceProvider.php: 依存注入
$this->app->bind(
    ArticleRepositoryInterface::class,
    EloquentArticleRepository::class
);
```

## 各層の詳細

### 1. Domain層（ドメイン層）

**場所**: `app/Domain/Blog/`

**責任**: ビジネスロジックとルールの表現

#### Entities（エンティティ）

**定義**: ライフサイクルを通じて同一性を持つオブジェクト

```php
namespace App\Domain\Blog\Entities;

class Article
{
    private ArticleId $id;
    private ArticleTitle $title;
    private ArticleContent $content;
    private \DateTimeImmutable $createdAt;

    public function __construct(
        ArticleId $id,
        ArticleTitle $title,
        ArticleContent $content,
        \DateTimeImmutable $createdAt
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->content = $content;
        $this->createdAt = $createdAt;
    }

    // ビジネスロジックをここに含める
    public function changeTitle(ArticleTitle $newTitle): Article
    {
        return new Article(
            $this->id,
            $newTitle,
            $this->content,
            $this->createdAt
        );
    }
}
```

#### ValueObjects（バリューオブジェクト）

**定義**: 不変の値を表現し、等価性は値の内容で判断

**特徴**:
- 不変（Immutable）
- バリデーションロジックを含む
- 等価性メソッド（equals）を実装

```php
namespace App\Domain\Blog\ValueObjects;

final class ArticleTitle
{
    private string $value;

    public function __construct(string $value)
    {
        $this->validate($value);
        $this->value = $value;
    }

    private function validate(string $value): void
    {
        $length = mb_strlen($value);
        if ($length < 1 || $length > 100) {
            throw new \InvalidArgumentException(
                'タイトルは1文字以上100文字以内である必要があります'
            );
        }
    }

    public function value(): string
    {
        return $this->value;
    }

    public function equals(?ArticleTitle $other): bool
    {
        return $other !== null && $this->value === $other->value();
    }
}
```

#### Repositories（リポジトリインターフェース）

**定義**: ドメインオブジェクトのコレクションの抽象化

```php
namespace App\Domain\Blog\Repositories;

interface ArticleRepositoryInterface
{
    public function save(Article $article): void;
    public function findById(ArticleId $id): ?Article;
    public function findAll(): array;
    public function delete(ArticleId $id): void;
}
```

### 2. Application層（アプリケーション層）

**場所**: `app/Application/Blog/UseCases/`

**責任**: ユースケースの調整とトランザクション管理

#### UseCases（ユースケース）

**定義**: 1つのビジネスユースケースを表現

**特徴**:
- ドメインオブジェクトを組み合わせる
- トランザクション境界を定義
- ビジネスロジックは書かない

```php
namespace App\Application\Blog\UseCases;

class CreateArticleUseCase
{
    private ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function execute(string $title, string $content): void
    {
        // ドメインオブジェクトの生成
        $article = new Article(
            new ArticleId(0), // 新規作成時は0
            new ArticleTitle($title),
            new ArticleContent($content),
            new \DateTimeImmutable()
        );

        // リポジトリ経由で永続化
        $this->articleRepository->save($article);
    }
}
```

### 3. Infrastructure層（インフラストラクチャ層）

**場所**: `app/Infrastructure/Blog/`

**責任**: 技術的な実装の詳細

#### Eloquent Models

**定義**: データベーステーブルとのマッピング

```php
namespace App\Infrastructure\Blog\Eloquent;

use Illuminate\Database\Eloquent\Model;

class ArticleModel extends Model
{
    protected $table = 'articles';

    protected $fillable = [
        'title',
        'content',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
```

#### Repository実装

**定義**: ドメインリポジトリインターフェースの具体的実装

```php
namespace App\Infrastructure\Blog\Repositories;

class EloquentArticleRepository implements ArticleRepositoryInterface
{
    public function save(Article $article): void
    {
        ArticleModel::create([
            'title' => $article->getTitle()->value(),
            'content' => $article->getContent()->value(),
        ]);
    }

    public function findById(ArticleId $id): ?Article
    {
        $model = ArticleModel::find($id->value());

        if (!$model) {
            return null;
        }

        return $this->toDomain($model);
    }

    private function toDomain(ArticleModel $model): Article
    {
        return new Article(
            new ArticleId($model->id),
            new ArticleTitle($model->title),
            new ArticleContent($model->content),
            new \DateTimeImmutable($model->created_at)
        );
    }
}
```

### 4. Presentation層（プレゼンテーション層）

**場所**: `app/Presentation/Blog/Controllers/`

**責任**: HTTPリクエスト/レスポンスの処理

#### Controllers

**定義**: HTTPリクエストを受け取り、ユースケースを呼び出す

```php
namespace App\Presentation\Blog\Controllers;

use App\Application\Blog\UseCases\CreateArticleUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController
{
    private CreateArticleUseCase $createArticleUseCase;

    public function __construct(CreateArticleUseCase $createArticleUseCase)
    {
        $this->createArticleUseCase = $createArticleUseCase;
    }

    public function store(Request $request): JsonResponse
    {
        // バリデーション
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
        ]);

        // ユースケース実行
        $this->createArticleUseCase->execute(
            $validated['title'],
            $validated['content']
        );

        return response()->json(['message' => '記事を作成しました'], 201);
    }
}
```

## データフロー

### 記事作成のフロー例

```
1. HTTPリクエスト
   ↓
2. Controller (Presentation層)
   - リクエストのバリデーション
   - UseCaseの呼び出し
   ↓
3. UseCase (Application層)
   - ドメインオブジェクトの生成
   - リポジトリの呼び出し
   ↓
4. Repository Interface (Domain層)
   - 抽象的なデータアクセス
   ↓
5. Repository Implementation (Infrastructure層)
   - Eloquentを使ったDB操作
   - ドメインオブジェクト ⇄ Eloquentモデルの変換
   ↓
6. Database
```

### コード例: 完全なフロー

```php
// 1. Presentation層 - Controller
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'title' => 'required|string|max:100',
        'content' => 'required|string',
    ]);

    $this->createArticleUseCase->execute(
        $validated['title'],
        $validated['content']
    );

    return response()->json(['message' => '記事を作成しました'], 201);
}

// 2. Application層 - UseCase
public function execute(string $title, string $content): void
{
    $article = new Article(
        new ArticleId(0),
        new ArticleTitle($title),
        new ArticleContent($content),
        new \DateTimeImmutable()
    );

    $this->articleRepository->save($article);
}

// 3. Infrastructure層 - Repository
public function save(Article $article): void
{
    ArticleModel::create([
        'title' => $article->getTitle()->value(),
        'content' => $article->getContent()->value(),
    ]);
}
```

## トランザクション管理

### 基本方針

- **Application層のUseCaseがトランザクション境界**
- Laravelの`DB::transaction()`を使用

```php
public function execute(string $title, string $content): void
{
    DB::transaction(function () use ($title, $content) {
        $article = new Article(
            new ArticleId(0),
            new ArticleTitle($title),
            new ArticleContent($content),
            new \DateTimeImmutable()
        );

        $this->articleRepository->save($article);
    });
}
```

## エラーハンドリング

### 層ごとのエラー処理

#### Domain層

- ドメインルール違反は**例外**をスロー
- カスタム例外クラスを定義

```php
namespace App\Domain\Blog\Exceptions;

class InvalidArticleTitleException extends \DomainException
{
    public static function tooLong(int $length): self
    {
        return new self("タイトルが長すぎます（{$length}文字）");
    }
}
```

#### Application層

- ドメイン例外をキャッチして適切に処理
- ユースケース固有の例外をスロー

#### Presentation層

- アプリケーション例外をHTTPレスポンスに変換
- 適切なステータスコードを返す

```php
public function store(Request $request): JsonResponse
{
    try {
        $this->createArticleUseCase->execute(
            $request->input('title'),
            $request->input('content')
        );

        return response()->json(['message' => '記事を作成しました'], 201);
    } catch (InvalidArticleTitleException $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}
```

## テスト戦略

### 層ごとのテスト

| 層 | テストタイプ | 目的 | モック対象 |
|---|------------|-----|----------|
| Domain | ユニットテスト | ビジネスロジック検証 | なし（純粋） |
| Application | ユニットテスト | ユースケース検証 | Repository |
| Infrastructure | 統合テスト | DBアクセス検証 | なし（実DB使用） |
| Presentation | フィーチャーテスト | E2E検証 | なし（全層） |

### テスト例

```php
// Domain層のテスト
class ArticleTitleTest extends TestCase
{
    public function test_valid_title_can_be_created(): void
    {
        $title = new ArticleTitle('有効なタイトル');
        $this->assertEquals('有効なタイトル', $title->value());
    }

    public function test_too_long_title_throws_exception(): void
    {
        $this->expectException(InvalidArgumentException::class);
        new ArticleTitle(str_repeat('あ', 101));
    }
}
```

## パフォーマンス考慮事項

### N+1問題の回避

- Eloquentのリレーション読み込みを最適化
- `with()`, `load()`を適切に使用

### キャッシュ戦略

- Application層でキャッシュを実装
- リポジトリをキャッシュでラップ

## まとめ

このアーキテクチャの利点：

1. **保守性**: 各層の責任が明確
2. **テスタビリティ**: 層ごとに独立してテスト可能
3. **柔軟性**: フレームワークやDBの変更に強い
4. **理解しやすさ**: ビジネスロジックがドメイン層に集約

ドメイン駆動設計の原則を守ることで、長期的に保守しやすいコードベースを維持できます。
