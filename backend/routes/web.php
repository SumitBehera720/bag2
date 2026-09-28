<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Inquiry;

Route::get('/', function () {
    return redirect('/admin');
});

// Support endpoints when accessed directly under /api or root
Route::get('/products', function () {
    return response()->json(Product::all());
});

Route::get('/products/{id}', function ($id) {
    return response()->json(Product::findOrFail($id));
});

Route::post('/inquiries', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'subject' => 'nullable|string|max:255',
        'message' => 'required|string',
    ]);
    
    $inquiry = Inquiry::create($validated);
    return response()->json(['message' => 'Inquiry submitted successfully!', 'inquiry' => $inquiry], 201);
});

// Also support /api/products and /api/inquiries if prefix wasn't stripped
Route::get('/api/products', function () {
    return response()->json(Product::all());
});

Route::get('/api/products/{id}', function ($id) {
    return response()->json(Product::findOrFail($id));
});

Route::post('/api/inquiries', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'subject' => 'nullable|string|max:255',
        'message' => 'required|string',
    ]);
    
    $inquiry = Inquiry::create($validated);
    return response()->json(['message' => 'Inquiry submitted successfully!', 'inquiry' => $inquiry], 201);
});
