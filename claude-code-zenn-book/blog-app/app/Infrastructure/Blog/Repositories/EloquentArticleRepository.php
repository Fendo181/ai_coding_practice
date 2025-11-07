<?php

declare(strict_types=1);

namespace App\Infrastructure\Blog\Repositories;

use App\Domain\Blog\Entities\Article;
use App\Domain\Blog\Repositories\ArticleRepositoryInterface;
use App\Domain\Blog\ValueObjects\ArticleId;
use App\Domain\Blog\ValueObjects\ArticleTitle;
use App\Domain\Blog\ValueObjects\ArticleContent;
use App\Infrastructure\Blog\Eloquent\ArticleModel;
use DateTimeImmutable;

class EloquentArticleRepository implements ArticleRepositoryInterface
{
    public function save(Article $article): Article
    {
        $id = $article->getId()->value();

        if ($id === 0) {
            $model = ArticleModel::create([
                'title' => $article->getTitle()->value(),
                'content' => $article->getContent()->value(),
            ]);
        } else {
            $model = ArticleModel::findOrFail($id);
            $model->update([
                'title' => $article->getTitle()->value(),
                'content' => $article->getContent()->value(),
            ]);
        }

        return $this->toDomain($model);
    }

    public function findById(ArticleId $id): ?Article
    {
        $model = ArticleModel::find($id->value());

        return $model ? $this->toDomain($model) : null;
    }

    public function findAll(): array
    {
        return ArticleModel::all()
            ->map(fn($model) => $this->toDomain($model))
            ->all();
    }

    public function delete(ArticleId $id): void
    {
        ArticleModel::destroy($id->value());
    }

    private function toDomain(ArticleModel $model): Article
    {
        return new Article(
            new ArticleId($model->id),
            new ArticleTitle($model->title),
            new ArticleContent($model->content),
            new DateTimeImmutable($model->created_at->toDateTimeString()),
            new DateTimeImmutable($model->updated_at->toDateTimeString())
        );
    }
}
