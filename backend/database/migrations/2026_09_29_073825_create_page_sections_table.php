<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Expand site_settings to full key-value store with groups
        Schema::dropIfExists('site_settings');
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('type')->default('text'); // text, textarea, image, json, boolean, number
            $table->string('group')->default('general'); // general, contact, whatsapp, seo, social, homepage
            $table->string('label')->nullable(); // human-readable label
            $table->timestamps();
        });

        // Expand categories
        Schema::dropIfExists('categories');
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Page sections for homepage CMS
        Schema::dropIfExists('page_sections');
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page')->default('homepage'); // homepage, about, contact, etc.
            $table->string('section_key')->unique(); // hero, bags, customization, etc.
            $table->string('section_type'); // hero, product_carousel, feature_cards, testimonials, etc.
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->json('content')->nullable(); // section-specific structured content
            $table->string('bg_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('site_settings');
    }
};
