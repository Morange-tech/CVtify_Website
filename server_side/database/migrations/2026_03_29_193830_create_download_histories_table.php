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
        Schema::create('download_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->morphs('downloadable');

            $table->string('type');
            $table->string('file_name');
            $table->string('format', 10);
            $table->unsignedBigInteger('file_size_bytes')->default(0);

            $table->string('template')->nullable();
            $table->boolean('is_premium_quality')->default(false);
            $table->boolean('has_watermark')->default(true);

            $table->string('file_path')->nullable();
            $table->timestamp('downloaded_at')->useCurrent();
            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'format']);
            $table->index(['user_id', 'downloaded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('download_histories');
    }
};
