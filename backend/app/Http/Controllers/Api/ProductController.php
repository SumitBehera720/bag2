<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('images');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
                  ->orWhere('string_id', 'like', "%{$request->search}%");
            });
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->status === 'active') {
            $query->where('is_active', true);
        } elseif ($request->status === 'inactive') {
            $query->where('is_active', false);
        }

        if ($request->featured === 'true') {
            $query->where('is_featured', true);
        }

        $perPage = $request->per_page ? (int)$request->per_page : 100;
        $products = $query->orderBy('sort_order')->orderBy('id')->paginate($perPage);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string',
        ]);

        $slug = Str::slug($request->name);
        $baseSlug = $slug;
        $i = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i++;
        }

        $data = $request->except(['primary_image_file', 'gallery_files']);
        $data['slug'] = $slug;

        // Handle primary image upload
        if ($request->hasFile('primary_image_file')) {
            $path = $request->file('primary_image_file')->store('products', 'public');
            $data['primary_image'] = '/storage/' . $path;
        }

        // Parse JSON fields
        foreach (['materials', 'color_options', 'features', 'branding_options'] as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = json_decode($data[$field], true);
            }
        }

        $product = Product::create($data);

        // Handle gallery images
        if ($request->hasFile('gallery_files')) {
            foreach ($request->file('gallery_files') as $i => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => '/storage/' . $path,
                    'label' => 'Gallery Image ' . ($i + 1),
                    'sort_order' => $i,
                ]);
            }
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'create',
            'entity_type' => 'product',
            'entity_id' => $product->id,
            'description' => 'Created product: ' . $product->name,
        ]);

        return response()->json($product->load('images'), 201);
    }

    public function show($id)
    {
        $product = Product::with('images')->where('id', $id)
            ->orWhere('string_id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->except(['primary_image_file', 'gallery_files', '_method']);

        if ($request->hasFile('primary_image_file')) {
            $path = $request->file('primary_image_file')->store('products', 'public');
            $data['primary_image'] = '/storage/' . $path;
        }

        foreach (['materials', 'color_options', 'features', 'branding_options'] as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = json_decode($data[$field], true);
            }
        }

        // Convert checkbox/boolean strings
        foreach (['is_active', 'is_featured', 'is_popular', 'is_new', 'is_customizable'] as $bool) {
            if (isset($data[$bool])) {
                $data[$bool] = filter_var($data[$bool], FILTER_VALIDATE_BOOLEAN);
            }
        }

        $product->update($data);

        if ($request->hasFile('gallery_files')) {
            $currentMax = ProductImage::where('product_id', $product->id)->max('sort_order') ?? 0;
            foreach ($request->file('gallery_files') as $i => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => '/storage/' . $path,
                    'label' => 'Gallery Image',
                    'sort_order' => $currentMax + $i + 1,
                ]);
            }
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'update',
            'entity_type' => 'product',
            'entity_id' => $product->id,
            'description' => 'Updated product: ' . $product->name,
        ]);

        return response()->json($product->load('images'));
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $name = $product->name;
        $product->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'delete',
            'entity_type' => 'product',
            'entity_id' => $id,
            'description' => 'Deleted product: ' . $name,
        ]);

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function toggleStatus(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_active' => !$product->is_active]);
        return response()->json(['is_active' => $product->is_active, 'message' => 'Status updated']);
    }

    public function deleteImage(Request $request, $imageId)
    {
        $image = ProductImage::findOrFail($imageId);
        $image->delete();
        return response()->json(['message' => 'Image deleted']);
    }
}
