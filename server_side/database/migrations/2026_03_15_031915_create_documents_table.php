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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['cv', 'motivation_letter'])->default('cv');
            $table->string('template_name')->nullable();
            $table->integer('template_id')->nullable();
            $table->enum('status', ['draft', 'complete'])->default('draft');
            $table->integer('downloads')->default(0);
            $table->json('content')->nullable();
            $table->integer('ats_score')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
