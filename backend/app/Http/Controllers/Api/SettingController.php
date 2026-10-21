<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $group = $request->group;
        $query = SiteSetting::query();
        if ($group) {
            $query->where('group', $group);
        }
        return response()->json($query->get()->keyBy('key'));
    }

    public function update(Request $request)
    {
        $settings = $request->all();

        foreach ($settings as $key => $value) {
            if (is_array($value) && isset($value['_file'])) continue; // skip meta
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        // Handle image uploads (key_file pattern)
        foreach ($request->allFiles() as $fileKey => $file) {
            $settingKey = str_replace('_file', '', $fileKey);
            $path = $file->store('settings', 'public');
            SiteSetting::updateOrCreate(
                ['key' => $settingKey],
                ['value' => '/storage/' . $path, 'type' => 'image']
            );
        }

        ActivityLog::create([
            'user_id' => $request->user()->id ?? null,
            'user_name' => $request->user()->name ?? 'Admin',
            'action' => 'update',
            'entity_type' => 'settings',
            'entity_id' => 'settings',
            'description' => 'Site settings updated',
        ]);

        return response()->json(['message' => 'Settings saved successfully']);
    }

    // Public endpoint for website
    public function publicSettings()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }
}
