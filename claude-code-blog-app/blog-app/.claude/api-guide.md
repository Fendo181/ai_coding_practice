# API ガイド

このドキュメントは、ブログアプリケーションのREST APIの設計と使用方法を説明します。

## API設計原則

### RESTful設計

- **リソース指向**: URLはリソースを表現
- **HTTPメソッド**: CRUD操作に対応
- **ステートレス**: 各リクエストは独立
- **統一されたインターフェース**: 一貫性のあるAPI設計

### APIバージョニング

現在のバージョン: `v1`

URLにバージョンを含める:
```
/api/v1/articles
```

## エンドポイント一覧

### 記事（Articles）

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| GET | `/api/v1/articles` | 記事一覧取得 | 不要 |
| GET | `/api/v1/articles/{id}` | 記事詳細取得 | 不要 |
| POST | `/api/v1/articles` | 記事作成 | 必要 |
| PUT | `/api/v1/articles/{id}` | 記事更新 | 必要 |
| DELETE | `/api/v1/articles/{id}` | 記事削除 | 必要 |

## エンドポイント詳細

### 1. 記事一覧取得

**エンドポイント**: `GET /api/v1/articles`

**説明**: 公開されている記事の一覧を取得します。

#### リクエスト

**クエリパラメータ**:

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|---|------|-----------|------|
| page | integer | No | 1 | ページ番号 |
| per_page | integer | No | 20 | 1ページあたりの件数 |
| sort | string | No | created_at | ソート項目 (created_at, title) |
| order | string | No | desc | ソート順 (asc, desc) |

**例**:
```bash
GET /api/v1/articles?page=1&per_page=10&sort=created_at&order=desc
```

#### レスポンス

**ステータスコード**: `200 OK`

**レスポンスボディ**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "DDDの基礎を学ぶ",
      "content": "ドメイン駆動設計について解説します...",
      "created_at": "2024-11-07T12:00:00Z",
      "updated_at": "2024-11-07T12:00:00Z"
    },
    {
      "id": 2,
      "title": "Laravelのベストプラクティス",
      "content": "Laravelで開発する際の推奨パターン...",
      "created_at": "2024-11-07T11:00:00Z",
      "updated_at": "2024-11-07T11:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 2,
    "last_page": 1
  }
}
```

---

### 2. 記事詳細取得

**エンドポイント**: `GET /api/v1/articles/{id}`

**説明**: 指定されたIDの記事を取得します。

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | integer | 記事ID |

**例**:
```bash
GET /api/v1/articles/1
```

#### レスポンス

**ステータスコード**: `200 OK`

**レスポンスボディ**:
```json
{
  "data": {
    "id": 1,
    "title": "DDDの基礎を学ぶ",
    "content": "ドメイン駆動設計について解説します...",
    "created_at": "2024-11-07T12:00:00Z",
    "updated_at": "2024-11-07T12:00:00Z"
  }
}
```

**エラーレスポンス**:

ステータスコード: `404 Not Found`
```json
{
  "error": {
    "message": "記事が見つかりません",
    "code": "ARTICLE_NOT_FOUND"
  }
}
```

---

### 3. 記事作成

**エンドポイント**: `POST /api/v1/articles`

**説明**: 新しい記事を作成します。

#### リクエスト

**ヘッダー**:
```
Content-Type: application/json
Authorization: Bearer {token}
```

**リクエストボディ**:
```json
{
  "title": "DDDの基礎を学ぶ",
  "content": "ドメイン駆動設計について解説します..."
}
```

**バリデーションルール**:

| フィールド | 型 | 必須 | ルール |
|-----------|---|------|--------|
| title | string | Yes | 1-100文字 |
| content | string | Yes | 1文字以上 |

#### レスポンス

**ステータスコード**: `201 Created`

**レスポンスボディ**:
```json
{
  "data": {
    "id": 3,
    "title": "DDDの基礎を学ぶ",
    "content": "ドメイン駆動設計について解説します...",
    "created_at": "2024-11-07T13:00:00Z",
    "updated_at": "2024-11-07T13:00:00Z"
  },
  "message": "記事を作成しました"
}
```

**エラーレスポンス**:

ステータスコード: `400 Bad Request` (バリデーションエラー)
```json
{
  "error": {
    "message": "バリデーションエラー",
    "code": "VALIDATION_ERROR",
    "details": {
      "title": [
        "タイトルは1文字以上100文字以内である必要があります"
      ]
    }
  }
}
```

ステータスコード: `401 Unauthorized` (認証エラー)
```json
{
  "error": {
    "message": "認証が必要です",
    "code": "UNAUTHORIZED"
  }
}
```

---

### 4. 記事更新

**エンドポイント**: `PUT /api/v1/articles/{id}`

**説明**: 既存の記事を更新します。

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | integer | 記事ID |

**ヘッダー**:
```
Content-Type: application/json
Authorization: Bearer {token}
```

**リクエストボディ**:
```json
{
  "title": "DDD実践ガイド（更新版）",
  "content": "実践的なドメイン駆動設計の手法..."
}
```

**バリデーションルール**:

| フィールド | 型 | 必須 | ルール |
|-----------|---|------|--------|
| title | string | Yes | 1-100文字 |
| content | string | Yes | 1文字以上 |

#### レスポンス

**ステータスコード**: `200 OK`

**レスポンスボディ**:
```json
{
  "data": {
    "id": 1,
    "title": "DDD実践ガイド（更新版）",
    "content": "実践的なドメイン駆動設計の手法...",
    "created_at": "2024-11-07T12:00:00Z",
    "updated_at": "2024-11-07T14:00:00Z"
  },
  "message": "記事を更新しました"
}
```

**エラーレスポンス**:

ステータスコード: `404 Not Found`
```json
{
  "error": {
    "message": "記事が見つかりません",
    "code": "ARTICLE_NOT_FOUND"
  }
}
```

---

### 5. 記事削除

**エンドポイント**: `DELETE /api/v1/articles/{id}`

**説明**: 指定されたIDの記事を削除します。

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|---|------|
| id | integer | 記事ID |

**ヘッダー**:
```
Authorization: Bearer {token}
```

**例**:
```bash
DELETE /api/v1/articles/1
```

#### レスポンス

**ステータスコード**: `200 OK`

**レスポンスボディ**:
```json
{
  "message": "記事を削除しました"
}
```

**エラーレスポンス**:

ステータスコード: `404 Not Found`
```json
{
  "error": {
    "message": "記事が見つかりません",
    "code": "ARTICLE_NOT_FOUND"
  }
}
```

## レスポンス形式

### 成功レスポンス

#### 単一リソース

```json
{
  "data": {
    // リソースデータ
  },
  "message": "操作が成功しました" // オプション
}
```

#### 複数リソース（ページネーション）

```json
{
  "data": [
    // リソース配列
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10
  }
}
```

### エラーレスポンス

```json
{
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE",
    "details": {
      // 詳細情報（オプション）
    }
  }
}
```

### エラーコード一覧

| コード | ステータス | 説明 |
|-------|-----------|------|
| VALIDATION_ERROR | 400 | バリデーションエラー |
| UNAUTHORIZED | 401 | 認証エラー |
| FORBIDDEN | 403 | 権限エラー |
| ARTICLE_NOT_FOUND | 404 | 記事が見つからない |
| INTERNAL_SERVER_ERROR | 500 | サーバーエラー |

## HTTPステータスコード

| コード | 意味 | 使用シーン |
|-------|------|----------|
| 200 | OK | 成功（GET, PUT, DELETE） |
| 201 | Created | 作成成功（POST） |
| 400 | Bad Request | バリデーションエラー |
| 401 | Unauthorized | 認証エラー |
| 403 | Forbidden | 権限エラー |
| 404 | Not Found | リソースが見つからない |
| 500 | Internal Server Error | サーバーエラー |

## 認証・認可

### 認証方式

Laravel Sanctumを使用したトークンベース認証

#### トークン取得

**エンドポイント**: `POST /api/v1/login`

**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**レスポンス**:
```json
{
  "access_token": "1|abcdef...",
  "token_type": "Bearer"
}
```

#### トークン使用

リクエストヘッダーに含める:
```
Authorization: Bearer 1|abcdef...
```

## リクエスト例（curl）

### 記事一覧取得

```bash
curl -X GET "http://localhost:8000/api/v1/articles" \
  -H "Accept: application/json"
```

### 記事作成

```bash
curl -X POST "http://localhost:8000/api/v1/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "新しい記事",
    "content": "記事の内容..."
  }'
```

### 記事更新

```bash
curl -X PUT "http://localhost:8000/api/v1/articles/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "更新されたタイトル",
    "content": "更新された内容..."
  }'
```

### 記事削除

```bash
curl -X DELETE "http://localhost:8000/api/v1/articles/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## レート制限

### 制限内容

- **認証なし**: 60リクエスト/分
- **認証あり**: 100リクエスト/分

### レート制限ヘッダー

レスポンスヘッダーに含まれる情報:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1699358400
```

### 制限超過時のレスポンス

**ステータスコード**: `429 Too Many Requests`

```json
{
  "error": {
    "message": "リクエストが多すぎます。しばらくしてから再試行してください。",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

## バージョニング戦略

### 現在のバージョン

- **v1**: 現在の安定版

### 非推奨化ポリシー

- 新バージョンリリース後、旧バージョンは**6ヶ月間**サポート
- 非推奨機能は`Deprecation`ヘッダーで通知

```
Deprecation: version="v1", date="2025-06-01"
```

## ベストプラクティス

### クライアント側の推奨事項

1. **エラーハンドリング**: すべてのエラーレスポンスを適切に処理
2. **リトライロジック**: 5xxエラーは指数バックオフでリトライ
3. **タイムアウト**: 適切なタイムアウトを設定
4. **キャッシング**: GETリクエストの結果をキャッシュ
5. **バージョン指定**: 常にバージョンを明示

### セキュリティ

1. **HTTPS使用**: 本番環境では必須
2. **トークン保護**: トークンは安全に保管
3. **入力検証**: クライアント側でも入力を検証
4. **XSS対策**: レスポンスのエスケープを適切に処理

## テスト

### APIテスト例

```php
// tests/Feature/ArticleApiTest.php

public function test_can_create_article(): void
{
    $response = $this->postJson('/api/v1/articles', [
        'title' => 'テスト記事',
        'content' => 'テスト内容',
    ]);

    $response
        ->assertStatus(201)
        ->assertJson([
            'data' => [
                'title' => 'テスト記事',
                'content' => 'テスト内容',
            ]
        ]);
}
```

## まとめ

このAPIは以下の特徴を持ちます：

- **RESTful設計**: 直感的なエンドポイント構成
- **一貫性**: 統一されたレスポンス形式
- **拡張性**: バージョニングによる将来の拡張性
- **セキュリティ**: 認証・認可の適切な実装

詳細な実装については、アーキテクチャガイドとあわせてご確認ください。
