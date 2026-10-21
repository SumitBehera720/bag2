<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Inquiry;
use App\Models\Testimonial;
use App\Models\Category;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $totalInquiries = Inquiry::count();
        $newInquiries = Inquiry::where('status', 'new')->count();
        $followUps = Inquiry::where('status', 'follow_up')->orWhere('status', 'contacted')->count();
        $quotationsSent = Inquiry::where('status', 'quotation_sent')->count();
        $converted = Inquiry::where('status', 'converted')->count();
        $lost = Inquiry::where('status', 'lost')->count();

        $recentInquiries = Inquiry::orderByDesc('created_at')
            ->take(10)
            ->get(['id', 'inquiry_id', 'name', 'company', 'phone', 'product_name', 'quantity', 'status', 'created_at']);

        $recentProducts = Product::orderByDesc('created_at')
            ->take(5)
            ->get(['id', 'name', 'sku', 'category', 'is_active', 'primary_image', 'created_at']);

        $inquiryByStatus = Inquiry::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return response()->json([
            'products' => [
                'total' => $totalProducts,
                'active' => $activeProducts,
                'inactive' => $totalProducts - $activeProducts,
            ],
            'inquiries' => [
                'total' => $totalInquiries,
                'new' => $newInquiries,
                'contacted' => $followUps,
                'quotation_sent' => $quotationsSent,
                'converted' => $converted,
                'lost' => $lost,
            ],
            'inquiry_by_status' => $inquiryByStatus,
            'recent_inquiries' => $recentInquiries,
            'recent_products' => $recentProducts,
        ]);
    }
}
