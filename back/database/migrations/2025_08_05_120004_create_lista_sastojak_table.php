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
        Schema::create('lista_sastojak', function (Blueprint $table) {
            $table->foreignId('id_liste')->constrained('liste_za_kupovinu')->onDelete('cascade');
            $table->foreignId('id_sastojka')->constrained('sastojci')->onDelete('cascade');
            $table->primary(['id_liste', 'id_sastojka']);
            $table->float('kolicina')->default(0);
            $table->timestamps();
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lista_sastojak');
    }
};
