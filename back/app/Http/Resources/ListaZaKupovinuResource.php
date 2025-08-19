<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListaZaKupovinuResource extends JsonResource
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
            'plan_obroka_id'=>$this->plan_obroka_id,
            'plan_obroka_naziv'=>$this->planObroka->naziv_plana,
            'sastojci' => $this->sastojci->map(function ($sastojak) {
                return [
                    'sastojak' => new SastojakResource($sastojak),
                    'kolicina' => $sastojak->pivot->kolicina,
                ];
            }),
        ];
    }
}
