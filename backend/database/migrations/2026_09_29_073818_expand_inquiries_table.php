<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Drop old inquiries and rebuild properly
        Schema::dropIfExists('inquiries');
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('inquiry_id')->unique(); // ASK-2026-00001
            // Customer Info
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            // Order Info
            $table->string('product_name')->nullable();
            $table->integer('quantity')->nullable();
            $table->date('required_date')->nullable();
            // Customization
            $table->text('customization')->nullable();
            $table->string('material_preference')->nullable();
            $table->string('color_preference')->nullable();
            $table->string('size_preference')->nullable();
            $table->text('message')->nullable();
            $table->string('logo_file')->nullable(); // uploaded file path
            // CRM
            $table->enum('status', ['new','contacted','quotation_sent','follow_up','negotiation','converted','closed','lost'])->default('new');
            $table->decimal('quotation_amount', 12, 2)->nullable();
            $table->string('quotation_file')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable(); // user_id
            $table->date('follow_up_date')->nullable();
            $table->string('source')->default('website'); // website, whatsapp, email
            $table->string('whatsapp_number')->nullable(); // the WA number used
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('inquiries'); }
};
