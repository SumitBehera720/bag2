<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Drop old products table and recreate with full schema
        Schema::dropIfExists('products');
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('string_id')->nullable()->unique(); // Original: amb-01
            $table->string('name');
            $table->string('slug')->unique()->nullable();
            $table->string('sku')->nullable()->unique();
            $table->string('category')->nullable(); // FK to categories.slug
            $table->text('tagline')->nullable();
            $table->text('description')->nullable(); // Full rich description
            $table->string('capacity')->nullable(); // e.g. "28L"
            $table->string('laptop_fit')->nullable(); // e.g. "15.6 Laptop"
            $table->string('primary_image')->nullable(); // main display image path
            $table->integer('min_order')->default(50);
            $table->string('lead_time')->default('2-3 Weeks');
            $table->string('logo_position')->nullable();
            $table->boolean('is_customizable')->default(true);
            $table->json('materials')->nullable();
            $table->json('color_options')->nullable(); // [{name, hex}]
            $table->json('features')->nullable(); // array of strings
            $table->json('branding_options')->nullable(); // array of strings
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('products'); }
};
