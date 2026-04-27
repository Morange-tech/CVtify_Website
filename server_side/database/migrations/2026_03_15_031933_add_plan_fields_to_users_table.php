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
        Schema::table('users', function (Blueprint $table) {

            if (!Schema::hasColumn('users', 'plan')) {
                $table->string('plan')->default('free'); // free, premium
            }

            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable();
            }

            if (!Schema::hasColumn('users', 'plan_expires_at')) {
                $table->timestamp('plan_expires_at')->nullable();
            }

            if (!Schema::hasColumn('users', 'max_cvs')) {
                $table->integer('max_cvs')->default(10);
            }

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $columns = [];

            if (Schema::hasColumn('users', 'plan')) {
                $columns[] = 'plan';
            }

            if (Schema::hasColumn('users', 'avatar')) {
                $columns[] = 'avatar';
            }

            if (Schema::hasColumn('users', 'plan_expires_at')) {
                $columns[] = 'plan_expires_at';
            }

            if (Schema::hasColumn('users', 'max_cvs')) {
                $columns[] = 'max_cvs';
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }

        });
    }
};
