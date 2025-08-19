<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PlanObroka;
use App\Models\ListaZaKupovinu;
use App\Http\Resources\ListaZaKupovinuResource;
class ListaZaKupovinuController extends Controller
{
    public function show($planObrokaId)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Niste autorizovani.'], 403);
        }


        $plan = PlanObroka::where('id', $planObrokaId)
            ->where('user_id', $user->id)
            ->first();

        if (!$plan) {
            return response()->json(['error' => 'Plan obroka nije pronađen ili nemate pristup.'], 404);
        }

      
        $listaZaKupovinu = $plan->listaZaKupovinu; 

        if (!$listaZaKupovinu) {
            return response()->json(['error' => 'Lista za kupovinu nije pronađena za dati plan obroka.'], 404);
        }

        return new ListaZaKupovinuResource($listaZaKupovinu->load('sastojci'));

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri učitavanju liste za kupovinu.',
            'message' => $e->getMessage()
        ], 500);
    }
}


public function index(Request $request){
     try {

        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Niste autorizovani.'], 403);
        }
        $liste = ListaZaKupovinu::whereHas('planObroka', function ($query) use ($user) {
        $query->where('user_id', $user->id);
    })
    ->orderBy('updated_at', 'desc')
    ->paginate(5);

    return ListaZaKupovinuResource::collection($liste);
     
     
     
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri učitavanju liste za kupovinu.',
            'message' => $e->getMessage()
        ], 500);
    }

}





}
