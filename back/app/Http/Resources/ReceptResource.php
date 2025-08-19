<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'tip_jela' => $this->tip_jela,
            'vreme_pripreme' => $this->vreme_pripreme,
            'opis_pripreme' => $this->opis_pripreme,
            'sastojci' => $this->sastojci->map(function ($sastojak) {
                return [
                    'sastojak' => new SastojakResource($sastojak),
                    'kolicina' => $sastojak->pivot->kolicina,
                ];
            }),
            'omiljen' => $this->korisniciOmiljeni->contains(auth()->id())
        ];
    }
}
