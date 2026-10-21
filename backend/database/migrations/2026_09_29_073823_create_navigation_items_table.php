<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url')->nullable();
            $table->string('page_slug')->nullable(); // internal page
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('open_new_tab')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('menu_location')->default('primary'); // primary, footer
            $table->timestamps();
        });

        Schema::create('footer_links', function (Blueprint $table) {
            $table->id();
            $table->string('column_title')->nullable(); // e.g. "Quick Links"
            $table->integer('column_order')->default(0);
            $table->string('label');
            $table->string('url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('footer_links');
        Schema::dropIfExists('navigation_items');
    }
};
