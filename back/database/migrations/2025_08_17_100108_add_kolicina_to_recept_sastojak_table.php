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
        Schema::table('recept_sastojak', function (Blueprint $table) {
             $table->float('kolicina')->after('id_sastojka');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recept_sastojak', function (Blueprint $table) {
            $table->dropColumn('kolicina');
        });
    }
};
