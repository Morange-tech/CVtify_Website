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
        Schema::table('templates', function (Blueprint $table) {
                    if (!Schema::hasColumn('templates', 'description')) {
                $table->text('description')->nullable()->after('image_path');
            }
            if (!Schema::hasColumn('templates', 'uses_count_raw')) {
                $table->integer('uses_count_raw')->default(0)->after('uses_count');
            }
            if (!Schema::hasColumn('templates', 'downloads_count')) {
                $table->integer('downloads_count')->default(0)->after('uses_count_raw');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
                        $table->dropColumn(['description', 'uses_count_raw', 'downloads_count']);
        });
    }
};
