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
        Schema::create('admin_notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->boolean('new_user')->default(true);
            $table->boolean('premium_request')->default(true);
            $table->boolean('payment')->default(true);
            $table->boolean('new_message')->default(true);
            $table->boolean('sound')->default(true);
            $table->boolean('desktop')->default(true);
            $table->boolean('email')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_notification_settings');
    }
};
