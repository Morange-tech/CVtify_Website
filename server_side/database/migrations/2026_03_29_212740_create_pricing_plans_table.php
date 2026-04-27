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
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
                        $table->string('name');
            $table->string('slug')->unique(); // free, premium
            $table->string('currency', 3)->default('USD');
            $table->decimal('monthly_price', 8, 2)->default(0);
            $table->decimal('yearly_price', 8, 2)->default(0);
            $table->string('short_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_recommended')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('meta')->nullable(); // optional extra content later
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
