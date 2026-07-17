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
        Schema::table('motivation_letters', function (Blueprint $table) {
            $table->unsignedInteger('template_id')->nullable()->after('user_id');
            $table->json('sender_info')->nullable()->after('content');
            $table->json('recipient_info')->nullable()->after('sender_info');
            $table->json('signature')->nullable()->after('recipient_info');
        });

        // The builder autosaves drafts before company/position are filled in,
        // so these can no longer be hard-required at the DB level.
        Schema::table('motivation_letters', function (Blueprint $table) {
            $table->string('company')->nullable()->change();
            $table->string('position')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motivation_letters', function (Blueprint $table) {
            $table->dropColumn(['template_id', 'sender_info', 'recipient_info', 'signature']);
        });

        Schema::table('motivation_letters', function (Blueprint $table) {
            $table->string('company')->nullable(false)->change();
            $table->string('position')->nullable(false)->change();
        });
    }
};
