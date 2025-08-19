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


public function dodajSastojak(Request $request, $id)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Niste autorizovani.'], 403);
        }

       
        $validated = $request->validate([
            'sastojak_id' => 'required|exists:sastojci,id',
            'kolicina' => 'required|numeric' 
        ]);

    
        $lista = ListaZaKupovinu::find($id);

        if (!$lista) {
            return response()->json(['error' => 'Lista za kupovinu nije pronađena.'], 404);
        }

      
        $planObroka = $lista->planObroka;
        if (!$planObroka || $planObroka->user_id !== $user->id) {
            return response()->json(['error' => 'Nemate pristup ovoj listi za kupovinu.'], 403);
        }


        $postojeci = $lista->sastojci()->where('sastojci.id', $validated['sastojak_id'])->first();

        if (!$postojeci) {
           
            $lista->sastojci()->attach($validated['sastojak_id'], [
                'kolicina' => $validated['kolicina']
            ]);
        } else {
         
            $lista->sastojci()->updateExistingPivot($validated['sastojak_id'], [
                'kolicina' => $postojeci->pivot->kolicina + $validated['kolicina'],
                'updated_at' => now()
            ]);
        }

        return response()->json([
            'message' => 'Sastojak uspešno dodat u listu za kupovinu.',
            'lista_za_kupovinu' => new ListaZaKupovinuResource($lista->load('sastojci'))
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške prilikom dodavanja sastojka u listu za kupovinu.',
            'message' => $e->getMessage()
        ], 500);
    }
}





}
