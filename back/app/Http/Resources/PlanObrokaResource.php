<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanObrokaResource extends JsonResource
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
            'naziv_plana' => $this->naziv_plana,
            'period' => $this->period,
            'recepti' => ReceptResource::collection($this->recepti),
        ];
    }
}
