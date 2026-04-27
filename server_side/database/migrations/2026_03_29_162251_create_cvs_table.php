// database/migrations/2026_03_29_000001_create_cvs_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('template_name')->nullable();
            $table->json('content')->nullable();

            $table->boolean('is_public')->default(false);
            $table->string('public_token')->nullable()->unique();

            $table->unsignedInteger('downloads')->default(0);

            $table->timestamps();

            $table->index('user_id');
            $table->index('is_public');
            $table->index('public_token');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cvs');
    }
};
