# CLAUDE.md

このファイルは、Claude Codeがこのプロジェクトで作業する際のガイドラインを提供します。

## プロジェクト概要

**ブログアプリケーション（DDD学習用）**

このプロジェクトは、ドメイン駆動設計（DDD）の学習と実践を目的としたLaravelベースのブログアプリケーションです。DDDの主要な概念とベストプラクティスを最小構成で実装し、初心者がDDDを理解しやすい構造を目指しています。

### 技術スタック

- **フレームワーク**: Laravel 10.49.1
- **PHP**: 8.1.5
- **アーキテクチャ**: ドメイン駆動設計（DDD）
- **パッケージマネージャー**: Composer 2.4.1

## ドメイン駆動設計（DDD）アーキテクチャ

このプロジェクトは、DDDの4層アーキテクチャを採用しています：

```
app/
├── Domain/              # ドメイン層 - ビジネスロジックの中核
├── Application/         # アプリケーション層 - ユースケースの実装
├── Infrastructure/      # インフラストラクチャ層 - 技術的な実装
└── Presentation/        # プレゼンテーション層 - ユーザーインターフェース
```

### 各層の責任と原則

#### 1. Domain層（ドメイン層）
**責任**: ビジネスロジックとビジネスルールの表現

- **Entities（エンティティ）**: 一意の識別子を持つビジネスオブジェクト
  - ライフサイクルを通じて同一性を保持
  - ビジネスルールを含む
  - 例: `Article`（記事エンティティ）

- **ValueObjects（バリューオブジェクト）**: 不変の値を表現するオブジェクト
  - 等価性は値の内容で判断
  - 不変性（Immutable）を保証
  - 例: `ArticleId`, `ArticleTitle`, `ArticleContent`

- **Repositories（リポジトリインターフェース）**: データアクセスの抽象化
  - インターフェースのみを定義（実装はInfrastructure層）
  - ドメインオブジェクトのコレクションとして扱う
  - 例: `ArticleRepositoryInterface`

**重要な原則**:
- 他の層に依存しない（依存関係の逆転原則）
- フレームワークに依存しない純粋なビジネスロジック
- データベースやHTTPリクエストの知識を持たない

#### 2. Application層（アプリケーション層）
**責任**: ユースケースの調整とトランザクション管理

- **UseCases（ユースケース）**: 1つのユースケースを表現するクラス
  - ドメインオブジェクトを組み合わせてビジネスフローを実現
  - トランザクション境界を定義
  - 例: `CreateArticleUseCase`, `GetArticleUseCase`

**重要な原則**:
- ドメイン層のオブジェクトを組み合わせて使用
- ビジネスロジックは書かない（Domain層の責任）
- インフラストラクチャの詳細を知らない

#### 3. Infrastructure層（インフラストラクチャ層）
**責任**: 技術的な実装の詳細

- **Repositories（リポジトリ実装）**: Domain層のインターフェースを実装
  - Eloquentを使用した具体的なデータアクセス
  - ドメインオブジェクトとデータベースの変換
  - 例: `EloquentArticleRepository`

- **Eloquent（Eloquentモデル）**: データベースとのマッピング
  - LaravelのEloquent ORMを使用
  - Infrastructure層に閉じ込める
  - 例: `ArticleModel`

**重要な原則**:
- Domain層のインターフェースに依存
- フレームワーク固有の技術を含む
- リポジトリパターンでドメイン層を技術から保護

#### 4. Presentation層（プレゼンテーション層）
**責任**: ユーザーインターフェースとリクエスト/レスポンスの処理

- **Controllers（コントローラー）**: HTTPリクエストの処理
  - リクエストからデータを取得
  - Application層のユースケースを呼び出し
  - レスポンスを生成
  - 例: `ArticleController`

**重要な原則**:
- Application層のユースケースを呼び出すのみ
- ビジネスロジックを書かない
- HTTPの知識のみを持つ

## ディレクトリ構造

```
app/
├── Domain/
│   └── Blog/
│       ├── Entities/           # エンティティ
│       │   └── Article.php
│       ├── ValueObjects/       # バリューオブジェクト
│       │   ├── ArticleId.php
│       │   ├── ArticleTitle.php
│       │   └── ArticleContent.php
│       └── Repositories/       # リポジトリインターフェース
│           └── ArticleRepositoryInterface.php
├── Application/
│   └── Blog/
│       └── UseCases/           # ユースケース
│           ├── CreateArticleUseCase.php
│           ├── GetArticleUseCase.php
│           └── ListArticlesUseCase.php
├── Infrastructure/
│   └── Blog/
│       ├── Eloquent/           # Eloquentモデル
│       │   └── ArticleModel.php
│       └── Repositories/       # リポジトリ実装
│           └── EloquentArticleRepository.php
└── Presentation/
    └── Blog/
        └── Controllers/        # コントローラー
            └── ArticleController.php
```

## DDDのベストプラクティス

### 1. 不変性（Immutability）
- バリューオブジェクトは不変にする
- 状態の変更は新しいオブジェクトを生成して返す

```php
// Good - 新しいオブジェクトを返す
public function changeTitle(ArticleTitle $newTitle): Article
{
    return new Article($this->id, $newTitle, $this->content);
}
```

### 2. ドメインロジックの集約
- エンティティとバリューオブジェクトにビジネスルールを含める
- サービス層に安易にロジックを書かない

```php
// Good - エンティティにビジネスルールを含める
class ArticleTitle
{
    public function __construct(string $value)
    {
        if (mb_strlen($value) < 1 || mb_strlen($value) > 100) {
            throw new InvalidArgumentException('タイトルは1文字以上100文字以内である必要があります');
        }
    }
}
```

### 3. 依存性の逆転原則（DIP）
- Domain層はインターフェースのみを定義
- Infrastructure層が実装を提供
- DIコンテナで結合

```php
// AppServiceProvider.php
$this->app->bind(
    ArticleRepositoryInterface::class,
    EloquentArticleRepository::class
);
```

### 4. ユビキタス言語
- ビジネスドメインの用語をコードに反映
- 日本語のビジネス用語も明確に定義

### 5. 集約の設計
- 関連するオブジェクトをグループ化
- トランザクション境界を明確に
- 現在は `Article` 集約のみ（最小構成）

## 開発の進め方

### コーディング順序
1. **Domain層から実装** - ビジネスロジックを先に確立
2. **Application層** - ユースケースの実装
3. **Infrastructure層** - 技術的な実装
4. **Presentation層** - UIとリクエスト処理

### テスト戦略
- Domain層: ユニットテスト（ビジネスロジックの検証）
- Application層: ユニットテスト（ユースケースの検証）
- Infrastructure層: 統合テスト（DBアクセスの検証）
- Presentation層: フィーチャーテスト（E2Eテスト）

## 開発環境

### セットアップ
```bash
# 依存関係のインストール
composer install

# 環境ファイルのコピー
cp .env.example .env

# アプリケーションキーの生成
php artisan key:generate

# データベースのマイグレーション
php artisan migrate

# 開発サーバーの起動
php artisan serve
```

### データベース
- SQLite使用（開発環境）
- マイグレーションは `database/migrations/` に配置

## このプロジェクトでの作業方針

### Claude Codeへの指示

1. **DDDの原則を厳守**
   - 各層の責任を明確に分離
   - Domain層をフレームワークから独立させる
   - 依存の方向を守る（外側から内側へ）

2. **段階的な実装**
   - Domain層から実装を開始
   - 各層を順番に完成させる
   - 一度に全てを実装しない

3. **コードの品質**
   - 型宣言を厳格に使用（`declare(strict_types=1);`）
   - 明確なクラス・メソッド名
   - 適切なPHPDocコメント
   - バリデーションとエラーハンドリング

4. **学習教材として**
   - コードにコメントで説明を追加
   - DDDパターンの意図を明確に
   - 初心者が理解しやすい実装

5. **最小構成を維持**
   - 必要最小限の機能のみ実装
   - 複雑な機能は避ける
   - 基本的なCRUD操作に焦点

## 現在の実装状況

- ✅ Laravelプロジェクトのセットアップ完了
- ✅ DDDディレクトリ構造の作成完了
- ⏸️ Domain層の実装（次のステップ）
- ⏸️ Application層の実装
- ⏸️ Infrastructure層の実装
- ⏸️ Presentation層の実装
- ⏸️ マイグレーションとシーダー

## 参考資料

### DDD関連
- エリック・エヴァンス『ドメイン駆動設計』
- Vernon Vaughn『実践ドメイン駆動設計』

### Laravel関連
- [Laravel 10.x 公式ドキュメント](https://laravel.com/docs/10.x)
- [Laravel リポジトリパターン](https://laravel.com/docs/10.x/repository)

## 注意事項

- このプロジェクトは学習目的です
- 本番環境での使用を想定していません
- DDDの概念理解を最優先にしています
- パフォーマンスよりも理解しやすさを重視
