<?php

declare(strict_types=1);

namespace App\Application\Blog\UseCases;

use App\Domain\Blog\Repositories\ArticleRepositoryInterface;

class ListArticlesUseCase
{
    private ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function execute(): array
    {
        return $this->articleRepository->findAll();
    }
}
