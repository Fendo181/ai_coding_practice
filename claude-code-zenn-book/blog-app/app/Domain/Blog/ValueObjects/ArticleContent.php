<?php

declare(strict_types=1);

namespace App\Domain\Blog\ValueObjects;

use InvalidArgumentException;

final class ArticleContent
{
    private string $value;

    public function __construct(string $value)
    {
        if (mb_strlen($value) < 1) {
            throw new InvalidArgumentException('本文は1文字以上である必要があります');
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }

    public function equals(?ArticleContent $other): bool
    {
        return $other !== null && $this->value === $other->value();
    }
}
