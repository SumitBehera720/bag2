<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add sort_order to testimonials if missing
        if (Schema::hasTable('testimonials') && !Schema::hasColumn('testimonials', 'sort_order')) {
            Schema::table('testimonials', function (Blueprint $table) {
                $table->integer('sort_order')->default(0)->after('is_active');
            });
        }

        // Add sort_order to portfolio_items if missing  
        if (Schema::hasTable('portfolio_items') && !Schema::hasColumn('portfolio_items', 'sort_order')) {
            Schema::table('portfolio_items', function (Blueprint $table) {
                $table->integer('sort_order')->default(0)->after('is_active');
            });
        }

        // Add missing tables for inquiry_status_histories and media_libraries if needed
        if (!Schema::hasTable('inquiry_status_histories')) {
            Schema::create('inquiry_status_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
                $table->string('from_status')->nullable();
                $table->string('to_status');
                $table->string('changed_by')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('media_libraries')) {
            Schema::create('media_libraries', function (Blueprint $table) {
                $table->id();
                $table->string('filename');
                $table->string('original_name');
                $table->string('mime_type')->nullable();
                $table->bigInteger('size')->default(0);
                $table->string('path');
                $table->string('disk')->default('public');
                $table->string('folder')->nullable();
                $table->text('alt_text')->nullable();
                $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // Reversing is optional
    }
};
