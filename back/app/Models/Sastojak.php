<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sastojak extends Model
{
     protected $table = 'sastojci';


      protected $fillable = [
        'naziv',
        'kategorija',
        'masti',
        'proteini',
        'kalorije',
        'ugljeni_hidrati',
        'tip',
        'jedinica'
    ];


    public function recepti()
    {
        return $this->belongsToMany(Recept::class, 'recept_sastojak', 'id_sastojka', 'id_recepta')
                    ->withPivot('kolicina')->withTimestamps();;
                    
    }

    public function listeZaKupovinu()
    {
        return $this->belongsToMany(ListaZaKupovinu::class, 'lista_sastojak', 'id_sastojka', 'id_liste')
                    ->withPivot('kolicina')->withTimestamps();;
                    
    }
}
