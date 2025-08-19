<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recept extends Model
{
    protected $table = 'recepti';

    protected $fillable = [
        'naziv',
        'tip_jela',
        'vreme_pripreme',
        'opis_pripreme',
    ];

    public function sastojci()
    {
        return $this->belongsToMany(Sastojak::class, 'recept_sastojak', 'id_recepta', 'id_sastojka')
                    ->withPivot('kolicina')->withTimestamps();;
                    
    }

    public function planovi()
    {
        return $this->belongsToMany(PlanObroka::class, 'plan_recept', 'id_recepta', 'id_plana')->withTimestamps();;
    }

    public function korisniciOmiljeni()
    {
        return $this->belongsToMany(User::class, 'omiljeni_recepti', 'id_recepta', 'id_korisnika')->withTimestamps();;
    }
}
