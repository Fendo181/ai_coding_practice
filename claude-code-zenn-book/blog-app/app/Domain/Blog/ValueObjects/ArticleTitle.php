<?php

declare(strict_types=1);

namespace App\Domain\Blog\ValueObjects;

use InvalidArgumentException;

final class ArticleTitle
{
    private string $value;

    public function __construct(string $value)
    {
        $length = mb_strlen($value);
        if ($length < 1 || $length > 100) {
            throw new InvalidArgumentException('タイトルは1文字以上100文字以内である必要があります');
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }

    public function equals(?ArticleTitle $other): bool
    {
        return $other !== null && $this->value === $other->value();
    }
}
