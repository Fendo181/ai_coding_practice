<?php

declare(strict_types=1);

namespace App\Application\Blog\UseCases;

use App\Domain\Blog\Entities\Article;
use App\Domain\Blog\Repositories\ArticleRepositoryInterface;
use App\Domain\Blog\ValueObjects\ArticleId;
use App\Domain\Blog\ValueObjects\ArticleTitle;
use App\Domain\Blog\ValueObjects\ArticleContent;

class UpdateArticleUseCase
{
    private ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function execute(int $id, string $title, string $content): ?Article
    {
        $article = $this->articleRepository->findById(new ArticleId($id));

        if (!$article) {
            return null;
        }

        $updatedArticle = $article
            ->changeTitle(new ArticleTitle($title))
            ->changeContent(new ArticleContent($content));

        return $this->articleRepository->save($updatedArticle);
    }
}
