<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ime_prezime', 'email', 'password','uloga',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function planoviObroka()
    {
        return $this->hasMany(PlanObroka::class, 'user_id');
    }

    

    public function omiljeniRecepti()
    {
        return $this->belongsToMany(Recept::class, 'omiljeni_recepti', 'id_korisnika', 'id_recepta')->withTimestamps();
    }
}
