<?php

declare(strict_types=1);

namespace App\Application\Blog\UseCases;

use App\Domain\Blog\Entities\Article;
use App\Domain\Blog\Repositories\ArticleRepositoryInterface;
use App\Domain\Blog\ValueObjects\ArticleId;

class GetArticleUseCase
{
    private ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function execute(int $id): ?Article
    {
        return $this->articleRepository->findById(new ArticleId($id));
    }
}
