<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\PlanObrokaResource;
use Illuminate\Support\Facades\Auth;
use App\Models\PlanObroka;
use App\Models\ListaZaKupovinu;
use App\Models\Recept;
use App\Http\Resources\ListaZaKupovinuResource;
class PlanObrokaController extends Controller
{

    public function show($id)
{
    $user = Auth::user();
      $plan = PlanObroka::find($id);

    if (!$plan) {
        return response()->json(['error' => 'Plan obroka nije pronađen.'], 404);
    }
  
    if (!$user ||$user->id!==$plan->korisnik->id || $user->uloga !== 'korisnik') {
        return response()->json(['error' => 'Pristup zabranjen.'], 403);
    }


  

    return new PlanObrokaResource($plan);
}






public function index(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Niste autorizovani.'], 403);
        }

        $planovi = PlanObroka::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->paginate(5);

        return PlanObrokaResource::collection($planovi);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri učitavanju planova obroka.',
            'message' => $e->getMessage()
        ], 500);
    }
}


    
}
