<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('image_path');
            $table->json('badges')->nullable();
            $table->decimal('rating', 2, 1)->default(0.0);
            $table->string('uses_count')->default('0');
            $table->boolean('is_free')->default(true);
            $table->boolean('is_active')->default(true);
            $table->integer('template_id')->unique();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('template_wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'template_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_wishlists');
        Schema::dropIfExists('templates');
    }
};
