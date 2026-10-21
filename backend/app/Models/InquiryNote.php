<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InquiryNote extends Model
{
    protected $fillable = ['inquiry_id', 'user_id', 'note', 'type'];
}
