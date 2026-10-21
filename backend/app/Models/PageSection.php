<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'page', 'section_key', 'section_type', 'title', 'subtitle',
        'description', 'content', 'bg_image', 'cover_image',
        'is_visible', 'sort_order',
    ];

    protected $casts = [
        'content' => 'array',
        'is_visible' => 'boolean',
    ];
}
