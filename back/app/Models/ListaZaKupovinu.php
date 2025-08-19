<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListaZaKupovinu extends Model
{
    protected $table = 'liste_za_kupovinu';

    protected $fillable = [
        'plan_obroka_id',
    ];

    public function planObroka()
    {
        return $this->belongsTo(PlanObroka::class, 'plan_obroka_id');
    }

    public function sastojci()
    {
        return $this->belongsToMany(Sastojak::class, 'lista_sastojak', 'id_liste', 'id_sastojka')
                    ->withPivot('kolicina')->withTimestamps();;
                    
    }
}
