# UIパターンガイド

このドキュメントは、ブログアプリケーションのUIデザインパターンとフロントエンドの実装方針を説明します。

## UI設計原則

### 基本方針

1. **シンプルさ**: 最小限の機能に集中
2. **一貫性**: 統一されたデザインとインタラクション
3. **レスポンシブ**: モバイルファーストのアプローチ
4. **アクセシビリティ**: すべてのユーザーが使いやすいUI

### 技術スタック

- **バックエンド**: Laravel Blade テンプレート
- **CSS**: Tailwind CSS
- **JavaScript**: Alpine.js（軽量なインタラクション）
- **アイコン**: Heroicons

## ページ構成

### 1. 記事一覧ページ（Index）

**URL**: `/articles`

**目的**: すべての記事を一覧表示

#### レイアウト

```
┌─────────────────────────────────────┐
│         Header / Navigation         │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │   記事タイトル                  │ │
│  │   投稿日時 | 更新日時           │ │
│  │   記事の抜粋...                 │ │
│  │   [続きを読む]                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   記事タイトル                  │ │
│  │   投稿日時 | 更新日時           │ │
│  │   記事の抜粋...                 │ │
│  │   [続きを読む]                  │ │
│  └───────────────────────────────┘ │
│                                     │
│         [← 前へ] [1] [2] [次へ →]   │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

#### Bladeテンプレート構造

```blade
{{-- resources/views/articles/index.blade.php --}}

@extends('layouts.app')

@section('title', '記事一覧')

@section('content')
<div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">記事一覧</h1>
        <a href="{{ route('articles.create') }}"
           class="btn-primary">
            新規記事作成
        </a>
    </div>

    @if($articles->isEmpty())
        <div class="text-center py-12">
            <p class="text-gray-500">まだ記事がありません</p>
        </div>
    @else
        <div class="space-y-6">
            @foreach($articles as $article)
                @include('articles.partials.article-card', ['article' => $article])
            @endforeach
        </div>

        <div class="mt-8">
            {{ $articles->links() }}
        </div>
    @endif
</div>
@endsection
```

---

### 2. 記事詳細ページ（Show）

**URL**: `/articles/{id}`

**目的**: 記事の全文を表示

#### レイアウト

```
┌─────────────────────────────────────┐
│         Header / Navigation         │
├─────────────────────────────────────┤
│                                     │
│        記事タイトル                  │
│        投稿日時 | 更新日時            │
│        ────────────────            │
│                                     │
│        記事本文...                  │
│        記事本文...                  │
│        記事本文...                  │
│                                     │
│        [編集] [削除]                │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

#### Bladeテンプレート

```blade
{{-- resources/views/articles/show.blade.php --}}

@extends('layouts.app')

@section('title', $article->title)

@section('content')
<article class="container mx-auto px-4 py-8 max-w-3xl">
    <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $article->title }}
        </h1>

        <div class="flex items-center text-sm text-gray-600 mb-4">
            <time datetime="{{ $article->created_at }}">
                {{ $article->created_at->format('Y年m月d日') }}
            </time>
            @if($article->updated_at != $article->created_at)
                <span class="mx-2">|</span>
                <span>更新: {{ $article->updated_at->format('Y年m月d日') }}</span>
            @endif
        </div>

        <div class="flex gap-2">
            <a href="{{ route('articles.edit', $article) }}"
               class="btn-secondary">
                編集
            </a>
            <form action="{{ route('articles.destroy', $article) }}"
                  method="POST"
                  x-data
                  @submit.prevent="if(confirm('本当に削除しますか？')) $el.submit()">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn-danger">
                    削除
                </button>
            </form>
        </div>
    </header>

    <div class="prose prose-lg max-w-none">
        {!! nl2br(e($article->content)) !!}
    </div>

    <footer class="mt-8 pt-4 border-t">
        <a href="{{ route('articles.index') }}"
           class="text-blue-600 hover:text-blue-800">
            ← 記事一覧に戻る
        </a>
    </footer>
</article>
@endsection
```

---

### 3. 記事作成ページ（Create）

**URL**: `/articles/create`

**目的**: 新しい記事を作成

#### レイアウト

```
┌─────────────────────────────────────┐
│         Header / Navigation         │
├─────────────────────────────────────┤
│                                     │
│        新規記事作成                  │
│        ────────────────            │
│                                     │
│        タイトル                      │
│        [___________________________] │
│                                     │
│        本文                         │
│        [___________________________] │
│        [                           ] │
│        [                           ] │
│        [___________________________] │
│                                     │
│        [作成する] [キャンセル]        │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

#### Bladeテンプレート

```blade
{{-- resources/views/articles/create.blade.php --}}

@extends('layouts.app')

@section('title', '新規記事作成')

@section('content')
<div class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
        新規記事作成
    </h1>

    <form action="{{ route('articles.store') }}"
          method="POST"
          class="space-y-6">
        @csrf

        @include('articles.partials.form', [
            'article' => null,
            'submitText' => '作成する'
        ])
    </form>
</div>
@endsection
```

---

### 4. 記事編集ページ（Edit）

**URL**: `/articles/{id}/edit`

**目的**: 既存の記事を編集

#### Bladeテンプレート

```blade
{{-- resources/views/articles/edit.blade.php --}}

@extends('layouts.app')

@section('title', '記事編集')

@section('content')
<div class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
        記事編集
    </h1>

    <form action="{{ route('articles.update', $article) }}"
          method="POST"
          class="space-y-6">
        @csrf
        @method('PUT')

        @include('articles.partials.form', [
            'article' => $article,
            'submitText' => '更新する'
        ])
    </form>
</div>
@endsection
```

## コンポーネント

### 1. 記事カード（Article Card）

**用途**: 記事一覧での各記事の表示

```blade
{{-- resources/views/articles/partials/article-card.blade.php --}}

<article class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">
        <a href="{{ route('articles.show', $article) }}"
           class="hover:text-blue-600">
            {{ $article->title }}
        </a>
    </h2>

    <div class="flex items-center text-sm text-gray-600 mb-4">
        <time datetime="{{ $article->created_at }}">
            {{ $article->created_at->format('Y年m月d日') }}
        </time>
    </div>

    <p class="text-gray-700 mb-4">
        {{ Str::limit($article->content, 150) }}
    </p>

    <a href="{{ route('articles.show', $article) }}"
       class="text-blue-600 hover:text-blue-800 font-medium">
        続きを読む →
    </a>
</article>
```

### 2. フォーム（Form Partial）

**用途**: 記事作成・編集の共通フォーム

```blade
{{-- resources/views/articles/partials/form.blade.php --}}

<div>
    <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
        タイトル
    </label>
    <input type="text"
           id="title"
           name="title"
           value="{{ old('title', $article?->title) }}"
           class="form-input w-full @error('title') border-red-500 @enderror"
           required>
    @error('title')
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>

<div>
    <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
        本文
    </label>
    <textarea id="content"
              name="content"
              rows="12"
              class="form-input w-full @error('content') border-red-500 @enderror"
              required>{{ old('content', $article?->content) }}</textarea>
    @error('content')
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>

<div class="flex gap-4">
    <button type="submit" class="btn-primary">
        {{ $submitText }}
    </button>
    <a href="{{ route('articles.index') }}" class="btn-secondary">
        キャンセル
    </a>
</div>
```

### 3. ページネーション

LaravelのデフォルトページネーションをTailwindCSSでカスタマイズ

```blade
{{-- resources/views/vendor/pagination/tailwind.blade.php --}}

@if ($paginator->hasPages())
    <nav role="navigation" aria-label="ページネーション" class="flex justify-center">
        <ul class="flex space-x-2">
            {{-- 前へボタン --}}
            @if ($paginator->onFirstPage())
                <li class="px-3 py-2 text-gray-400 cursor-not-allowed">前へ</li>
            @else
                <li>
                    <a href="{{ $paginator->previousPageUrl() }}"
                       class="px-3 py-2 text-blue-600 hover:text-blue-800">
                        前へ
                    </a>
                </li>
            @endif

            {{-- ページ番号 --}}
            @foreach ($elements as $element)
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <li class="px-3 py-2 bg-blue-600 text-white rounded">
                            {{ $page }}
                        </li>
                    @else
                        <li>
                            <a href="{{ $url }}"
                               class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                                {{ $page }}
                            </a>
                        </li>
                    @endif
                @endforeach
            @endforeach

            {{-- 次へボタン --}}
            @if ($paginator->hasMorePages())
                <li>
                    <a href="{{ $paginator->nextPageUrl() }}"
                       class="px-3 py-2 text-blue-600 hover:text-blue-800">
                        次へ
                    </a>
                </li>
            @else
                <li class="px-3 py-2 text-gray-400 cursor-not-allowed">次へ</li>
            @endif
        </ul>
    </nav>
@endif
```

## レイアウト

### ベースレイアウト

```blade
{{-- resources/views/layouts/app.blade.php --}}

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'ブログアプリ') - DDD Blog</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">
    {{-- ヘッダー --}}
    <header class="bg-white shadow">
        <nav class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="{{ route('articles.index') }}"
                   class="text-2xl font-bold text-gray-900">
                    DDD Blog
                </a>

                <div class="flex gap-4">
                    <a href="{{ route('articles.index') }}"
                       class="text-gray-700 hover:text-gray-900">
                        記事一覧
                    </a>
                    <a href="{{ route('articles.create') }}"
                       class="text-gray-700 hover:text-gray-900">
                        新規作成
                    </a>
                </div>
            </div>
        </nav>
    </header>

    {{-- フラッシュメッセージ --}}
    @if(session('success'))
        <div class="container mx-auto px-4 mt-4">
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                 role="alert"
                 x-data="{ show: true }"
                 x-show="show"
                 x-init="setTimeout(() => show = false, 3000)">
                {{ session('success') }}
            </div>
        </div>
    @endif

    @if(session('error'))
        <div class="container mx-auto px-4 mt-4">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                 role="alert">
                {{ session('error') }}
            </div>
        </div>
    @endif

    {{-- メインコンテンツ --}}
    <main class="flex-1">
        @yield('content')
    </main>

    {{-- フッター --}}
    <footer class="bg-gray-800 text-white mt-12">
        <div class="container mx-auto px-4 py-6 text-center">
            <p>&copy; 2024 DDD Blog. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
```

## スタイリング

### Tailwind CSS設定

```javascript
// tailwind.config.js

export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### カスタムスタイル

```css
/* resources/css/app.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    /* ボタン */
    .btn-primary {
        @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium;
    }

    .btn-secondary {
        @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium;
    }

    .btn-danger {
        @apply px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium;
    }

    /* フォーム入力 */
    .form-input {
        @apply px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    }

    /* カード */
    .card {
        @apply bg-white rounded-lg shadow-md p-6;
    }
}
```

## インタラクション（Alpine.js）

### 削除確認ダイアログ

```blade
<form action="{{ route('articles.destroy', $article) }}"
      method="POST"
      x-data
      @submit.prevent="if(confirm('本当に削除しますか？')) $el.submit()">
    @csrf
    @method('DELETE')
    <button type="submit" class="btn-danger">削除</button>
</form>
```

### フラッシュメッセージの自動非表示

```blade
<div x-data="{ show: true }"
     x-show="show"
     x-init="setTimeout(() => show = false, 3000)"
     class="alert">
    {{ session('success') }}
</div>
```

## レスポンシブデザイン

### ブレークポイント

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### レスポンシブ対応例

```blade
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @foreach($articles as $article)
        @include('articles.partials.article-card')
    @endforeach
</div>
```

## アクセシビリティ

### 基本原則

1. **セマンティックHTML**: 適切なタグを使用
2. **キーボード操作**: すべての機能がキーボードで操作可能
3. **スクリーンリーダー**: ARIA属性の適切な使用
4. **コントラスト**: WCAG AA準拠の色コントラスト

### 実装例

```blade
{{-- セマンティックHTML --}}
<article>
    <header>
        <h1>タイトル</h1>
    </header>
    <main>
        本文...
    </main>
</article>

{{-- ARIA属性 --}}
<nav role="navigation" aria-label="ページネーション">
    <!-- ... -->
</nav>

{{-- フォームラベル --}}
<label for="title">タイトル</label>
<input type="text" id="title" name="title">
```

## パフォーマンス最適化

### 画像最適化

- 適切なフォーマット（WebP優先）
- Lazy loading

```blade
<img src="{{ $article->image_url }}"
     alt="{{ $article->title }}"
     loading="lazy"
     class="w-full h-auto">
```

### CSS/JS最適化

- Viteによるバンドル最適化
- 本番環境での圧縮

## まとめ

このUIパターンガイドの特徴：

1. **シンプル**: 最小限の機能に集中
2. **再利用可能**: コンポーネント化されたパーツ
3. **レスポンシブ**: モバイルフレンドリー
4. **アクセシブル**: すべてのユーザーに配慮

Bladeテンプレートとコンポーネントの再利用により、一貫性のある保守しやすいUIを実現しています。
