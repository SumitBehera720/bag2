<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use App\Models\Inquiry;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
