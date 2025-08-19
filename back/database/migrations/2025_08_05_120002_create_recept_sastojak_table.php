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
        Schema::create('recept_sastojak', function (Blueprint $table) {
            $table->foreignId('id_recepta')->constrained('recepti')->onDelete('cascade');
            $table->foreignId('id_sastojka')->constrained('sastojci')->onDelete('cascade');
            $table->primary(['id_sastojka', 'id_recepta']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recept_sastojak');
    }
};
