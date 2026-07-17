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
        Schema::table('motivation_template_wishlists', function (Blueprint $table) {
            $table->dropForeign(['motivation_template_id']);

            $table->foreign('motivation_template_id')
                ->references('id')->on('motivation_letter_templates')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motivation_template_wishlists', function (Blueprint $table) {
            $table->dropForeign(['motivation_template_id']);

            $table->foreign('motivation_template_id')
                ->references('id')->on('motivation_templates')
                ->onDelete('cascade');
        });
    }
};
