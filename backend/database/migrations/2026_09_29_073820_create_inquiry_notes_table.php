<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inquiry_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inquiry_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('note');
            $table->string('type')->default('note'); // note, call, email, whatsapp
            $table->timestamps();
            $table->foreign('inquiry_id')->references('id')->on('inquiries')->onDelete('cascade');
        });

        Schema::create('inquiry_status_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inquiry_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->foreign('inquiry_id')->references('id')->on('inquiries')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('inquiry_status_history');
        Schema::dropIfExists('inquiry_notes');
    }
};
