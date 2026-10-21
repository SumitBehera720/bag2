<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'inquiry_id', 'name', 'company', 'phone', 'email',
        'product_name', 'quantity', 'required_date', 'customization',
        'material_preference', 'color_preference', 'size_preference',
        'message', 'logo_file', 'status', 'quotation_amount',
        'quotation_file', 'assigned_to', 'follow_up_date', 'source', 'whatsapp_number',
    ];

    protected $casts = [
        'required_date' => 'date',
        'follow_up_date' => 'date',
        'quantity' => 'integer',
        'quotation_amount' => 'decimal:2',
    ];

    public function notes()
    {
        return $this->hasMany(InquiryNote::class)->orderByDesc('created_at');
    }

    public function statusHistory()
    {
        return $this->hasMany(InquiryStatusHistory::class)->orderByDesc('created_at');
    }
}
