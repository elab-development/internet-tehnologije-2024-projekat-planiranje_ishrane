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
        Schema::table('liste_za_kupovinu', function (Blueprint $table) {
             $table->foreignId('plan_obroka_id')->constrained('planovi_obroka')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('liste_za_kupovinu', function (Blueprint $table) {
             $table->dropForeign(['plan_obroka_id']);
            $table->dropColumn('plan_obroka_id');
        });
    }
};
