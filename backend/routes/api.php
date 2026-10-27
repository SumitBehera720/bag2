<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\PortfolioItem;
use App\Models\PageSection;
use App\Models\Category;

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
// Authentication
Route::post('/auth/login', [AuthController::class, 'login']);

// Public inquiry submission (from website contact form)
Route::post('/inquiries', [InquiryController::class, 'store']);

// Public CMS data for the website
Route::get('/public/settings', [SettingController::class, 'publicSettings']);

Route::get('/public/products', function (Request $request) {
    $query = Product::with('images')->where('is_active', true);
    if ($request->category) $query->where('category', $request->category);
    if ($request->featured) $query->where('is_featured', true);
    return response()->json($query->orderBy('sort_order')->get());
});

Route::get('/public/products/{id}', function ($id) {
    return response()->json(
        Product::with('images')
            ->where('is_active', true)
            ->where(function($q) use ($id) {
                $q->where('id', $id)->orWhere('string_id', $id)->orWhere('slug', $id);
            })
            ->firstOrFail()
    );
});

Route::get('/public/categories', function () {
    return response()->json(Category::where('is_active', true)->orderBy('display_order')->get());
});

Route::get('/public/testimonials', function () {
    return response()->json(Testimonial::where('is_active', true)->orderBy('id')->get());
});

Route::get('/public/sections', function (Request $request) {
    $page = $request->page ?? 'homepage';
    return response()->json(
        PageSection::where('page', $page)->where('is_visible', true)->orderBy('sort_order')->get()
    );
});

Route::get('/home-data', function () {
    $featured = Product::with('images')->where('is_active', true)->where('is_featured', true)->orderBy('sort_order')->take(8)->get();
    if ($featured->isEmpty()) {
        $featured = Product::with('images')->where('is_active', true)->orderBy('sort_order')->take(8)->get();
    }
    return response()->json([
        'settings' => SiteSetting::all()->pluck('value', 'key'),
        'categories' => Category::where('is_active', true)->orderBy('display_order')->get(),
        'featured_products' => $featured,
        'testimonials' => Testimonial::where('is_active', true)->orderBy('id')->get(),
        'portfolio' => PortfolioItem::where('is_active', true)->orderBy('id')->get(),
        'sections' => PageSection::where('page', 'homepage')->orderBy('sort_order')->get(),
    ]);
});

// Direct and legacy public routes (backward compatibility)
Route::get('/categories', function () {
    return response()->json(Category::where('is_active', true)->orderBy('display_order')->get());
});
Route::get('/settings', [SettingController::class, 'publicSettings']);
Route::get('/testimonials', function () {
    return response()->json(Testimonial::where('is_active', true)->orderBy('id')->get());
});
Route::get('/products', function () {
    return response()->json(Product::with('images')->where('is_active', true)->orderBy('sort_order')->get());
});
Route::get('/products/{id}', function ($id) {
    return response()->json(Product::with('images')->where('id', $id)->orWhere('string_id', $id)->orWhere('slug', $id)->firstOrFail());
});

// ─── PROTECTED ADMIN ROUTES ──────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'stats']);

    // Products (admin)
    Route::get('/admin/products', [ProductController::class, 'index']);
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::get('/admin/products/{id}', [ProductController::class, 'show']);
    Route::match(['post', 'put', 'patch'], '/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/admin/products/{id}/toggle-status', [ProductController::class, 'toggleStatus']);
    Route::delete('/admin/product-images/{imageId}', [ProductController::class, 'deleteImage']);

    // Categories (admin)
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::match(['post', 'put', 'patch'], '/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    // Inquiries (admin)
    Route::get('/admin/inquiries', [InquiryController::class, 'index']);
    Route::get('/admin/inquiries/{id}', [InquiryController::class, 'show']);
    Route::post('/admin/inquiries/{id}/status', [InquiryController::class, 'updateStatus']);
    Route::post('/admin/inquiries/{id}/notes', [InquiryController::class, 'addNote']);
    Route::get('/admin/inquiries/{id}/whatsapp', [InquiryController::class, 'getWhatsAppUrl']);
    Route::delete('/admin/inquiries/{id}', [InquiryController::class, 'destroy']);

    // Page Sections / CMS
    Route::get('/admin/sections', [SectionController::class, 'index']);
    Route::get('/admin/sections/{key}', [SectionController::class, 'show']);
    Route::match(['post', 'put', 'patch'], '/admin/sections/{key}', [SectionController::class, 'update']);
    Route::post('/admin/sections/reorder', [SectionController::class, 'reorder']);
    Route::post('/admin/sections/{key}/toggle-visibility', [SectionController::class, 'toggleVisibility']);

    // Settings
    Route::get('/admin/settings', [SettingController::class, 'index']);
    Route::post('/admin/settings', [SettingController::class, 'update']);

    // Media Library
    Route::get('/admin/media', [MediaController::class, 'index']);
    Route::post('/admin/media', [MediaController::class, 'store']);
    Route::match(['post', 'put', 'patch'], '/admin/media/{id}', [MediaController::class, 'update']);
    Route::delete('/admin/media/{id}', [MediaController::class, 'destroy']);

    // Testimonials
    Route::get('/admin/testimonials', [TestimonialController::class, 'index']);
    Route::post('/admin/testimonials', [TestimonialController::class, 'store']);
    Route::match(['post', 'put', 'patch'], '/admin/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/admin/testimonials/{id}', [TestimonialController::class, 'destroy']);

    // Activity Logs
    Route::get('/admin/activity-logs', [ActivityLogController::class, 'index']);

    // Admin Users
    Route::get('/admin/users', function (Request $request) {
        return response()->json(\App\Models\User::select('id','name','email','role','is_active','last_login_at','created_at')->get());
    });
    Route::post('/admin/users', function (Request $request) {
        $request->validate(['name'=>'required','email'=>'required|email|unique:users','password'=>'required|min:8','role'=>'required']);
        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
        ]);
        return response()->json($user, 201);
    });
    Route::post('/admin/users/{id}', function (Request $request, $id) {
        $user = \App\Models\User::findOrFail($id);
        $data = $request->only(['name', 'role', 'is_active']);
        if ($request->password) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }
        $user->update($data);
        return response()->json($user);
    });
});
