<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->page ?? 'homepage';
        $sections = PageSection::where('page', $page)
            ->orderBy('sort_order')
            ->get();
        return response()->json($sections);
    }

    public function show($key)
    {
        $section = PageSection::where('section_key', $key)->firstOrFail();
        return response()->json($section);
    }

    public function update(Request $request, $key)
    {
        $section = PageSection::where('section_key', $key)->first();

        $data = $request->except(['image_file', 'cover_image_file', '_method']);

        // Handle image uploads
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('sections', 'public');
            $data['bg_image'] = '/storage/' . $path;
        }
        if ($request->hasFile('cover_image_file')) {
            $path = $request->file('cover_image_file')->store('sections', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        // Parse content if it's a string
        if (isset($data['content']) && is_string($data['content'])) {
            $data['content'] = json_decode($data['content'], true);
        }

        if ($section) {
            $section->update($data);
        } else {
            $data['section_key'] = $key;
            $section = PageSection::create($data);
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'update',
            'entity_type' => 'section',
            'entity_id' => $key,
            'description' => "Section '{$key}' updated",
        ]);

        return response()->json($section);
    }

    public function reorder(Request $request)
    {
        $request->validate(['sections' => 'required|array']);
        foreach ($request->sections as $index => $key) {
            PageSection::where('section_key', $key)->update(['sort_order' => $index]);
        }
        return response()->json(['message' => 'Section order saved']);
    }

    public function toggleVisibility(Request $request, $key)
    {
        $section = PageSection::where('section_key', $key)->firstOrFail();
        $section->update(['is_visible' => !$section->is_visible]);
        return response()->json(['is_visible' => $section->is_visible]);
    }
}
