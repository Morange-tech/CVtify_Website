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
        Schema::create('motivation_letters', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('company');
            $table->string('position');
            $table->string('linked_cv')->nullable(); // simple version
            $table->longText('content')->nullable(); // actual letter body
            $table->enum('status', ['draft', 'complete'])->default('draft');
            $table->unsignedInteger('downloads')->default(0);
            $table->uuid('share_token')->nullable()->unique();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('company');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motivation_letters');
    }
};
