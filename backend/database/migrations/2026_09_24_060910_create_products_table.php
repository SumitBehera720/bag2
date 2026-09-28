<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Will be integer ID
            $table->string('string_id')->nullable(); // Original string id (e.g. "amb-1")
            $table->integer('index')->nullable();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->string('category')->nullable();
            $table->text('tagline')->nullable();
            $table->string('capacity')->nullable();
            $table->string('laptopFit')->nullable();
            $table->string('cutoutImage')->nullable();
            $table->string('styledImage')->nullable();
            $table->string('defaultImage')->nullable();
            $table->integer('minOrder')->nullable();
            $table->string('leadTime')->nullable();
            $table->string('logoPosition')->nullable();
            $table->boolean('isCustomizable')->default(true);
            $table->json('materials')->nullable();
            $table->json('colorOptions')->nullable();
            $table->json('features')->nullable();
            $table->json('brandingOptions')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
