<?php

declare(strict_types=1);

namespace App\Infrastructure\Blog\Eloquent;

use Illuminate\Database\Eloquent\Model;

class ArticleModel extends Model
{
    protected $table = 'articles';

    protected $fillable = [
        'title',
        'content',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
