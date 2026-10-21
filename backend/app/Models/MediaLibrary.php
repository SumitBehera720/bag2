<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaLibrary extends Model
{
    protected $fillable = [
        'filename', 'original_name', 'path', 'url', 'mime_type',
        'size', 'folder', 'alt_text', 'caption', 'uploaded_by',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute($value)
    {
        if ($value) return $value;
        return '/storage/' . $this->path;
    }
}
