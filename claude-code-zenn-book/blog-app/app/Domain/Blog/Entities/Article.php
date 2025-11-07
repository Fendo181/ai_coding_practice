<?php

declare(strict_types=1);

namespace App\Domain\Blog\Entities;

use App\Domain\Blog\ValueObjects\ArticleId;
use App\Domain\Blog\ValueObjects\ArticleTitle;
use App\Domain\Blog\ValueObjects\ArticleContent;
use DateTimeImmutable;

final class Article
{
    private ArticleId $id;
    private ArticleTitle $title;
    private ArticleContent $content;
    private DateTimeImmutable $createdAt;
    private DateTimeImmutable $updatedAt;

    public function __construct(
        ArticleId $id,
        ArticleTitle $title,
        ArticleContent $content,
        DateTimeImmutable $createdAt,
        DateTimeImmutable $updatedAt
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->content = $content;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): ArticleId
    {
        return $this->id;
    }

    public function getTitle(): ArticleTitle
    {
        return $this->title;
    }

    public function getContent(): ArticleContent
    {
        return $this->content;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function changeTitle(ArticleTitle $newTitle): self
    {
        return new self(
            $this->id,
            $newTitle,
            $this->content,
            $this->createdAt,
            new DateTimeImmutable()
        );
    }

    public function changeContent(ArticleContent $newContent): self
    {
        return new self(
            $this->id,
            $this->title,
            $newContent,
            $this->createdAt,
            new DateTimeImmutable()
        );
    }
}
