<?php

declare(strict_types=1);

namespace App\Domain\Blog\ValueObjects;

use InvalidArgumentException;

final class ArticleId
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value < 0) {
            throw new InvalidArgumentException('記事IDは0以上である必要があります');
        }
        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }

    public function equals(?ArticleId $other): bool
    {
        return $other !== null && $this->value === $other->value();
    }
}
