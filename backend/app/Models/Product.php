<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'string_id', 'name', 'slug', 'sku', 'category', 'tagline', 'description',
        'capacity', 'laptop_fit', 'primary_image', 'min_order', 'lead_time',
        'logo_position', 'is_customizable', 'materials', 'color_options',
        'features', 'branding_options', 'is_featured', 'is_popular', 'is_new',
        'is_active', 'sort_order', 'seo_title', 'seo_description',
    ];

    protected $casts = [
        'materials' => 'array',
        'color_options' => 'array',
        'features' => 'array',
        'branding_options' => 'array',
        'is_customizable' => 'boolean',
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }
}
