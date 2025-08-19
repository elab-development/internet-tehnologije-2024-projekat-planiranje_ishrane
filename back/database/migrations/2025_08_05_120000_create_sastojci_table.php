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
        Schema::create('sastojci', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->string('kategorija');
            $table->float('masti')->default(0);
            $table->float('proteini')->default(0);
            $table->float('ugljeni_hidrati')->default(0);
            $table->float('kalorije')->default(0);
            $table->enum('tip', ['organski', 'neorganski']);
            $table->enum('jedinica',['kom','g','kasika','ml']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sastojci');
    }
};
