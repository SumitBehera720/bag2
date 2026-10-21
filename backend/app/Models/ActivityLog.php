<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 'user_name', 'action', 'entity_type',
        'entity_id', 'description', 'meta', 'ip_address',
    ];

    protected $casts = ['meta' => 'array'];
}
