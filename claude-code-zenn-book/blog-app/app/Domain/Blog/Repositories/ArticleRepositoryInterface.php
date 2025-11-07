<?php

declare(strict_types=1);

namespace App\Domain\Blog\Repositories;

use App\Domain\Blog\Entities\Article;
use App\Domain\Blog\ValueObjects\ArticleId;

interface ArticleRepositoryInterface
{
    public function save(Article $article): Article;

    public function findById(ArticleId $id): ?Article;

    public function findAll(): array;

    public function delete(ArticleId $id): void;
}
