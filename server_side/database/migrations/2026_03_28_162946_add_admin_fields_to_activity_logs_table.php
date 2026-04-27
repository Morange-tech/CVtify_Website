<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->string('log_code')->nullable()->unique()->after('id');
            $table->string('severity')->default('info')->after('type');
            $table->string('action')->nullable()->after('severity');
            $table->string('actor')->nullable()->after('user_id');
            $table->string('actor_email')->nullable()->after('actor');
            $table->string('actor_role')->default('user')->after('actor_email');
            $table->string('target')->nullable()->after('description');
            $table->string('ip')->nullable()->after('target');
            $table->string('location')->nullable()->after('ip');
            $table->string('device')->nullable()->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn([
                'log_code',
                'severity',
                'action',
                'actor',
                'actor_email',
                'actor_role',
                'target',
                'ip',
                'location',
                'device',
            ]);
        });
    }
};
