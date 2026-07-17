<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // cv_guide | cover_letter_tip | interview_prep | career_advice
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('read_time')->nullable();
            $table->string('icon')->nullable();
            $table->string('category')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->json('checklist')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['type', 'is_published', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
