<?php

declare(strict_types=1);

namespace App\Application\Blog\UseCases;

use App\Domain\Blog\Entities\Article;
use App\Domain\Blog\Repositories\ArticleRepositoryInterface;
use App\Domain\Blog\ValueObjects\ArticleId;
use App\Domain\Blog\ValueObjects\ArticleTitle;
use App\Domain\Blog\ValueObjects\ArticleContent;
use DateTimeImmutable;

class CreateArticleUseCase
{
    private ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function execute(string $title, string $content): Article
    {
        $article = new Article(
            new ArticleId(0),
            new ArticleTitle($title),
            new ArticleContent($content),
            new DateTimeImmutable(),
            new DateTimeImmutable()
        );

        return $this->articleRepository->save($article);
    }
}
