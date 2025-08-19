<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanObroka extends Model
{
    protected $table = 'planovi_obroka';

    protected $fillable = [
        'naziv_plana',
        'period',
        'user_id',
    ];

    public function listaZaKupovinu(){
        return $this->hasOne(listaZaKupovinu::class,"plan_obroka_id");
    }
    public function korisnik()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function recepti()
    {
        return $this->belongsToMany(Recept::class, 'plan_recept', 'id_plana', 'id_recepta');
    }
}
