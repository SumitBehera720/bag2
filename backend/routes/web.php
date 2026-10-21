<?php

use Illuminate\Support\Facades\Route;

// Load all API endpoints both with and without /api prefix
// to handle any Apache symlink rewrite or direct proxy transparently:
require base_path('routes/api.php');

Route::prefix('api')->group(function () {
    require base_path('routes/api.php');
});
