// database/migrations/2024_01_15_000001_create_motivation_letter_templates_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motivation_letter_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->default('professional');
            $table->text('description')->nullable();
            $table->string('preview_image')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('uses')->default(0);
            $table->unsignedInteger('downloads')->default(0);
            $table->decimal('rating', 2, 1)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('category');
            $table->index('is_premium');
            $table->index('is_published');
            $table->index(['is_published', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motivation_letter_templates');
    }
};
