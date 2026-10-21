<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name')->nullable(); // denormalized for display
            $table->string('action'); // login, logout, create, update, delete, upload
            $table->string('entity_type')->nullable(); // product, inquiry, section, etc.
            $table->string('entity_id')->nullable();
            $table->string('description');
            $table->json('meta')->nullable(); // before/after values
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('activity_logs'); }
};
