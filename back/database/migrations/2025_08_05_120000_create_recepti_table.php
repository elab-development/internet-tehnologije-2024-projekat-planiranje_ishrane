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
        Schema::create('recepti', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->enum('tip_jela', ['doručak', 'ručak', 'večera', 'užina']);
            $table->integer('vreme_pripreme'); 
            $table->text('opis_pripreme');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recepti');
    }
};
