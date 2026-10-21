<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // super_admin, content_manager, product_manager, sales_manager, viewer
            $table->string('label');
            $table->json('permissions')->nullable(); // array of permission keys
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('roles'); }
};
