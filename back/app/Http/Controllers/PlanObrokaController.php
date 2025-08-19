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




public function store(Request $request)
{
    try {
        $user = Auth::user();

       
        if (!$user || $user->uloga !== 'korisnik') {
            return response()->json([
                'error' => 'Zabranjen pristup.',
                'message' => 'Samo korisnici mogu da kreiraju planove obroka.'
            ], 403);
        }

       
        $validated = $request->validate([
            'naziv_plana' => 'required|string|max:255',
            'period' => 'required|string|max:255',
            'recepti' => 'required|array|min:1',
            'recepti.*' => 'exists:recepti,id'
        ]);

       
        $planObroka = PlanObroka::create([
            'naziv_plana' => $validated['naziv_plana'],
            'period' => $validated['period'],
            'user_id' => $user->id
        ]);

      
        $planObroka->recepti()->attach($validated['recepti']);

    
        $listaZaKupovinu = ListaZaKupovinu::create([
            'plan_obroka_id' => $planObroka->id,
        ]);

       
        $sastojciZaDodavanje = [];

foreach ($validated['recepti'] as $receptId) {
    $recept = Recept::with('sastojci')->find($receptId);

    foreach ($recept->sastojci as $sastojak) {
        $id = $sastojak->id;
        $kolicina = $sastojak->pivot->kolicina;


        if (!isset($sastojciZaDodavanje[$id])) {
            $sastojciZaDodavanje[$id] = [
                'kolicina' => $kolicina,
            ];
        } else {
          
                $sastojciZaDodavanje[$id]['kolicina'] += $kolicina;
            }
        }
    }


      
      foreach ($sastojciZaDodavanje as $sastojakId => $podaci) {
    $kolicinaSastojka = $podaci['kolicina'];
    $listaZaKupovinu->sastojci()->attach($sastojakId, [
        'kolicina' => $kolicinaSastojka
    ]);
}

        return response()->json([
            'plan_obroka' => new PlanObrokaResource($planObroka->load('recepti')),
            'lista_za_kupovinu' => new ListaZaKupovinuResource($listaZaKupovinu->load('sastojci'))
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri kreiranju plana obroka.',
            'message' => $e->getMessage()
        ], 500);
    }
}




public function destroy($id)
{
    try {
        $plan = PlanObroka::findOrFail($id);

        $user = Auth::user();
        if ($plan->user_id !== $user->id) {
            return response()->json(['error' => 'Nemate dozvolu da obrišete ovaj plan obroka.'], 403);
        }

        $plan->delete();

        return response()->json(['message' => 'Plan obroka uspešno obrisan.'], 200);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['error' => 'Plan obroka nije pronađen.'], 404);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri brisanju plana obroka.',
            'message' => $e->getMessage()
        ], 500);
    }
}



public function dodajRecept(Request $request, $id)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Niste autorizovani.'], 403);
        }

        $validated = $request->validate([
            'recept_id' => 'required|exists:recepti,id',
        ]);

        $plan = PlanObroka::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$plan) {
            return response()->json(['error' => 'Plan obroka nije pronađen ili nemate pristup.'], 404);
        }

        if ($plan->recepti()->where('id', $validated['recept_id'])->exists()) {
            return response()->json(['message' => 'Recept je već dodat u plan obroka.'], 200);
        }

       
        $plan->recepti()->attach($validated['recept_id']);

      
        $listaZaKupovinu = $plan->listaZaKupovinu;

       
        $recept = Recept::with('sastojci')->find($validated['recept_id']);

        foreach ($recept->sastojci as $sastojak) {
            $pivot = $sastojak->pivot; 
            $kolicina = $pivot->kolicina;

           
            $postojećiSastojakPivot = $listaZaKupovinu->sastojci()->where('sastojci.id', $sastojak->id)->first();

            if (!$postojećiSastojakPivot) {
              
                $listaZaKupovinu->sastojci()->attach($sastojak->id, [
                    'kolicina' => $kolicina
                ]);
            } else {
               
                

               $kolicina = $kolicina + $postojećiSastojakPivot->pivot->kolicina;

             
                $listaZaKupovinu->sastojci()->updateExistingPivot($sastojak->id, [
                    'kolicina' => $kolicina
                ]);
            }
        }

        return response()->json(['message' => 'Recept je uspešno dodat u plan obroka.']);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške prilikom dodavanja recepta u plan obroka.',
            'message' => $e->getMessage()
        ], 500);
    }
}

    
}
