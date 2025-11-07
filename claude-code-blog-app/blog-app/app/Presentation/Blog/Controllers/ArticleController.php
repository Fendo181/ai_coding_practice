<?php

declare(strict_types=1);

namespace App\Presentation\Blog\Controllers;

use App\Application\Blog\UseCases\CreateArticleUseCase;
use App\Application\Blog\UseCases\GetArticleUseCase;
use App\Application\Blog\UseCases\ListArticlesUseCase;
use App\Application\Blog\UseCases\UpdateArticleUseCase;
use App\Application\Blog\UseCases\DeleteArticleUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ArticleController extends Controller
{
    public function __construct(
        private CreateArticleUseCase $createArticleUseCase,
        private GetArticleUseCase $getArticleUseCase,
        private ListArticlesUseCase $listArticlesUseCase,
        private UpdateArticleUseCase $updateArticleUseCase,
        private DeleteArticleUseCase $deleteArticleUseCase
    ) {}

    public function index(): JsonResponse
    {
        $articles = $this->listArticlesUseCase->execute();

        return response()->json([
            'data' => array_map(fn($article) => [
                'id' => $article->getId()->value(),
                'title' => $article->getTitle()->value(),
                'content' => $article->getContent()->value(),
                'created_at' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
                'updated_at' => $article->getUpdatedAt()->format('Y-m-d H:i:s'),
            ], $articles)
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $article = $this->getArticleUseCase->execute($id);

        if (!$article) {
            return response()->json([
                'error' => ['message' => '記事が見つかりません', 'code' => 'ARTICLE_NOT_FOUND']
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $article->getId()->value(),
                'title' => $article->getTitle()->value(),
                'content' => $article->getContent()->value(),
                'created_at' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
                'updated_at' => $article->getUpdatedAt()->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
        ]);

        try {
            $article = $this->createArticleUseCase->execute(
                $validated['title'],
                $validated['content']
            );

            return response()->json([
                'data' => [
                    'id' => $article->getId()->value(),
                    'title' => $article->getTitle()->value(),
                    'content' => $article->getContent()->value(),
                    'created_at' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
                    'updated_at' => $article->getUpdatedAt()->format('Y-m-d H:i:s'),
                ],
                'message' => '記事を作成しました'
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => ['message' => $e->getMessage(), 'code' => 'VALIDATION_ERROR']
            ], 400);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
        ]);

        try {
            $article = $this->updateArticleUseCase->execute(
                $id,
                $validated['title'],
                $validated['content']
            );

            if (!$article) {
                return response()->json([
                    'error' => ['message' => '記事が見つかりません', 'code' => 'ARTICLE_NOT_FOUND']
                ], 404);
            }

            return response()->json([
                'data' => [
                    'id' => $article->getId()->value(),
                    'title' => $article->getTitle()->value(),
                    'content' => $article->getContent()->value(),
                    'created_at' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
                    'updated_at' => $article->getUpdatedAt()->format('Y-m-d H:i:s'),
                ],
                'message' => '記事を更新しました'
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => ['message' => $e->getMessage(), 'code' => 'VALIDATION_ERROR']
            ], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $this->deleteArticleUseCase->execute($id);

        return response()->json([
            'message' => '記事を削除しました'
        ]);
    }
}
