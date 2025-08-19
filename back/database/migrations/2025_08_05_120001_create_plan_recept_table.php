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
        Schema::create('plan_recept', function (Blueprint $table) {
          
            $table->foreignId('id_plana')->constrained('planovi_obroka')->onDelete('cascade');
            $table->foreignId('id_recepta')->constrained('recepti')->onDelete('cascade');
            $table->primary(['id_plana', 'id_recepta']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_recept');
    }
};
