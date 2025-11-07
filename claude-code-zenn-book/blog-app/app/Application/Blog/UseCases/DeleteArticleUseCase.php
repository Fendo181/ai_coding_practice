<?php

declare(strict_types=1);

namespace App\Application\Blog\UseCases;

use App\Domain\Blog\Repositories\ArticleRepositoryInterface;
use App\Domain\Blog\ValueObjects\ArticleId;

class DeleteArticleUseCase
{
    private ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function execute(int $id): void
    {
        $this->articleRepository->delete(new ArticleId($id));
    }
}
