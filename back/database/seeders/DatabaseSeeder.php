<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
          User::factory()->create([
            'ime_prezime' => 'Gost',
            'email' => 'gost@gmail.com',
            "password"=>Hash::make("gost1234"),
            "uloga"=>"gost"

    ]);
    }
}
