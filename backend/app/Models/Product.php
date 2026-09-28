<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];
    
    protected $casts = [
        'materials' => 'array',
        'colorOptions' => 'array',
        'features' => 'array',
        'brandingOptions' => 'array',
        'isCustomizable' => 'boolean',
    ];
}
