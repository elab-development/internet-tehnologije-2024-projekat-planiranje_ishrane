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
        Schema::create('omiljeni_recepti', function (Blueprint $table) {
             $table->foreignId('id_korisnika')->constrained('users')->onDelete('cascade');
             $table->foreignId('id_recepta')->constrained('recepti')->onDelete('cascade');
             $table->primary(['id_korisnika', 'id_recepta']);
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('omiljeni_recepti');
    }
};
