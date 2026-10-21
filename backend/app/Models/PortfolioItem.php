<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    protected $fillable = ['title', 'description', 'image', 'category', 'sort_order', 'is_active'];
}
