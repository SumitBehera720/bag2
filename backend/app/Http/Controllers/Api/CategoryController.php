<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::orderBy('display_order')->orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'display_order' => 'nullable|integer',
        ]);

        $data = $request->except(['cover_image_file', '_method']);

        // Resolve slug collision cleanly
        $baseSlug = Str::slug($request->slug ?: $request->name);
        if (empty($baseSlug)) {
            $baseSlug = 'category';
        }
        $slug = $baseSlug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }
        $data['slug'] = $slug;

        // Ensure display_order is integer
        $data['display_order'] = isset($request->display_order) ? (int)$request->display_order : 0;
        $data['is_active'] = $request->has('is_active') ? filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN) : true;

        if ($request->hasFile('cover_image_file')) {
            $path = $request->file('cover_image_file')->store('categories', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        $category = Category::create($data);

        if (class_exists(ActivityLog::class)) {
            try {
                ActivityLog::create([
                    'user_id' => $request->user()?->id,
                    'user_name' => $request->user()?->name ?? 'Admin',
                    'action' => 'create',
                    'entity_type' => 'category',
                    'entity_id' => $category->id,
                    'description' => 'Created category: ' . $category->name,
                ]);
            } catch (\Throwable $e) {}
        }

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->except(['cover_image_file', '_method']);

        if ($request->has('name') || $request->has('slug')) {
            $baseSlug = Str::slug($request->slug ?: ($request->name ?: $category->name));
            if (!empty($baseSlug)) {
                $slug = $baseSlug;
                $counter = 1;
                while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }
                $data['slug'] = $slug;
            }
        }

        if (isset($data['display_order'])) {
            $data['display_order'] = (int)$data['display_order'];
        }

        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('cover_image_file')) {
            $path = $request->file('cover_image_file')->store('categories', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        $category->update($data);

        if (class_exists(ActivityLog::class)) {
            try {
                ActivityLog::create([
                    'user_id' => $request->user()?->id,
                    'user_name' => $request->user()?->name ?? 'Admin',
                    'action' => 'update',
                    'entity_type' => 'category',
                    'entity_id' => $category->id,
                    'description' => 'Updated category: ' . $category->name,
                ]);
            } catch (\Throwable $e) {}
        }

        return response()->json($category);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $name = $category->name;
        $category->delete();

        if (class_exists(ActivityLog::class)) {
            try {
                ActivityLog::create([
                    'user_id' => $request->user()?->id,
                    'user_name' => $request->user()?->name ?? 'Admin',
                    'action' => 'delete',
                    'entity_type' => 'category',
                    'entity_id' => $id,
                    'description' => 'Deleted category: ' . $name,
                ]);
            } catch (\Throwable $e) {}
        }

        return response()->json(['message' => 'Category deleted']);
    }
}
