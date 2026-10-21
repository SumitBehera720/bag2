<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InquiryStatusHistory extends Model
{
    protected $table = 'inquiry_status_history';
    protected $fillable = ['inquiry_id', 'user_id', 'from_status', 'to_status', 'note'];
}
