<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::query();

        if ($request->search) {
            $query->where('description', 'like', "%{$request->search}%");
        }
        if ($request->action) {
            $query->where('action', $request->action);
        }

        return response()->json($query->orderByDesc('created_at')->paginate(50));
    }
}
