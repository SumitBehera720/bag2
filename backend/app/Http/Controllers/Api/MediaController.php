<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaLibrary;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = MediaLibrary::query();

        if ($request->folder) {
            $query->where('folder', $request->folder);
        }
        if ($request->search) {
            $query->where('original_name', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderByDesc('created_at')->paginate(40));
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480',
            'folder' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $folder = $request->folder ?? 'general';
        $path = $file->store("media/{$folder}", 'public');

        $media = MediaLibrary::create([
            'filename' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => '/storage/' . $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'folder' => $folder,
            'alt_text' => $request->alt_text ?? '',
            'caption' => $request->caption ?? '',
            'uploaded_by' => $request->user()->id,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'upload',
            'entity_type' => 'media',
            'entity_id' => $media->id,
            'description' => 'Uploaded: ' . $file->getClientOriginalName(),
        ]);

        return response()->json($media, 201);
    }

    public function update(Request $request, $id)
    {
        $media = MediaLibrary::findOrFail($id);
        $media->update($request->only(['alt_text', 'caption', 'folder']));
        return response()->json($media);
    }

    public function destroy(Request $request, $id)
    {
        $media = MediaLibrary::findOrFail($id);
        Storage::disk('public')->delete($media->path);
        $media->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'delete',
            'entity_type' => 'media',
            'entity_id' => $id,
            'description' => 'Deleted media: ' . $media->original_name,
        ]);

        return response()->json(['message' => 'File deleted']);
    }
}
