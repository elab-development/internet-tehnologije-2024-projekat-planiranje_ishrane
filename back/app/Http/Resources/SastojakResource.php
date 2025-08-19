<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SastojakResource extends JsonResource
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
            'kategorija' => $this->kategorija,
            'tip' => $this->tip,
            'masti'=>$this->masti,
            'proteini'=>$this->proteini,
            'ugljeni_hidrati'=>$this->ugljeni_hidrati,
            'kalorije'=>$this->kalorije,
            'jedinica'=>$this->jedinica
        ];
    }
}
